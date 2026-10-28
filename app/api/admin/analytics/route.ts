import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";
import { classifyDbError } from "@/lib/server/db-errors";
import { dashboardData } from "@/lib/server/analytics/queries";
import { parseRangeParams } from "@/lib/server/analytics/range-params";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: PRIVATE });
  }

  const parsed = parseRangeParams(new URL(request.url).searchParams);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400, headers: PRIVATE });

  try {
    // Inside the try: a malformed DATABASE_URL throws while creating the client.
    const db = getDb();
    if (!db) return NextResponse.json({ error: "database_not_configured" }, { status: 503, headers: PRIVATE });
    return NextResponse.json(await dashboardData(db, parsed.value), { headers: PRIVATE });
  } catch (cause) {
    console.error("[admin-analytics] query failed:", cause instanceof Error ? cause.message : cause);
    return NextResponse.json({ error: classifyDbError(cause) }, { status: 500, headers: PRIVATE });
  }
}
