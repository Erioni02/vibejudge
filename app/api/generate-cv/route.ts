import { NextResponse } from "next/server";
import { AiNotConfiguredError, AiUnavailableError } from "@/lib/ai/llm";
import { generateCv } from "@/lib/ai/resume";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";
import type { ResumeAnalysis } from "@/lib/types";
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
  // Analytics: "from_roast" when the roast is sent along, otherwise a plain "rewrite".
  const track = serverTracker(request);
  let mode: "rewrite" | "from_roast" = "rewrite";
  const fail = (reason: FailureReason) => track("cv_generation_failed", { reason, mode });

  if (!rateLimit(clientIp(request))) {
    track("cv_generation_started", { mode });
    fail("rate_limited");
    return error("That's a lot of new CVs for one hour. Take a breather and try again later.", 429);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    track("cv_generation_started", { mode });
    fail("invalid_input");
    return error("We could not read that upload. Try again with a PDF, DOCX, or TXT file.");
  }

  const file = formData.get("resume");
  const pastedText = formData.get("text");
  const analysisValue = formData.get("analysis");
  if (typeof analysisValue === "string" && analysisValue.trim()) mode = "from_roast";
  track("cv_generation_started", { mode });

  try {
    let resumeText = "";

    if (typeof pastedText === "string" && pastedText.trim()) {
      resumeText = pastedText;
    } else if (file instanceof File) {
      const validation = validateResumeFile(file);

      if (!validation.ok) {
        fail("invalid_input");
        return error(validation.message);
      }

      resumeText = await extractResumeText(file, validation.extension);
    } else {
      fail("invalid_input");
      return error("Upload your resume or paste the text first, then generate the new CV.");
    }

    const textValidation = validateResumeText(resumeText);

    if (!textValidation.ok) {
      fail("invalid_input");
      return error(textValidation.message);
    }

    let analysis: ResumeAnalysis | undefined;

    if (typeof analysisValue === "string" && analysisValue.trim()) {
      try {
        analysis = JSON.parse(analysisValue) as ResumeAnalysis;
      } catch {
        analysis = undefined;
      }
    }

    const cv = await generateCv(textValidation.text, analysis);
    track("cv_generation_completed", { mode });
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
    return error("We could not generate the improved CV right now. Give it another shot.", 500);
  }
}
