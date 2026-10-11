import { scoreBand } from "@/lib/score";

const toneStroke = { moss: "#2f6b57", amber: "#c98a2b", ember: "#e2492f" } as const;

/** Circular score gauge. Pure SVG; the arc sweeps in with a CSS keyframe on mount (no JS needed). */
export function ScoreDial({
  score,
  size = 168,
  dark = false,
  showBand = true
}: {
  score: number;
  size?: number;
  dark?: boolean;
  showBand?: boolean;
}) {
  const band = scoreBand(score);
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={dark ? "#3d3730" : "#efeae1"} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={toneStroke[band.tone]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            style={{ ["--dial-length" as string]: circumference }}
            className="animate-dial"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-display font-semibold leading-none tracking-tight ${dark ? "text-white" : "text-ink"}`}
            style={{ fontSize: size * 0.34 }}
          >
            {value}
          </span>
          <span className={`mt-1 text-xs font-medium ${dark ? "text-white/55" : "text-ink-3"}`}>out of 100</span>
        </div>
        <span className="sr-only">
          Score {value} out of 100: {band.label}
        </span>
      </div>
      {showBand ? <ScoreBandPill score={score} className="mt-4" /> : null}
    </div>
  );
}

export function ScoreBandPill({ score, className = "" }: { score: number; className?: string }) {
  const band = scoreBand(score);
  const styles = {
    moss: "bg-moss-soft text-moss",
    amber: "bg-amber-soft text-amber",
    ember: "bg-ember-soft text-ember-dark"
  }[band.tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles} ${className}`}>
      <span className="emoji text-[0.95em] leading-none" aria-hidden>
        {band.emoji}
      </span>
      {band.label}
    </span>
  );
}
