/**
 * Multi-provider, multi-model LLM client with automatic failover.
 *
 * Order: provider → model → key. Each provider has up to 3 models and 2–3 keys. If a model fails on every
 * key, the next model is tried; when all of a provider's models fail, the next provider takes over.
 * An attempt fails over on network errors, timeouts, HTTP errors, or output the caller's validator rejects.
 *
 * Health is tracked at three levels so we don't keep waiting on something known to be broken:
 *   - key   (401/403: bad or revoked key)          → that key is skipped for every model, 30 min
 *   - model (404/410: model retired on provider)   → that model is skipped for every key, 30 min
 *   - attempt (timeouts, 5xx, 429, invalid output) → 2 strikes (429: 1) → skipped for 2 min
 * Anything parked is still tried as a last resort, so the chain can never lock itself out completely.
 *
 * Env (all lists comma-separated):
 *   AI_PROVIDER_ORDER=nvidia,ollama
 *   NVIDIA_API_KEYS / NVIDIA_MODELS        OLLAMA_API_KEYS / OLLAMA_MODELS
 *   (single-value OLLAMA_API_KEY / *_MODEL still work)
 */

export type ChatMessage = { role: "system" | "user"; content: string };

type ProviderName = "nvidia" | "ollama";

type CallOptions = { json: boolean; signal: AbortSignal };

type Provider = {
  name: ProviderName;
  keys: string[];
  models: string[];
  call: (key: string, model: string, messages: ChatMessage[], options: CallOptions) => Promise<string>;
};

export class AiNotConfiguredError extends Error {}
export class AiUnavailableError extends Error {}

const ATTEMPT_TIMEOUT_MS = 30_000;
const TOTAL_BUDGET_MS = 57_000;
const STRIKES_BEFORE_COOLDOWN = 2;
const COOLDOWN_MS = 2 * 60_000;
const LONG_COOLDOWN_MS = 30 * 60_000;

const defaultModels: Record<ProviderName, string[]> = {
  nvidia: ["deepseek-ai/deepseek-v4.1-flash", "z-ai/glm-5.3-flash", "nvidia/nemotron-3-super-120b-a12b"],
  ollama: ["gemma4:31b", "gpt-oss:20b", "nemotron-3-nano:30b"] // fastest first (measured ~5–13s, ~21s, ~35s)
};

function listFrom(...names: string[]) {
  const values = names.flatMap((name) => (process.env[name] ?? "").split(","));
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function modelsFor(provider: ProviderName) {
  const prefix = provider.toUpperCase();
  const configured = listFrom(`${prefix}_MODELS`, `${prefix}_MODEL`);
  return configured.length ? configured : defaultModels[provider];
}

class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function openAiCompatible(baseUrl: string, key: string, model: string, messages: ChatMessage[], { signal }: CallOptions) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, stream: false, temperature: 0.7 }),
    signal
  });
  if (!response.ok) throw new HttpError(response.status);
  const payload = await response.json();
  return String(payload.choices?.[0]?.message?.content ?? "");
}

function providers(): Provider[] {
  const all: Record<ProviderName, Provider> = {
    nvidia: {
      name: "nvidia",
      keys: listFrom("NVIDIA_API_KEYS", "NVIDIA_API_KEY"),
      models: modelsFor("nvidia"),
      call: (key, model, messages, options) =>
        openAiCompatible(process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1", key, model, messages, options)
    },
    ollama: {
      name: "ollama",
      keys: listFrom("OLLAMA_API_KEYS", "OLLAMA_API_KEY"),
      models: modelsFor("ollama"),
      call: async (key, model, messages, { json, signal }) => {
        const baseUrl = (process.env.OLLAMA_BASE_URL ?? "https://ollama.com").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model, stream: false, ...(json ? { format: "json" } : {}), messages }),
          signal
        });
        if (!response.ok) throw new HttpError(response.status);
        const payload = await response.json();
        return String(payload.message?.content ?? payload.response ?? "");
      }
    }
  };

  const order = (process.env.AI_PROVIDER_ORDER ?? "nvidia,ollama")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is ProviderName => name in all);

  return order.map((name) => all[name]).filter((provider) => provider.keys.length > 0 && provider.models.length > 0);
}

/*
 * Health, kept in memory per server instance. Stored on globalThis so every route bundle
 * (analyze, generate-cv) shares one view of what is cooling down.
 */
type Health = { strikes: number; until: number };
const globalHealth = globalThis as typeof globalThis & { __vjAiHealth?: Map<string, Health> };
const health = (globalHealth.__vjAiHealth ??= new Map());

const keyId = (provider: ProviderName, key: string) => `key:${provider}:${key.slice(-8)}`;
const modelId = (provider: ProviderName, model: string) => `model:${provider}:${model}`;
const attemptId = (provider: ProviderName, model: string, key: string) => `attempt:${provider}:${model}:${key.slice(-8)}`;

function parked(id: string) {
  const entry = health.get(id);
  return Boolean(entry && entry.until > Date.now());
}

function park(id: string, ms: number) {
  health.set(id, { strikes: 0, until: Date.now() + ms });
}

function strike(id: string, immediate: boolean) {
  const entry = health.get(id) ?? { strikes: 0, until: 0 };
  entry.strikes += 1;
  if (immediate || entry.strikes >= STRIKES_BEFORE_COOLDOWN) {
    entry.until = Date.now() + COOLDOWN_MS;
    entry.strikes = 0;
  }
  health.set(id, entry);
}

/** Reasoning models sometimes prepend their thinking; strip it so validators see only the answer. */
function cleanContent(content: string) {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/**
 * Runs the prompt through the provider → model → key chain until `validate` accepts an output.
 * `validate` should throw if the output is unusable (bad JSON, schema mismatch, empty…), which triggers failover.
 */
export async function completeWithFailover<T>(
  messages: ChatMessage[],
  options: { json: boolean; validate: (content: string) => T; label: string }
): Promise<T> {
  const chain = providers();
  if (chain.length === 0) throw new AiNotConfiguredError("No AI provider keys are configured");

  type Attempt = { provider: Provider; model: string; key: string };
  const attempts: Attempt[] = chain.flatMap((provider) =>
    provider.models.flatMap((model) => provider.keys.map((key) => ({ provider, model, key })))
  );
  const isParked = ({ provider, model, key }: Attempt) =>
    parked(keyId(provider.name, key)) || parked(modelId(provider.name, model)) || parked(attemptId(provider.name, model, key));

  // Healthy attempts first, in configured order; parked ones stay as a last resort.
  const healthy = attempts.filter((attempt) => !isParked(attempt));
  const ordered = [...healthy, ...attempts.filter(isParked)];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const [index, { provider, model, key }] of ordered.entries()) {
    const remaining = deadline - Date.now();
    if (remaining < 3_000) break;

    // Skip a healthy-list attempt whose key or model got parked earlier in this same request.
    if (index < healthy.length && (parked(keyId(provider.name, key)) || parked(modelId(provider.name, model)))) continue;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(ATTEMPT_TIMEOUT_MS, remaining));
    const started = Date.now();

    try {
      const content = cleanContent(await provider.call(key, model, messages, { json: options.json, signal: controller.signal }));
      const result = options.validate(content);
      health.delete(attemptId(provider.name, model, key));
      console.info(`[ai] ${options.label} ok via ${provider.name}/${model} in ${Date.now() - started}ms`);
      return result;
    } catch (cause) {
      const status = cause instanceof HttpError ? cause.status : null;
      const reason = controller.signal.aborted ? "timeout" : status ? `HTTP ${status}` : "invalid output";

      if (status === 401 || status === 403) park(keyId(provider.name, key), LONG_COOLDOWN_MS);
      else if (status === 404 || status === 410) park(modelId(provider.name, model), LONG_COOLDOWN_MS);
      else strike(attemptId(provider.name, model, key), status === 429);

      console.warn(`[ai] ${options.label} failed via ${provider.name}/${model} key …${key.slice(-4)}: ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new AiUnavailableError("All AI providers failed");
}
