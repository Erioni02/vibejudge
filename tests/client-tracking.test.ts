import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackBatchSchema } from "@/lib/analytics/events";

/** Minimal browser stand-ins: storage, location, document, navigator, fetch. */
function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, String(value)),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear()
  };
}

type Sent = { url: string; body: unknown };

function installBrowser({ doNotTrack = false, pathname = "/", search = "", referrer = "" } = {}) {
  const sent: Sent[] = [];
  const local = memoryStorage();
  const session = memoryStorage();
  vi.stubGlobal("window", {
    localStorage: local,
    sessionStorage: session,
    location: { pathname, search },
    setTimeout: (fn: () => void) => setTimeout(fn, 0),
    clearTimeout,
    addEventListener: () => {}
  });
  vi.stubGlobal("document", { referrer, visibilityState: "visible", addEventListener: () => {} });
  vi.stubGlobal("navigator", { doNotTrack: doNotTrack ? "1" : null });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: { body: string }) => {
      sent.push({ url, body: JSON.parse(init.body) });
      return { status: 200 };
    })
  );
  return { sent, local };
}

async function load() {
  vi.resetModules();
  return import("@/lib/analytics/client");
}

function eventNames(sent: Sent[]) {
  return sent.flatMap((request) => (request.body as { events: { name: string }[] }).events.map((event) => event.name));
}

beforeEach(() => vi.useFakeTimers({ toFake: ["Date"] }));
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("browser tracker", () => {
  it("starts a session with attribution on the first page view, then tracks plain page views", async () => {
    const browser = installBrowser({ search: "?utm_source=producthunt&utm_campaign=launch&email=jane@example.com", referrer: "https://www.producthunt.com/posts/vibejudge" });
    const client = await load();

    client.trackPageView();
    client.flush();
    expect(eventNames(browser.sent)).toEqual(["session_started", "landing_page_view", "unique_visitor", "page_view"]);

    const first = browser.sent[0].body as { events: { utm?: unknown; path?: string }[] };
    expect(trackBatchSchema.safeParse(browser.sent[0].body).success).toBe(true);
    expect(first.events[0].utm).toEqual({ source: "producthunt", campaign: "launch" });
    // Only the pathname is sent; the query string (with the email) never leaves the browser in an event.
    expect(JSON.stringify(browser.sent)).not.toContain("jane");

    client.trackPageView();
    client.flush();
    expect(eventNames(browser.sent).slice(4)).toEqual(["page_view"]);
  });

  it("marks a later session from the same browser as a returning visitor", async () => {
    const browser = installBrowser();
    const client = await load();
    client.trackPageView();
    client.flush();
    vi.setSystemTime(Date.now() + 31 * 60 * 1000);
    client.trackPageView();
    client.flush();
    expect(eventNames(browser.sent)).toContain("returning_visitor");
    const sessions = new Set(browser.sent.map((request) => (request.body as { sid: string }).sid));
    expect(sessions.size).toBe(2);
  });

  it("sends nothing when Do Not Track is on", async () => {
    const browser = installBrowser({ doNotTrack: true });
    const client = await load();
    client.trackPageView();
    client.trackEvent("builder_started");
    client.flush();
    expect(browser.sent).toHaveLength(0);
    expect(client.analyticsHeaders()).toEqual({});
  });

  it("stops tracking a browser marked as internal (admin)", async () => {
    const browser = installBrowser();
    const client = await load();
    client.markBrowserInternal();
    client.trackPageView();
    client.flush();
    expect(browser.sent).toHaveLength(0);
    expect(client.analyticsHeaders()).toEqual({ "x-vj-internal": "1" });
  });

  it("adds anonymous ids to API calls so server events join the same visitor", async () => {
    installBrowser();
    const client = await load();
    const headers = client.analyticsHeaders();
    expect(headers["x-vj-vid"]).toMatch(/^[0-9a-f-]{36}$/);
    expect(headers["x-vj-sid"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("re-queues a batch when the network fails", async () => {
    const browser = installBrowser();
    const client = await load();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    client.trackEvent("builder_started");
    client.flush();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 5));
    client.flush();
    // The failed batch is retried with the same event ids (the server de-duplicates).
    expect(eventNames(browser.sent).filter((name) => name === "builder_started")).toHaveLength(1);
    const ids = fetchMock.mock.calls.map(([, init]) => JSON.parse((init as { body: string }).body).events.map((e: { id: string }) => e.id)).flat();
    expect(new Set(ids).size).toBeLessThan(ids.length);
  });
});

describe("share and download instrumentation", () => {
  const tracked: { name: string; options?: { entityId?: string; meta?: unknown } }[] = [];

  beforeEach(() => {
    tracked.length = 0;
    vi.resetModules();
    vi.doMock("@/lib/analytics/client", () => ({
      trackEvent: (name: string, options?: { entityId?: string; meta?: unknown }) => tracked.push({ name, options })
    }));
  });

  it("records link creation once and every copy separately", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { copyChallengeLink } = await import("@/components/roast/share-panel");
    const notify = vi.fn();

    await copyChallengeLink("abcdefg1", 64, notify);
    await copyChallengeLink("abcdefg1", 64, notify);

    expect(tracked.map((event) => event.name)).toEqual(["roast_off_share_created", "roast_off_share_copied", "roast_off_share_copied"]);
    expect(tracked.every((event) => event.options?.entityId === "abcdefg1")).toBe(true);
    // The copied text uses the same code as the tracked share id.
    expect(String((writeText.mock.calls as unknown[][])[0][0])).toContain("/abcdefg1");
  });

  it("does not record a copy when the clipboard fails", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn(async () => Promise.reject(new Error("denied"))) } });
    const { copyChallengeLink } = await import("@/components/roast/share-panel");
    await copyChallengeLink("abcdefg2", 64, vi.fn());
    expect(tracked.map((event) => event.name)).toEqual(["client_error"]);
  });

  it("records download started → completed, or started → failed", async () => {
    vi.doMock("@/lib/export/roast-card", () => ({ renderRoastCard: vi.fn().mockResolvedValueOnce(new Blob(["png"])).mockRejectedValueOnce(new Error("no canvas")) }));
    vi.doMock("@/lib/export/canvas", () => ({ saveBlob: vi.fn() }));
    const { downloadRoastCard } = await import("@/components/roast/share-panel");
    const analysis = { score: 50 } as never;

    await downloadRoastCard(analysis, true, vi.fn());
    await downloadRoastCard(analysis, false, vi.fn());

    expect(tracked.map((event) => event.name)).toEqual([
      "roast_image_download_started",
      "roast_image_download_completed",
      "roast_image_download_started",
      "roast_image_download_failed"
    ]);
    expect(tracked[3].options?.meta).toEqual({ variant: "score_only" });
  });
});
