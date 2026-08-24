import Link from "next/link";
import { ContentShell, RehearseCta, SeoFooter, SeoHeader, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Resume Checker — Get an Honest Read on Your Resume",
  description:
    "An AI resume checker reviews your resume in seconds: score, structure, ATS readiness, and specific fixes. See how VibeJudge analyzes resumes and what you get back.",
  path: "/ai-resume-checker"
});

const faq = [
  {
    question: "What does an AI resume checker actually check?",
    answer:
      "It reviews the substance and structure of your resume: whether bullets describe achievements or duties, whether metrics are present, whether sections are complete and in the right order, whether the formatting parses cleanly, and whether your vocabulary matches what recruiters search for."
  },
  {
    question: "Is an AI resume check as good as a human review?",
    answer:
      "It is different. AI catches structural and consistency issues instantly and without fatigue: missing metrics, weak verbs, formatting risks, section gaps. Human reviewers add industry intuition. VibeJudge gives you the structured review instantly and free, so your resume is strong before any human sees it."
  },
  {
    question: "How long does the VibeJudge check take?",
    answer:
      "Usually under a minute. Upload a PDF, DOCX, or TXT resume and you get a score, a roast, a prioritized problem list, quick wins, and rewrite examples on the same page."
  }
];

export default function AiResumeCheckerPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">AI Resume Checker</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">AI Resume Checker</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        An AI resume checker reads your resume the way a skeptical recruiter would: fast, critical, and unimpressed by
        buzzwords. VibeJudge scores your resume, roasts its weakest points, and hands you a fix list you can act on
        today.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">What VibeJudge checks</h2>
      <p className="mt-4 leading-7 text-stone-700">
        The analysis covers the dimensions that actually decide whether a resume survives a recruiter&apos;s first
        sixty-second scan:
      </p>
      <ul className="mt-4 space-y-3 text-stone-700">
        {[
          ["Impact evidence", "Whether your bullets describe achievements with results or just list responsibilities"],
          ["Measurable outcomes", "Whether metrics (percentages, time saved, scale) back up your strongest claims"],
          ["Structure and formatting", "Section order, consistency, and the parsing risks that break applicant tracking systems"],
          ["ATS readability", "Whether the vocabulary and layout match how resume software indexes and searches your file"],
          ["Section quality", "Specific feedback on your summary, experience, skills, and education sections"],
          ["Interview readiness", "Whether your resume sets up stories you can actually defend in an interview"]
        ].map(([title, body]) => (
          <li key={title} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            <span>
              <strong className="font-black">{title}.</strong> {body}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-3xl font-black uppercase">How the check works</h2>
      <ol className="mt-4 space-y-4 text-stone-700">
        <li className="rounded-2xl border border-stone-200 bg-white p-4">
          <strong className="font-black">1. Upload or paste your resume.</strong> PDF, DOCX, or TXT up to 6MB. Your
          resume is processed for the current request and discarded after analysis.
        </li>
        <li className="rounded-2xl border border-stone-200 bg-white p-4">
          <strong className="font-black">2. AI analysis runs server-side.</strong> Your resume text is analyzed against
          recruiter criteria: impact, metrics, structure, ATS readiness, and clarity.
        </li>
        <li className="rounded-2xl border border-stone-200 bg-white p-4">
          <strong className="font-black">3. You get a structured verdict.</strong> A 0-100 score, a roast that names
          specific weaknesses, a prioritized problem list, quick wins, and before/after rewrite examples drawn from your
          actual bullets.
        </li>
      </ol>

      <h2 className="mt-12 text-3xl font-black uppercase">Why an AI check first?</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Human reviewers are valuable but slow, inconsistent, and often unavailable. An AI check gives you an instant,
        structured first pass so that when a human does read your resume, they are reading your best version. Most
        resume rejections are structural: responsibility bullets, missing metrics, keyword mismatches, formatting that
        breaks parsing. Those are exactly the issues an automated check catches reliably.
      </p>
      <p className="mt-4 leading-7 text-stone-700">
        VibeJudge adds something most checkers do not: honesty. The roast format exists because polite feedback gets
        ignored. A specific, slightly brutal observation about your bullet points is harder to dismiss than a generic
        &quot;consider adding more metrics.&quot;
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">Who it is for</h2>
      <ul className="mt-4 grid gap-3 text-stone-700 sm:grid-cols-2">
        {[
          "Job seekers applying right now who want a fast sanity check before clicking submit",
          "Career changers who need an outside read on how their old experience lands in a new field",
          "Students and graduates turning projects into professional evidence",
          "Anyone who has been sending resumes into silence and wants to know why"
        ].map((item) => (
          <li key={item} className="rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <ToolCta
          heading="Get your resume checked in seconds"
          body="Upload your resume and see the score, the roast, and the fix list. Free, no signup, no payment."
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
            <Link href="/ats-resume-checker" className="text-stone-700 hover:text-ink">
              ATS resume checker — see what the robots see →
            </Link>
          </li>
          <li>
            <Link href="/free-resume-checker" className="text-stone-700 hover:text-ink">
              Free resume checker — what free includes →
            </Link>
          </li>
          <li>
            <Link href="/resume-review" className="text-stone-700 hover:text-ink">
              What a complete resume review covers →
            </Link>
          </li>
          <li>
            <Link href="/resume-examples" className="text-stone-700 hover:text-ink">
              Resume examples by role →
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-write-a-resume" className="text-stone-700 hover:text-ink">
              How to write a resume, step by step →
            </Link>
          </li>
          <li>
            <Link href="/guides/resume-mistakes" className="text-stone-700 hover:text-ink">
              The 12 most common resume mistakes →
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
