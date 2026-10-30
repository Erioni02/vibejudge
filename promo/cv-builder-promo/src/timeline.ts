/**
 * The whole edit is laid out from the measured VO clips (public/vo/vo.json),
 * so re-recording a line re-times every scene, cue and sound hit automatically.
 *
 * A scene is a list of beats: `pad` (frames of silence) or `vo` (a clip, optionally
 * followed by `gap` frames). Scenes sit back to back; each one is also rendered
 * TRANSITION frames early/late so neighbours can cross-fade.
 */
import vo from '../public/vo/vo.json';

export const FPS = 30;
export const TRANSITION = 14;

type VoId = keyof typeof vo;
type Beat = {pad: number} | {vo: VoId; gap?: number};

const SCENES = {
  blank: [{pad: 22}, {vo: '01-blank'}, {pad: 22}],
  nocv: [{pad: 8}, {vo: '02a-nocv', gap: 10}, {vo: '02b-noidea', gap: 10}, {vo: '02c-start'}, {pad: 52}],
  meet: [{pad: 16}, {vo: '03-meet'}, {pad: 28}],
  questions: [
    {pad: 10},
    {vo: '04a-seven', gap: 14},
    {vo: '04b-job', gap: 26},
    {vo: '04c-edu', gap: 26},
    {vo: '04d-work', gap: 26},
    {vo: '04e-club', gap: 26},
    {vo: '04f-proud'},
    {pad: 40},
  ],
  build: [{pad: 14}, {vo: '05-build'}, {pad: 30}],
  honest: [{pad: 10}, {vo: '06-honest'}, {pad: 30}],
  roast: [{pad: 10}, {vo: '07-roast'}, {pad: 34}],
  cta: [{pad: 22}, {vo: '08a-free', gap: 12}, {vo: '08b-cta'}, {pad: 96}],
} satisfies Record<string, Beat[]>;

export type SceneId = keyof typeof SCENES;

const sec = (s: number) => Math.round(s * FPS);

export type Cue = {from: number; dur: number; phrases: [number, number][]};

const build = () => {
  const scenes = {} as Record<SceneId, {from: number; dur: number}>;
  const cues = {} as Record<VoId, Cue>;
  let t = 0;
  for (const [id, beats] of Object.entries(SCENES) as [SceneId, Beat[]][]) {
    const from = t;
    for (const beat of beats) {
      if ('pad' in beat) {
        t += beat.pad;
        continue;
      }
      const clip = vo[beat.vo];
      const dur = sec(clip.dur);
      cues[beat.vo] = {
        from: t,
        dur,
        phrases: clip.phrases.map(([a, b]) => [t + sec(a), t + sec(b)] as [number, number]),
      };
      t += dur + (beat.gap ?? 0);
    }
    scenes[id] = {from, dur: t - from};
  }
  return {scenes, cues, total: t};
};

export const TL = build();
export const DURATION = TL.total;
export const cue = (id: VoId) => TL.cues[id];
