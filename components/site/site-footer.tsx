import Link from "next/link";
import { LogoMark } from "@/components/site/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#upload", label: "Roast my CV" },
      { href: "/#upload", label: "Generate a new CV" },
      { href: "/#example", label: "Example roast" },
      { href: "/#faq", label: "FAQ" }
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/ai-resume-checker", label: "AI Resume Checker" },
      { href: "/free-resume-checker", label: "Free Resume Checker" },
      { href: "/ats-resume-checker", label: "ATS Resume Checker" },
      { href: "/resume-review", label: "Resume Review" },
      { href: "/resume-roast", label: "Resume Roast" },
      { href: "/resume-feedback", label: "Resume Feedback" },
      { href: "/resume-examples", label: "Resume Examples" },
      { href: "/guides", label: "Resume Guides" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="section grid gap-10 py-12 md:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={26} />
            <span className="font-display text-lg font-semibold tracking-tight">VibeJudge</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-3">
            Brutally honest AI feedback for your CV, then a better one. Free, no account needed.
          </p>
          <a
            href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-5 inline-block rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light"
              alt="Follow VibeJudge on Product Hunt"
              width={200}
              height={43}
              loading="lazy"
            />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="focus-ring rounded-sm text-ink-2 transition hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-line/70">
        <div className="section flex flex-col gap-2 py-5 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VibeJudge. Roasts are AI-generated — review every suggestion before using it.</p>
          <p>Made for people who are tired of polite feedback.</p>
        </div>
      </div>
    </footer>
  );
}
