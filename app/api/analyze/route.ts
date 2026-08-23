import { NextResponse } from "next/server";
import { analyzeResumeWithOllama } from "@/lib/ai/ollama";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";

export const runtime = "nodejs";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 8;

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);

  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

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

    const analysis = await analyzeResumeWithOllama(textValidation.text);
    return NextResponse.json({ analysis });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unknown server error";

    if (message.includes("OLLAMA_API_KEY")) {
      return error("The AI judge is not configured yet. Add OLLAMA_API_KEY to .env.local.", 503);
    }

    if (message.includes("aborted")) {
      return error("The AI judge took too long. Give it another shot.", 504);
    }

    return error("We could not roast your resume right now. Give it another shot.", 500);
  }
}
