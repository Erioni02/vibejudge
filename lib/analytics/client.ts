import {
  ANALYTICS_SCHEMA_VERSION,
  INTERNAL_HEADER,
  SESSION_HEADER,
  VISITOR_HEADER,
  type ClientEventMeta,
  type ClientEventName
} from "@/lib/analytics/events";

/**
 * First-party, cookie-less product analytics for the browser.
 *
 * - A random visitor id (localStorage) and session id (30 min inactivity). No fingerprinting.
 * - Honours Do Not Track / Global Privacy Control: nothing is sent and no ids are stored.
 * - Events are batched, flushed on a short timer or when the page is hidden, retried from
 *   sessionStorage on failure, and de-duplicated server-side by event id.
 * - Never put CV content into an event: metadata is enum-only and validated by the server.
 */

const VISITOR_KEY = "vj_vid";
const SESSION_KEY = "vj_session";
const QUEUE_KEY = "vj_queue";
const INTERNAL_KEY = "vj_internal";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const FLUSH_DELAY_MS = 1500;
const MAX_BATCH = 25;
const MAX_QUEUE = 100;

type QueuedEvent = {
  id: string;
  name: ClientEventName;
  ts: number;
  path?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
};

type Session = { id: string; last: number };

let queue: QueuedEvent[] = [];
let timer: number | null = null;
let listening = false;

function storage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function uuid() {
  // randomUUID needs a secure context; fall back to getRandomValues elsewhere.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** True when this browser must not be tracked: privacy signal set, or marked internal (admin). */
export function trackingDisabled() {
  if (typeof window === "undefined") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  if (nav.globalPrivacyControl === true) return true;
  if (nav.doNotTrack === "1" || nav.msDoNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1") return true;
  return storage("local")?.getItem(INTERNAL_KEY) === "1";
}

/** Marks this browser as internal (the admin's own), so its visits never count. */
export function markBrowserInternal() {
  storage("local")?.setItem(INTERNAL_KEY, "1");
  queue = [];
  storage("session")?.removeItem(QUEUE_KEY);
}

function visitor(): { id: string; isNew: boolean } {
  const store = storage("local");
  const existing = store?.getItem(VISITOR_KEY);
  if (existing && /^[0-9a-f-]{36}$/.test(existing)) return { id: existing, isNew: false };
  const id = uuid();
  store?.setItem(VISITOR_KEY, id);
  return { id, isNew: true };
}

/** Returns the current session, starting a new one after 30 minutes of inactivity. */
function session(now = Date.now()): { id: string; isNew: boolean } {
  const store = storage("local");
  let current: Session | null = null;
  try {
    current = JSON.parse(store?.getItem(SESSION_KEY) ?? "null") as Session | null;
  } catch {
    current = null;
  }

  if (current && typeof current.id === "string" && now - current.last < SESSION_TIMEOUT_MS) {
    store?.setItem(SESSION_KEY, JSON.stringify({ id: current.id, last: now }));
    return { id: current.id, isNew: false };
  }

  const id = uuid();
  store?.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
  return { id, isNew: true };
}

/** Headers for the app's own API calls, so server-confirmed events join the same anonymous visitor. */
export function analyticsHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  if (trackingDisabled()) {
    return storage("local")?.getItem(INTERNAL_KEY) === "1" ? { [INTERNAL_HEADER]: "1" } : {};
  }
  touch();
  return { [VISITOR_HEADER]: visitor().id, [SESSION_HEADER]: session().id };
}

function restoreQueue() {
  try {
    const saved = JSON.parse(storage("session")?.getItem(QUEUE_KEY) ?? "[]") as QueuedEvent[];
    if (Array.isArray(saved) && saved.length) queue = [...saved, ...queue].slice(-MAX_QUEUE);
  } catch {
    // ignore a corrupted queue
  }
  storage("session")?.removeItem(QUEUE_KEY);
}

function persistQueue() {
  try {
    if (queue.length) storage("session")?.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
    else storage("session")?.removeItem(QUEUE_KEY);
  } catch {
    // storage full or blocked: keep the in-memory queue only
  }
}

function listen() {
  if (listening) return;
  listening = true;
  restoreQueue();
  const flushOnHide = () => {
    if (document.visibilityState === "hidden") flush(true);
  };
  document.addEventListener("visibilitychange", flushOnHide);
  window.addEventListener("pagehide", () => flush(true));
}

function body(events: QueuedEvent[]) {
  touch();
  return JSON.stringify({ v: ANALYTICS_SCHEMA_VERSION, vid: visitor().id, sid: session().id, events });
}

/** Sends queued events. On page hide uses sendBeacon (survives navigation); otherwise fetch with retry. */
export function flush(unloading = false) {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (!queue.length || trackingDisabled()) return;

  while (queue.length) {
    const batch = queue.splice(0, MAX_BATCH);
    const payload = body(batch);

    if (unloading && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }))) continue;
      } catch {
        // fall back to fetch below
      }
    }

    fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } })
      .then((response) => {
        // 5xx / 429: put the batch back for the next flush. 4xx means invalid — drop it.
        if (response.status >= 500 || response.status === 429) requeue(batch);
      })
      .catch(() => requeue(batch));
  }
  persistQueue();
}

function requeue(batch: QueuedEvent[]) {
  queue = [...batch, ...queue].slice(-MAX_QUEUE);
  persistQueue();
  schedule(10_000);
}

function schedule(delay = FLUSH_DELAY_MS) {
  if (timer !== null) return;
  timer = window.setTimeout(() => {
    timer = null;
    flush();
  }, delay);
}

type TrackOptions<N extends ClientEventName> = {
  entityId?: string;
  /** Send right away instead of batching (for events right before a likely navigation). */
  immediate?: boolean;
} & (keyof ClientEventMeta<N> extends never ? { meta?: ClientEventMeta<N> } : { meta: ClientEventMeta<N> });

function enqueue(event: Omit<QueuedEvent, "id" | "ts">, immediate = false) {
  listen();
  queue.push({ id: uuid(), ts: Date.now(), path: window.location.pathname, ...event });
  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  if (immediate || queue.length >= MAX_BATCH) flush();
  else schedule();
}

const UTM_KEYS = ["source", "medium", "campaign"] as const;

/**
 * Keeps the session alive. When a new session begins it records session start, landing page,
 * new-vs-returning, and first-touch attribution (referrer host + UTM tags; never the full URL).
 */
function touch() {
  const who = visitor();
  const current = session();
  if (!current.isNew) return;

  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const utm: QueuedEvent["utm"] = {};
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value && /^[\w.\-+ %]{1,100}$/.test(value)) utm[key] = value;
  }
  const attribution = { path: pathname, referrer: document.referrer || undefined, utm: Object.keys(utm).length ? utm : undefined };

  enqueue({ name: "session_started", ...attribution });
  enqueue({ name: "landing_page_view", ...attribution });
  enqueue({ name: who.isNew ? "unique_visitor" : "returning_visitor", path: pathname });
}

/** Records a product event. Never throws, never blocks the UI. */
export function trackEvent<N extends ClientEventName>(name: N, ...[options]: keyof ClientEventMeta<N> extends never ? [TrackOptions<N>?] : [TrackOptions<N>]) {
  try {
    if (trackingDisabled()) return;
    touch();
    enqueue({ name, entityId: options?.entityId, meta: options?.meta as Record<string, unknown> | undefined }, options?.immediate);
  } catch {
    // analytics must never break the app
  }
}

/** Page view tracking (called on every client-side route change). */
export function trackPageView() {
  try {
    if (trackingDisabled()) return;
    touch();
    enqueue({ name: "page_view" });
  } catch {
    // analytics must never break the app
  }
}
