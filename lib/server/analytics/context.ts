import { decodeChallenge } from "@/lib/challenge";

/**
 * Request-derived, privacy-reduced context. Nothing here stores a raw user agent, an IP address,
 * a query string, or a full referrer URL — only coarse buckets.
 */

const BOT_PATTERN =
  /bot|crawl|spider|slurp|scrape|preview|facebookexternalhit|embedly|quora link|^whatsapp\/|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|undici|go-http|java\/|okhttp|httpclient|postman|insomnia/i;

export function isBot(userAgent: string | null) {
  if (!userAgent || userAgent.length < 20) return true;
  return BOT_PATTERN.test(userAgent);
}

export type Device = "mobile" | "tablet" | "desktop";

export function deviceFromUserAgent(userAgent: string | null): Device | null {
  if (!userAgent) return null;
  if (/ipad|tablet|kindle|silk|playbook|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android|windows phone|blackberry|opera mini/i.test(userAgent)) return "mobile";
  return "desktop";
}

export function browserFromUserAgent(userAgent: string | null): string | null {
  if (!userAgent) return null;
  // Order matters: most engines include "Chrome" and "Safari" in their UA.
  if (/edg(e|a|ios)?\//i.test(userAgent)) return "Edge";
  if (/opr\/|opera/i.test(userAgent)) return "Opera";
  if (/samsungbrowser/i.test(userAgent)) return "Samsung Internet";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/chrome|crios|chromium/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Other";
}

/** Coarse country only (from the host's geo header, e.g. Vercel). Never an IP or city. */
export function countryFromHeaders(headers: Headers): string | null {
  const value = headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry");
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" ? value : null;
}

export const ROAST_OFF_PATH = "/[roast-off]";

/**
 * Keeps only the pathname. Query strings and fragments are dropped entirely (UTM tags are sent
 * separately and validated), and roast-off share codes collapse into one bucket.
 */
export function sanitizePath(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let path = raw.split(/[?#]/)[0] ?? "";
  if (!path.startsWith("/")) return null;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/$/, "");
  if (path.length > 160 || !/^[A-Za-z0-9\-_/.[\]]*$/.test(path)) return null;

  const segment = path.slice(1);
  if (/^[0-9a-z]{8}$/i.test(segment) && decodeChallenge(segment) !== null) return ROAST_OFF_PATH;
  return path;
}

/** Hostname only — never the referring URL's path or query, which can carry personal data. */
export function referrerHost(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return host.length <= 120 ? host : null;
  } catch {
    return null;
  }
}

export type TrafficSource = "direct" | "organic" | "social" | "referral" | "campaign" | "paid" | "email" | "internal";

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|brave|qwant|startpage|naver|seznam|kagi|perplexity|chatgpt|openai|you|phind|gemini)\./;
const SOCIAL =
  /(^|\.)(facebook|fb|instagram|t|x|twitter|linkedin|lnkd|reddit|tiktok|youtube|youtu|pinterest|threads|bsky|mastodon|snapchat|whatsapp|wa|telegram|discord|producthunt|news\.ycombinator|ycombinator|medium|tumblr|quora|vk|weibo)\./;
const EMAIL = /(^|\.)(mail\.google|outlook\.live|mail\.yahoo|mail\.proton|mail)\./;

export function classifyTraffic({
  referrer,
  utmSource,
  utmMedium,
  ownHost
}: {
  referrer: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  ownHost: string;
}): TrafficSource {
  const medium = utmMedium?.toLowerCase() ?? "";
  if (/^(cpc|ppc|paid|paidsocial|paid_social|display|cpm|ads?)$/.test(medium)) return "paid";
  if (medium === "email" || medium === "newsletter") return "email";
  if (utmSource || utmMedium) return "campaign";

  if (!referrer) return "direct";
  const host = `${referrer}.`;
  if (referrer === ownHost || referrer.endsWith(`.${ownHost}`)) return "internal";
  if (EMAIL.test(host)) return "email";
  if (SEARCH.test(host)) return "organic";
  if (SOCIAL.test(host)) return "social";
  return "referral";
}

export function cleanUtm(value: string | undefined | null) {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase().slice(0, 100);
  return cleaned || null;
}
