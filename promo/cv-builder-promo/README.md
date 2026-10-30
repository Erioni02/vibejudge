# VibeJudge AI CV Builder: promo (Remotion)

A ~51-second cinematic promo for the "No CV yet" guided builder, with a female voice-over, an original synthesized score and frame-locked sound design.

| Composition | Authored | Rendered (`--scale=1.333`) |
|---|---|---|
| `CvBuilder16x9` | 1920×1080 | 2560×1440 |
| `CvBuilder9x16` | 1080×1920 | 1440×2560 (Reels / TikTok / Shorts) |

## Pipeline

```bash
npm install
npm run voiceover              # tts.ai (Kokoro "af_heart") → public/vo/*.mp3   (needs TTS_API_KEY in .env)
python scripts/process_vo.py   # trim, EQ, compress, -16 LUFS → public/vo/*.wav + vo.json (durations, pauses)
npx tsx scripts/export-timeline.ts   # edit timing → public/audio/timeline.json
python scripts/score.py        # music + SFX + VO, ducked and mastered to -14 LUFS → public/audio/master.wav (~4 min)
npm run render                 # 16:9 → out/
npm run render:vertical        # 9:16 → out/
npm run dev                    # Remotion Studio preview
```

The edit is timed from the measured VO clips. If you change a line in `scripts/vo-lines.json`, rerun the whole pipeline: every scene, cue and sound hit moves with it.

## What to edit

| To change… | Edit |
|---|---|
| Narration text / voice / speed | `scripts/vo-lines.json` |
| Pauses between lines, scene lengths | `src/timeline.ts` → `SCENES` |
| Beats that get a sound hit (click, scan, score, wipe…) | `src/moments.ts` |
| Colours / fonts (match vibejudge.app) | `src/theme.ts` |
| One scene's look | `src/scenes/<Scene>.tsx` |
| Music, SFX, mix levels | `scripts/score.py` |

The questions and the example CV use the builder's own prompts and placeholder answers (`components/home/cv-builder.tsx`), so nothing on screen claims more than the product does.
