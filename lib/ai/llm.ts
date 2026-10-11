/**
 * Multi-provider LLM client with automatic failover.
 *
 * Providers are tried in AI_PROVIDER_ORDER (default: nvidia → ollama → opencode). Each provider can have
 * 2–3 API keys (comma-separated env var). A request walks provider → key until one returns output that
 * passes the caller's validator. Keys that fail repeatedly are skipped for a cool-down period so users
 * don't wait on a dead provider.
 *
 * Env:
 *   NVIDIA_API_KEYS=key1,key2,key3      NVIDIA_MODEL=deepseek-ai/deepseek-v4.1-flash
 *   OLLAMA_API_KEYS=key1,key2,key3      OLLAMA_MODEL=gpt-oss:120b-cloud   (OLLAMA_API_KEY still works)
 *   OPENCODE_API_KEYS=key1,key2,key3    OPENCODE_MODEL=<model id from opencode.ai/zen/v1/models>
 *   AI_PROVIDER_ORDER=nvidia,ollama,opencode
 */

export type ChatMessage = { role: "system" | "user"; content: string };

type ProviderName = "nvidia" | "ollama" | "opencode";

type Provider = {
  name: ProviderName;
  keys: string[];
  model: string;
  call: (key: string, messages: ChatMessage[], options: CallOptions) => Promise<string>;
};

type CallOptions = { json: boolean; signal: AbortSignal };

export class AiNotConfiguredError extends Error {}
export class AiUnavailableError extends Error {}

const ATTEMPT_TIMEOUT_MS = 25_000;
const TOTAL_BUDGET_MS = 55_000;
const FAILURES_BEFORE_COOLDOWN = 2;
const COOLDOWN_MS = 2 * 60_000;
const AUTH_COOLDOWN_MS = 30 * 60_000;

function keysFrom(...names: string[]) {
  const keys = names.flatMap((name) => (process.env[name] ?? "").split(","));
  return Array.from(new Set(keys.map((key) => key.trim()).filter(Boolean)));
}

class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function openAiCompatible(url: string, key: string, model: string, messages: ChatMessage[], { signal }: CallOptions) {
  const response = await fetch(url, {
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
      keys: keysFrom("NVIDIA_API_KEYS", "NVIDIA_API_KEY"),
      model: process.env.NVIDIA_MODEL ?? "deepseek-ai/deepseek-v4.1-flash",
      call: (key, messages, options) =>
        openAiCompatible(
          `${(process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1").replace(/\/$/, "")}/chat/completions`,
          key,
          all.nvidia.model,
          messages,
          options
        )
    },
    ollama: {
      name: "ollama",
      keys: keysFrom("OLLAMA_API_KEYS", "OLLAMA_API_KEY"),
      model: process.env.OLLAMA_MODEL ?? "gpt-oss:120b-cloud",
      call: async (key, messages, { json, signal }) => {
        const baseUrl = (process.env.OLLAMA_BASE_URL ?? "https://ollama.com").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: all.ollama.model, stream: false, ...(json ? { format: "json" } : {}), messages }),
          signal
        });
        if (!response.ok) throw new HttpError(response.status);
        const payload = await response.json();
        return String(payload.message?.content ?? payload.response ?? "");
      }
    },
    opencode: {
      name: "opencode",
      keys: keysFrom("OPENCODE_API_KEYS", "OPENCODE_API_KEY"),
      model: process.env.OPENCODE_MODEL ?? "",
      call: (key, messages, options) =>
        openAiCompatible(
          `${(process.env.OPENCODE_BASE_URL ?? "https://opencode.ai/zen/v1").replace(/\/$/, "")}/chat/completions`,
          key,
          all.opencode.model,
          messages,
          options
        )
    }
  };

  const order = (process.env.AI_PROVIDER_ORDER ?? "nvidia,ollama,opencode")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is ProviderName => name in all);

  return order.map((name) => all[name]).filter((provider) => provider.keys.length > 0 && provider.model);
}

/*
 * Per-key health, kept in memory per server instance. Stored on globalThis so every route bundle
 * (analyze, generate-cv) shares one view of which keys are cooling down.
 */
const globalHealth = globalThis as typeof globalThis & { __vjAiHealth?: Map<string, { failures: number; until: number }> };
const health = (globalHealth.__vjAiHealth ??= new Map());

function healthKey(provider: ProviderName, key: string) {
  return `${provider}:${key.slice(-8)}`;
}

function isCoolingDown(id: string) {
  const entry = health.get(id);
  return Boolean(entry && entry.until > Date.now());
}

function recordFailure(id: string, cooldownMs = COOLDOWN_MS, immediate = false) {
  const entry = health.get(id) ?? { failures: 0, until: 0 };
  entry.failures += 1;
  if (immediate || entry.failures >= FAILURES_BEFORE_COOLDOWN) {
    entry.until = Date.now() + cooldownMs;
    entry.failures = 0;
  }
  health.set(id, entry);
}

function recordSuccess(id: string) {
  health.delete(id);
}

/** Reasoning models sometimes prepend their thinking; strip it so validators see only the answer. */
function cleanContent(content: string) {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/**
 * Runs the prompt through the provider chain until `validate` accepts an output.
 * `validate` should throw if the output is unusable (bad JSON, schema mismatch, empty…), which triggers failover.
 */
export async function completeWithFailover<T>(
  messages: ChatMessage[],
  options: { json: boolean; validate: (content: string) => T; label: string }
): Promise<T> {
  const chain = providers();
  if (chain.length === 0) throw new AiNotConfiguredError("No AI provider keys are configured");

  const attempts = chain.flatMap((provider) => provider.keys.map((key) => ({ provider, key, id: healthKey(provider.name, key) })));
  // Healthy keys first (in configured order); cooling-down keys stay as a last resort.
  const ordered = [...attempts.filter((a) => !isCoolingDown(a.id)), ...attempts.filter((a) => isCoolingDown(a.id))];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const { provider, key, id } of ordered) {
    const remaining = deadline - Date.now();
    if (remaining < 3_000) break;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(ATTEMPT_TIMEOUT_MS, remaining));
    const started = Date.now();

    try {
      const content = cleanContent(await provider.call(key, messages, { json: options.json, signal: controller.signal }));
      const result = options.validate(content);
      recordSuccess(id);
      console.info(`[ai] ${options.label} ok via ${provider.name} (${provider.model}) in ${Date.now() - started}ms`);
      return result;
    } catch (cause) {
      const status = cause instanceof HttpError ? cause.status : null;
      const reason = controller.signal.aborted ? "timeout" : status ? `HTTP ${status}` : "invalid output";
      // Bad/revoked key (401/403) or retired model (404/410): park it for a long time. Everything else: normal cool-down rules.
      if (status === 401 || status === 403 || status === 404 || status === 410) recordFailure(id, AUTH_COOLDOWN_MS, true);
      else recordFailure(id, COOLDOWN_MS, status === 429);
      console.warn(`[ai] ${options.label} failed via ${provider.name} key …${key.slice(-4)}: ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new AiUnavailableError("All AI providers failed");
}
