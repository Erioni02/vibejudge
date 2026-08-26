import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { rehearseUrl, siteName } from "@/lib/site";

export function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SeoHeader />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">{children}</main>
      <SeoFooter />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-stone-700">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-ink">
                    {item.name}
                  </Link>
                )}
                {!isLast ? <span aria-hidden>/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

const footerNav = [
  { href: "/ai-resume-checker", label: "AI Resume Checker" },
  { href: "/free-resume-checker", label: "Free Resume Checker" },
  { href: "/resume-review", label: "Resume Review" },
  { href: "/resume-roast", label: "Resume Roast" },
  { href: "/resume-feedback", label: "Resume Feedback" },
  { href: "/ats-resume-checker", label: "ATS Resume Checker" },
  { href: "/resume-examples", label: "Resume Examples" },
  { href: "/guides", label: "Resume Guides" }
];

export function SeoHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} home`}>
          <Image src="/cv.png" alt="" width={34} height={34} className="rounded-md" />
          <span className="text-lg font-black">{siteName}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-600 sm:flex" aria-label="Main">
          <Link href="/resume-examples" className="hover:text-ink">
            Examples
          </Link>
          <Link href="/guides" className="hover:text-ink">
            Guides
          </Link>
          <Link href="/resume-roast" className="hover:text-ink">
            Roasts
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden rounded-lg md:inline-block"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light"
              alt="VibeJudge - AI that brutally roasts your resume | Product Hunt"
              className="h-auto w-[180px] lg:w-[250px]"
              width={250}
              height={54}
            />
          </a>
          <Link
            href="/#upload"
            className="focus-ring inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-black uppercase text-white transition hover:-translate-y-0.5"
          >
            Roast my resume
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SeoFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/cv.png" alt="" width={32} height={32} className="rounded-md" />
            <span className="font-black">{siteName}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">
            Free AI resume checker. Upload, get roasted, fix what matters.
          </p>
          <a
            href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-block rounded-lg"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light"
              alt="VibeJudge - AI that brutally roasts your resume | Product Hunt"
              width={250}
              height={54}
              loading="lazy"
            />
          </a>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold text-stone-600 sm:grid-cols-3" aria-label="Footer">
          {footerNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </nav>
      </div>
      <div className="border-t border-stone-100">
        <div className="mx-auto max-w-6xl px-5 py-5 text-sm text-stone-500 sm:px-8">Copyright 2026 {siteName}.</div>
      </div>
    </footer>
  );
}

export function ToolCta({ heading, body }: { heading?: string; body?: string }) {
  return (
    <section className="rounded-[2rem] bg-ink p-8 text-white sm:p-10">
      <h2 className="text-3xl font-black uppercase">{heading ?? "Want to know how your resume compares?"}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-stone-300">
        {body ??
          "Upload your resume and get a score, a roast, and a fix list in seconds. Free, no signup, no payment."}
      </p>
      <Link
        href="/#upload"
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-black uppercase text-white transition hover:-translate-y-0.5"
      >
        Check my resume free
      </Link>
    </section>
  );
}

export function RehearseCta() {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
      <h2 className="text-2xl font-black">Fixed your resume? Now practice defending it.</h2>
      <p className="mt-3 leading-7 text-stone-600">
        VibeJudge handles resume preparation. When the resume is sharp, Rehearse helps you answer the questions a
        recruiter will ask about it.
      </p>
      <a
        href={rehearseUrl}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full border border-ink bg-[#f8d8f3] px-5 py-3 text-sm font-black text-ink transition hover:bg-ink hover:text-white"
      >
        Practice with Rehearse →
      </a>
    </section>
  );
}
