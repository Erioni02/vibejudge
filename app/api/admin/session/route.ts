import { NextResponse } from "next/server";
import { z } from "zod";
import { adminConfig, checkCredentials, createSessionToken, isSameOrigin, sessionCookie } from "@/lib/server/admin-auth";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

// Brute-force protection: per IP, plus a global ceiling across all IPs.
const perIp = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });
const global = createRateLimiter({ max: 30, windowMs: 15 * 60 * 1000 });

const loginSchema = z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) }).strict();

/** Sign in. */
export async function POST(request: Request) {
  if (!adminConfig()) return NextResponse.json({ error: "not_found" }, { status: 404, headers: PRIVATE });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: PRIVATE });
  if (!perIp(clientIp(request)) || !global("all")) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429, headers: PRIVATE });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: PRIVATE });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success || !(await checkCredentials(parsed.data.username, parsed.data.password))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401, headers: PRIVATE });
  }

  const response = NextResponse.json({ ok: true }, { headers: PRIVATE });
  response.cookies.set(sessionCookie(createSessionToken()));
  return response;
}

/** Sign out. */
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: PRIVATE });
  const response = NextResponse.json({ ok: true }, { headers: PRIVATE });
  response.cookies.set({ ...sessionCookie(""), maxAge: 0 });
  return response;
}
