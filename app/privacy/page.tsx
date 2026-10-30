import type { Metadata } from "next";
import { ContentShell } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How VibeJudge handles CV data: processed per request, analyzed server-side, and not stored. No accounts, no CV text in analytics, and sharing only when you choose.",
  path: "/privacy"
});

const sections = [
  {
    title: "What happens when you upload a CV",
    body: [
      "Your file (or pasted text) is sent to our server, where its text is extracted. That text is sent to our AI provider to generate your roast or your new CV, and the result is returned to your browser.",
      "VibeJudge does not save your CV file, its text, your roast, or your generated CV. Uploaded files are handled for the current request only and then discarded."
    ]
  },
  {
    title: "What we don't do",
    body: [
      "No accounts, sign-ups, or payments. We never put CV contents in URLs, page metadata, or analytics events.",
      "Your results live only in your browser tab. Close or reload the page and they are gone."
    ]
  },
  {
    title: "Analytics",
    body: [
      "We run our own first-party analytics (no third-party trackers or ad pixels) to count things like page visits, completed roasts, shared roast-off links, and downloads. Events contain the event name, the page path without its query string, the referring website's domain, a coarse device type, browser family and country, and a random anonymous ID kept in your browser's local storage so repeat visits can be counted. They never contain your CV text, roast, name, contact details, file names, or IP address.",
      "No fingerprinting is used. If your browser sends Do Not Track or Global Privacy Control, no analytics IDs are stored and no browser events are sent; clearing your site data resets the anonymous ID. Raw analytics events are deleted after 13 months."
    ]
  },
  {
    id: "updates",
    title: "Email updates",
    body: [
      "If you choose to join our updates list, we save your email address, the page you signed up on, and the date. We use it only to email you about new VibeJudge features and tips, never sell or share it, and every email lets you unsubscribe. Your address is stored separately from analytics and is never linked to your anonymous analytics ID or to any CV."
    ]
  },
  {
    title: "Sharing",
    body: [
      "Roast cards and downloaded CVs are created in your browser. Nothing is posted or shared anywhere unless you choose to download or share it yourself. Roast cards never include your name, contact details, or CV file.",
      "Roast-off links contain only your score. We count when a link is copied and when it is opened, using the link's code — never who you sent it to."
    ]
  },
  {
    title: "Fair-use limits",
    body: [
      "To prevent abuse, we temporarily keep a count of requests per IP address in server memory for up to an hour. It is not linked to your CV and is not stored permanently."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <ContentShell>
      <p className="eyebrow text-ember">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Privacy</h1>
      <p className="mt-5 text-lg leading-8 text-ink-2">
        Short version: we read your CV to roast it or rewrite it, then we forget it.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title} id={section.id} className="scroll-mt-24 border-t border-line pt-6">
            <h2 className="font-display text-xl font-semibold tracking-tight">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-7 text-ink-2">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </ContentShell>
  );
}
