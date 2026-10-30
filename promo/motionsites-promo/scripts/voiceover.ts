/**
 * Generates the voiceover clips with tts.ai.
 *   npm run voiceover            → generate missing clips
 *   npm run voiceover -- --force → regenerate all clips
 *
 * Reads TTS_API_KEY from .env, lines/voice from src/config.ts,
 * writes public/voiceover/<id>.mp3 and warns if a clip overruns its slot.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {VIDEO, VOICEOVER} from '../src/config';

const API = 'https://api.tts.ai/v1';
const OUT_DIR = join(process.cwd(), 'public', 'voiceover');
const force = process.argv.includes('--force');

const loadKey = (): string => {
  if (process.env.TTS_API_KEY) return process.env.TTS_API_KEY;
  if (existsSync('.env')) {
    const match = readFileSync('.env', 'utf8').match(/^TTS_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error('TTS_API_KEY missing — add it to .env (see .env.example).');
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const synthesize = async (key: string, text: string): Promise<Buffer> => {
  const headers = {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'};
  const res = await fetch(`${API}/tts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({text, ...VOICEOVER.tts}),
  });
  if (!res.ok) throw new Error(`tts.ai ${res.status}: ${await res.text()}`);
  const job = (await res.json()) as {uuid: string};

  for (let i = 0; i < 120; i++) {
    await sleep(1500);
    const poll = await fetch(`${API}/speech/results/?uuid=${job.uuid}`, {headers});
    const data = (await poll.json()) as {status: string; result_url?: string; error?: string};
    if (data.status === 'completed' && data.result_url) {
      const audio = await fetch(data.result_url);
      return Buffer.from(await audio.arrayBuffer());
    }
    if (data.status === 'failed') throw new Error(`tts.ai job failed: ${data.error ?? 'unknown'}`);
  }
  throw new Error('tts.ai job timed out');
};

const durationSeconds = (file: string): number | null => {
  try {
    const out = execFileSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {
      encoding: 'utf8',
      shell: true,
    });
    return parseFloat(out.trim());
  } catch {
    return null;
  }
};

const main = async () => {
  const key = loadKey();
  mkdirSync(OUT_DIR, {recursive: true});
  const lines = VOICEOVER.lines;

  for (const [i, line] of lines.entries()) {
    const file = join(OUT_DIR, `${line.id}.${VOICEOVER.tts.format}`);
    if (!force && existsSync(file)) {
      console.log(`✓ ${line.id} (exists, skipped)`);
    } else {
      process.stdout.write(`… ${line.id}: "${line.text}" `);
      let audio: Buffer | null = null;
      for (let attempt = 1; !audio; attempt++) {
        try {
          audio = await synthesize(key, line.text);
        } catch (err) {
          if (attempt >= 3) throw err;
          process.stdout.write(`(retry ${attempt}) `);
          await sleep(2000 * attempt);
        }
      }
      writeFileSync(file, audio);
      console.log('done');
    }

    const nextFrom = lines[i + 1]?.from ?? VIDEO.durationInFrames;
    const slot = (nextFrom - line.from) / VIDEO.fps;
    const dur = durationSeconds(file);
    if (dur !== null) {
      const flag = dur > slot ? '  ⚠ OVERRUNS slot — shorten text or raise speed' : '';
      console.log(`  ${dur.toFixed(2)}s of ${slot.toFixed(2)}s slot${flag}`);
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
