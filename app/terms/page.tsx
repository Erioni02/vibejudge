import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using VibeJudge: automated resume feedback for informational purposes, free of charge, with no guarantee of hiring outcomes.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
        <a href="/" className="inline-flex items-center gap-3 font-black">
          <Image src="/cv.png" alt="" width={34} height={34} className="rounded-md" />
          VibeJudge
        </a>
        <h1 className="mt-8 text-4xl font-black uppercase">Terms</h1>
        <p className="mt-5 leading-7 text-stone-700">
          VibeJudge provides automated resume feedback for informational purposes. It is not a hiring guarantee,
          professional legal advice, or a replacement for human review.
        </p>
        <p className="mt-4 leading-7 text-stone-700">
          Use the service only with resumes you have permission to analyze. The tool is free and provided without
          authentication, subscriptions, or payment processing.
        </p>
      </div>
    </main>
  );
}
