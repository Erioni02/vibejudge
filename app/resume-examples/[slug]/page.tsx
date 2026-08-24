import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
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
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/resume-examples" className="hover:text-ink">
          Resume Examples
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">{example.role}</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">
        {example.role} Resume Example
      </h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">{example.introduction}</p>

      <h2 className="mt-12 text-3xl font-black uppercase">Example {example.role.toLowerCase()} resume</h2>
      <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-7 text-stone-800">
        {example.exampleResume}
      </pre>

      <h2 className="mt-12 text-3xl font-black uppercase">Professional summary example</h2>
      <blockquote className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 leading-7">
        &quot;{example.summaryExample.text}&quot;
      </blockquote>
      <p className="mt-4 leading-7 text-stone-700">
        <strong className="font-black">Why it works:</strong> {example.summaryExample.why}
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">Skills to include</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {example.skills.map((group) => (
          <div key={group.label} className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="font-black">{group.label}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{group.items.join(", ")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">Experience bullet examples</h2>
      <p className="mt-4 leading-7 text-stone-700">
        The pattern to copy: strong verb, specific action, measurable result. Compare each weak version with its
        rebuild:
      </p>
      <div className="mt-5 space-y-5">
        {example.bulletExamples.map((bullet, index) => (
          <article key={bullet.bad} className="rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-sm font-black uppercase text-stone-500">Example {index + 1}</p>
            <p className="mt-3 rounded-xl border border-ember bg-[#fff3ef] p-4 text-sm leading-6">
              <strong className="font-black text-ember">Bad:</strong> {bullet.bad}
            </p>
            <p className="mt-3 rounded-xl border border-moss bg-[#edf8f2] p-4 text-sm leading-6">
              <strong className="font-black text-moss">Good:</strong> {bullet.good}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              <strong className="font-black">Why:</strong> {bullet.why}
            </p>
          </article>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">Common {example.role.toLowerCase()} resume mistakes</h2>
      <ul className="mt-5 space-y-2 text-stone-700">
        {example.commonMistakes.map((mistake) => (
          <li key={mistake} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            {mistake}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-3xl font-black uppercase">ATS keywords for {example.role.toLowerCase()} roles</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Include the terms the job posting uses, and make sure each one is backed by evidence in a bullet. Common
        keywords for this role:
      </p>
      <p className="mt-4 flex flex-wrap gap-2">
        {example.atsKeywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm font-semibold">
            {keyword}
          </span>
        ))}
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">Formatting tips</h2>
      <ul className="mt-5 space-y-2 text-stone-700">
        {example.formattingTips.map((tip) => (
          <li key={tip} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
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
        <h2 className="text-2xl font-black uppercase">Frequently asked questions</h2>
        <div className="mt-5 space-y-4">
          {example.faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-stone-200 bg-white p-5">
              <summary className="cursor-pointer font-black">{item.question}</summary>
              <p className="mt-3 leading-7 text-stone-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Related resume examples</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedExamples.map((related) => (
            <Link
              key={related.slug}
              href={`/resume-examples/${related.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {related.role} resume example →
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Related guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {guide.title} →
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <RehearseCta />
      </div>
    </ContentShell>
  );
}
