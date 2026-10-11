import type { ResumeAnalysis } from "@/lib/types";

/**
 * A fictional example used on the homepage to show the shape of a real roast.
 * The person, company, and numbers are invented and labeled as such in the UI.
 */
export const demoCv = {
  name: "Alex Rivera",
  role: "Marketing Manager",
  summary: ["Hard-working, ", { mark: 1, text: "results-driven team player" }, " with a passion for synergy and strong communication skills."],
  job: { title: "Marketing Manager", company: "Brightline Foods", dates: "2021 – Present" },
  bullets: [
    [{ mark: 2, text: "Responsible for managing" }, " social media and campaigns."],
    ["Worked closely with stakeholders on various projects."],
    [{ mark: 3, text: "Helped increase brand awareness" }, " across multiple channels."]
  ],
  skills: "Microsoft Office, Communication, Leadership, Canva, Time Management"
} as const;

export const demoAnalysis: Pick<
  ResumeAnalysis,
  "score" | "verdict" | "summary" | "roast" | "sections" | "quick_wins" | "rewrite_examples"
> = {
  score: 58,
  verdict: "Real experience, buried under buzzwords.",
  summary:
    "Alex clearly did the work, but the CV describes job duties instead of results, so a recruiter can't tell a great marketer from an average one.",
  roast: [
    "“Results-driven” — and yet not a single result in sight. This summary is a LinkedIn bingo card.",
    "Every bullet opens with “responsible for”. Recruiters don't hire responsibilities; they hire outcomes.",
    "“Helped increase brand awareness” by how much, for whom? That's a horoscope, not a bullet point."
  ],
  sections: {
    experience: "Duties, not achievements. Lead each bullet with what changed, then prove it with a number: followers, revenue, sign-ups, cost.",
    skills: "Microsoft Office and Time Management are table stakes. Swap them for the tools in the job ads: Meta Ads, GA4, HubSpot.",
    ats: "Parses cleanly, but it's missing the keywords marketing roles screen for. Mirror the language of the roles you want.",
    formatting: "Clean layout. Tighten the summary to two lines.",
    education: "Fine as is."
  },
  quick_wins: [
    "Replace “responsible for” with a strong verb: ran, grew, launched, cut.",
    "Add one real number to each of your top three bullets.",
    "Delete “team player” and “hard-working” — show it instead."
  ],
  rewrite_examples: [
    {
      original: "Responsible for managing social media and campaigns.",
      improved: "Ran paid and organic social across 3 channels, growing Instagram from 4k to 31k followers in 9 months and driving 18% of web sign-ups."
    }
  ]
};
