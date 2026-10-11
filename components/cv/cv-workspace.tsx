"use client";

import { AlertCircle, Check, Copy, Download, FileImage, Loader2, PenLine, RefreshCw, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cvFileName, parseCv } from "@/lib/cv/parse";
import { saveBlob } from "@/lib/export/canvas";
import { renderCvPdf, renderCvPng } from "@/lib/export/cv-files";
import { CvDocument, CvDocumentSkeleton } from "@/components/cv/cv-document";

const writingMessages = [
  "Reading your experience…",
  "Cutting the corporate fog…",
  "Turning duties into results…",
  "Formatting like a professional…"
];

export function CvWorkspace({
  status,
  cvText,
  error,
  usedRoast,
  onChange,
  onRetry,
  onCancel,
  notify
}: {
  status: "loading" | "done" | "error";
  cvText: string;
  error: string;
  usedRoast: boolean;
  onChange: (text: string) => void;
  onRetry: () => void;
  onCancel: () => void;
  notify: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cvText);
  const [busy, setBusy] = useState<"pdf" | "png" | null>(null);
  const [copied, setCopied] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const parsed = useMemo(() => parseCv(cvText), [cvText]);

  useEffect(() => {
    if (status !== "loading") return;
    setMessageIndex(0);
    const timer = window.setInterval(() => setMessageIndex((index) => (index + 1) % writingMessages.length), 2200);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    setDraft(cvText);
    setEditing(false);
  }, [cvText]);

  async function download(kind: "pdf" | "png") {
    setBusy(kind);
    try {
      if (kind === "pdf") {
        const { blob, lossy } = await renderCvPdf(parsed);
        saveBlob(blob, cvFileName(parsed.name, "pdf"));
        notify(
          lossy
            ? "PDF downloaded. A few special characters aren't supported in PDF — double-check it, or use PNG."
            : "PDF downloaded."
        );
      } else {
        saveBlob(await renderCvPng(parsed), cvFileName(parsed.name, "png"));
        notify("PNG downloaded.");
      }
      trackEvent("cv_downloaded");
    } catch {
      notify(`Couldn't create the ${kind.toUpperCase()} in this browser. Try copying the text instead.`);
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(cvText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      notify("Couldn't access the clipboard. Use Edit text to select and copy it manually.");
    }
  }

  function saveEdits() {
    onChange(draft.trim() || cvText);
    setEditing(false);
    notify("Edits saved. Downloads use your edited version.");
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-ember">Your new CV</p>
          <h2 className="mt-2 font-display text-display-lg font-semibold">
            {status === "done" ? "Clean, sharp, and still 100% you." : status === "loading" ? "Writing your new CV…" : "The CV writer hit a snag."}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-ink-2">
            {usedRoast
              ? "Rebuilt from your original CV and every fix in the roast — using only facts you already wrote."
              : "Rebuilt from your original CV into a clean, recruiter-ready format — using only facts you already wrote."}
          </p>
        </div>

        {status === "done" ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => download("pdf")} disabled={busy !== null || editing} aria-busy={busy === "pdf"} className="btn btn-dark">
              {busy === "pdf" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Download size={16} aria-hidden />}
              Download PDF
            </button>
            <button type="button" onClick={() => download("png")} disabled={busy !== null || editing} aria-busy={busy === "png"} className="btn btn-secondary">
              {busy === "png" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <FileImage size={16} aria-hidden />}
              PNG
            </button>
            <button type="button" onClick={copy} disabled={editing} className="btn btn-secondary">
              {copied ? <Check size={16} className="text-moss" aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => (editing ? saveEdits() : setEditing(true))}
              className={`btn ${editing ? "btn-primary" : "btn-secondary"}`}
              aria-pressed={editing}
            >
              {editing ? <Check size={16} aria-hidden /> : <PenLine size={16} aria-hidden />}
              {editing ? "Save edits" : "Edit text"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-[20px] border border-line bg-paper-2/70 p-3 sm:p-8">
        {status === "loading" ? (
          <div className="relative">
            <CvDocumentSkeleton />
            <div className="absolute inset-x-0 top-1/3 flex justify-center px-4">
              <div className="flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-3 pr-2 shadow-card" role="status" aria-live="polite">
                <Loader2 size={16} className="animate-spin text-ember" aria-hidden />
                <span className="text-sm font-medium text-ink">{writingMessages[messageIndex]}</span>
                <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm !px-2 !py-1" aria-label="Cancel CV generation">
                  <X size={14} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center" role="alert">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-soft text-ember">
              <AlertCircle size={20} aria-hidden />
            </span>
            <p className="mt-4 text-[15px] leading-7 text-ink">{error}</p>
            <button type="button" onClick={onRetry} className="btn btn-dark mt-5">
              <RefreshCw size={15} aria-hidden />
              Try again
            </button>
          </div>
        ) : editing ? (
          <div className="mx-auto max-w-[820px]">
            <label htmlFor="cv-editor" className="sr-only">
              Edit your CV text
            </label>
            <textarea
              id="cv-editor"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              spellCheck
              className="focus-ring min-h-[640px] w-full resize-y rounded-[6px] border border-line bg-white p-6 font-mono text-[13px] leading-6 text-ink shadow-card sm:p-10"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-3">
              <span>Line 1 is your name, line 2 your contact details. UPPERCASE lines become section headings; lines starting with “- ” become bullets.</span>
              <button
                type="button"
                onClick={() => {
                  setDraft(cvText);
                  setEditing(false);
                }}
                className="btn btn-ghost btn-sm"
              >
                Discard changes
              </button>
            </div>
          </div>
        ) : (
          <CvDocument cv={parsed} />
        )}
      </div>

      {status === "done" ? (
        <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-ink-3">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-moss" aria-hidden />
          AI can still make mistakes. Check every name, date, and contact detail before you send it.
        </p>
      ) : null}
    </div>
  );
}
