import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { dashboardData } from "@/lib/server/analytics/queries";
import { flushBackgroundWrites } from "@/lib/server/analytics/store";
import { subscribersCsv } from "@/lib/server/subscribers";
import { allEvents, createTestDb, seed } from "./helpers/db";
import { BROWSER_UA } from "./helpers/env";

const { POST: subscribe } = await import("@/app/api/subscribe/route");
const { GET: exportCsv } = await import("@/app/api/admin/subscribers/route");

const VID = "55555555-5555-4555-8555-555555555555";

let ip = 0;
function request(body: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request("https://vibejudge.app/api/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      origin: "https://vibejudge.app",
      host: "vibejudge.app",
      "user-agent": BROWSER_UA,
      "x-vj-vid": VID,
      "x-forwarded-for": `10.1.0.${ip}`,
      ...headers
    }
  });
}

async function subscribers() {
  return testDb.db.query<{ email: string; trigger: string; path: string | null }>(`select email, trigger, path from email_subscribers order by id`);
}

async function eventNames() {
  await flushBackgroundWrites();
  return (await allEvents(testDb.db)).map((row) => row.name);
}

let testDb: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  testDb = await createTestDb();
});
afterAll(() => testDb.close());
beforeEach(() => testDb.reset());

describe("POST /api/subscribe", () => {
  it("saves a normalised address once and records one trusted signup event", async () => {
    const first = await subscribe(request({ email: "  Jane@Example.COM ", trigger: "after_roast", path: "/resume-roast?x=1" }));
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ ok: true });

    // Same address again: same answer (no probing who is on the list), no duplicate, no second event.
    const again = await subscribe(request({ email: "jane@example.com", trigger: "engaged" }));
    expect(await again.json()).toEqual({ ok: true });

    expect(await subscribers()).toEqual([{ email: "jane@example.com", trigger: "after_roast", path: "/resume-roast" }]);
    await flushBackgroundWrites();
    const rows = (await allEvents(testDb.db)).filter((row) => row.name === "email_subscribed");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source: "server", visitor_id: VID });
  });

  it("never stores the address in analytics", async () => {
    await subscribe(request({ email: "private@example.com", trigger: "engaged" }));
    await flushBackgroundWrites();
    expect(JSON.stringify(await allEvents(testDb.db))).not.toContain("private@example.com");
  });

  it("rejects bad input and cross-site posts", async () => {
    expect((await subscribe(request({ email: "not-an-email", trigger: "engaged" }))).status).toBe(400);
    expect((await subscribe(request({ email: "a@b.co", trigger: "made_up" }))).status).toBe(400);
    expect((await subscribe(request({ email: "a@b.co", trigger: "engaged", extra: 1 }))).status).toBe(400);
    expect((await subscribe(request({ email: "a@b.co", trigger: "engaged" }, { origin: "https://evil.example" }))).status).toBe(403);
    expect(await subscribers()).toEqual([]);
  });

  it("silently drops bots that fill the honeypot", async () => {
    const response = await subscribe(request({ email: "bot@example.com", trigger: "engaged", company: "Spam Inc" }));
    expect(await response.json()).toEqual({ ok: true });
    expect(await subscribers()).toEqual([]);
    expect(await eventNames()).toEqual([]);
  });

  it("rate limits one address-spraying IP", async () => {
    const statuses = [];
    for (let i = 0; i < 7; i += 1) {
      const response = await subscribe(request({ email: `spray${i}@example.com`, trigger: "engaged" }, { "x-forwarded-for": "10.9.9.9" }));
      statuses.push(response.status);
    }
    expect(statuses.filter((status) => status === 429)).toHaveLength(2);
  });
});

describe("email popup dashboard", () => {
  it("counts views, closes and signups, trusting only server-confirmed signups", async () => {
    await seed(testDb.db, [
      { name: "email_popup_shown", at: "2026-10-02T10:00:00Z", visitor: "a", meta: { trigger: "after_roast" } },
      { name: "email_popup_shown", at: "2026-10-02T11:00:00Z", visitor: "b", meta: { trigger: "after_roast" } },
      { name: "email_popup_shown", at: "2026-10-03T10:00:00Z", visitor: "c", meta: { trigger: "engaged" } },
      { name: "email_popup_shown", at: "2026-10-03T12:00:00Z", visitor: "d", meta: { trigger: "exit_intent" } },
      { name: "email_popup_dismissed", at: "2026-10-03T10:01:00Z", visitor: "c", meta: { trigger: "engaged", method: "close" } },
      { name: "email_popup_dismissed", at: "2026-10-03T12:01:00Z", visitor: "d", meta: { trigger: "exit_intent", method: "no_thanks" } },
      { name: "email_subscribed", at: "2026-10-02T10:01:00Z", visitor: "a", source: "server", meta: { trigger: "after_roast" } },
      // A forged browser-sent signup must not count.
      { name: "email_subscribed", at: "2026-10-02T11:01:00Z", visitor: "b", source: "client", meta: { trigger: "after_roast" } }
    ]);
    await testDb.db.query(`insert into email_subscribers (email, trigger, created_at) values ('a@example.com', 'after_roast', '2026-10-02T10:01:00Z'), ('old@example.com', 'engaged', '2026-09-01T00:00:00Z')`);
    await testDb.db.query(`insert into email_subscribers (email, created_at, unsubscribed_at) values ('gone@example.com', '2026-10-02T00:00:00Z', '2026-10-04T00:00:00Z')`);

    const { email, series } = await dashboardData(testDb.db, { from: "2026-10-01", to: "2026-10-07", tz: "UTC" });
    expect(email).toMatchObject({ shown: 4, shownVisitors: 4, dismissed: 2, subscribed: 1 });
    expect(email.byTrigger).toEqual([
      { trigger: "after_roast", shown: 2, dismissed: 0, subscribed: 1 },
      { trigger: "engaged", shown: 1, dismissed: 1, subscribed: 0 },
      { trigger: "exit_intent", shown: 1, dismissed: 1, subscribed: 0 }
    ]);
    expect(email.dismissMethods).toEqual(expect.arrayContaining([{ method: "close", total: 1 }, { method: "no_thanks", total: 1 }]));
    expect(email.list).toMatchObject({ total: 2, newInRange: 2 });
    expect(email.list?.recent.map((row) => row.email)).toEqual(["a@example.com", "old@example.com"]);
    expect(series.emailSubscribed).toEqual([0, 1, 0, 0, 0, 0, 0]);
  });

  it("still loads before the subscriber table exists", async () => {
    await testDb.exec("alter table email_subscribers rename to email_subscribers_off");
    try {
      const { email } = await dashboardData(testDb.db, { from: "2026-10-01", to: "2026-10-07", tz: "UTC" });
      expect(email.list).toBeNull();
    } finally {
      await testDb.exec("alter table email_subscribers_off rename to email_subscribers");
    }
  });
});

describe("subscriber export", () => {
  it("exports active subscribers as CSV and defuses spreadsheet formulas", async () => {
    await testDb.db.query(
      `insert into email_subscribers (email, trigger, path, created_at) values
         ('a@example.com', 'engaged', '/', '2026-10-02T10:00:00Z'),
         ('-cmd@example.com', 'after_roast', null, '2026-10-03T10:00:00Z')`
    );
    await testDb.db.query(`insert into email_subscribers (email, unsubscribed_at) values ('gone@example.com', now())`);
    expect((await subscribersCsv(testDb.db)).split("\n")).toEqual([
      "email,subscribed_at,trigger,page,country",
      "'-cmd@example.com,2026-10-03T10:00:00.000Z,after_roast,,",
      "a@example.com,2026-10-02T10:00:00.000Z,engaged,/,",
      ""
    ]);
  });

  it("is admin-only", async () => {
    const response = await exportCsv(new Request("https://vibejudge.app/api/admin/subscribers"));
    expect(response.status).toBe(401);
  });
});
