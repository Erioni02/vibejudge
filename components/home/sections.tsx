import { ArrowRight, ArrowUpRight, Download, Flame, Plus, UploadCloud } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    Icon: UploadCloud,
    title: "Upload your CV",
    body: "Drop a PDF, DOCX or TXT file — or paste the text. No account, no email, no card."
  },
  {
    Icon: Flame,
    title: "Get roasted",
    body: "An overall score, a brutally honest roast, the biggest problems ranked by impact, and feedback for every section."
  },
  {
    Icon: Download,
    title: "Download or rebuild",
    body: "Save a shareable roast card, or let AI rewrite your CV using the fixes — then download it as a PDF."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-line bg-white py-20 sm:py-24" aria-labelledby="how-heading">
      <div className="section">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-ember">How it works</p>
            <h2 id="how-heading" className="mt-3 font-display text-display-lg font-semibold">
              From “meh” to hireable in three steps.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-7 text-ink-2">Most roasts take under a minute. Fixing your CV takes a little longer — that part&apos;s on you.</p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
          {steps.map(({ Icon, title, body }, index) => (
            <li key={title} className="bg-white p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-paper text-ink ring-1 ring-line">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold tabular-nums text-ink-3">0{index + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-7 text-ink-2">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const homeFaq = [
  {
    question: "Is VibeJudge really free?",
    answer:
      "Yes. Roasting your CV, downloading the roast, and generating a new CV are all free. There's no account, no email sign-up, and no payment details."
  },
  {
    question: "What happens to my CV?",
    answer:
      "Your file is read to extract its text, which is sent to our AI provider to produce your feedback or new CV. VibeJudge doesn't store your CV, and its contents never go into analytics or URLs."
  },
  {
    question: "Which files can I upload?",
    answer:
      "PDF, DOCX, or TXT files up to 6 MB. Scanned, image-only PDFs don't contain readable text — use “Paste text” instead."
  },
  {
    question: "Will the new CV make things up?",
    answer:
      "The CV writer is instructed to use only facts from your original CV: no invented employers, titles, dates, degrees, or metrics. AI can still slip, so review every detail before you send it."
  },
  {
    question: "Is the roast going to be mean about me?",
    answer:
      "It roasts the document, not the person. It never comments on personal characteristics, and every joke comes with a specific fix."
  },
  {
    question: "Is there a usage limit?",
    answer: "To keep it free for everyone, there's a fair-use limit of 8 roasts and 6 generated CVs per hour."
  }
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="section grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p className="eyebrow text-ember">FAQ</p>
          <h2 id="faq-heading" className="mt-3 font-display text-display-lg font-semibold">
            The fine print, minus the fine print.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-ink-2">
            Still unsure? Read the{" "}
            <Link href="/privacy" className="link">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {homeFaq.map((item) => (
            <details key={item.question} className="group">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 text-[16px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus size={18} className="shrink-0 text-ink-3 transition duration-base ease-out group-open:rotate-45" aria-hidden />
              </summary>
              <p className="-mt-1 pb-5 pr-10 text-[15px] leading-7 text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const resources = [
  { href: "/ai-resume-checker", title: "AI Resume Checker", body: "How the instant check works." },
  { href: "/ats-resume-checker", title: "ATS Resume Checker", body: "See what the robots see." },
  { href: "/resume-roast", title: "Resume Roast", body: "Roast examples by role." },
  { href: "/resume-examples", title: "Resume Examples", body: "Examples for 20+ roles." },
  { href: "/guides", title: "Resume Guides", body: "Bullets, summaries, gaps." },
  { href: "/resume-review", title: "Resume Review", body: "The six-area checklist." },
  { href: "/resume-feedback", title: "Resume Feedback", body: "Turn feedback into fixes." },
  { href: "/free-resume-checker", title: "Free Resume Checker", body: "What free includes." }
];

export function Resources() {
  return (
    <section className="border-t border-line bg-white py-16 sm:py-20" aria-labelledby="resources-heading">
      <div className="section">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="resources-heading" className="font-display text-display-md font-semibold">
            Free CV resources
          </h2>
          <Link href="/guides" className="link text-sm">
            All guides
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="focus-ring group flex items-start justify-between gap-3 rounded-card border border-line bg-paper/60 p-4 transition duration-base ease-out hover:border-line-strong hover:bg-white"
            >
              <span>
                <span className="block text-[15px] font-semibold text-ink">{resource.title}</span>
                <span className="mt-1 block text-[13px] leading-5 text-ink-3">{resource.body}</span>
              </span>
              <ArrowUpRight
                size={16}
                className="mt-0.5 shrink-0 text-ink-3 transition duration-base ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section pb-20 sm:pb-28" aria-labelledby="final-cta-heading">
      <div className="relative overflow-hidden rounded-[24px] bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3d3730_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,#000_10%,transparent_70%)]"
          aria-hidden
        />
        <div className="relative">
          <h2 id="final-cta-heading" className="font-display text-display-lg font-semibold">
            Think your CV can survive?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-8 text-white/65">
            Find out in under a minute. Free, no account, no corporate ceremony.
          </p>
          <Link href="#upload" className="btn btn-primary btn-lg group mt-8">
            Roast My CV — Free
            <ArrowRight size={17} className="transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
