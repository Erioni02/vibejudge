import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { POST as track } from "@/app/api/track/route";
import { encodeChallenge } from "@/lib/challenge";
import { ADMIN_COOKIE, createSessionToken } from "@/lib/server/admin-auth";
import { classifyTraffic, referrerHost, sanitizePath } from "@/lib/server/analytics/context";
import { allEvents, createTestDb } from "./helpers/db";
import { BROWSER_UA, clearAdmin, configureAdmin } from "./helpers/env";

const VID = "11111111-1111-4111-8111-111111111111";
const SID = "22222222-2222-4222-8222-222222222222";

let ipCounter = 0;
function post(body: unknown, headers: Record<string, string> = {}) {
  ipCounter += 1;
  return track(
    new Request("https://vibejudge.app/api/track", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": BROWSER_UA, host: "vibejudge.app", "x-forwarded-for": `10.0.0.${ipCounter}`, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body)
    })
  );
}

function event(name: string, extra: Record<string, unknown> = {}) {
  return { id: randomUUID(), name, ts: Date.now(), path: "/", ...extra };
}

function batch(events: unknown[]) {
  return { v: 1, vid: VID, sid: SID, events };
}

let testDb: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  testDb = await createTestDb();
});
afterAll(() => testDb.close());
beforeEach(() => testDb.reset());

describe("event ingestion", () => {
  it("stores a valid page view with anonymous ids and coarse device info", async () => {
    const response = await post(batch([event("page_view", { path: "/resume-roast" })]));
    expect(response.status).toBe(200);
    const [row] = await allEvents(testDb.db);
    expect(row).toMatchObject({ name: "page_view", source: "client", visitor_id: VID, session_id: SID, path: "/resume-roast", device: "desktop", browser: "Chrome" });
  });

  it("ignores duplicate deliveries of the same event id", async () => {
    const once = event("page_view");
    await post(batch([once]));
    await post(batch([once]));
    await post(batch([once, once]));
    expect(await allEvents(testDb.db)).toHaveLength(1);
  });

  it("rejects unknown events and malformed batches", async () => {
    expect((await post(batch([event("totally_made_up")]))).status).toBe(400);
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ v: 1, vid: "not-a-uuid", sid: SID, events: [event("page_view")] })).status).toBe(400);
    expect((await post(batch([]))).status).toBe(400);
    expect(await allEvents(testDb.db)).toHaveLength(0);
  });

  it("never accepts trusted server-only events from a browser", async () => {
    for (const name of ["cv_roast_completed", "cv_generation_completed", "cv_roast_started", "cv_upload_completed"]) {
      expect((await post(batch([event(name)]))).status).toBe(400);
    }
    expect(await allEvents(testDb.db)).toHaveLength(0);
  });

  it("drops events whose metadata has unexpected fields (no free text can sneak in)", async () => {
    const response = await post(
      batch([
        event("roast_image_download_completed", { meta: { variant: "full", cvText: "Jane Doe, jane@example.com" } }),
        event("roast_image_download_completed", { meta: { variant: "full" } })
      ])
    );
    expect(response.status).toBe(200);
    const rows = await allEvents(testDb.db);
    expect(rows).toHaveLength(1);
    expect(JSON.stringify(rows)).not.toContain("jane");
    // Stored as a JSON object (queryable with ->>), not a double-encoded string.
    const [typed] = await testDb.db.query<{ kind: string; variant: string }>(
      `select jsonb_typeof(metadata) as kind, metadata->>'variant' as variant from analytics_events`
    );
    expect(typed).toEqual({ kind: "object", variant: "full" });
  });

  it("strips query strings, fragments, and full referrer URLs", async () => {
    await post(
      batch([
        event("landing_page_view", {
          path: "/guides/ats?email=jane@example.com#top",
          referrer: "https://www.google.com/search?q=jane+doe+cv",
          utm: { source: "Newsletter", medium: "email", campaign: "Launch Week" }
        })
      ])
    );
    const [row] = await allEvents(testDb.db);
    expect(row.path).toBe("/guides/ats");
    expect(row.referrer_host).toBe("google.com");
    expect(row.traffic_source).toBe("email");
    expect(row.utm_campaign).toBe("launch week");
    expect(JSON.stringify(row)).not.toContain("jane");
  });

  it("collapses roast-off share paths and validates share codes", async () => {
    const code = encodeChallenge(72);
    await post(batch([event("roast_off_share_opened", { path: `/${code}`, entityId: code, meta: { legacy: false } })]));
    expect((await post(batch([event("roast_off_share_opened", { entityId: "zzzzzzzz", meta: { legacy: false } })]))).status).toBe(400);
    const rows = await allEvents(testDb.db);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ entity_id: code, path: "/[roast-off]" });
  });

  it("does not count crawlers", async () => {
    const response = await post(batch([event("page_view")]), { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" });
    expect(response.status).toBe(200);
    expect(await allEvents(testDb.db)).toHaveLength(0);
  });

  it("does not count the administrator's own visits", async () => {
    await configureAdmin();
    await post(batch([event("page_view")]), { cookie: `${ADMIN_COOKIE}=${createSessionToken()}` });
    await post(batch([event("page_view")]), { "x-vj-internal": "1" });
    expect(await allEvents(testDb.db)).toHaveLength(0);
    clearAdmin();
  });

  it("rejects oversized payloads", async () => {
    const huge = batch([event("page_view", { path: `/${"a".repeat(20_000)}` })]);
    expect((await post(huge)).status).toBe(413);
  });

  it("rate limits floods from a single IP", async () => {
    const statuses: number[] = [];
    for (let index = 0; index < 62; index += 1) {
      statuses.push((await post(batch([event("page_view")]), { "x-forwarded-for": "10.9.9.9" })).status);
    }
    expect(statuses.at(-1)).toBe(429);
  });
});

describe("privacy helpers", () => {
  it("keeps only safe pathnames", () => {
    expect(sanitizePath("/resume-examples/nurse?name=jane")).toBe("/resume-examples/nurse");
    expect(sanitizePath("https://evil.example/x")).toBe(null);
    expect(sanitizePath("/<script>")).toBe(null);
    expect(sanitizePath("/")).toBe("/");
  });

  it("reduces referrers to a hostname", () => {
    expect(referrerHost("https://www.linkedin.com/feed/update/urn:li:activity:123?trk=x")).toBe("linkedin.com");
    expect(referrerHost("javascript:alert(1)")).toBe(null);
    expect(referrerHost("not a url")).toBe(null);
  });

  it("classifies traffic sources", () => {
    const own = "vibejudge.app";
    expect(classifyTraffic({ referrer: null, ownHost: own })).toBe("direct");
    expect(classifyTraffic({ referrer: "google.com", ownHost: own })).toBe("organic");
    expect(classifyTraffic({ referrer: "t.co", ownHost: own })).toBe("social");
    expect(classifyTraffic({ referrer: "linkedin.com", ownHost: own })).toBe("social");
    expect(classifyTraffic({ referrer: "someblog.dev", ownHost: own })).toBe("referral");
    expect(classifyTraffic({ referrer: "vibejudge.app", ownHost: own })).toBe("internal");
    expect(classifyTraffic({ referrer: null, utmSource: "ph", ownHost: own })).toBe("campaign");
    expect(classifyTraffic({ referrer: "facebook.com", utmMedium: "cpc", ownHost: own })).toBe("paid");
  });
});
