import { ArrowRight, Briefcase, GraduationCap, LayoutTemplate, ScanText, Wrench } from "lucide-react";
import type { ResumeAnalysis, RewriteExample } from "@/lib/types";

/** Presentational building blocks shared by the live results and the homepage demo. */

export function RoastLines({ lines, size = "lg" }: { lines: string[]; size?: "lg" | "md" }) {
  return (
    <ol className="divide-y divide-line">
      {lines.map((line, index) => (
        <li key={`${index}-${line.slice(0, 24)}`} className="flex gap-4 py-5 first:pt-0 last:pb-0 sm:gap-5">
          <span className="mt-1.5 font-display text-sm font-semibold tabular-nums text-ember" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <p
            className={`font-serif italic leading-snug text-ink ${
              size === "lg" ? "text-[22px] sm:text-[26px]" : "text-[19px] sm:text-[21px]"
            }`}
          >
            {line}
          </p>
        </li>
      ))}
    </ol>
  );
}

export const categoryMeta: Record<keyof ResumeAnalysis["sections"], { label: string; Icon: typeof Briefcase }> = {
  experience: { label: "Experience", Icon: Briefcase },
  formatting: { label: "Formatting", Icon: LayoutTemplate },
  skills: { label: "Skills", Icon: Wrench },
  ats: { label: "ATS readability", Icon: ScanText },
  education: { label: "Education", Icon: GraduationCap }
};

const categoryOrder: Array<keyof ResumeAnalysis["sections"]> = ["experience", "formatting", "skills", "ats", "education"];

export function CategoryFeedback({
  sections,
  only
}: {
  sections: Partial<ResumeAnalysis["sections"]>;
  only?: Array<keyof ResumeAnalysis["sections"]>;
}) {
  const keys = (only ?? categoryOrder).filter((key) => sections[key]);

  return (
    <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
      {keys.map((key, index) => {
        const { label, Icon } = categoryMeta[key];
        const spanFull = keys.length % 2 === 1 && index === keys.length - 1;
        return (
          <div key={key} className={`bg-white p-5 ${spanFull ? "sm:col-span-2" : ""}`}>
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper-2 text-ink-2">
                <Icon size={15} aria-hidden />
              </span>
              {label}
            </dt>
            <dd className="mt-2.5 text-sm leading-6 text-ink-2">{sections[key]}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function BeforeAfter({ example, stacked = false }: { example: RewriteExample; stacked?: boolean }) {
  return (
    <div className={`grid items-stretch gap-3 ${stacked ? "" : "md:grid-cols-[1fr_auto_1fr]"}`}>
      <div className="rounded-card border border-line bg-paper p-5">
        <p className="eyebrow text-ember-dark">Before</p>
        <p className="mt-2.5 text-[15px] leading-7 text-ink-3 decoration-ember/40 decoration-1 [text-decoration-line:line-through]">
          {example.original}
        </p>
      </div>
      <div className={`relative z-10 -my-4 flex items-center justify-center text-ink-3 ${stacked ? "" : "md:my-0"}`} aria-hidden>
        <span
          className={`flex h-8 w-8 rotate-90 items-center justify-center rounded-full border border-line bg-white ${stacked ? "" : "md:rotate-0"}`}
        >
          <ArrowRight size={15} />
        </span>
      </div>
      <div className="rounded-card border border-moss/25 bg-moss-soft/60 p-5">
        <p className="eyebrow text-moss">After</p>
        <p className="mt-2.5 text-[15px] font-medium leading-7 text-ink">{example.improved}</p>
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, aside }: { eyebrow?: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-[22px]">{title}</h3>
      </div>
      {aside}
    </div>
  );
}
