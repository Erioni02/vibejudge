import "server-only";
import {
  INTERNAL_HEADER,
  clientEventMeta,
  isClientEventName,
  shareEntityEvents,
  trackBatchSchema,
  type ClientEventInput
} from "@/lib/analytics/events";
import { decodeChallenge } from "@/lib/challenge";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  browserFromUserAgent,
  classifyTraffic,
  cleanUtm,
  countryFromHeaders,
  deviceFromUserAgent,
  isBot,
  referrerHost,
  sanitizePath
} from "@/lib/server/analytics/context";
import { insertEvents, type EventRow } from "@/lib/server/analytics/store";

export const MAX_BODY_BYTES = 16 * 1024;

/** Events whose first-touch attribution (referrer, UTM, traffic source) is recorded. */
const ATTRIBUTED = new Set(["session_started", "landing_page_view"]);

export type IngestResult =
  | { status: 200; accepted: number; stored: number; ignored?: "bot" | "internal" }
  | { status: 400 | 413; error: string };

function ownHost(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "vibejudge.app";
  return host.toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
}

/** Client clocks lie. Accept timestamps from the last 24h (queued retries); otherwise use server time. */
function eventTime(ts: number, nowMs: number) {
  return ts <= nowMs + 5 * 60 * 1000 && ts >= nowMs - 24 * 60 * 60 * 1000 ? new Date(Math.min(ts, nowMs)) : new Date(nowMs);
}

type RequestContext = Pick<EventRow, "source" | "visitorId" | "sessionId" | "device" | "browser" | "country">;

function toRow(event: ClientEventInput, context: RequestContext, request: Request, nowMs: number): EventRow | null {
  if (!isClientEventName(event.name)) return null;
  const meta = clientEventMeta[event.name].safeParse(event.meta ?? {});
  if (!meta.success) return null;

  let entityId: string | null = null;
  if (shareEntityEvents.has(event.name) && event.entityId) {
    // Only real roast-off codes are accepted as share ids.
    if (decodeChallenge(event.entityId) === null) return null;
    entityId = event.entityId.toLowerCase();
  }

  const attributed = ATTRIBUTED.has(event.name);
  const referrer = attributed ? referrerHost(event.referrer) : null;
  const utmSource = attributed ? cleanUtm(event.utm?.source) : null;
  const utmMedium = attributed ? cleanUtm(event.utm?.medium) : null;
  const utmCampaign = attributed ? cleanUtm(event.utm?.campaign) : null;

  return {
    ...context,
    eventId: event.id.toLowerCase(),
    name: event.name,
    occurredAt: eventTime(event.ts, nowMs),
    path: sanitizePath(event.path),
    entityId,
    referrerHost: referrer,
    trafficSource: attributed ? classifyTraffic({ referrer, utmSource, utmMedium, ownHost: ownHost(request) }) : null,
    utmSource,
    utmMedium,
    utmCampaign,
    metadata: meta.data as Record<string, unknown>
  };
}

/**
 * Validates and stores a browser batch. Invalid individual events are dropped (not the whole batch)
 * so one bad event can't lose the rest; trusted server-only event names are always rejected.
 */
export async function ingestBatch(request: Request, nowMs = Date.now()): Promise<IngestResult> {
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return { status: 413, error: "too_large" };

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { status: 400, error: "invalid_json" };
  }

  const parsed = trackBatchSchema.safeParse(body);
  if (!parsed.success) return { status: 400, error: "invalid_batch" };

  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) return { status: 200, accepted: 0, stored: 0, ignored: "bot" };
  if (request.headers.get(INTERNAL_HEADER) === "1" || isAdminRequest(request)) {
    return { status: 200, accepted: 0, stored: 0, ignored: "internal" };
  }

  const context = {
    source: "client" as const,
    visitorId: parsed.data.vid.toLowerCase(),
    sessionId: parsed.data.sid.toLowerCase(),
    device: deviceFromUserAgent(userAgent),
    browser: browserFromUserAgent(userAgent),
    country: countryFromHeaders(request.headers)
  };

  const rows = parsed.data.events
    .map((event) => toRow(event, context, request, nowMs))
    .filter((row): row is EventRow => row !== null);

  if (!rows.length) return { status: 400, error: "no_valid_events" };

  const stored = await insertEvents(rows);
  return { status: 200, accepted: rows.length, stored };
}
