import type { ParsedCv } from "@/lib/cv/parse";
import { formatHeading } from "@/lib/cv/parse";

/** Renders the generated CV as a printed page: real typography, not a <pre> dump. */
export function CvDocument({ cv }: { cv: ParsedCv }) {
  return (
    <article className="mx-auto w-full max-w-[820px] rounded-[6px] bg-white px-6 py-9 text-ink shadow-lift ring-1 ring-line sm:px-14 sm:py-14">
      <header>
        <h3 className="font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">{cv.name}</h3>
        {cv.contact ? <p className="mt-2 break-words text-[13px] leading-6 text-ink-3 sm:text-sm">{cv.contact}</p> : null}
        <div className="mt-5 h-[3px] w-12 rounded-full bg-ember" aria-hidden />
      </header>

      <div className="mt-8 space-y-8">
        {cv.sections.map((section, sectionIndex) => (
          <section key={`${section.heading}-${sectionIndex}`}>
            <h4 className="border-b border-line pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
              {formatHeading(section.heading)}
            </h4>
            <div className="mt-3.5 space-y-2">
              {section.lines.map((line, index) => {
                if (line.kind === "role") {
                  return (
                    <div key={index} className={index > 0 ? "pt-3" : ""}>
                      <p className="text-[15px] font-semibold leading-6">{line.title}</p>
                      {line.meta.length ? <p className="text-[13px] leading-5 text-ink-3">{line.meta.join(" · ")}</p> : null}
                    </div>
                  );
                }
                if (line.kind === "bullet") {
                  return (
                    <p key={index} className="relative pl-5 text-[14px] leading-6 text-ink-2">
                      <span className="absolute left-1 top-[10px] h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
                      {line.text}
                    </p>
                  );
                }
                if (line.kind === "pair") {
                  return (
                    <p key={index} className="text-[14px] leading-6 text-ink-2">
                      <span className="font-semibold text-ink">{line.label}:</span> {line.value}
                    </p>
                  );
                }
                return (
                  <p key={index} className="text-[14px] leading-6 text-ink-2">
                    {line.text}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

export function CvDocumentSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[820px] rounded-[6px] bg-white px-6 py-9 shadow-lift ring-1 ring-line sm:px-14 sm:py-14" aria-hidden>
      <div className="skeleton h-8 w-56" />
      <div className="skeleton mt-3 h-3.5 w-80 max-w-full" />
      <div className="mt-5 h-[3px] w-12 rounded-full bg-ember/40" />
      {[0, 1, 2].map((block) => (
        <div key={block} className="mt-9">
          <div className="skeleton h-3 w-36" />
          <div className="mt-4 space-y-2.5">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-[92%]" />
            <div className="skeleton h-3 w-[78%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
