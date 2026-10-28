import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { flushBackgroundWrites } from "@/lib/server/analytics/store";
import { allEvents, createTestDb } from "./helpers/db";
import { BROWSER_UA } from "./helpers/env";

// The AI is mocked; everything else (routes, validation, analytics, Postgres) is real.
const ai = vi.hoisted(() => ({
  analyzeResume: vi.fn(),
  generateCv: vi.fn(),
  buildCvFromAnswers: vi.fn()
}));
vi.mock("@/lib/ai/resume", () => ai);

const { POST: analyze } = await import("@/app/api/analyze/route");
const { POST: generate } = await import("@/app/api/generate-cv/route");
const { POST: build } = await import("@/app/api/build-cv/route");
const { AiUnavailableError } = await import("@/lib/ai/llm");

const VID = "33333333-3333-4333-8333-333333333333";
const SID = "44444444-4444-4444-8444-444444444444";
const CV_TEXT = `Jane Example — jane@example.com
Senior Software Engineer with 8 years of experience building payment systems at scale.
Experience: Led a team of five engineers to rebuild the checkout pipeline, cutting latency by 40%.
Education: BSc Computer Science. Skills: TypeScript, Go, Postgres, Kubernetes, AWS.`;

let ip = 0;
function form(extra: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const body = new FormData();
  body.append("text", CV_TEXT);
  for (const [key, value] of Object.entries(extra)) body.append(key, value);
  ip += 1;
  return new Request("https://vibejudge.app/api/x", {
    method: "POST",
    body,
    headers: { "user-agent": BROWSER_UA, "x-vj-vid": VID, "x-vj-sid": SID, "x-forwarded-for": `172.16.0.${ip}`, ...headers }
  });
}

async function names() {
  await flushBackgroundWrites();
  return (await allEvents(testDb.db)).map((row) => row.name);
}

let testDb: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  testDb = await createTestDb();
});
afterAll(() => testDb.close());
beforeEach(async () => {
  await testDb.reset();
  vi.clearAllMocks();
});

const analysis = { score: 64, verdict: "ok", summary: "", roast: [], strengths: [], problems: [], categories: [], rewrites: [], quickWins: [], finalVerdict: "" };

describe("CV roast events (server-confirmed)", () => {
  it("records started → upload completed → completed for a successful roast, attributed to the visitor", async () => {
    ai.analyzeResume.mockResolvedValue(analysis);
    const response = await analyze(form());
    expect(response.status).toBe(200);
    expect(await names()).toEqual(["cv_roast_started", "cv_upload_completed", "cv_roast_completed"]);

    const rows = await allEvents(testDb.db);
    expect(rows.every((row) => row.source === "server" && row.visitor_id === VID && row.session_id === SID)).toBe(true);
    // No CV content anywhere in analytics.
    expect(JSON.stringify(rows)).not.toMatch(/jane|payment|checkout/i);
  });

  it("a failed roast never counts as completed", async () => {
    ai.analyzeResume.mockRejectedValue(new AiUnavailableError("all providers down"));
    const response = await analyze(form());
    expect(response.status).toBe(503);
    expect(await names()).toEqual(["cv_roast_started", "cv_upload_completed", "cv_roast_failed"]);
    const failed = (await allEvents(testDb.db)).find((row) => row.name === "cv_roast_failed");
    expect(failed?.metadata).toEqual({ reason: "ai_unavailable" });
  });

  it("records invalid input as a failure without calling the AI", async () => {
    const body = new FormData();
    body.append("text", "too short");
    const response = await analyze(new Request("https://vibejudge.app/api/analyze", { method: "POST", body, headers: { "user-agent": BROWSER_UA } }));
    expect(response.status).toBe(400);
    expect(ai.analyzeResume).not.toHaveBeenCalled();
    expect(await names()).toEqual(["cv_roast_started", "cv_roast_failed"]);
  });

  it("still counts visitors who opted out — anonymously, without ids", async () => {
    ai.analyzeResume.mockResolvedValue(analysis);
    await analyze(form({}, { "x-vj-vid": "", "x-vj-sid": "" }));
    await flushBackgroundWrites();
    const rows = await allEvents(testDb.db);
    expect(rows.find((row) => row.name === "cv_roast_completed")).toMatchObject({ visitor_id: null, session_id: null });
  });

  it("keeps working when the analytics database is down", async () => {
    ai.analyzeResume.mockResolvedValue(analysis);
    await testDb.exec("alter table analytics_events rename to analytics_events_off");
    try {
      const response = await analyze(form());
      expect(response.status).toBe(200);
      await flushBackgroundWrites();
    } finally {
      await testDb.exec("alter table analytics_events_off rename to analytics_events");
    }
  });
});

describe("AI CV generation events (server-confirmed)", () => {
  it("records a rewrite from the roast as mode from_roast", async () => {
    ai.generateCv.mockResolvedValue("NEW CV");
    const response = await generate(form({ analysis: JSON.stringify(analysis) }));
    expect(response.status).toBe(200);
    expect(await names()).toEqual(["cv_generation_started", "cv_generation_completed"]);
    const rows = await allEvents(testDb.db);
    expect(rows.map((row) => row.metadata)).toEqual([{ mode: "from_roast" }, { mode: "from_roast" }]);
  });

  it("a failed generation is recorded as failed, not completed", async () => {
    ai.generateCv.mockRejectedValue(new Error("boom"));
    const response = await generate(form());
    expect(response.status).toBe(500);
    expect(await names()).toEqual(["cv_generation_started", "cv_generation_failed"]);
    const failed = (await allEvents(testDb.db)).at(-1);
    expect(failed?.metadata).toEqual({ reason: "server_error", mode: "rewrite" });
  });

  it("the No-CV builder counts as generation with mode builder", async () => {
    ai.buildCvFromAnswers.mockResolvedValue("BUILT CV");
    const answers = {
      targetRole: "Junior data analyst",
      fullName: "Sam Example",
      email: "sam@example.com",
      education: "BSc Statistics, University of Leeds, graduating 2026. Dissertation on forecasting demand.",
      experience: "Part-time barista for two years, trained four new staff and handled the evening shift alone.",
      skills: "Python, SQL, Excel, Tableau"
    };
    const response = await build(
      new Request("https://vibejudge.app/api/build-cv", {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": BROWSER_UA, "x-vj-vid": VID, "x-forwarded-for": "172.16.9.1" },
        body: JSON.stringify({ answers })
      })
    );
    expect(response.status).toBe(200);
    expect(await names()).toEqual(["cv_generation_started", "cv_generation_completed"]);
    const rows = await allEvents(testDb.db);
    expect(rows.every((row) => (row.metadata as { mode: string }).mode === "builder")).toBe(true);
    expect(JSON.stringify(rows)).not.toMatch(/sam|barista|leeds/i);
  });

  it("bots hitting the API are not counted", async () => {
    ai.generateCv.mockResolvedValue("NEW CV");
    await generate(form({}, { "user-agent": "curl/8.4.0" }));
    expect(await names()).toEqual([]);
  });
});
