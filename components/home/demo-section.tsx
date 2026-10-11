import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { demoAnalysis, demoCv } from "@/data/demo-roast";
import { ScoreDial } from "@/components/roast/score-dial";
import { BeforeAfter, CategoryFeedback, RoastLines } from "@/components/roast/roast-parts";

type Part = string | { readonly mark: number; readonly text: string };

function Annotated({ parts }: { parts: readonly Part[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index} className="relative">
            <mark className="rounded-[3px] bg-ember-soft px-0.5 text-ink [box-decoration-break:clone] [text-decoration:underline_wavy_#e2492f_1.5px] [text-underline-offset:4px]">
              {part.text}
            </mark>
            <sup className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ember align-super text-[9px] font-bold not-italic text-white">
              {part.mark}
            </sup>
          </span>
        )
      )}
    </>
  );
}

export function DemoSection() {
  return (
    <section id="example" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="example-heading">
      <div className="section">
        <div className="max-w-2xl">
          <p className="eyebrow text-ember">Example roast</p>
          <h2 id="example-heading" className="mt-3 font-display text-display-lg font-semibold text-ink">
            See a roast before you get one.
          </h2>
          <p className="mt-4 text-[17px] leading-8 text-ink-2">
            A fictional CV, judged the way yours will be: an overall score, the roast, feedback by category, and fixes you can
            actually use.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* The fictional CV, red-penned */}
          <div className="relative rounded-[20px] border border-line bg-paper-2/60 p-3 sm:p-6">
            <article className="rounded-[6px] bg-white p-6 shadow-card ring-1 ring-line sm:p-9">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{demoCv.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-3">{demoCv.role}</p>
                </div>
                <span className="chip shrink-0">
                  <Info size={12} aria-hidden />
                  Fictional CV
                </span>
              </div>
              <div className="mt-4 h-[3px] w-10 rounded-full bg-line-strong" aria-hidden />

              <p className="mt-6 border-b border-line pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">Summary</p>
              <p className="mt-3 text-[14.5px] leading-7 text-ink-2">
                <Annotated parts={demoCv.summary} />
              </p>

              <p className="mt-6 border-b border-line pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">Experience</p>
              <p className="mt-3 text-[14.5px] font-semibold">{demoCv.job.title}</p>
              <p className="text-[13px] text-ink-3">
                {demoCv.job.company} · {demoCv.job.dates}
              </p>
              <ul className="mt-3 space-y-2">
                {demoCv.bullets.map((bullet, index) => (
                  <li key={index} className="relative pl-4 text-[14.5px] leading-7 text-ink-2">
                    <span className="absolute left-0 top-[11px] h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden />
                    <Annotated parts={bullet} />
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-b border-line pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">Skills</p>
              <p className="mt-3 text-[14.5px] leading-7 text-ink-2">{demoCv.skills}</p>
            </article>
          </div>

          {/* The verdict */}
          <div className="card flex flex-col p-6 shadow-card sm:p-8">
            <div className="flex flex-col items-center gap-6 border-b border-line pb-7 sm:flex-row sm:items-center">
              <ScoreDial score={demoAnalysis.score} size={128} />
              <div className="text-center sm:text-left">
                <p className="font-display text-[22px] font-semibold leading-tight tracking-tight">{demoAnalysis.verdict}</p>
                <p className="mt-2.5 text-sm leading-6 text-ink-2">{demoAnalysis.summary}</p>
              </div>
            </div>
            <p className="eyebrow mb-4 mt-7 text-ember">The roast</p>
            <RoastLines lines={demoAnalysis.roast} size="md" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Feedback by category</p>
            <CategoryFeedback sections={demoAnalysis.sections} only={["experience", "skills", "ats"]} />
          </div>
          <div className="space-y-6">
            <div>
              <p className="eyebrow mb-4">Fix these first</p>
              <ol className="space-y-2">
                {demoAnalysis.quick_wins.map((win, index) => (
                  <li key={win} className="flex gap-3 rounded-control border border-line bg-white p-3.5 text-[15px] leading-6">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss-soft text-xs font-semibold text-moss">
                      {index + 1}
                    </span>
                    {win}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="eyebrow mb-4">Before / after</p>
              <BeforeAfter example={demoAnalysis.rewrite_examples[0]} stacked />
              <p className="mt-3 text-xs leading-5 text-ink-3">
                Example numbers are illustrative. Use your real ones — a rewrite only works if you can back it up in an interview.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="#upload" className="btn btn-dark btn-lg group">
            Now roast mine
            <ArrowRight size={17} className="transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
