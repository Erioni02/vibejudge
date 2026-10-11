import { NextResponse } from "next/server";
import { AiNotConfiguredError, AiUnavailableError } from "@/lib/ai/llm";
import { generateCv } from "@/lib/ai/resume";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";
import type { ResumeAnalysis } from "@/lib/types";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const rateLimit = createRateLimiter({ max: 6, windowMs: 60 * 60 * 1000 });

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return error("That's a lot of new CVs for one hour. Take a breather and try again later.", 429);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return error("We could not read that upload. Try again with a PDF, DOCX, or TXT file.");
  }

  const file = formData.get("resume");
  const pastedText = formData.get("text");
  const analysisValue = formData.get("analysis");

  try {
    let resumeText = "";

    if (typeof pastedText === "string" && pastedText.trim()) {
      resumeText = pastedText;
    } else if (file instanceof File) {
      const validation = validateResumeFile(file);

      if (!validation.ok) {
        return error(validation.message);
      }

      resumeText = await extractResumeText(file, validation.extension);
    } else {
      return error("Upload your resume or paste the text first, then generate the new CV.");
    }

    const textValidation = validateResumeText(resumeText);

    if (!textValidation.ok) {
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
    return NextResponse.json({ cv });
  } catch (cause) {
    if (cause instanceof AiNotConfiguredError) {
      return error("The AI CV writer is not configured yet. Add provider API keys to .env.local.", 503);
    }

    if (cause instanceof AiUnavailableError) {
      return error("The AI CV writer is swamped right now. Give it another shot in a minute.", 503);
    }

    return error("We could not generate the improved CV right now. Give it another shot.", 500);
  }
}
