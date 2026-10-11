import { scoreBand, scoreTiers } from "@/lib/score";

/** Shows every tier with the user's position highlighted — makes the next tier feel within reach. */
export function TierLadder({ score }: { score: number }) {
  const current = scoreBand(score);

  return (
    <ol className="space-y-1" aria-label="Score tiers">
      {scoreTiers.map((tier, index) => {
        const active = tier.label === current.label;
        const max = index === 0 ? 100 : scoreTiers[index - 1].min - 1;
        return (
          <li
            key={tier.label}
            aria-current={active ? "true" : undefined}
            className={`flex items-center gap-3 rounded-control px-3 py-2 text-sm transition ${
              active ? "bg-ink text-white" : "text-ink-3"
            }`}
          >
            <span className="emoji w-5 text-center leading-none" aria-hidden>
              {tier.emoji}
            </span>
            <span className={`flex-1 ${active ? "font-semibold" : ""}`}>{tier.label}</span>
            <span className={`tabular-nums text-xs ${active ? "text-white/60" : ""}`}>
              {tier.min}–{max}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
