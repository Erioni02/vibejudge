import Link from "next/link";
import { ContentShell, RehearseCta, ToolCta } from "@/components/seo";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ATS Resume Checker — See What the Robots See",
  description:
    "Check your resume for ATS readiness: parsing risks, keyword alignment, and formatting that survives applicant tracking systems. Free instant analysis from VibeJudge.",
  path: "/ats-resume-checker"
});

const faq = [
  {
    question: "What does an ATS resume checker look for?",
    answer:
      "Two things: whether your file parses cleanly (layout, section headers, contact info placement) and whether your content matches what recruiters search for (job titles, skills, and the posting's exact vocabulary). VibeJudge reports both, plus a section-by-section structural read."
  },
  {
    question: "How do I know if my resume will pass an ATS?",
    answer:
      "Paste your PDF text into a plain text editor: whatever survives is roughly what the ATS sees. If sections are jumbled or text is missing, reformat. Then check keyword coverage against the job posting and run a structured analysis to catch content issues."
  },
  {
    question: "Should I use one-column or two-column resume layout for ATS?",
    answer:
      "One column. Two-column designs look great and parse terribly: text extraction often interleaves the columns, scrambling your experience. Save the design energy for the interview task or your portfolio."
  }
];

export default function AtsResumeCheckerPage() {
  return (
    <ContentShell>
      <JsonLd data={faqJsonLd(faq)} />
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-stone-500">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-stone-700">ATS Resume Checker</span>
      </nav>

      <h1 className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl">ATS Resume Checker</h1>
      <p className="mt-5 text-xl leading-8 text-stone-700">
        Before a human loves your resume, software has to find it. Applicant tracking systems convert your file to text,
        index it, and let recruiters search it. If parsing garbles your experience or the searched keywords are missing,
        you are invisible no matter how good you are. This page shows you exactly what to check.
      </p>

      <h2 className="mt-12 text-3xl font-black uppercase">What breaks ATS parsing</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Two-column layouts", "Text extraction often interleaves columns, scrambling your sections into nonsense."],
          ["Tables and text boxes", "Frequent parsing failures: content inside them can vanish entirely."],
          ["Contact info in headers/footers", "Some systems never read headers, so your phone number simply does not exist."],
          ["Text inside images", "Icons, skill bars, and graphics with embedded text are invisible to parsers."],
          ["Exotic fonts and symbols", "Special glyphs can convert to garbage characters mid-sentence."],
          ["Non-standard section titles", "'My Journey' is creative; parsers index 'Experience'."]
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="font-black text-ember">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-black uppercase">The ATS-safe formatting checklist</h2>
      <ul className="mt-4 space-y-2 text-stone-700">
        {[
          "Single column, top-to-bottom reading flow",
          "Standard section headers: Professional Summary, Experience, Skills, Education",
          "Consistent dates ('Jan 2024 - Mar 2025') in the same format everywhere",
          "Contact details in the document body, first section of the page",
          "PDF exported from Word or Google Docs (DOCX when the posting requests it)",
          "Job title spelled the way the posting spells it, with the standard equivalent if yours is unusual",
          "10-12pt standard font, 0.5 inch margins minimum",
          "File named Firstname-Lastname-Resume.pdf"
        ].map((item) => (
          <li key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-3xl font-black uppercase">Keywords: the matching half</h2>
      <p className="mt-4 leading-7 text-stone-700">
        Parsing gets you indexed; keywords get you found. Recruiters search the ATS index for the terms in their job
        description, so your resume needs the posting&apos;s exact vocabulary, honestly earned:
      </p>
      <ul className="mt-4 space-y-2 text-stone-700">
        {[
          "Mirror the posting's skill names: 'Power BI' not 'Microsoft Power BI Desktop' if that is their phrase",
          "Include acronyms and expansions once each: 'SEO (search engine optimization)'",
          "Put each claimed keyword to work in a bullet, so matching comes with evidence",
          "Use the standard job title in parentheses if your real title is idiosyncratic",
          "Never keyword-stuff or hide text: recruiters see it, and it ends processes"
        ].map((item) => (
          <li key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-3xl font-black uppercase">The 60-second self-test</h2>
      <ol className="mt-4 space-y-3 text-stone-700">
        <li>
          <strong className="font-black">1. Copy your PDF text into a plain text editor.</strong> What survives is
          approximately what the ATS indexes. Jumbled or missing sections means reformat.
        </li>
        <li>
          <strong className="font-black">2. Compare against the posting.</strong> Highlight their top 5-7 skills and
          check each appears in your skills line and at least one bullet.
        </li>
        <li>
          <strong className="font-black">3. Run a structured check.</strong> VibeJudge&apos;s analysis flags parsing
          risks and content weaknesses in one pass, free.
        </li>
      </ol>

      <div className="mt-12">
        <ToolCta
          heading="Check your ATS readiness now"
          body="Upload your resume and get parsing risks, keyword feedback, and a full structural read in seconds. Free, no signup."
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
            <Link href="/guides/ats-resume-guide" className="text-stone-700 hover:text-ink">
              The complete ATS resume guide →
            </Link>
          </li>
          <li>
            <Link href="/ai-resume-checker" className="text-stone-700 hover:text-ink">
              The full AI resume check →
            </Link>
          </li>
          <li>
            <Link href="/guides/resume-skills" className="text-stone-700 hover:text-ink">
              Which skills to list (and how) →
            </Link>
          </li>
          <li>
            <Link href="/resume-examples" className="text-stone-700 hover:text-ink">
              ATS-friendly resume examples by role →
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
