import Link from "next/link";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume Feedback You Can Actually Act On",
  description:
    "Good resume feedback is specific, prioritized, and actionable. Learn the difference between useful and useless feedback, and get a prioritized fix list from VibeJudge instantly.",
  path: "/resume-feedback"
});

const faq = [
  {
    question: "Why does most resume feedback fail?",
    answer:
      "Because it is generic ('make it more concise'), unprioritized (a list of 30 equal-weight notes), or unactionable ('strengthen your bullets' without showing how). Useful feedback names the line, explains the problem, and shows the fix."
  },
  {
    question: "How do I prioritize resume feedback?",
    answer:
      "Fix by expected impact: achievement bullets and metrics first (they change every future read), then keyword and ATS alignment (it changes whether you are seen), then structure and formatting, then wording polish. VibeJudge's severity ratings follow exactly this ordering."
  },
  {
    question: "How many revisions should I make after feedback?",
    answer:
      "Usually two or three focused passes: one structural pass fixing bullets and metrics, one targeting pass adjusting vocabulary per role type, and one final polish. Re-check the score after each pass so you know what moved."
  }
];

export default function ResumeFeedbackPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">Resume Feedback</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">Resume Feedback</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        Feedback is only worth what you can do with it. &quot;Consider making your experience more impactful&quot; is
        worth nothing. &quot;Your third bullet describes a duty; add the conversion rate it moved&quot; is worth an
        interview. This page shows the anatomy of feedback that works and how to turn any feedback into a fix list.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">Useful feedback vs useless feedback</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-stone-300 font-black">
              <th className="py-3 pr-4">Useless (but common)</th>
              <th className="py-3">Useful (what to demand)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-700">
            {[
              ["'Make it more concise'", "'Your summary is 5 sentences; cut to 2 by keeping the metric and the target'"],
              ["'Add more metrics'", "'Bullets 2, 4, and 6 in your current role have no number; add volume, %, or time saved to each'"],
              ["'Strengthen your bullet points'", "'Start each bullet with a verb like led, cut, built; delete every responsible for'"],
              ["'Improve the design'", "'Remove the two-column layout; it breaks ATS parsing. Single column, standard headers'"],
              ["'Tailor it to the job'", "'The posting says stakeholder management; your resume says client communication. Match their phrase'"]
            ].map(([bad, good]) => (
              <tr key={bad}>
                <td className="py-3 pr-4 text-stone-500">{bad}</td>
                <td className="py-3 font-semibold">{good}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">
        The pattern: useful feedback names the location, the problem, and the fix. If any of the three is missing, ask
        for it explicitly.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">The prioritization order that works</h2>
      <ol className="mt-4 space-y-4 text-stone-700">
        {[
          ["Achievement bullets and metrics", "Highest impact per minute of work. Every duty-to-achievement conversion changes how every future reader prices you."],
          ["Keyword and ATS alignment", "Fixes whether you are seen at all. Match the posting's exact vocabulary for skills and titles."],
          ["Structure and length", "Section order, one-page discipline, consistent dates. Low glamour, zero downside."],
          ["Summary sharpening", "Two sentences: identity, proof, target. Written last, after the bullets it compresses exist."],
          ["Wording polish", "Verb variety, deleting filler adverbs. Do this last; polishing weak bullets is wasted effort."]
        ].map(([title, body], index) => (
          <li key={title} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-black text-white">
              {index + 1}
            </span>
            <span>
              <strong className="font-black">{title}.</strong> {body}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-3xl font-black uppercase">How to apply feedback in one evening</h2>
      <ol className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong className="font-black">1. Get the structured list.</strong> Run your resume through VibeJudge: you get
          severity-ranked problems, quick wins, and rewrite examples from your own bullets.
        </li>
        <li>
          <strong className="font-black">2. Fix the high-severity items only.</strong> Ignore everything else on pass
          one. Most resumes improve dramatically from three or four structural fixes.
        </li>
        <li>
          <strong className="font-black">3. Re-run the check.</strong> The score movement tells you whether your fixes
          landed. Iterate on the next tier only if the score is still below your target.
        </li>
        <li>
          <strong className="font-black">4. Stop.</strong> Resume perfectionism is procrastination with better branding.
          A fixed 85 beats an unfixed 95 that never gets sent.
        </li>
      </ol>

      <div className="mt-12">
        <ToolCta
          heading="Get your prioritized feedback now"
          body="Upload your resume and get severity-ranked problems, quick wins, and rewrite examples. Free, no signup."
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
            <Link href="/resume-review" className="text-stone-700 hover:text-ink">
              The full review checklist →
            </Link>
          </li>
          <li>
            <Link href="/resume-roast" className="text-stone-700 hover:text-ink">
              Feedback with teeth: the resume roast →
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-write-resume-bullet-points" className="text-stone-700 hover:text-ink">
              Fixing bullets: the formula →
            </Link>
          </li>
          <li>
            <Link href="/guides/resume-mistakes" className="text-stone-700 hover:text-ink">
              The 12 most common mistakes →
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
