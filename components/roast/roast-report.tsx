"use client";

import { Check, Download, FileText, Gavel, Loader2, RotateCcw, Sparkles, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ResumeAnalysis } from "@/lib/types";
import { bySeverity, severityMeta } from "@/lib/score";
import { ScoreDial } from "@/components/roast/score-dial";
import { BeforeAfter, CategoryFeedback, RoastLines, SectionTitle } from "@/components/roast/roast-parts";
import { SharePanel, downloadRoastCard } from "@/components/roast/share-panel";

type CvStatus = "idle" | "loading" | "done" | "error";

export function RoastReport({
  analysis,
  sourceLabel,
  cvStatus,
  onGenerateCv,
  onViewCv,
  onReset,
  notify
}: {
  analysis: ResumeAnalysis;
  sourceLabel: string;
  cvStatus: CvStatus;
  onGenerateCv: () => void;
  onViewCv: () => void;
  onReset: () => void;
  notify: (message: string) => void;
}) {
  const [includeRoast, setIncludeRoast] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [barVisible, setBarVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const problems = bySeverity(analysis.problems);

  // Mobile: show the sticky action bar only while the report is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setBarVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function toggleWin(index: number) {
    setDone((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function download() {
    setDownloading(true);
    await downloadRoastCard(analysis, includeRoast, notify);
    setDownloading(false);
  }

  return (
    <>
      <div ref={rootRef} className="animate-fade-up pb-16 lg:pb-0">
        {/* Report header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
              <Gavel size={15} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">The verdict is in</p>
              <p className="truncate text-sm font-medium text-ink-2" title={sourceLabel}>
                {sourceLabel}
              </p>
            </div>
          </div>
          <button type="button" onClick={onReset} className="btn btn-ghost btn-sm">
            <RotateCcw size={14} aria-hidden />
            Roast another CV
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
          {/* Score + primary actions */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-6 text-center shadow-card">
              <ScoreDial score={analysis.score} />
              <h2 className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-tight text-ink">{analysis.verdict}</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-2">{analysis.summary}</p>
            </div>

            <div className="card hidden space-y-2.5 p-4 shadow-card lg:block">
              {cvStatus === "done" ? (
                <button type="button" onClick={onViewCv} className="btn btn-primary btn-lg w-full">
                  <FileText size={17} aria-hidden />
                  View your new CV
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGenerateCv}
                  disabled={cvStatus === "loading"}
                  aria-busy={cvStatus === "loading"}
                  className="btn btn-primary btn-lg w-full"
                >
                  {cvStatus === "loading" ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <Sparkles size={17} aria-hidden />}
                  {cvStatus === "loading" ? "Writing your new CV…" : "Generate a New CV with AI"}
                </button>
              )}
              <button type="button" onClick={download} disabled={downloading} aria-busy={downloading} className="btn btn-secondary w-full">
                <Download size={16} aria-hidden />
                {downloading ? "Rendering…" : "Download roast"}
              </button>
              <p className="px-1 pt-1 text-xs leading-5 text-ink-3">
                The new CV is rewritten from your real experience plus this feedback. Nothing is invented.
              </p>
            </div>
          </aside>

          {/* Report body */}
          <div className="min-w-0 space-y-6">
            {/* The roast — centerpiece */}
            <section className="card relative overflow-hidden p-6 shadow-card sm:p-8" aria-labelledby="roast-heading">
              <div className="absolute inset-x-0 top-0 h-1 bg-ember" aria-hidden />
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 id="roast-heading" className="font-display text-display-md font-semibold">
                  The roast
                </h2>
                <span className="chip">
                  <span className="emoji" aria-hidden>
                    🔥
                  </span>
                  {analysis.roast.length} burns
                </span>
              </div>
              <RoastLines lines={analysis.roast} />
            </section>

            {analysis.strengths.length ? (
              <section className="card p-6 sm:p-7" aria-label="What's working">
                <SectionTitle eyebrow="Credit where it's due" title="What's actually working" />
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex gap-3 rounded-control bg-moss-soft/60 p-3.5 text-sm leading-6 text-ink">
                      <ThumbsUp size={16} className="mt-1 shrink-0 text-moss" aria-hidden />
                      {strength}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="card p-6 sm:p-7" aria-label="What's holding your CV back">
              <SectionTitle eyebrow="The evidence" title="What's holding your CV back" />
              <ul className="divide-y divide-line">
                {problems.map((problem, index) => {
                  const meta = severityMeta[problem.severity];
                  return (
                    <li key={index} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
                          {meta.label}
                        </span>
                        <h4 className="text-base font-semibold text-ink">{problem.title}</h4>
                      </div>
                      <p className="mt-2 text-[15px] leading-7 text-ink-2">{problem.explanation}</p>
                      <p className="mt-3 rounded-control border-l-2 border-moss bg-paper px-4 py-3 text-sm leading-6 text-ink">
                        <span className="font-semibold text-moss">Fix: </span>
                        {problem.fix}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-label="Feedback by category">
              <SectionTitle eyebrow="Section by section" title="Feedback by category" />
              <CategoryFeedback sections={analysis.sections} />
            </section>

            {analysis.rewrite_examples.length ? (
              <section className="card p-6 sm:p-7" aria-label="Before and after rewrites">
                <SectionTitle eyebrow="Exhibit A" title="Before / after" />
                <div className="space-y-4">
                  {analysis.rewrite_examples.map((example, index) => (
                    <BeforeAfter key={index} example={example} />
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-ink-3">
                  Rewrites can include example numbers. Swap in your real ones — never claim results you can&apos;t back up.
                </p>
              </section>
            ) : null}

            <section className="card p-6 sm:p-7" aria-label="Quick wins">
              <SectionTitle
                eyebrow="Fix these first"
                title="Quick wins"
                aside={
                  <span className="text-sm font-medium tabular-nums text-ink-3">
                    {done.size}/{analysis.quick_wins.length} done
                  </span>
                }
              />
              <ul className="space-y-2">
                {analysis.quick_wins.map((win, index) => {
                  const checked = done.has(index);
                  return (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => toggleWin(index)}
                        aria-pressed={checked}
                        className="focus-ring group flex w-full items-start gap-3 rounded-control border border-line bg-white p-3.5 text-left text-[15px] leading-6 transition hover:border-line-strong"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            checked ? "border-moss bg-moss text-white" : "border-line-strong bg-white text-transparent group-hover:border-ink-3"
                          }`}
                          aria-hidden
                        >
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span className={checked ? "text-ink-3 line-through decoration-ink-3/50" : "text-ink"}>{win}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-card bg-ink p-6 text-white sm:p-8" aria-label="Final verdict">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Final verdict</p>
              <p className="mt-3 font-serif text-[26px] italic leading-snug sm:text-[30px]">{analysis.final_verdict}</p>
              {analysis.interview_readiness ? (
                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-white/65">
                  <span className="font-semibold text-white/85">Will it hold up when they ask about it? </span>
                  {analysis.interview_readiness}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {cvStatus === "done" ? (
                  <button type="button" onClick={onViewCv} className="btn btn-primary">
                    <FileText size={16} aria-hidden />
                    View your new CV
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGenerateCv}
                    disabled={cvStatus === "loading"}
                    aria-busy={cvStatus === "loading"}
                    className="btn btn-primary"
                  >
                    {cvStatus === "loading" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Sparkles size={16} aria-hidden />}
                    {cvStatus === "loading" ? "Writing your new CV…" : "Fix it for me — generate a new CV"}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        <section className="card mt-6 p-6 sm:p-8" aria-label="Share your roast">
          <SharePanel analysis={analysis} includeRoast={includeRoast} onIncludeRoastChange={setIncludeRoast} notify={notify} />
        </section>
      </div>

      {/* Mobile action bar — outside the animated wrapper, whose transform would break position: fixed */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-md transition duration-base ease-out pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden ${
          barVisible ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        aria-hidden={!barVisible}
      >
        <div className="mx-auto flex max-w-md gap-2">
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            aria-busy={downloading}
            tabIndex={barVisible ? 0 : -1}
            className="btn btn-secondary shrink-0 !px-3.5"
            aria-label="Download roast"
          >
            <Download size={17} aria-hidden />
          </button>
          {cvStatus === "done" ? (
            <button type="button" onClick={onViewCv} tabIndex={barVisible ? 0 : -1} className="btn btn-primary flex-1">
              <FileText size={16} aria-hidden />
              View your new CV
            </button>
          ) : (
            <button
              type="button"
              onClick={onGenerateCv}
              disabled={cvStatus === "loading"}
              aria-busy={cvStatus === "loading"}
              tabIndex={barVisible ? 0 : -1}
              className="btn btn-primary flex-1"
            >
              {cvStatus === "loading" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Sparkles size={16} aria-hidden />}
              {cvStatus === "loading" ? "Writing your new CV…" : "Generate a New CV with AI"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
