/**
 * Generates the voice-over clips with tts.ai.
 *   npm run voiceover            → generate missing clips
 *   npm run voiceover -- --force → regenerate all clips
 *
 * Reads TTS_API_KEY from .env and lines/voice from scripts/vo-lines.json,
 * writes public/vo/<id>.mp3 and public/vo/durations.json (seconds per clip).
 * Scene timing in src/timeline.ts is derived from durations.json.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const API = 'https://api.tts.ai/v1';
const OUT_DIR = join(process.cwd(), 'public', 'vo');
const force = process.argv.includes('--force');
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);

type Config = {tts: Record<string, unknown> & {format: string}; lines: {id: string; text: string}[]};
const config = JSON.parse(readFileSync(join(process.cwd(), 'scripts', 'vo-lines.json'), 'utf8')) as Config;

const loadKey = (): string => {
  if (process.env.TTS_API_KEY) return process.env.TTS_API_KEY;
  if (existsSync('.env')) {
    const match = readFileSync('.env', 'utf8').match(/^TTS_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error('TTS_API_KEY missing — add it to .env.');
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const synthesize = async (key: string, text: string): Promise<Buffer> => {
  const headers = {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'};
  const res = await fetch(`${API}/tts/`, {method: 'POST', headers, body: JSON.stringify({text, ...config.tts})});
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

const durationSeconds = (file: string): number =>
  parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).trim(),
  );

const main = async () => {
  const key = loadKey();
  mkdirSync(OUT_DIR, {recursive: true});
  const durations: Record<string, number> = {};

  for (const line of config.lines) {
    const file = join(OUT_DIR, `${line.id}.${config.tts.format}`);
    const wanted = only ? only === line.id : force || !existsSync(file);
    if (wanted) {
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
    durations[line.id] = durationSeconds(file);
    console.log(`  ${line.id}: ${durations[line.id].toFixed(2)}s`);
  }

  writeFileSync(join(OUT_DIR, 'durations.json'), JSON.stringify(durations, null, 2) + '\n');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
