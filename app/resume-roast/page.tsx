import Link from "next/link";
import { ContentShell, CvCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { roastPages } from "@/data/roasts";

export const metadata = pageMetadata({
  title: "Resume Roast: Brutally Honest (and Useful) Resume Feedback",
  description:
    "A resume roast tells you the truth about your resume with specific, funny, slightly brutal feedback, then hands you the fixes. See real roast examples and get roasted yourself.",
  path: "/resume-roast"
});

const faq = [
  {
    question: "What is a resume roast?",
    answer:
      "A resume roast is critical feedback delivered with humor and specificity. Instead of 'consider strengthening your bullet points', a roast says 'your bullet points are responsibilities wearing a tie'. The goal is not cruelty; it is feedback specific enough that you cannot ignore it."
  },
  {
    question: "Will the roast be mean about me personally?",
    answer:
      "No. VibeJudge roasts the resume, not the person. The analysis never comments on protected characteristics, never invents facts, and focuses on the document: weak verbs, missing metrics, structural problems, corporate fog."
  },
  {
    question: "Why humor instead of polite feedback?",
    answer:
      "Because polite feedback is forgettable. 'Consider adding more metrics' is easy to skip; a specific joke about your bullet points sticks with you while you fix them. The humor is the delivery mechanism, the fixes are the payload."
  }
];

export default function ResumeRoastPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-[13px] font-medium text-ink-3">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-2">Resume Roast</span>
      </nav>

      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Resume Roast</h1>
      <p className="mt-5 text-xl leading-8 text-ink-2">
        Your resume has probably received a dozen polite reviews that changed nothing. A roast is what happens when
        feedback stops being careful: specific, funny, slightly brutal observations about exactly why your bullets are
        not working, followed by the fixes. It hurts for five minutes and helps for the whole job search.
      </p>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">What a roast looks like</h2>
      <p className="mt-4 leading-7 text-ink-2">
        Every roast follows the same structure: the weak line, the roast, why it fails, and the rebuilt version. Here is
        one, from the software engineer roast collection (fictional but typical):
      </p>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="eyebrow text-ink-3">The weak line</p>
          <p className="mt-2 leading-7">&quot;Worked on backend services using Node.js and helped fix bugs.&quot;</p>
        </div>
        <div className="rounded-2xl border border-ember bg-ember-soft p-5">
          <p className="eyebrow text-ember">The roast</p>
          <p className="mt-2 leading-7">
            &quot;This bullet has all the commitment of someone standing near a kitchen while other people cook. What
            did you build, at what scale, and what changed?&quot;
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="eyebrow text-ink-3">The rebuild</p>
          <p className="mt-2 leading-7">
            &quot;Rebuilt the checkout API in Node.js, cutting p95 latency from 820ms to 290ms for 15k daily orders and
            eliminating the weekly timeout incidents.&quot;
          </p>
        </div>
      </div>
      <p className="mt-6 leading-7 text-ink-2">
        Same engineer, same work. The first version reads as attendance; the second reads as competence. That gap is
        what the roast exists to close.
      </p>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">Roasts by role</h2>
      <p className="mt-4 leading-7 text-ink-2">
        Different roles fail in different ways. These guides show the most common roast-worthy patterns per field:
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {roastPages.map((page) => (
          <Link
            key={page.slug}
            href={`/resume-roast/${page.slug}`}
            className="group rounded-2xl border border-line bg-white p-5 transition hover:border-ink"
          >
            <h3 className="font-semibold group-hover:text-ember">{page.role} resume roast →</h3>
            <p className="mt-2 text-sm leading-6 text-ink-2">{page.patterns[0]}.</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-[28px] font-semibold leading-tight tracking-tight">The rules of a fair roast</h2>
      <ul className="mt-4 space-y-3 text-ink-2">
        {[
          "Roast the resume, never the person: no comments on you, only on the document",
          "No invented facts: if evidence is missing, the roast says so instead of making things up",
          "Every roast comes with a fix: criticism without a rebuild is just noise",
          "Specificity is mandatory: a roast that could apply to anyone applies to no one"
        ].map((rule) => (
          <li key={rule} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            {rule}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <ToolCta
          heading="Ready to get roasted?"
          body="Upload your resume and receive the roast, the score, and the fix list in under a minute. Free, no signup."
        />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-5 space-y-4">
          {faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-3 leading-7 text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Related resources</h2>
        <ul className="mt-4 grid gap-3 text-sm font-semibold sm:grid-cols-2">
          <li>
            <Link href="/ai-resume-checker" className="text-ink-2 hover:text-ink">
              How the AI check works →
            </Link>
          </li>
          <li>
            <Link href="/guides/resume-mistakes" className="text-ink-2 hover:text-ink">
              The mistakes roasts catch most →
            </Link>
          </li>
          <li>
            <Link href="/resume-examples" className="text-ink-2 hover:text-ink">
              Resume examples by role →
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-write-resume-bullet-points" className="text-ink-2 hover:text-ink">
              The bullet point formula →
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-12">
        <CvCta />
      </div>
    </ContentShell>
  );
}
