import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";
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

  const db = getDb();
  if (!db) return NextResponse.json({ error: "database_not_configured" }, { status: 503, headers: PRIVATE });

  try {
    return NextResponse.json(await dashboardData(db, parsed.value), { headers: PRIVATE });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error("[admin-analytics] query failed:", message);
    const missingTable = /analytics_events.*does not exist/i.test(message);
    return NextResponse.json({ error: missingTable ? "schema_missing" : "query_failed" }, { status: 500, headers: PRIVATE });
  }
}
