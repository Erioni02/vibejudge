import { z } from "zod";

/**
 * VibeJudge analytics event catalogue (schema v1). Shared by the browser tracker and the server.
 *
 * Rules:
 * - Metadata is a closed set of enums per event. There is no free-text field anywhere, so CV text,
 *   roast lines, names, emails, or file names cannot end up in analytics, even by accident.
 * - "Trusted" events are only ever written by the server after the real operation finished. The
 *   ingestion endpoint refuses them from browsers, so nobody can inflate roast or CV counts.
 */
export const ANALYTICS_SCHEMA_VERSION = 1;

const empty = z.object({}).strict();
const roastVariant = z.object({ variant: z.enum(["full", "score_only"]) }).strict();
const failure = z
  .object({
    reason: z.enum(["rate_limited", "invalid_input", "ai_unavailable", "ai_not_configured", "server_error"])
  })
  .strict();
const generationMode = z.enum(["rewrite", "from_roast", "builder"]);

/** Events the browser may send to /api/track. */
export const clientEventMeta = {
  page_view: empty,
  session_started: empty,
  landing_page_view: empty,
  unique_visitor: empty,
  returning_visitor: empty,

  cv_upload_started: z.object({ input: z.enum(["file"]) }).strict(),
  cv_roast_abandoned: empty,
  cv_generation_abandoned: empty,
  builder_started: empty,

  roast_off_share_created: z.object({ method: z.enum(["clipboard", "native"]) }).strict(),
  roast_off_share_copied: z.object({ method: z.enum(["clipboard", "native"]) }).strict(),
  roast_off_share_opened: z.object({ legacy: z.boolean() }).strict(),
  roast_off_interaction: z.object({ action: z.enum(["upload_started", "roast_completed", "generation_started"]) }).strict(),

  roast_image_download_started: roastVariant,
  roast_image_download_completed: roastVariant,
  roast_image_download_failed: roastVariant,

  cv_download_completed: z.object({ format: z.enum(["pdf", "png"]) }).strict(),
  cv_download_failed: z.object({ format: z.enum(["pdf", "png"]) }).strict(),

  client_error: z
    .object({
      feature: z.enum(["roast", "generation", "builder", "share", "download"]),
      reason: z.enum(["network", "clipboard", "render"])
    })
    .strict()
} as const;

/** Events only the server writes, after it has confirmed the outcome itself. */
export const serverEventMeta = {
  cv_upload_completed: z.object({ input: z.enum(["file", "text"]) }).strict(),
  cv_roast_started: empty,
  cv_roast_completed: empty,
  cv_roast_failed: failure,
  cv_generation_started: z.object({ mode: generationMode }).strict(),
  cv_generation_completed: z.object({ mode: generationMode }).strict(),
  cv_generation_failed: failure.extend({ mode: generationMode }).strict()
} as const;

export type ClientEventName = keyof typeof clientEventMeta;
export type ServerEventName = keyof typeof serverEventMeta;
export type EventName = ClientEventName | ServerEventName;

export type ClientEventMeta<N extends ClientEventName> = z.infer<(typeof clientEventMeta)[N]>;
export type ServerEventMeta<N extends ServerEventName> = z.infer<(typeof serverEventMeta)[N]>;

export const clientEventNames = Object.keys(clientEventMeta) as ClientEventName[];
export const serverEventNames = Object.keys(serverEventMeta) as ServerEventName[];

export function isClientEventName(name: string): name is ClientEventName {
  return Object.prototype.hasOwnProperty.call(clientEventMeta, name);
}

/** Events that carry the roast-off share code as their entity id. */
export const shareEntityEvents = new Set<EventName>([
  "roast_off_share_created",
  "roast_off_share_copied",
  "roast_off_share_opened",
  "roast_off_interaction"
]);

export const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Header names the app's own API calls use to attribute server events to the anonymous visitor. */
export const VISITOR_HEADER = "x-vj-vid";
export const SESSION_HEADER = "x-vj-sid";
export const INTERNAL_HEADER = "x-vj-internal";

const shortText = z
  .string()
  .max(100)
  .regex(/^[\w.\-+ %]*$/);

/** One event inside a /api/track batch. */
export const clientEventSchema = z
  .object({
    id: z.string().regex(ID_PATTERN),
    name: z.string().max(64),
    ts: z.number().int().positive(),
    path: z.string().max(300).optional(),
    entityId: z.string().max(16).optional(),
    meta: z.record(z.unknown()).optional(),
    referrer: z.string().max(500).optional(),
    utm: z
      .object({ source: shortText.optional(), medium: shortText.optional(), campaign: shortText.optional() })
      .strict()
      .optional()
  })
  .strict();

export const trackBatchSchema = z
  .object({
    v: z.literal(ANALYTICS_SCHEMA_VERSION),
    vid: z.string().regex(ID_PATTERN),
    sid: z.string().regex(ID_PATTERN),
    events: z.array(clientEventSchema).min(1).max(25)
  })
  .strict();

export type ClientEventInput = z.infer<typeof clientEventSchema>;
export type TrackBatch = z.infer<typeof trackBatchSchema>;
