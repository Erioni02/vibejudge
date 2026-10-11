import { NextResponse } from "next/server";
import { AiNotConfiguredError, AiUnavailableError } from "@/lib/ai/llm";
import { analyzeResume } from "@/lib/ai/resume";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
// Leave room for the AI failover chain (57s budget).
export const maxDuration = 60;

const rateLimit = createRateLimiter({ max: 8, windowMs: 60 * 60 * 1000 });

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return error("Too many roasts in one hour. Even judgment needs a cooldown.", 429);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return error("We could not read that upload. Try again with a PDF, DOCX, or TXT file.");
  }

  const file = formData.get("resume");
  const pastedText = formData.get("text");

  try {
    let text = "";

    if (typeof pastedText === "string" && pastedText.trim()) {
      text = pastedText;
    } else if (file instanceof File) {
      const validation = validateResumeFile(file);

      if (!validation.ok) {
        return error(validation.message);
      }

      text = await extractResumeText(file, validation.extension);
    } else {
      return error("Upload your resume or paste the text first.");
    }

    const textValidation = validateResumeText(text);

    if (!textValidation.ok) {
      return error(textValidation.message);
    }

    const analysis = await analyzeResume(textValidation.text);
    return NextResponse.json({ analysis });
  } catch (cause) {
    if (cause instanceof AiNotConfiguredError) {
      return error("The AI judge is not configured yet. Add provider API keys to .env.local.", 503);
    }

    if (cause instanceof AiUnavailableError) {
      return error("The AI judge is swamped right now. Give it another shot in a minute.", 503);
    }

    return error("We could not roast your resume right now. Give it another shot.", 500);
  }
}
