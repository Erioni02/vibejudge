import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { breadcrumbJsonLd } from "@/lib/seo";

export function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-[16px] sm:px-8 sm:py-14">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="text-[13px] font-medium text-ink-3">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink-2">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="focus-ring rounded-sm transition hover:text-ink">
                    {item.name}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden className="text-line-strong">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export function ToolCta({ heading, body }: { heading?: string; body?: string }) {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-ink p-8 text-white sm:p-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-ember" aria-hidden />
      <h2 className="font-display text-display-md font-semibold">{heading ?? "Want to know how your CV compares?"}</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/65">
        {body ?? "Upload your CV and get a score, a roast, and a fix list in under a minute. Free, no sign-up, no payment."}
      </p>
      <Link href="/#upload" className="btn btn-primary btn-lg group mt-6">
        Roast My CV — Free
        <ArrowRight size={17} className="transition group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </section>
  );
}

/** Secondary CTA for content pages: the AI CV generator. */
export function CvCta() {
  return (
    <section className="card flex flex-col gap-5 p-7 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight">Rather skip the rewrite?</h2>
        <p className="mt-2 max-w-md text-[15px] leading-7 text-ink-2">
          Upload your CV and VibeJudge will generate a clean, recruiter-ready version using only your real experience.
          Download it as a PDF.
        </p>
      </div>
      <Link href="/#upload" className="btn btn-dark shrink-0">
        <Sparkles size={16} aria-hidden />
        Generate a new CV
      </Link>
    </section>
  );
}
