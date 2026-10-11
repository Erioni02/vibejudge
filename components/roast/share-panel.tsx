"use client";

import { Check, Copy, Download, Lock, Share2 } from "lucide-react";
import { useState } from "react";
import type { ResumeAnalysis } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { saveBlob } from "@/lib/export/canvas";
import { renderRoastCard } from "@/lib/export/roast-card";
import { ScoreBandPill } from "@/components/roast/score-dial";

type Notify = (message: string) => void;

export function shareTextFor(analysis: ResumeAnalysis) {
  return `My CV scored ${Math.round(analysis.score)}/100 on VibeJudge and got roasted. Think yours can survive? vibejudge.app`;
}

export async function downloadRoastCard(analysis: ResumeAnalysis, includeRoast: boolean, notify: Notify) {
  try {
    const blob = await renderRoastCard(analysis, { includeRoast });
    saveBlob(blob, "vibejudge-roast.png");
    trackEvent("roast_card_downloaded");
    notify("Roast card downloaded.");
  } catch {
    notify("Couldn't create the image in this browser. Try another browser.");
  }
}

/**
 * Optional, explicit sharing. Nothing leaves the browser unless the user downloads or shares.
 * The card never contains the CV file, the candidate's name, or contact details.
 */
export function SharePanel({
  analysis,
  includeRoast,
  onIncludeRoastChange,
  notify
}: {
  analysis: ResumeAnalysis;
  includeRoast: boolean;
  onIncludeRoastChange: (value: boolean) => void;
  notify: Notify;
}) {
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [copied, setCopied] = useState(false);
  const shareText = shareTextFor(analysis);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      trackEvent("share_clicked");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      notify("Couldn't access the clipboard. Select the text and copy it manually.");
    }
  }

  async function download() {
    setBusy("download");
    await downloadRoastCard(analysis, includeRoast, notify);
    setBusy(null);
  }

  async function share() {
    setBusy("share");
    trackEvent("share_clicked");
    try {
      const blob = await renderRoastCard(analysis, { includeRoast });
      const file = new File([blob], "vibejudge-roast.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, title: "My VibeJudge CV roast" });
      } else if (navigator.share) {
        await navigator.share({ text: shareText, title: "My VibeJudge CV roast", url: "https://vibejudge.app" });
      } else {
        await copyText();
        notify("Sharing isn't supported here, so we copied the text instead.");
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center">
      {/* Live preview of the card */}
      <div className="mx-auto w-full max-w-[320px]" aria-hidden>
        <div className="flex aspect-[4/5] flex-col rounded-card border border-line bg-paper p-5 shadow-card">
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
            <p className="font-display text-[10px] font-semibold">Think your CV can survive?</p>
            <p className="text-[8px] text-ink-3">Get roasted free at vibejudge.app</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-display-md font-semibold">Make it shareable</h3>
        <p className="mt-2 max-w-lg text-[15px] leading-7 text-ink-2">
          Download a clean roast card for LinkedIn, X, or the group chat. It shows your score and verdict — never your
          name, contact details, or CV.
        </p>

        <label className="mt-5 flex max-w-lg cursor-pointer items-start gap-3 rounded-control border border-line bg-white p-3.5 transition hover:border-line-strong">
          <input
            type="checkbox"
            checked={includeRoast}
            onChange={(event) => onIncludeRoastChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#e2492f]"
          />
          <span className="text-sm leading-6">
            <span className="font-semibold text-ink">Include the roast lines</span>
            <span className="block text-ink-3">Turn off to share only your score, verdict, and summary.</span>
          </span>
        </label>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button type="button" onClick={download} disabled={busy !== null} aria-busy={busy === "download"} className="btn btn-dark">
            <Download size={16} aria-hidden />
            {busy === "download" ? "Rendering…" : "Download PNG"}
          </button>
          <button type="button" onClick={share} disabled={busy !== null} aria-busy={busy === "share"} className="btn btn-secondary">
            <Share2 size={16} aria-hidden />
            {busy === "share" ? "Preparing…" : "Share"}
          </button>
          <button type="button" onClick={copyText} className="btn btn-ghost">
            {copied ? <Check size={16} className="text-moss" aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied ? "Copied" : "Copy text"}
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
