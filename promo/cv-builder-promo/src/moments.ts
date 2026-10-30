/**
 * Absolute frames of the visual beats that also get a sound hit.
 * Scenes read these for their animation; scripts/export-timeline.ts hands
 * them to the score so picture and sound stay locked.
 */
import {TL} from './timeline';

const c = TL.cues;
const s = TL.scenes;
const endOf = (id: keyof typeof c) => c[id].from + c[id].dur;

export const QUESTION_CUES = ['04b-job', '04c-edu', '04d-work', '04e-club', '04f-proud'] as const;

export const M = {
  pageRise: s.blank.from + 4,
  noCvSlam: c['02a-nocv'].from - 2,
  clickNoCv: endOf('02c-start') + 26,
  logoBurst: s.meet.from,
  wordmark: c['03-meet'].from + 10,
  builderLabel: c['03-meet'].from + 36,
  cardIn: s.questions.from + 2,
  // the answer for each question starts typing here
  questions: QUESTION_CUES.map((id) => c[id].from - 6),
  scanStart: c['05-build'].phrases[0][1] - 8,
  scanLen: 62,
  inSeconds: c['05-build'].phrases[2][0] - 2,
  marker: c['06-honest'].from + 4,
  roast: c['07-roast'].from + 14,
  score: c['07-roast'].phrases[1][0] + 2,
  sharpen: c['07-roast'].phrases[1][0] + 26,
  wipe: s.cta.from - 10,
  badges: c['08a-free'].from,
  url: c['08b-cta'].phrases[1]?.[0] ?? c['08b-cta'].from + 40,
  end: TL.total,
} as const;
