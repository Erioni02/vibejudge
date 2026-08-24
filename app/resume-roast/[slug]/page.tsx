import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getRoastPage, roastPages } from "@/data/roasts";
import { getResumeExample } from "@/data/resume-examples";

export function generateStaticParams() {
  return roastPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getRoastPage(slug);

  if (!page) return {};

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/resume-roast/${page.slug}`
  });
}

export default async function RoastPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getRoastPage(slug);

  if (!page) notFound();

  const relatedRoasts = page.relatedRoasts
    .map((related) => getRoastPage(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedExamples = page.relatedExamples
    .map((related) => getResumeExample(related))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <ContentShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume Roast", path: "/resume-roast" },
          { name: `${page.role} Resume Roast`, path: `/resume-roast/${page.slug}` }
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/resume-roast" className="hover:text-ink">
          Resume Roast
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">{page.role}</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">
        {page.role} Resume Roast
      </h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">{page.intro}</p>

      <h2 className="mt-12 text-3xl font-black uppercase">The roasts</h2>
      <div className="mt-5 space-y-8">
        {page.cases.map((roastCase, index) => (
          <article key={roastCase.bad} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-sm font-black uppercase text-stone-500">Case {index + 1}</p>
            <div className="mt-4 space-y-3">
              <p className="rounded-xl border border-stone-200 bg-paper p-4 text-sm leading-6">
                <strong className="font-black">The resume says:</strong> &quot;{roastCase.bad}&quot;
              </p>
              <p className="rounded-xl border border-ember bg-[#fff3ef] p-4 text-sm leading-6">
                <strong className="font-black text-ember">The roast:</strong> {roastCase.roast}
              </p>
              <p className="text-sm leading-6 text-stone-700">
                <strong className="font-black">Why it is weak:</strong> {roastCase.why}
              </p>
              <p className="rounded-xl border border-moss bg-[#edf8f2] p-4 text-sm leading-6">
                <strong className="font-black text-moss">Improved:</strong> {roastCase.improved}
              </p>
              <p className="text-sm leading-6 text-stone-700">
                <strong className="font-black">Why it works:</strong> {roastCase.explanation}
              </p>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">The pattern to watch for</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Every {page.role.toLowerCase()} roast above traces back to the same root problems. Check your resume for these
        patterns:
      </p>
      <ul className="mt-5 space-y-2">
        {page.patterns.map((pattern) => (
          <li key={pattern} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            {pattern}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <ToolCta
          heading="Think your resume survives the roast?"
          body={`Upload your ${page.role.toLowerCase()} resume and find out. You will get the roast, the score, and the exact fixes. Free, no signup.`}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Related roasts</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedRoasts.map((related) => (
            <Link
              key={related.slug}
              href={`/resume-roast/${related.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold transition hover:border-ink"
            >
              {related.role} resume roast →
            </Link>
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

      <div className="mt-12">
        <RehearseCta />
      </div>
    </ContentShell>
  );
}
