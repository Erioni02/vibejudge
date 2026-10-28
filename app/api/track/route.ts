import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";
import { MAX_BODY_BYTES, ingestBatch } from "@/lib/server/analytics/ingest";

export const runtime = "nodejs";

// A busy visitor sends a handful of batches per minute; this only stops floods.
const rateLimit = createRateLimiter({ max: 60, windowMs: 60 * 1000 });

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  try {
    const result = await ingestBatch(request);
    if (result.status !== 200) return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    return NextResponse.json({ ok: true, accepted: result.accepted });
  } catch (cause) {
    // Never surface database details to the public endpoint.
    console.warn("[analytics] ingest failed:", cause instanceof Error ? cause.message : cause);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
