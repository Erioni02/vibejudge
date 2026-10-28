import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";
import { recentActivity } from "@/lib/server/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: PRIVATE });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "database_not_configured" }, { status: 503, headers: PRIVATE });

  try {
    return NextResponse.json({ items: await recentActivity(db), fetchedAt: new Date().toISOString() }, { headers: PRIVATE });
  } catch (cause) {
    console.error("[admin-analytics] activity failed:", cause instanceof Error ? cause.message : cause);
    return NextResponse.json({ error: "query_failed" }, { status: 500, headers: PRIVATE });
  }
}
