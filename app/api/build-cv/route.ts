import { NextResponse } from "next/server";
import { AiNotConfiguredError, AiUnavailableError } from "@/lib/ai/llm";
import { buildCvFromAnswers } from "@/lib/ai/resume";
import { MIN_BUILDER_SUBSTANCE, builderAnswersSchema, builderNotes, builderSubstance } from "@/lib/validation/builder";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";
import { serverTracker, type FailureReason } from "@/lib/server/analytics/server-events";

export const runtime = "nodejs";
// Leave room for the AI failover chain (57s budget).
export const maxDuration = 60;

const rateLimit = createRateLimiter({ max: 6, windowMs: 60 * 60 * 1000 });

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  // Analytics: the "No CV yet" builder counts as AI CV generation with mode "builder".
  const track = serverTracker(request);
  const fail = (reason: FailureReason) => track("cv_generation_failed", { reason, mode: "builder" });
  track("cv_generation_started", { mode: "builder" });

  if (!rateLimit(clientIp(request))) {
    fail("rate_limited");
    return error("That's a lot of new CVs for one hour. Take a breather and try again later.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    fail("invalid_input");
    return error("We couldn't read your answers. Try again.");
  }

  const parsed = builderAnswersSchema.safeParse((body as { answers?: unknown } | null)?.answers);
  if (!parsed.success) {
    fail("invalid_input");
    return error(parsed.error.issues[0]?.message ?? "Some answers look incomplete.");
  }

  if (builderSubstance(parsed.data) < MIN_BUILDER_SUBSTANCE) {
    fail("invalid_input");
    return error("Tell us a bit more about your education, experience, or activities so there's something real to write about.");
  }

  try {
    const cv = await buildCvFromAnswers(builderNotes(parsed.data));
    track("cv_generation_completed", { mode: "builder" });
    return NextResponse.json({ cv });
  } catch (cause) {
    if (cause instanceof AiNotConfiguredError) {
      fail("ai_not_configured");
      return error("The AI CV writer is not configured yet. Add provider API keys to .env.local.", 503);
    }

    if (cause instanceof AiUnavailableError) {
      fail("ai_unavailable");
      return error("The AI CV writer is swamped right now. Give it another shot in a minute.", 503);
    }

    fail("server_error");
    return error("We could not build your CV right now. Give it another shot.", 500);
  }
}
