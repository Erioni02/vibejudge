import "server-only";
import { z } from "zod";
import { popupTrigger, type PopupTrigger } from "@/lib/analytics/events";
import type { Db } from "@/lib/server/db";

export const subscribeSchema = z
  .object({
    email: z.string().trim().toLowerCase().max(254).email(),
    trigger: popupTrigger,
    path: z.string().max(300).optional(),
    /** Honeypot: hidden from people, filled in by naive bots. */
    company: z.string().max(200).optional()
  })
  .strict();

export type SubscribeInput = z.infer<typeof subscribeSchema>;

/**
 * Adds an address to the updates list. Returns whether it is new. An existing address (even one that
 * unsubscribed) is left untouched, so a repeat signup can't resubscribe someone who opted out.
 */
export async function addSubscriber(
  db: Db,
  input: { email: string; trigger: PopupTrigger; path: string | null; country: string | null }
): Promise<{ created: boolean }> {
  const rows = await db.query<{ id: string }>(
    `insert into email_subscribers (email, source, trigger, path, country)
     values ($1, 'popup', $2, $3, $4)
     on conflict (email) do nothing
     returning id`,
    [input.email, input.trigger, input.path, input.country]
  );
  return { created: rows.length > 0 };
}

/** Escapes one CSV cell, and defuses spreadsheet formulas (=, +, -, @) in case a value ever starts with one. */
function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Every active subscriber, newest first, as a CSV file for importing into an email tool. */
export async function subscribersCsv(db: Db) {
  const rows = await db.query<{ email: string; created_at: Date | string; trigger: string | null; path: string | null; country: string | null }>(
    `select email, created_at, trigger, path, country
       from email_subscribers
      where unsubscribed_at is null
      order by created_at desc`
  );
  const lines = [
    "email,subscribed_at,trigger,page,country",
    ...rows.map((row) =>
      [row.email, new Date(row.created_at).toISOString(), row.trigger ?? "", row.path ?? "", row.country ?? ""].map(csvCell).join(",")
    )
  ];
  return `${lines.join("\n")}\n`;
}
