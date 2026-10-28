import "server-only";
import { randomUUID } from "node:crypto";
import {
  ID_PATTERN,
  INTERNAL_HEADER,
  SESSION_HEADER,
  VISITOR_HEADER,
  serverEventMeta,
  type ServerEventMeta,
  type ServerEventName
} from "@/lib/analytics/events";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { browserFromUserAgent, countryFromHeaders, deviceFromUserAgent, isBot } from "@/lib/server/analytics/context";
import { insertEvents, runInBackground } from "@/lib/server/analytics/store";

export type FailureReason = ServerEventMeta<"cv_roast_failed">["reason"];

export type ServerTracker =<N extends ServerEventName>(name: N, meta: ServerEventMeta<N>) => void;

/**
 * Binds server-side event recording to one API request. The anonymous visitor/session ids come from
 * headers the app's own fetch calls add; they are optional (privacy opt-out → anonymous counts only).
 * Writes happen after the response, so a database problem can never fail a roast or a CV.
 */
export function serverTracker(request: Request): ServerTracker {
  const headers = request.headers;
  const userAgent = headers.get("user-agent");
  const excluded = isBot(userAgent) || headers.get(INTERNAL_HEADER) === "1" || isAdminRequest(request);

  const visitor = headers.get(VISITOR_HEADER);
  const session = headers.get(SESSION_HEADER);
  const visitorId = visitor && ID_PATTERN.test(visitor) ? visitor.toLowerCase() : null;
  const sessionId = session && ID_PATTERN.test(session) ? session.toLowerCase() : null;
  const device = deviceFromUserAgent(userAgent);
  const browser = browserFromUserAgent(userAgent);
  const country = countryFromHeaders(headers);

  return (name, meta) => {
    if (excluded) return;
    const parsed = serverEventMeta[name].safeParse(meta);
    if (!parsed.success) {
      console.warn(`[analytics] dropped invalid server event ${name}`);
      return;
    }

    runInBackground(() =>
      insertEvents([
        {
          eventId: randomUUID(),
          name,
          source: "server",
          occurredAt: new Date(),
          visitorId,
          sessionId,
          entityId: null,
          path: null,
          referrerHost: null,
          trafficSource: null,
          utmSource: null,
          utmMedium: null,
          utmCampaign: null,
          device,
          browser,
          country,
          metadata: parsed.data
        }
      ])
    );
  };
}
