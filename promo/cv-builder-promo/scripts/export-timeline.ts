/** Writes public/audio/timeline.json (scenes, VO cues, sync moments) for scripts/score.py. */
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {FPS, TL, TRANSITION} from '../src/timeline';
import {M} from '../src/moments';

const out = join(process.cwd(), 'public', 'audio');
mkdirSync(out, {recursive: true});
writeFileSync(join(out, 'timeline.json'), JSON.stringify({fps: FPS, transition: TRANSITION, total: TL.total, scenes: TL.scenes, cues: TL.cues, moments: M}, null, 2) + '\n');
console.log(`total ${TL.total} frames (${(TL.total / FPS).toFixed(2)}s)`);
for (const [id, s] of Object.entries(TL.scenes)) console.log(`${id.padEnd(10)} ${s.from}–${s.from + s.dur}`);
console.log(JSON.stringify(M));
