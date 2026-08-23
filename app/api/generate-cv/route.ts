import { NextResponse } from "next/server";
import { generateCvWithOllama } from "@/lib/ai/ollama";
import { extractResumeText } from "@/lib/resume/parser";
import { validateResumeFile, validateResumeText } from "@/lib/validation/resume";
import type { ResumeAnalysis } from "@/lib/types";

export const runtime = "nodejs";

function selectTemplate(extension: string, buffer: Buffer) {
  const lowerExtension = extension.toLowerCase();
  const hasEmbeddedImage =
    (lowerExtension === "pdf" && buffer.includes(Buffer.from("/Image"))) ||
    (lowerExtension === "docx" && buffer.includes(Buffer.from("word/media/")));

  return {
    hasPhoto: hasEmbeddedImage,
    template: hasEmbeddedImage ? "withphoto1.pdf" : "nophoto1.pdf"
  };
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return error("We could not read that upload. Try again with a PDF, DOCX, or TXT file.");
  }

  const file = formData.get("resume");
  const analysisValue = formData.get("analysis");

  if (!(file instanceof File)) {
    return error("Upload your resume first, then generate the improved CV.");
  }

  const validation = validateResumeFile(file);

  if (!validation.ok) {
    return error(validation.message);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const selectedTemplate = selectTemplate(validation.extension, buffer);
    const resumeText = await extractResumeText(file, validation.extension);
    const textValidation = validateResumeText(resumeText);

    if (!textValidation.ok) {
      return error(textValidation.message);
    }

    let analysis: ResumeAnalysis | undefined;

    if (typeof analysisValue === "string" && analysisValue.trim()) {
      analysis = JSON.parse(analysisValue) as ResumeAnalysis;
    }

    const cv = await generateCvWithOllama(textValidation.text, analysis);
    return NextResponse.json({ cv, template: selectedTemplate.template, hasPhoto: selectedTemplate.hasPhoto });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Unknown server error";

    if (message.includes("OLLAMA_API_KEY")) {
      return error("The AI CV writer is not configured yet. Add OLLAMA_API_KEY to .env.local.", 503);
    }

    if (message.includes("aborted")) {
      return error("The AI CV writer took too long. Give it another shot.", 504);
    }

    return error("We could not generate the improved CV right now. Give it another shot.", 500);
  }
}
