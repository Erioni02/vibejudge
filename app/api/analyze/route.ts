import { NextResponse } from "next/server";
import { AiNotConfiguredError, AiUnavailableError } from "@/lib/ai/llm";
import { analyzeResume } from "@/lib/ai/resume";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";
import { serverTracker } from "@/lib/server/analytics/server-events";

export const runtime = "nodejs";
// Leave room for the AI failover chain (57s budget).
export const maxDuration = 60;

const rateLimit = createRateLimiter({ max: 8, windowMs: 60 * 60 * 1000 });

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  // Analytics: started on every request; completed only after the AI returned a valid roast.
  const track = serverTracker(request);
  track("cv_roast_started", {});

  if (!rateLimit(clientIp(request))) {
    track("cv_roast_failed", { reason: "rate_limited" });
    return error("Too many roasts in one hour. Even judgment needs a cooldown.", 429);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    track("cv_roast_failed", { reason: "invalid_input" });
    return error("We could not read that upload. Try again with a PDF, DOCX, or TXT file.");
  }

  const file = formData.get("resume");
  const pastedText = formData.get("text");

  try {
    let text = "";
    const pasted = typeof pastedText === "string" && pastedText.trim().length > 0;

    if (pasted) {
      text = pastedText as string;
    } else if (file instanceof File) {
      const validation = validateResumeFile(file);

      if (!validation.ok) {
        track("cv_roast_failed", { reason: "invalid_input" });
        return error(validation.message);
      }

      text = await extractResumeText(file, validation.extension);
    } else {
      track("cv_roast_failed", { reason: "invalid_input" });
      return error("Upload your resume or paste the text first.");
    }

    const textValidation = validateResumeText(text);

    if (!textValidation.ok) {
      track("cv_roast_failed", { reason: "invalid_input" });
      return error(textValidation.message);
    }

    track("cv_upload_completed", { input: pasted ? "text" : "file" });
    const analysis = await analyzeResume(textValidation.text);
    track("cv_roast_completed", {});
    return NextResponse.json({ analysis });
  } catch (cause) {
    if (cause instanceof AiNotConfiguredError) {
      track("cv_roast_failed", { reason: "ai_not_configured" });
      return error("The AI judge is not configured yet. Add provider API keys to .env.local.", 503);
    }

    if (cause instanceof AiUnavailableError) {
      track("cv_roast_failed", { reason: "ai_unavailable" });
      return error("The AI judge is swamped right now. Give it another shot in a minute.", 503);
    }

    track("cv_roast_failed", { reason: "server_error" });
    return error("We could not roast your resume right now. Give it another shot.", 500);
  }
}
