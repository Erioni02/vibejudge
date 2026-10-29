import Link from "next/link";
import { Logo } from "@/components/site/logo";

const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#example", label: "Example roast" },
  { href: "/#faq", label: "FAQ" },
  { href: "/guides", label: "Guides" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <div className="section flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="btn btn-ghost btn-sm font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/#upload" className="btn btn-primary btn-sm">
          <span>
            Roast my CV<span className="hidden sm:inline"> — free</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
