import Link from "next/link";
import { ContentShell, ToolCta } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";
import { guides } from "@/data/guides";

export const metadata = pageMetadata({
  title: "Resume Guides: Writing, ATS, Bullets, Summaries & More",
  description:
    "Practical resume guides with concrete examples: how to write a resume, pass ATS screens, write bullet points and summaries, handle gaps, and avoid the mistakes that cost interviews.",
  path: "/guides"
});

export default function GuidesPage() {
  return (
    <ContentShell>
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">Guides</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">Resume Guides</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        No filler, no 2,000-word warmups. Each guide is a working document with formulas, before/after examples, and
        checklists you can apply to your resume the same day.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-ink"
          >
            <h2 className="font-black leading-6 group-hover:text-ember">{guide.title} →</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{guide.description}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide text-stone-400">
              {guide.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <ToolCta
          heading="Prefer your feedback personalized?"
          body="Guides teach the patterns. VibeJudge applies them to your actual resume and shows you the fixes."
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Related resources</h2>
        <ul className="mt-4 grid gap-3 text-sm font-semibold sm:grid-cols-2">
          <li>
            <Link href="/resume-examples" className="text-stone-700 hover:text-ink">
              Resume examples by role →
            </Link>
          </li>
          <li>
            <Link href="/resume-roast" className="text-stone-700 hover:text-ink">
              Resume roasts by role →
            </Link>
          </li>
        </ul>
      </section>
    </ContentShell>
  );
}
