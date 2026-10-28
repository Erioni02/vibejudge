"use client";

import { Check, Download, Link2, Lock, Share2 } from "lucide-react";
import { useState } from "react";
import type { ResumeAnalysis } from "@/lib/types";
import { trackEvent } from "@/lib/analytics/client";
import { challengeText, challengeUrl } from "@/lib/challenge";
import { saveBlob } from "@/lib/export/canvas";
import { renderRoastCard } from "@/lib/export/roast-card";
import { scoreBand } from "@/lib/score";
import { ScoreBandPill } from "@/components/roast/score-dial";

type Notify = (message: string) => void;

/**
 * "Completed" means the PNG was rendered and handed to the browser's download. Browsers don't
 * report whether the file was actually saved, so the dashboard labels this as a handed-off download.
 */
export async function downloadRoastCard(analysis: ResumeAnalysis, includeRoast: boolean, notify: Notify) {
  const meta = { variant: includeRoast ? "full" : "score_only" } as const;
  trackEvent("roast_image_download_started", { meta });
  try {
    const blob = await renderRoastCard(analysis, { includeRoast });
    saveBlob(blob, "vibejudge-roast.png");
    trackEvent("roast_image_download_completed", { meta });
    notify("Roast card downloaded.");
  } catch {
    trackEvent("roast_image_download_failed", { meta });
    notify("Couldn't create the image in this browser. Try another browser.");
  }
}

const createdCodes = new Set<string>();

/** A share link "exists" the first time it leaves the page (copied or natively shared). */
export function recordShare(code: string, method: "clipboard" | "native") {
  if (!createdCodes.has(code)) {
    createdCodes.add(code);
    trackEvent("roast_off_share_created", { entityId: code, meta: { method } });
  }
  trackEvent("roast_off_share_copied", { entityId: code, meta: { method }, immediate: true });
}

/** Copies the roast-off link. Shared by the share panel and the roast-off card. */
export async function copyChallengeLink(code: string, score: number, notify: Notify) {
  try {
    await navigator.clipboard.writeText(challengeText(score, scoreBand(score).label, code));
    recordShare(code, "clipboard");
    notify("Roast-off link copied. Send it to someone brave.");
    return true;
  } catch {
    trackEvent("client_error", { meta: { feature: "share", reason: "clipboard" } });
    notify(`Couldn't access the clipboard. Share this link: ${challengeUrl(code)}`);
    return false;
  }
}

/**
 * Optional, explicit sharing. Nothing leaves the browser unless the user downloads or shares.
 * The card and link never contain the CV, the candidate's name, or contact details.
 */
export function SharePanel({
  analysis,
  shareCode,
  includeRoast,
  onIncludeRoastChange,
  notify
}: {
  analysis: ResumeAnalysis;
  shareCode: string;
  includeRoast: boolean;
  onIncludeRoastChange: (value: boolean) => void;
  notify: Notify;
}) {
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [copied, setCopied] = useState(false);
  const tier = scoreBand(analysis.score);
  const text = challengeText(analysis.score, tier.label, shareCode);

  async function copyLink() {
    if (await copyChallengeLink(shareCode, analysis.score, notify)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  async function download() {
    setBusy("download");
    await downloadRoastCard(analysis, includeRoast, notify);
    setBusy(null);
  }

  async function share() {
    setBusy("share");
    try {
      const blob = await renderRoastCard(analysis, { includeRoast });
      const file = new File([blob], "vibejudge-roast.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "Beat my CV score" });
        recordShare(shareCode, "native");
      } else if (navigator.share) {
        await navigator.share({ text, title: "Beat my CV score" });
        recordShare(shareCode, "native");
      } else {
        await copyLink();
      }
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        notify("Sharing didn't work this time. You can still download the card.");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-center">
      {/* Live preview of the card */}
      <div className="mx-auto w-full max-w-[300px]" aria-hidden>
        <div className="flex aspect-[4/5] flex-col rounded-card border border-line bg-paper p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[13px] font-semibold">VibeJudge</span>
            <span className="text-[8px] font-semibold tracking-[0.14em] text-ink-3">CV ROAST REPORT</span>
          </div>
          <div className="mt-3 flex items-end justify-between rounded-xl bg-ink px-4 py-3.5 text-white">
            <span className="font-display text-5xl font-semibold leading-none">
              {Math.round(analysis.score)}
              <span className="ml-0.5 text-sm text-white/50">/100</span>
            </span>
            <ScoreBandPill score={analysis.score} className="!px-2 !py-0.5 !text-[9px]" />
          </div>
          <p className="mt-3 line-clamp-3 font-display text-[13px] font-semibold leading-snug">{analysis.verdict}</p>
          {includeRoast ? (
            <div className="mt-2.5 space-y-1.5">
              {analysis.roast.slice(0, 3).map((line, index) => (
                <p key={index} className="line-clamp-2 font-serif text-[11px] italic leading-snug text-ink-2">
                  <span className="mr-1 font-sans text-[9px] font-semibold not-italic text-ember">0{index + 1}</span>“{line}”
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-2.5 line-clamp-5 text-[10px] leading-relaxed text-ink-2">{analysis.summary}</p>
          )}
          <div className="mt-auto border-t border-line-strong/70 pt-2.5">
            <p className="font-display text-[10px] font-semibold">Think you can beat {Math.round(analysis.score)}?</p>
            <p className="text-[8px] text-ink-3">Take the roast-off at vibejudge.app</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-display-md font-semibold">Post it. Dare someone to beat it.</h3>
        <p className="mt-2 max-w-lg text-[15px] leading-7 text-ink-2">
          Your card and roast-off link only show your score and verdict — never your name, contact details, or CV.
        </p>

        <label className="mt-5 flex max-w-lg cursor-pointer items-start gap-3 text-sm leading-6">
          <input
            type="checkbox"
            checked={includeRoast}
            onChange={(event) => onIncludeRoastChange(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#e2492f]"
          />
          <span>
            <span className="font-medium text-ink">Include the roast lines</span>
            <span className="text-ink-3"> — turn off to share only your score and verdict.</span>
          </span>
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={share} disabled={busy !== null} aria-busy={busy === "share"} className="btn btn-dark">
            <Share2 size={16} aria-hidden />
            {busy === "share" ? "Preparing…" : "Share"}
          </button>
          <button type="button" onClick={copyLink} className="btn btn-secondary">
            {copied ? <Check size={16} className="text-moss" aria-hidden /> : <Link2 size={16} aria-hidden />}
            {copied ? "Copied" : "Copy roast-off link"}
          </button>
          <button type="button" onClick={download} disabled={busy !== null} aria-busy={busy === "download"} className="btn btn-ghost">
            <Download size={16} aria-hidden />
            {busy === "download" ? "Rendering…" : "Download PNG"}
          </button>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-3">
          <Lock size={12} aria-hidden />
          Nothing is posted anywhere unless you choose to share it.
        </p>
      </div>
    </div>
  );
}
