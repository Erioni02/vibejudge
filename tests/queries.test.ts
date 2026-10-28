import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { dashboardData, recentActivity, resolveRange } from "@/lib/server/analytics/queries";
import { parseRangeParams } from "@/lib/server/analytics/range-params";
import { createTestDb, seed } from "./helpers/db";

let testDb: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  testDb = await createTestDb();
});
afterAll(() => testDb.close());
beforeEach(() => testDb.reset());

const week = { from: "2026-10-01", to: "2026-10-07", tz: "UTC" };

describe("date ranges", () => {
  it("resolves local-day boundaries in the dashboard's time zone", async () => {
    const range = await resolveRange(testDb.db, { from: "2026-10-01", to: "2026-10-07", tz: "Europe/Tirane" });
    // Tirane is UTC+2 in October (CEST).
    expect(range?.start).toBe("2026-09-30T22:00:00.000Z");
    expect(range?.end).toBe("2026-10-07T22:00:00.000Z");
    expect(range?.prevStart).toBe("2026-09-23T22:00:00.000Z");
    expect(range?.prevEnd).toBe("2026-09-30T22:00:00.000Z");
    expect(range?.granularity).toBe("day");
  });

  it("filters events strictly inside the range", async () => {
    await seed(testDb.db, [
      { name: "page_view", at: "2026-09-30T23:59:59Z", visitor: "early" },
      { name: "page_view", at: "2026-10-01T00:00:00Z", visitor: "a" },
      { name: "page_view", at: "2026-10-07T23:59:59Z", visitor: "b" },
      { name: "page_view", at: "2026-10-08T00:00:00Z", visitor: "late" }
    ]);
    const data = await dashboardData(testDb.db, week);
    expect(data.kpis.pageViews.value).toBe(2);
    expect(data.kpis.pageViews.previous).toBe(1);
    expect(data.buckets).toHaveLength(7);
    expect(data.series.pageViews).toEqual([1, 0, 0, 0, 0, 0, 1]);
  });

  it("all time has no comparison period", async () => {
    await seed(testDb.db, [{ name: "page_view", at: "2026-01-15T10:00:00Z" }]);
    const data = await dashboardData(testDb.db, { from: null, to: "2026-10-07", tz: "UTC" });
    expect(data.range.from).toBe("2026-01-15");
    expect(data.kpis.pageViews).toMatchObject({ value: 1, previous: null });
  });

  it("validates query parameters", () => {
    const ok = parseRangeParams(new URLSearchParams("from=2026-10-01&to=2026-10-07&tz=America/New_York"));
    expect(ok.ok).toBe(true);
    expect(parseRangeParams(new URLSearchParams("from=2026-02-30&to=2026-03-01")).ok).toBe(false);
    expect(parseRangeParams(new URLSearchParams("from=all&to=2026-10-07&granularity=hour")).ok).toBe(false);
    expect(parseRangeParams(new URLSearchParams("from=2026-10-01&to=2026-10-07;drop table")).ok).toBe(false);
    expect(parseRangeParams(new URLSearchParams("from=2026-10-01&to=2026-10-07&granularity=decade")).ok).toBe(false);
  });
});

describe("traffic metrics", () => {
  it("counts page views, unique visitors, and sessions", async () => {
    await seed(testDb.db, [
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "a", session: "a1" },
      { name: "page_view", at: "2026-10-02T10:01:00Z", visitor: "a", session: "a1" },
      { name: "page_view", at: "2026-10-03T10:00:00Z", visitor: "a", session: "a2" },
      { name: "page_view", at: "2026-10-03T11:00:00Z", visitor: "b", session: "b1" }
    ]);
    const { kpis } = await dashboardData(testDb.db, week);
    expect(kpis.pageViews.value).toBe(4);
    expect(kpis.uniqueVisitors.value).toBe(2);
    expect(kpis.sessions.value).toBe(3);
  });

  it("splits new and returning visitors by first-ever visit", async () => {
    await seed(testDb.db, [
      { name: "page_view", at: "2026-09-10T10:00:00Z", visitor: "old" },
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "old" },
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "fresh" }
    ]);
    const { traffic } = await dashboardData(testDb.db, week);
    expect(traffic.newVsReturning).toEqual({ new: 1, returning: 1 });
  });

  it("attributes sessions to traffic sources and counts roast conversions", async () => {
    await seed(testDb.db, [
      { name: "session_started", at: "2026-10-02T10:00:00Z", visitor: "a", session: "a1", traffic: "organic", referrer: "google.com" },
      { name: "landing_page_view", at: "2026-10-02T10:00:00Z", visitor: "a", session: "a1", path: "/ats-resume-checker" },
      { name: "cv_roast_completed", at: "2026-10-02T10:05:00Z", visitor: "a", session: "a1", source: "server" },
      { name: "session_started", at: "2026-10-02T11:00:00Z", visitor: "b", session: "b1", traffic: "social", referrer: "linkedin.com" },
      { name: "landing_page_view", at: "2026-10-02T11:00:00Z", visitor: "b", session: "b1", path: "/" },
      { name: "session_started", at: "2026-10-02T12:00:00Z", visitor: "c", session: "c1", traffic: "organic", referrer: "bing.com" }
    ]);
    const { traffic } = await dashboardData(testDb.db, week);
    expect(traffic.sources).toEqual([
      { label: "organic", sessions: 2, visitors: 2, converted: 1 },
      { label: "social", sessions: 1, visitors: 1, converted: 0 }
    ]);
    expect(traffic.landingPages.find((page) => page.label === "/ats-resume-checker")).toMatchObject({ sessions: 1, converted: 1 });
    expect(traffic.referrers.map((row) => row.label)).toEqual(["bing.com", "google.com", "linkedin.com"]);
  });
});

describe("feature metrics", () => {
  it("only counts server-confirmed roasts and computes success rates", async () => {
    await seed(testDb.db, [
      { name: "cv_roast_started", at: "2026-10-02T10:00:00Z", source: "server" },
      { name: "cv_roast_completed", at: "2026-10-02T10:00:10Z", source: "server" },
      { name: "cv_roast_started", at: "2026-10-02T11:00:00Z", source: "server", visitor: "b" },
      { name: "cv_roast_failed", at: "2026-10-02T11:00:10Z", source: "server", visitor: "b", meta: { reason: "ai_unavailable" } },
      // A forged client-side "completed" must never count.
      { name: "cv_roast_completed", at: "2026-10-02T12:00:00Z", source: "client", visitor: "attacker" }
    ]);
    const data = await dashboardData(testDb.db, week);
    expect(data.kpis.roastsCompleted.value).toBe(1);
    const roast = data.features.rows.find((row) => row.key === "roast");
    expect(roast).toMatchObject({ started: 2, completed: 1, failed: 1, uniqueVisitors: 1, successRate: 0.5 });
    expect(data.features.failureReasons).toEqual([{ feature: "roast", reason: "ai_unavailable", mode: null, total: 1 }]);
  });

  it("counts AI CV generations and image downloads separately", async () => {
    await seed(testDb.db, [
      { name: "cv_generation_started", at: "2026-10-03T10:00:00Z", source: "server", meta: { mode: "from_roast" } },
      { name: "cv_generation_completed", at: "2026-10-03T10:00:30Z", source: "server", meta: { mode: "from_roast" } },
      { name: "cv_generation_completed", at: "2026-10-03T11:00:30Z", source: "server", visitor: "b", meta: { mode: "builder" } },
      { name: "roast_image_download_started", at: "2026-10-03T10:01:00Z", meta: { variant: "full" } },
      { name: "roast_image_download_completed", at: "2026-10-03T10:01:01Z", meta: { variant: "full" } },
      { name: "roast_image_download_started", at: "2026-10-03T10:02:00Z", meta: { variant: "full" } },
      { name: "roast_image_download_failed", at: "2026-10-03T10:02:01Z", meta: { variant: "full" } }
    ]);
    const data = await dashboardData(testDb.db, week);
    expect(data.kpis.cvsGenerated.value).toBe(2);
    expect(data.kpis.imagesDownloaded.value).toBe(1);
    expect(data.features.generationModes).toEqual([
      { mode: "builder", total: 1 },
      { mode: "from_roast", total: 1 }
    ]);
    expect(data.features.rows.find((row) => row.key === "download")).toMatchObject({ started: 2, completed: 1, failed: 1, successRate: 0.5 });
  });
});

describe("roast-off metrics", () => {
  it("keeps created, copied, and opened distinct, and excludes the creator's own opens", async () => {
    await seed(testDb.db, [
      { name: "roast_off_share_created", at: "2026-10-02T10:00:00Z", visitor: "creator", entity: "code0001", meta: { method: "clipboard" } },
      { name: "roast_off_share_copied", at: "2026-10-02T10:00:00Z", visitor: "creator", entity: "code0001", meta: { method: "clipboard" } },
      { name: "roast_off_share_copied", at: "2026-10-02T10:05:00Z", visitor: "creator", entity: "code0001", meta: { method: "native" } },
      // Creator checks their own link: an open, but not "by someone else".
      { name: "roast_off_share_opened", at: "2026-10-02T10:06:00Z", visitor: "creator", session: "c2", entity: "code0001", meta: { legacy: false } },
      { name: "roast_off_share_opened", at: "2026-10-02T12:00:00Z", visitor: "friend1", session: "f1", entity: "code0001", meta: { legacy: false } },
      { name: "roast_off_share_opened", at: "2026-10-02T13:00:00Z", visitor: "friend2", session: "f2", entity: "code0001", meta: { legacy: false } },
      { name: "roast_off_share_opened", at: "2026-10-02T14:00:00Z", visitor: "friend2", session: "f3", entity: "code0001", meta: { legacy: false } },
      { name: "cv_roast_completed", at: "2026-10-02T12:10:00Z", visitor: "friend1", session: "f1", source: "server" },
      { name: "landing_page_view", at: "2026-10-02T12:00:00Z", visitor: "friend1", session: "f1", path: "/[roast-off]", referrer: "wa.me", traffic: "social" }
    ]);
    const { kpis, roastOff, funnel } = await dashboardData(testDb.db, week);

    expect(kpis.sharesCreated.value).toBe(1);
    expect(kpis.sharesCopied.value).toBe(2);
    expect(kpis.shareOpens.value).toBe(4);
    expect(roastOff).toMatchObject({ created: 1, copies: 2, nativeShares: 1, opens: 4, uniqueOpeners: 3, opensByOthers: 3, linksOpened: 1 });
    expect(roastOff.topLinks[0]).toMatchObject({ id: "code0001", opens: 4, visitors: 3, roasted: 1 });
    expect(roastOff.downstream).toEqual({ openers: 3, roasted: 1, generated: 0 });
    expect(roastOff.referral).toEqual([{ label: "wa.me", sessions: 1 }]);
    expect(funnel.stages.find((stage) => stage.key === "share_opened_by_other")?.visitors).toBe(1);
  });

  it("a link opened only by its creator does not count as reaching someone", async () => {
    await seed(testDb.db, [
      { name: "roast_off_share_created", at: "2026-10-02T10:00:00Z", visitor: "solo", entity: "code0002", meta: { method: "clipboard" } },
      { name: "roast_off_share_opened", at: "2026-10-02T10:01:00Z", visitor: "solo", entity: "code0002", meta: { legacy: false } }
    ]);
    const { funnel, roastOff } = await dashboardData(testDb.db, week);
    expect(funnel.stages.find((stage) => stage.key === "share_opened_by_other")?.visitors).toBe(0);
    expect(roastOff.opensByOthers).toBe(0);
  });
});

describe("funnel", () => {
  it("counts distinct visitors per stage and roast → CV conversion", async () => {
    await seed(testDb.db, [
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "a" },
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "b" },
      { name: "page_view", at: "2026-10-02T10:00:00Z", visitor: "c" },
      { name: "cv_roast_started", at: "2026-10-02T10:01:00Z", visitor: "a", source: "server" },
      { name: "cv_roast_started", at: "2026-10-02T10:01:00Z", visitor: "b", source: "server" },
      { name: "cv_roast_completed", at: "2026-10-02T10:02:00Z", visitor: "a", source: "server" },
      { name: "cv_generation_started", at: "2026-10-02T10:03:00Z", visitor: "a", source: "server", meta: { mode: "from_roast" } },
      { name: "cv_generation_completed", at: "2026-10-02T10:04:00Z", visitor: "a", source: "server", meta: { mode: "from_roast" } },
      // Generated without roasting first: counts in the stage, not in the roast → CV conversion.
      { name: "cv_generation_completed", at: "2026-10-02T10:04:00Z", visitor: "c", source: "server", meta: { mode: "builder" } }
    ]);
    const { funnel } = await dashboardData(testDb.db, week);
    const stage = (key: string) => funnel.stages.find((item) => item.key === key)?.visitors;
    expect(stage("visitors")).toBe(3);
    expect(stage("roast_started")).toBe(2);
    expect(stage("roast_completed")).toBe(1);
    expect(stage("generation_completed")).toBe(2);
    expect(funnel.roastToGeneration).toEqual({ roasters: 1, started: 1, completed: 1 });
  });
});

describe("recent activity", () => {
  it("shows notable events with a hashed visitor id and no raw ids", async () => {
    const recent = new Date(Date.now() - 60_000).toISOString();
    await seed(testDb.db, [
      { name: "cv_roast_completed", at: recent, visitor: "visitor-raw-id", source: "server" },
      { name: "page_view", at: recent, visitor: "visitor-raw-id" }
    ]);
    const items = await recentActivity(testDb.db);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("cv_roast_completed");
    expect(items[0].visitor).toMatch(/^[0-9a-f]{6}$/);
    expect(JSON.stringify(items)).not.toContain("visitor-raw-id");
  });
});
