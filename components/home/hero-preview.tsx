import { ScoreDial } from "@/components/roast/score-dial";

/** Decorative product preview for the hero. Clearly labeled as an example; it contains no real user data. */
export function HeroPreview() {
  return (
    <div className="relative mx-auto flex w-full max-w-[440px] select-none justify-center pt-6" aria-hidden>
      <div className="w-full -rotate-[2deg] rounded-card border border-line bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Example roast</p>
            <p className="mt-2 max-w-[200px] font-display text-xl font-semibold leading-snug">Solid career. Invisible results.</p>
          </div>
          <ScoreDial score={61} size={104} showBand={false} />
        </div>
        <div className="mt-5 border-t border-line pt-5">
          <p className="font-serif text-[23px] italic leading-snug text-ink">
            “Your bullet points are responsibilities wearing a tie.”
          </p>
          <p className="mt-4 rounded-lg border-l-2 border-moss bg-paper px-3.5 py-2.5 text-[13px] leading-5 text-ink-2">
            <span className="font-semibold text-moss">Fix: </span>
            Lead each bullet with the result, then the number.
          </p>
        </div>
      </div>
    </div>
  );
}
