import { siteUrl } from "@/lib/site";

/**
 * Roast-off links look like https://vibejudge.app/k3x9q2mf and carry only a score (0–100) —
 * never a name, file, or any CV content. No database: the code is the score mixed with random
 * noise (base36), plus one check character so random URLs don't decode as challenges.
 */
const CODE_PATTERN = /^[0-9a-z]{8}$/;
const BODY_LENGTH = 7;
const MAX_BODY = 36 ** BODY_LENGTH;

function checkChar(body: string) {
  let sum = 0;
  for (let index = 0; index < body.length; index += 1) sum += body.charCodeAt(index) * (index + 3);
  return (sum % 36).toString(36);
}

function randomInt(max: number) {
  const values = new Uint32Array(2);
  crypto.getRandomValues(values);
  // 53-bit-ish random number, then scale down.
  return Math.floor(((values[0] * 2 ** 21 + (values[1] >>> 11)) / 2 ** 53) * max);
}

export function encodeChallenge(score: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const noise = randomInt(Math.floor((MAX_BODY - 101) / 101));
  const body = (noise * 101 + clamped).toString(36).padStart(BODY_LENGTH, "0");
  return body + checkChar(body);
}

export function decodeChallenge(code: string): number | null {
  const value = code.toLowerCase();
  if (!CODE_PATTERN.test(value)) return null;
  const body = value.slice(0, BODY_LENGTH);
  if (checkChar(body) !== value.slice(BODY_LENGTH)) return null;
  return parseInt(body, 36) % 101;
}

/** Still accepts the older `/?vs=54` links that were already shared. */
export function parseLegacyChallenge(search: string): number | null {
  const raw = new URLSearchParams(search).get("vs");
  if (!raw || !/^\d{1,3}$/.test(raw)) return null;
  const score = Number(raw);
  return score <= 100 ? score : null;
}

export function challengeUrl(score: number) {
  return `${siteUrl}/${encodeChallenge(score)}`;
}

export function challengeText(score: number, tierLabel: string) {
  return `My CV scored ${Math.round(score)}/100 on VibeJudge — "${tierLabel}". Think yours can beat it? ${challengeUrl(score)}`;
}
