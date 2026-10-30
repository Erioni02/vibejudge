import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";
import { countryFromHeaders, sanitizePath } from "@/lib/server/analytics/context";
import { serverTracker } from "@/lib/server/analytics/server-events";
import { addSubscriber, subscribeSchema } from "@/lib/server/subscribers";

export const runtime = "nodejs";

const rateLimit = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

function error(code: string, status: number) {
  return NextResponse.json({ ok: false, error: code }, { status });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return error("forbidden", 403);
  if (!rateLimit(clientIp(request))) return error("rate_limited", 429);
  if (Number(request.headers.get("content-length") ?? 0) > 2_000) return error("too_large", 413);

  const parsed = subscribeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("invalid_email", 400);

  // Bots that fill the hidden field get the same answer as people, and nothing is stored.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const db = getDb();
  if (!db) return error("unavailable", 503);

  try {
    const { created } = await addSubscriber(db, {
      email: parsed.data.email,
      trigger: parsed.data.trigger,
      path: sanitizePath(parsed.data.path),
      country: countryFromHeaders(request.headers)
    });
    if (created) serverTracker(request)("email_subscribed", { trigger: parsed.data.trigger });
    // Same reply for new and existing addresses, so the form can't be used to probe who is on the list.
    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.warn("[subscribe] failed:", cause instanceof Error ? cause.message : cause);
    return error("unavailable", 503);
  }
}
