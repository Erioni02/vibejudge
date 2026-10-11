import type { ProblemSeverity } from "@/lib/types";

export type ScoreTone = "moss" | "amber" | "ember";

export type ScoreTier = {
  min: number;
  label: string;
  emoji: string;
  tagline: string;
  tone: ScoreTone;
  hex: string;
};

/**
 * Shareable score tiers. High tiers are badges worth showing off; low tiers are funny enough to post anyway.
 * Shared by the UI, the demo, the share card, and the roast-off comparison so they always agree.
 */
export const scoreTiers: ScoreTier[] = [
  { min: 90, label: "Unroastable", emoji: "💎", tagline: "The judge found nothing to burn.", tone: "moss", hex: "#2f6b57" },
  { min: 80, label: "Hard to roast", emoji: "🛡️", tagline: "Recruiters will actually read this one.", tone: "moss", hex: "#2f6b57" },
  { min: 70, label: "Lightly toasted", emoji: "🍞", tagline: "Solid, with a few crispy edges.", tone: "amber", hex: "#a8701c" },
  { min: 60, label: "Medium rare", emoji: "🥩", tagline: "Promising, but still a bit raw.", tone: "amber", hex: "#a8701c" },
  { min: 40, label: "Well done", emoji: "🔥", tagline: "Not a compliment. Thoroughly roasted.", tone: "ember", hex: "#e2492f" },
  { min: 0, label: "Burnt to a crisp", emoji: "💀", tagline: "Call the fire brigade. Then rewrite it.", tone: "ember", hex: "#e2492f" }
];

export function scoreBand(score: number): ScoreTier {
  return scoreTiers.find((tier) => score >= tier.min) ?? scoreTiers[scoreTiers.length - 1];
}

export const severityMeta: Record<ProblemSeverity, { label: string; className: string; dot: string }> = {
  high: { label: "High impact", className: "bg-ember-soft text-ember-dark", dot: "bg-ember" },
  medium: { label: "Medium", className: "bg-amber-soft text-amber", dot: "bg-amber" },
  low: { label: "Low", className: "bg-moss-soft text-moss", dot: "bg-moss" }
};

const severityOrder: Record<ProblemSeverity, number> = { high: 0, medium: 1, low: 2 };

export function bySeverity<T extends { severity: ProblemSeverity }>(items: T[]) {
  return [...items].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
