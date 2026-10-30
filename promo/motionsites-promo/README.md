# MotionSites promo (Remotion)

30-second motion-graphics promo, in two formats from the same components:

| Composition | Size | Length |
|---|---|---|
| `Promo16x9` | 1920×1080 | 900 frames @ 30fps |
| `Promo9x16` | 1080×1920 | 900 frames @ 30fps |

## Run

```bash
npm install
npm run dev          # Remotion Studio at http://localhost:3000
```

## Render

```bash
npx remotion render Promo16x9 out/promo-16x9.mp4
npx remotion render Promo9x16 out/promo-9x16.mp4
```

(or `npm run render:all`)

## What to edit

| To change… | Edit |
|---|---|
| **Copy** (all on-screen text) | `src/config.ts` → `COPY` |
| **Affiliate link / code** | `src/config.ts` → `COPY.cta.affiliate` (disclosure line: `COPY.cta.disclosure`) |
| **Colors / gradient / grain** | `src/config.ts` → `COLORS`, `STYLE` |
| **Scene timing** | `src/config.ts` → `TIMING` (must still sum to 900) |
| **Scene order** | `src/Promo.tsx` → `SCENES` array |
| **A single scene's look** | `src/scenes/<Scene>.tsx` |
| **Music** | drop `public/music.mp3`; volume/fades in `AUDIO.music` |
| **Whoosh / pop SFX** | drop `public/sfx/whoosh.mp3` and `public/sfx/pop.mp3`; cue frames in `AUDIO.sfx.cues` |
| **Screen recording** | drop `public/demo.mp4` — it replaces the mock browser in scene 4 (slot is marked in `src/scenes/HowItWorks.tsx`); start offset: `DEMO.startFromSeconds` |
| **Voiceover script / voice** | `src/config.ts` → `VOICEOVER`, then `npm run voiceover -- --force` |

Every audio/video file is optional — anything missing from `public/` is skipped, so renders never crash on a missing asset.

## Voiceover (tts.ai)

Clips live in `public/voiceover/<id>.mp3` and are generated from `VOICEOVER.lines`:

```bash
npm run voiceover            # generate missing clips
npm run voiceover -- --force # regenerate all
```

The key is read from `.env` (`TTS_API_KEY=…`, see `.env.example`; `.env` is gitignored).
The script prints each clip's length against its slot and warns if a line runs into the next one —
shorten the text, raise `VOICEOVER.tts.speed`, or move `from`. Use `text` as spoken (e.g. "motionsites dot A I").
Delete `public/voiceover/` to render without narration (music then plays at full `AUDIO.music.volume`).

Note: SFX cues and voiceover `from` values are absolute frames — if you reorder scenes or change `TIMING`, update them too.

## Structure

```
src/
  config.ts              ← timing, colors, copy, audio, voiceover
  Root.tsx               ← the two compositions
  Promo.tsx              ← background + scene series + audio
  scenes/                ← Hook, Problem, Reveal, HowItWorks, Proof, CTA
  components/            ← Background/grain, SceneWrap (fade + push-in),
                           WordReveal, BrowserFrame, MockHeroes, GenericWireframe, AudioLayer
scripts/voiceover.ts     ← tts.ai generator
```

All mock UI is abstract shapes — none of it reproduces real MotionSites designs.
