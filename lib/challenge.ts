import { siteUrl } from "@/lib/site";

/**
 * Roast-off links carry only a score (0–100) — never a name, file, or any CV content.
 * Example: https://vibejudge.app/?vs=54
 */
export const CHALLENGE_PARAM = "vs";

export function parseChallengeScore(search: string): number | null {
  const raw = new URLSearchParams(search).get(CHALLENGE_PARAM);
  if (!raw || !/^\d{1,3}$/.test(raw)) return null;
  const score = Number(raw);
  return score >= 0 && score <= 100 ? score : null;
}

export function challengeUrl(score: number) {
  return `${siteUrl}/?${CHALLENGE_PARAM}=${Math.round(score)}`;
}

export function challengeText(score: number, tierLabel: string) {
  return `My CV scored ${Math.round(score)}/100 on VibeJudge — "${tierLabel}". Think yours can beat it? ${challengeUrl(score)}`;
}
