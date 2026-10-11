export type FunnelEvent =
  | "resume_upload_started"
  | "resume_upload_completed"
  | "resume_analysis_completed"
  | "resume_analysis_failed"
  | "resume_score_viewed"
  | "resume_roast_viewed"
  | "cv_generation_completed"
  | "rehearse_cta_clicked"
  | "share_clicked"
  | "roast_card_downloaded"
  | "cv_generation_started"
  | "cv_generation_failed"
  | "cv_downloaded"
  | "challenge_opened"
  | "challenge_completed"
  | "challenge_link_shared";

export function trackEvent(event: FunnelEvent) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ event });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    // fall through to fetch
  }

  fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
}
