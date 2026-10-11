import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import { decodeChallenge } from "@/lib/challenge";
import { scoreBand } from "@/lib/score";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ code: string }> };

/** Short roast-off links: vibejudge.app/k3x9q2mf → landing page with the friend's score. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const score = decodeChallenge((await params).code);
  if (score === null) return {};
  const title = `Roast-off: can your CV beat ${score}/100?`;
  const description = `A friend's CV scored ${score}/100 ("${scoreBand(score).label}") on VibeJudge. Get your CV roasted free and see who wins.`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    robots: { index: false, follow: true },
    openGraph: { title, description, url: siteUrl },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function ChallengePage({ params }: Props) {
  const score = decodeChallenge((await params).code);
  if (score === null) notFound();
  return <HomePage challengeScore={score} />;
}
