"use client";

import { AlertCircle, ArrowDown, ArrowRight, Check, FileText, Flame, Loader2, RefreshCw, Sparkles, UploadCloud, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { MIN_RESUME_CHARACTERS } from "@/lib/validation/resume";

export type InputMode = "file" | "text" | "build";
export type RoastStatus = "idle" | "loading" | "error" | "done";

const roastSteps = [
  { at: 0, label: "Reading your CV" },
  { at: 4, label: "Hunting for red flags" },
  { at: 11, label: "Writing the roast" }
];

const quips = [
  "Counting how many times you wrote “responsible for”…",
  "Checking whether “team player” is doing any heavy lifting…",
  "Looking for a single number. Any number…",
  "Asking the ATS robot for its honest opinion…",
  "Sharpening the feedback, gently…"
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPanel({
  mode,
  onModeChange,
  file,
  onFile,
  text,
  onText,
  status,
  error,
  hasResult,
  cvBusy,
  onRoast,
  onGenerate,
  onCancel,
  onViewResults,
  builder
}: {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  file: File | null;
  onFile: (file: File | null) => void;
  text: string;
  onText: (text: string) => void;
  status: RoastStatus;
  error: string;
  hasResult: boolean;
  cvBusy: boolean;
  onRoast: () => void;
  onGenerate: () => void;
  onCancel: () => void;
  onViewResults: () => void;
  /** The "No CV yet" interview, rendered when mode is "build". */
  builder: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const dragDepth = useRef(0);
  // Set when the main CTA opens the file picker, so choosing a file starts the roast straight away.
  const autoRoast = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const textId = useId();
  const isLoading = status === "loading";
  const textLength = text.trim().length;
  const ready = mode === "file" ? Boolean(file) : mode === "text" ? textLength >= MIN_RESUME_CHARACTERS : false;

  useEffect(() => {
    if (!isLoading) return;
    setElapsed(0);
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 500);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (file && autoRoast.current) {
      autoRoast.current = false;
      onRoast();
    }
  }, [file, onRoast]);

  useEffect(() => {
    if (error) autoRoast.current = false;
  }, [error]);

  function handlePrimary() {
    if (ready) {
      onRoast();
    } else if (mode === "file") {
      autoRoast.current = true;
      inputRef.current?.click();
    } else {
      textRef.current?.focus();
    }
  }

  const activeStep = roastSteps.reduce((active, step, index) => (elapsed >= step.at ? index : active), 0);

  return (
    <div id="upload" className="card scroll-mt-24 p-2 shadow-xs">
      {isLoading ? (
        <div className="rounded-[12px] bg-paper p-6 sm:p-7" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold">The judge is reading…</p>
            <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
              Cancel
            </button>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-ember transition-[width] duration-700 ease-out"
              style={{ width: `${Math.min(92, 8 + elapsed * 2.4)}%` }}
            />
          </div>
          <ol className="mt-5 space-y-3">
            {roastSteps.map((step, index) => {
              const state = index < activeStep ? "done" : index === activeStep ? "active" : "todo";
              return (
                <li key={step.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                      state === "done" ? "bg-moss text-white" : state === "active" ? "bg-ember-soft text-ember" : "bg-paper-2 text-ink-3"
                    }`}
                    aria-hidden
                  >
                    {state === "done" ? <Check size={12} strokeWidth={3} /> : state === "active" ? <Loader2 size={12} className="animate-spin" /> : null}
                  </span>
                  <span className={state === "todo" ? "text-ink-3" : "font-medium text-ink"}>{step.label}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 min-h-[20px] font-serif text-[17px] italic text-ink-2">{quips[Math.floor(elapsed / 4) % quips.length]}</p>
          <p className="mt-1 text-xs text-ink-3">Usually under a minute.</p>
        </div>
      ) : (
        <>
          {/* Mode switch */}
          <div className="flex gap-1 rounded-[12px] bg-paper p-1" role="group" aria-label="How do you want to add your CV?">
            {(
              [
                ["file", "Upload file"],
                ["text", "Paste text"],
                ["build", "No CV yet"]
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => onModeChange(value)}
                className={`focus-ring flex-1 rounded-[9px] px-3 py-2 text-[13px] font-semibold transition duration-fast ${
                  mode === value ? "bg-white text-ink shadow-xs" : "text-ink-3 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "build" ? (
            <div className="p-2 pt-3 sm:p-3">
              {error && status === "error" ? (
                <div className="mb-4 flex gap-3 rounded-control border border-ember/30 bg-ember-soft/70 p-3.5 text-sm leading-6 text-ink" role="alert">
                  <AlertCircle className="mt-0.5 shrink-0 text-ember" size={17} aria-hidden />
                  <span className="flex-1">{error}</span>
                </div>
              ) : null}
              {builder}
            </div>
          ) : (
            <div className="p-2 pt-3 sm:p-3">
              {mode === "file" ? (
                file ? (
                  <div className="flex items-center gap-3 rounded-[12px] border border-line bg-paper p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ink ring-1 ring-line">
                      <FileText size={18} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-ink-3">{formatBytes(file.size)} · ready to roast</p>
                    </div>
                    <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-ghost btn-sm hidden sm:inline-flex">
                      Replace
                    </button>
                    <button type="button" onClick={() => onFile(null)} className="btn btn-ghost btn-sm !px-2" aria-label="Remove file">
                      <X size={16} aria-hidden />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      dragDepth.current += 1;
                      setDragging(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => {
                      dragDepth.current = Math.max(0, dragDepth.current - 1);
                      if (dragDepth.current === 0) setDragging(false);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      dragDepth.current = 0;
                      setDragging(false);
                      onFile(event.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`focus-ring group flex w-full flex-col items-center justify-center rounded-[12px] border-[1.5px] border-dashed px-6 py-8 text-center transition duration-base ease-out sm:py-9 ${
                      dragging ? "scale-[1.01] border-ember bg-ember-soft/60" : "border-line-strong bg-paper hover:border-ink-3 hover:bg-paper-2/60"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink shadow-xs ring-1 ring-line transition duration-base ease-out ${
                        dragging ? "-translate-y-1 text-ember" : "group-hover:-translate-y-0.5"
                      }`}
                    >
                      <UploadCloud size={22} aria-hidden />
                    </span>
                    <span className="mt-4 text-[15px] font-semibold text-ink">
                      {dragging ? "Drop it. The judge is waiting." : (
                        <>
                          Drop your CV here or <span className="text-ember underline decoration-ember/30 underline-offset-4">browse</span>
                        </>
                      )}
                    </span>
                    <span className="mt-1.5 text-[13px] text-ink-3">PDF, DOCX or TXT · up to 6 MB</span>
                  </button>
                )
              ) : (
                <div>
                  <label htmlFor={textId} className="sr-only">
                    Paste your CV text
                  </label>
                  <textarea
                    ref={textRef}
                    id={textId}
                    value={text}
                    onChange={(event) => onText(event.target.value)}
                    placeholder="Paste the full text of your CV here — experience, skills, education…"
                    className="focus-ring block h-[188px] w-full resize-none rounded-[12px] border border-line-strong bg-paper p-4 text-sm leading-6 text-ink placeholder:text-ink-3 focus:bg-white"
                  />
                  <p className={`mt-1.5 text-right text-xs tabular-nums ${textLength && textLength < MIN_RESUME_CHARACTERS ? "text-amber" : "text-ink-3"}`}>
                    {textLength < MIN_RESUME_CHARACTERS
                      ? `${textLength}/${MIN_RESUME_CHARACTERS} characters minimum`
                      : `${textLength.toLocaleString()} characters`}
                  </p>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={(event) => {
                  const picked = event.target.files?.[0] ?? null;
                  if (!picked) autoRoast.current = false;
                  onFile(picked);
                  event.target.value = "";
                }}
              />

              {error ? (
                <div className="mt-3 flex gap-3 rounded-control border border-ember/30 bg-ember-soft/70 p-3.5 text-sm leading-6 text-ink" role="alert">
                  <AlertCircle className="mt-0.5 shrink-0 text-ember" size={17} aria-hidden />
                  <span className="flex-1">{error}</span>
                  {status === "error" && ready ? (
                    <button type="button" onClick={onRoast} className="btn btn-ghost btn-sm -my-1 shrink-0 !px-2 font-semibold text-ember-dark">
                      <RefreshCw size={14} aria-hidden />
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3">
                {hasResult ? (
                  <button type="button" onClick={onViewResults} className="btn btn-dark btn-lg w-full">
                    <ArrowDown size={17} aria-hidden />
                    View your results
                  </button>
                ) : (
                  <button type="button" onClick={handlePrimary} disabled={cvBusy} className="btn btn-primary btn-lg w-full">
                    <Flame size={17} aria-hidden />
                    Roast My CV — Free
                  </button>
                )}
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={!ready || cvBusy}
                  className="focus-ring group mx-auto mt-2 flex items-center gap-1.5 rounded-control px-3 py-2 text-[13px] font-medium text-ink-2 transition hover:text-ink disabled:pointer-events-none disabled:opacity-45"
                >
                  {cvBusy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Sparkles size={14} className="text-ember" aria-hidden />}
                  {cvBusy ? "Writing your new CV…" : "Skip the roast — generate a new CV"}
                  {!cvBusy ? <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden /> : null}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
