import type { Metadata } from "next";
import { ContentShell } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using VibeJudge: automated CV feedback and CV generation for informational purposes, free of charge, with no guarantee of hiring outcomes.",
  path: "/terms"
});

const terms = [
  "VibeJudge provides automated CV feedback and AI-generated CVs for informational purposes. It is not a hiring guarantee, professional legal advice, or a replacement for human review.",
  "AI output can contain mistakes. You are responsible for checking every detail of a generated CV — names, dates, employers, and contact details — before using it.",
  "Only upload CVs you have permission to analyze.",
  "The service is free and provided without authentication, subscriptions, or payment processing. Fair-use limits apply to keep it that way.",
  "The roast is humor aimed at the document, not the person. Please don't use the service to harass anyone."
];

export default function TermsPage() {
  return (
    <ContentShell>
      <p className="eyebrow text-ember">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Terms</h1>
      <ol className="mt-10 space-y-5">
        {terms.map((term, index) => (
          <li key={term} className="flex gap-4 border-t border-line pt-5 leading-7 text-ink-2">
            <span className="font-display text-sm font-semibold tabular-nums text-ink-3">{String(index + 1).padStart(2, "0")}</span>
            {term}
          </li>
        ))}
      </ol>
    </ContentShell>
  );
}
