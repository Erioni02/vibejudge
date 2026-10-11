import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentShell, CvCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { getGuide, guides } from "@/data/guides";
import { getResumeExample } from "@/data/resume-examples";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) return {};

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) notFound();

  const relatedExamples = guide.relatedExamples
    .map((related) => getResumeExample(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGuides = guide.relatedGuides
    .map((related) => getGuide(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <ContentShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` }
          ]),
          articleJsonLd({
            title: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            datePublished: guide.published
          }),
          faqJsonLd(guide.faq)
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-[13px] font-medium text-ink-3">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/guides" className="hover:text-ink">
          Guides
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-2">{guide.title}</span>
      </nav>

      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{guide.title}</h1>
      <p className="mt-3 eyebrow">{guide.readingMinutes} min read</p>
      <p className="mt-5 text-xl leading-8 text-ink-2">{guide.intro}</p>

      {guide.sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-4 leading-7 text-ink-2">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="mt-4 space-y-2">
              {section.list.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-6">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {section.example ? (
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-white p-5 text-sm leading-7 text-ink">
              {section.example.text}
            </pre>
          ) : null}
        </section>
      ))}

      <section className="mt-12">
        <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight">Key takeaways</h2>
        <ul className="mt-5 space-y-2">
          {guide.takeaways.map((takeaway) => (
            <li key={takeaway} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-semibold leading-6">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
              {takeaway}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight">Frequently asked questions</h2>
        <div className="mt-5 space-y-4">
          {guide.faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-3 leading-7 text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <ToolCta
          heading="Apply this to your resume now"
          body="Upload your resume and get a score, a roast, and a prioritized fix list built on these patterns. Free, no signup."
        />
      </div>

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
          {relatedGuides.map((related) => (
            <Link
              key={related.slug}
              href={`/guides/${related.slug}`}
              className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {related.title} →
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
