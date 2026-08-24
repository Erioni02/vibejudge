import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How VibeJudge handles resume data: processed per request, analyzed server-side, and discarded after analysis. No accounts, no storage, no resume text in analytics.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-soft">
        <a href="/" className="inline-flex items-center gap-3 font-black">
          <Image src="/cv.png" alt="" width={34} height={34} className="rounded-md" />
          VibeJudge
        </a>
        <h1 className="mt-8 text-4xl font-black uppercase">Privacy</h1>
        <p className="mt-5 leading-7 text-stone-700">
          VibeJudge processes resumes only to extract text, send that text to the configured server-side AI provider,
          and return feedback. The app does not require accounts, payments, or permanent resume storage.
        </p>
        <p className="mt-4 leading-7 text-stone-700">
          Do not place resume contents in analytics events, client-side URLs, or browser-exposed secrets. Server logs
          should avoid full resume text. Uploaded files are handled for the current request and discarded after analysis.
        </p>
      </div>
    </main>
  );
}
