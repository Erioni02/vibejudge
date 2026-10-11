import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentShell, CvCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { getResumeExample, resumeExamples } from "@/data/resume-examples";
import { getGuide } from "@/data/guides";

export function generateStaticParams() {
  return resumeExamples.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const example = getResumeExample(slug);

  if (!example) return {};

  return pageMetadata({
    title: example.title,
    description: example.description,
    path: `/resume-examples/${example.slug}`
  });
}

export default async function ResumeExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const example = getResumeExample(slug);

  if (!example) notFound();

  const relatedExamples = example.relatedRoles
    .map((related) => getResumeExample(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGuides = example.relatedGuides
    .map((related) => getGuide(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resume Examples", path: "/resume-examples" },
            { name: `${example.role} Resume Example`, path: `/resume-examples/${example.slug}` }
          ]),
          faqJsonLd(example.faq)
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-[13px] font-medium text-ink-3">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/resume-examples" className="hover:text-ink">
          Resume Examples
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-2">{example.role}</span>
      </nav>

      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
        {example.role} Resume Example
      </h1>
      <p className="mt-5 text-xl leading-8 text-ink-2">{example.introduction}</p>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Example {example.role.toLowerCase()} resume</h2>
      <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-white p-6 text-sm leading-7 text-ink">
        {example.exampleResume}
      </pre>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Professional summary example</h2>
      <blockquote className="mt-5 rounded-2xl border border-line bg-white p-6 leading-7">
        &quot;{example.summaryExample.text}&quot;
      </blockquote>
      <p className="mt-4 leading-7 text-ink-2">
        <strong className="font-semibold">Why it works:</strong> {example.summaryExample.why}
      </p>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Skills to include</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {example.skills.map((group) => (
          <div key={group.label} className="rounded-2xl border border-line bg-white p-5">
            <h3 className="font-semibold">{group.label}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-2">{group.items.join(", ")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Experience bullet examples</h2>
      <p className="mt-4 leading-7 text-ink-2">
        The pattern to copy: strong verb, specific action, measurable result. Compare each weak version with its
        rebuild:
      </p>
      <div className="mt-5 space-y-5">
        {example.bulletExamples.map((bullet, index) => (
          <article key={bullet.bad} className="rounded-2xl border border-line bg-white p-6">
            <p className="eyebrow text-ink-3">Example {index + 1}</p>
            <p className="mt-3 rounded-xl border border-ember bg-ember-soft p-4 text-sm leading-6">
              <strong className="font-semibold text-ember">Bad:</strong> {bullet.bad}
            </p>
            <p className="mt-3 rounded-xl border border-moss bg-moss-soft p-4 text-sm leading-6">
              <strong className="font-semibold text-moss">Good:</strong> {bullet.good}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-2">
              <strong className="font-semibold">Why:</strong> {bullet.why}
            </p>
          </article>
        ))}
      </div>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Common {example.role.toLowerCase()} resume mistakes</h2>
      <ul className="mt-5 space-y-2 text-ink-2">
        {example.commonMistakes.map((mistake) => (
          <li key={mistake} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            {mistake}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">ATS keywords for {example.role.toLowerCase()} roles</h2>
      <p className="mt-4 leading-7 text-ink-2">
        Include the terms the job posting uses, and make sure each one is backed by evidence in a bullet. Common
        keywords for this role:
      </p>
      <p className="mt-4 flex flex-wrap gap-2">
        {example.atsKeywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold">
            {keyword}
          </span>
        ))}
      </p>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Formatting tips</h2>
      <ul className="mt-5 space-y-2 text-ink-2">
        {example.formattingTips.map((tip) => (
          <li key={tip} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <ToolCta
          heading="Want to know how your resume compares?"
          body={`Upload your ${example.role.toLowerCase()} resume and get it roasted by VibeJudge: score, problems, quick wins, and rewrites. Free, no signup.`}
        />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-5 space-y-4">
          {example.faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-3 leading-7 text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Related resume examples</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedExamples.map((related) => (
            <Link
              key={related.slug}
              href={`/resume-examples/${related.slug}`}
              className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {related.role} resume example →
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Related guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {guide.title} →
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <CvCta />
      </div>
    </ContentShell>
  );
}
