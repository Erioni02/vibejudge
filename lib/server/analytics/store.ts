import "server-only";
import { after } from "next/server";
import { ANALYTICS_SCHEMA_VERSION, type EventName } from "@/lib/analytics/events";
import { getDb } from "@/lib/server/db";

export type EventRow = {
  eventId: string;
  name: EventName;
  source: "client" | "server";
  occurredAt: Date;
  visitorId: string | null;
  sessionId: string | null;
  entityId: string | null;
  path: string | null;
  referrerHost: string | null;
  trafficSource: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  device: string | null;
  browser: string | null;
  country: string | null;
  metadata: Record<string, unknown>;
};

const COLUMNS = [
  "event_id",
  "schema_version",
  "name",
  "source",
  "occurred_at",
  "visitor_id",
  "session_id",
  "entity_id",
  "path",
  "referrer_host",
  "traffic_source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "device",
  "browser",
  "country",
  "metadata"
];

/** Inserts events; duplicates (same event_id, e.g. a retried beacon) are silently ignored. */
export async function insertEvents(rows: EventRow[]) {
  const db = getDb();
  if (!db || !rows.length) return 0;

  const params: unknown[] = [];
  const tuples = rows.map((row) => {
    const values = [
      row.eventId,
      ANALYTICS_SCHEMA_VERSION,
      row.name,
      row.source,
      row.occurredAt.toISOString(),
      row.visitorId,
      row.sessionId,
      row.entityId,
      row.path,
      row.referrerHost,
      row.trafficSource,
      row.utmSource,
      row.utmMedium,
      row.utmCampaign,
      row.device,
      row.browser,
      row.country,
      JSON.stringify(row.metadata ?? {})
    ];
    const placeholders = values.map((value, index) => {
      params.push(value);
      const n = params.length;
      if (index === 0) return `$${n}::uuid`;
      if (index === 4) return `$${n}::timestamptz`;
      // Via text: some drivers JSON-encode a string bound straight to jsonb (storing a JSON string, not an object).
      if (index === values.length - 1) return `$${n}::text::jsonb`;
      return `$${n}`;
    });
    return `(${placeholders.join(", ")})`;
  });

  const inserted = await db.query<{ event_id: string }>(
    `insert into analytics_events (${COLUMNS.join(", ")}) values ${tuples.join(", ")}
     on conflict (event_id) do nothing returning event_id`,
    params
  );
  await maybePurge();
  return inserted.length;
}

/** Raw-event retention. Default 395 days (13 months, so year-over-year still works). */
export function retentionDays() {
  const days = Number(process.env.ANALYTICS_RETENTION_DAYS);
  return Number.isInteger(days) && days >= 30 ? days : 395;
}

let lastPurge = 0;

/** Deletes expired raw events at most every 6 hours per server instance. */
export async function maybePurge(nowMs = Date.now()) {
  if (nowMs - lastPurge < 6 * 60 * 60 * 1000) return;
  lastPurge = nowMs;
  const db = getDb();
  if (!db) return;
  await db.query(`delete from analytics_events where occurred_at < now() - make_interval(days => $1::int)`, [retentionDays()]);
}

const pending = new Set<Promise<unknown>>();

/**
 * Runs analytics work after the response is sent (next/server `after`), so tracking never slows
 * down or breaks a roast. Errors are logged and swallowed.
 */
export function runInBackground(task: () => Promise<unknown>) {
  const guarded = () =>
    task().catch((cause) => {
      console.warn("[analytics] write failed:", cause instanceof Error ? cause.message : cause);
    });

  try {
    after(guarded);
  } catch {
    // Outside a request scope (tests, scripts): run now, but keep a handle so tests can await it.
    const promise = guarded().finally(() => pending.delete(promise));
    pending.add(promise);
  }
}

/** Test helper: wait for background analytics writes started outside a request scope. */
export async function flushBackgroundWrites() {
  await Promise.all([...pending]);
}
