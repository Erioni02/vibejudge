import Link from "next/link";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume Review: The Complete Checklist Reviewers Actually Use",
  description:
    "What a thorough resume review covers: impact, metrics, structure, ATS readiness, and clarity. Use this review checklist yourself, or get an instant AI review from VibeJudge.",
  path: "/resume-review"
});

const faq = [
  {
    question: "What should a resume review cover?",
    answer:
      "A complete review covers six areas: achievement evidence (are bullets outcomes or duties?), metrics (are claims measurable?), structure (section order and consistency), ATS readiness (parsing and keywords), clarity (can a skim reader get your story?), and honesty (is every claim defensible in an interview?)."
  },
  {
    question: "How long does a professional resume review take?",
    answer:
      "A quality manual review typically takes 30-60 minutes and costs $50-$200. VibeJudge performs the same structural review in under a minute and free, which is why the sensible workflow is: AI review first, human eyes second."
  },
  {
    question: "Can I review my own resume effectively?",
    answer:
      "Partially. You are the worst reviewer of your own resume because you fill in context the reader does not have. Checklists and AI tools restore the outside perspective; a friend in your target industry adds the final layer."
  }
];

const checklist = [
  {
    area: "Impact evidence",
    checks: [
      "Every bullet starts with a strong action verb, not 'responsible for'",
      "Bullets describe what changed, not what you were near",
      "Your strongest achievement leads each role"
    ]
  },
  {
    area: "Metrics",
    checks: [
      "At least one number in most bullets: %, $, time, volume, users",
      "Before/after states are visible ('from 9% to 15%')",
      "Scale is clear: team size, budget, traffic, data volume"
    ]
  },
  {
    area: "Structure",
    checks: [
      "Sections in order: summary, experience, skills, education",
      "Consistent date formats and job title formatting",
      "One page under 10 years of experience, two pages maximum"
    ]
  },
  {
    area: "ATS readiness",
    checks: [
      "Single-column layout with standard section headers",
      "Contact info in the document body, not header/footer",
      "Vocabulary mirrors the target posting's exact terms"
    ]
  },
  {
    area: "Clarity",
    checks: [
      "A stranger can state your role and level in 10 seconds",
      "The summary names your field, proof, and target",
      "No unexplained gaps or inconsistent timelines"
    ]
  },
  {
    area: "Defensibility",
    checks: [
      "Every claim survives 'walk me through that number'",
      "No skills listed you would not want interviewed on",
      "Dates and titles match your LinkedIn exactly"
    ]
  }
];

export default function ResumeReviewPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">Resume Review</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">Resume Review</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        A real resume review is not a proofread. It is a structured interrogation of your evidence: does this document
        prove you can do the job, to a skeptical stranger, in under a minute? Here is the full review framework, so you
        can apply it yourself or let VibeJudge run it instantly.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">The six-area review checklist</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Professional reviewers converge on the same areas. Work through them in order; the first two decide most
        outcomes.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {checklist.map((group) => (
          <section key={group.area} className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="font-black uppercase">{group.area}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
              {group.checks.map((check) => (
                <li key={check} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
                  {check}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">A review in practice: one bullet, three passes</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Reviews feel abstract until you watch one happen. Take a typical weak bullet and apply the checklist:
      </p>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-stone-500">Original</p>
          <p className="mt-2 leading-7">&quot;Responsible for managing the company&apos;s email marketing.&quot;</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Pass 1 (impact): fails. Presence verb, no action, no result. Pass 2 (metrics): fails, zero numbers. Pass 3
            (clarity): the reader learns only that email existed.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-stone-500">After review</p>
          <p className="mt-2 leading-7">
            &quot;Rebuilt lifecycle email into 14 behavior-triggered sequences, lifting trial-to-paid conversion 27% and
            generating $1.1M in attributed revenue.&quot;
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Pass 1: strong verb, specific system, clear change. Pass 2: three numbers including money. Pass 3: any
            reader can now size this person&apos;s contribution in one line.
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">Who should review your resume, in order</h2>
      <ol className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong className="font-black">1. An automated review (VibeJudge).</strong> Instant, structured, and immune to
          politeness. Catches the structural issues that cause most rejections.
        </li>
        <li>
          <strong className="font-black">2. A peer in your target field.</strong> Adds industry vocabulary and can tell
          you what is normal for your level.
        </li>
        <li>
          <strong className="font-black">3. Someone who hires for your target role,</strong> if you can get 15 minutes
          of their time. This is the closest proxy for the actual decision.
        </li>
      </ol>

      <div className="mt-12">
        <ToolCta
          heading="Get your review in 60 seconds"
          body="VibeJudge runs the full six-area review on your resume and hands you the fix list. Free, no signup."
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Frequently asked questions</h2>
        <div className="mt-5 space-y-4">
          {faq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-stone-200 bg-white p-5">
              <summary className="cursor-pointer font-black">{item.question}</summary>
              <p className="mt-3 leading-7 text-stone-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-black uppercase">Related resources</h2>
        <ul className="mt-4 grid gap-3 text-sm font-semibold sm:grid-cols-2">
          <li>
            <Link href="/ai-resume-checker" className="text-stone-700 hover:text-ink">
              AI resume checker, explained →
            </Link>
          </li>
          <li>
            <Link href="/resume-feedback" className="text-stone-700 hover:text-ink">
              Turning feedback into fixes →
            </Link>
          </li>
          <li>
            <Link href="/guides/resume-mistakes" className="text-stone-700 hover:text-ink">
              The 12 most common resume mistakes →
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-write-resume-bullet-points" className="text-stone-700 hover:text-ink">
              How to write resume bullet points →
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-12">
        <RehearseCta />
      </div>
    </ContentShell>
  );
}
