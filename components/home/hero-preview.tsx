import { Download, Sparkles } from "lucide-react";
import { ScoreDial } from "@/components/roast/score-dial";

/** Decorative product preview for the hero. Clearly labeled as an example; it contains no real user data. */
export function HeroPreview() {
  return (
    <div className="relative mx-auto h-[470px] w-full max-w-[500px] select-none" aria-hidden>
      {/* Back: the generated CV */}
      <div className="absolute right-0 top-0 w-[290px] rotate-[3deg] rounded-[6px] bg-white p-6 shadow-card ring-1 ring-line">
        <div className="flex items-center justify-between">
          <span className="chip !border-moss/25 !bg-moss-soft !text-moss">
            <Sparkles size={11} />
            New CV
          </span>
          <Download size={14} className="text-ink-3" />
        </div>
        <p className="mt-4 font-display text-xl font-semibold tracking-tight">Jordan Ellis</p>
        <p className="mt-0.5 text-[10px] text-ink-3">jordan@email.com · London · linkedin.com/in/jordan</p>
        <div className="mt-3 h-[2px] w-8 rounded-full bg-ember" />
        {["Professional summary", "Experience"].map((heading, block) => (
          <div key={heading} className="mt-4">
            <p className="border-b border-line pb-1 text-[8px] font-semibold uppercase tracking-[0.16em]">{heading}</p>
            <div className="mt-2 space-y-1.5">
              {(block === 0 ? [100, 94, 70] : [88, 96, 80, 62]).map((width, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  {block === 1 ? <span className="h-1 w-1 shrink-0 rounded-full bg-ember" /> : null}
                  <div className="h-[5px] rounded-full bg-paper-2" style={{ width: `${width}%` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Front: the roast */}
      <div className="absolute left-0 top-[178px] w-[320px] -rotate-[2deg] rounded-card border border-line bg-white p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Example roast</p>
            <p className="mt-2 max-w-[170px] font-display text-[17px] font-semibold leading-snug">Solid career. Invisible results.</p>
          </div>
          <ScoreDial score={61} size={86} showBand={false} />
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <p className="font-serif text-[19px] italic leading-snug text-ink">
            “Your bullet points are responsibilities wearing a tie.”
          </p>
          <p className="mt-3 rounded-lg border-l-2 border-moss bg-paper px-3 py-2 text-[11.5px] leading-5 text-ink-2">
            <span className="font-semibold text-moss">Fix: </span>
            Lead each bullet with the result, then the number.
          </p>
        </div>
      </div>
    </div>
  );
}
