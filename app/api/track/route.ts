import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "resume_upload_started",
  "resume_upload_completed",
  "resume_analysis_completed",
  "resume_analysis_failed",
  "resume_score_viewed",
  "resume_roast_viewed",
  "cv_generation_completed",
  "rehearse_cta_clicked",
  "share_clicked"
]);

const counts = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { event?: string };

    if (!payload.event || !allowedEvents.has(payload.event)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    counts.set(payload.event, (counts.get(payload.event) ?? 0) + 1);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    events: Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)))
  });
}
