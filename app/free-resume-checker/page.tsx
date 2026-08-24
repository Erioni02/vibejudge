import Link from "next/link";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Resume Checker — No Signup, No Payment, No Catch",
  description:
    "Check your resume for free: instant score, honest feedback, and a prioritized fix list. No account, no credit card, no email required. Here is exactly what free includes.",
  path: "/free-resume-checker"
});

const faq = [
  {
    question: "Is the resume checker really free?",
    answer:
      "Yes. Upload a resume, get the full analysis: score, roast, problem list, quick wins, and rewrite examples. There is no account system, no payment processing, and no email capture anywhere in the product."
  },
  {
    question: "What is the catch with free resume checkers?",
    answer:
      "Usually the catch is that 'free check' is a teaser for a paid rewrite service, or your resume text gets stored and resold. VibeJudge has no paid tier to upsell, and resumes are processed for the current request and discarded, not stored."
  },
  {
    question: "How many times can I check my resume for free?",
    answer:
      "You can check as many versions as you like, within a fair-use rate limit (8 analyses per hour) that keeps the service free and fast for everyone. Most users check 2-3 revisions in a session."
  }
];

export default function FreeResumeCheckerPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">Free Resume Checker</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">Free Resume Checker</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        Most &quot;free&quot; resume tools are demos for a paid rewrite. VibeJudge is just free: upload your resume, get
        a score, a roast, and a fix list. No account, no credit card, no email required, and nothing to cancel later.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">What free includes</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["Resume score (0-100)", "A single number calibrated to how recruiters actually weigh impact, structure, and ATS readiness."],
          ["The roast", "Specific, funny, slightly brutal observations about your weakest bullets and sections."],
          ["Prioritized problems", "Your issues ranked by severity, each with an explanation and an exact fix."],
          ["Quick wins", "The 3-6 fastest changes that will move your score the most."],
          ["Rewrite examples", "Your weak bullets rewritten into strong ones, so you can see the standard."],
          ["ATS analysis", "Section-by-section feedback on parsing risks and keyword alignment."]
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">What free does not include</h2>
      <p className="mt-4 leading-7 text-stone-700">
        No account system, because accounts exist to sell you upgrades and remarket to you later. No payment, because
        the product is the check, not a funnel. No stored resumes: your file is processed for the current request and
        discarded, and resume text never enters URLs or analytics. And no human rewrite service, because the fix list
        you get back is specific enough to apply yourself in an evening.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">Free checker vs paid services</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-stone-300 font-black">
              <th className="py-3 pr-4">What you get</th>
              <th className="py-3 pr-4">VibeJudge (free)</th>
              <th className="py-3">Typical paid services</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-700">
            {[
              ["Instant AI score and feedback", "Included", "Often gated behind signup"],
              ["Specific rewrite examples from your bullets", "Included", "Usually a paid 'expert rewrite'"],
              ["ATS and structure analysis", "Included", "Sometimes a separate paid tier"],
              ["Account required", "No", "Almost always"],
              ["Resume stored after analysis", "No, discarded after processing", "Often retained"],
              ["Price", "$0", "$20-$150+ per review"]
            ].map(([feature, free, paid]) => (
              <tr key={feature}>
                <td className="py-3 pr-4 font-semibold">{feature}</td>
                <td className="py-3 pr-4">{free}</td>
                <td className="py-3">{paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">How to get the most out of a free check</h2>
      <ol className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong className="font-black">1. Check the resume you actually send,</strong> not an aspirational version. The
          score only helps if it reflects reality.
        </li>
        <li>
          <strong className="font-black">2. Fix the quick wins first,</strong> then re-run the check. Watching the score
          move tells you which fixes mattered.
        </li>
        <li>
          <strong className="font-black">3. Check once per target role type,</strong> since your strongest resume for a
          startup differs from the one for a large enterprise.
        </li>
      </ol>

      <div className="mt-12">
        <ToolCta
          heading="Check your resume free, right now"
          body="Upload, get the roast, fix the list. No signup, no card, no email."
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
              How the AI resume check works →
            </Link>
          </li>
          <li>
            <Link href="/resume-feedback" className="text-stone-700 hover:text-ink">
              How to act on resume feedback →
            </Link>
          </li>
          <li>
            <Link href="/resume-examples" className="text-stone-700 hover:text-ink">
              Resume examples by role →
            </Link>
          </li>
          <li>
            <Link href="/guides/ats-resume-guide" className="text-stone-700 hover:text-ink">
              The complete ATS resume guide →
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
