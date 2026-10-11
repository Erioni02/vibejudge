import type { ProblemSeverity } from "@/lib/types";

export type ScoreTone = "moss" | "amber" | "ember";

/** Shared score bands so the UI, the share card, and the demo always agree. */
export function scoreBand(score: number): { label: string; tone: ScoreTone; hex: string } {
  if (score >= 80) return { label: "Hard to roast", tone: "moss", hex: "#2f6b57" };
  if (score >= 60) return { label: "Fixable", tone: "amber", hex: "#a8701c" };
  if (score >= 40) return { label: "Needs real work", tone: "ember", hex: "#e2492f" };
  return { label: "Full rebuild", tone: "ember", hex: "#e2492f" };
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
