import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";
import { classifyDbError } from "@/lib/server/db-errors";
import { subscribersCsv } from "@/lib/server/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow" };

/** Downloads the active updates list as CSV (for importing into an email tool). */
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: PRIVATE });
  }

  try {
    const db = getDb();
    if (!db) return NextResponse.json({ error: "database_not_configured" }, { status: 503, headers: PRIVATE });
    const csv = await subscribersCsv(db);
    const day = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      headers: {
        ...PRIVATE,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vibejudge-subscribers-${day}.csv"`
      }
    });
  } catch (cause) {
    console.error("[admin-analytics] subscriber export failed:", cause instanceof Error ? cause.message : cause);
    return NextResponse.json({ error: classifyDbError(cause) }, { status: 500, headers: PRIVATE });
  }
}
