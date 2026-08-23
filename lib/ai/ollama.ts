import { z } from "zod";
import type { ResumeAnalysis } from "@/lib/types";

const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string().min(1),
  roast: z.array(z.string().min(1)).min(3).max(7),
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1).max(6),
  problems: z.array(
    z.object({
      title: z.string().min(1),
      severity: z.enum(["high", "medium", "low"]),
      explanation: z.string().min(1),
      fix: z.string().min(1)
    })
  ).min(2).max(8),
  sections: z.object({
    formatting: z.string().min(1),
    experience: z.string().min(1),
    skills: z.string().min(1),
    education: z.string().min(1),
    ats: z.string().min(1)
  }),
  quick_wins: z.array(z.string().min(1)).min(3).max(6),
  rewrite_examples: z.array(
    z.object({
      original: z.string().min(1),
      improved: z.string().min(1)
    })
  ).min(1).max(4),
  final_verdict: z.string().min(1),
  interview_readiness: z.string().min(1)
});

const systemPrompt = `You are VibeJudge, a brutally honest but useful AI resume coach.
Roast the resume, not the person. Be witty, specific, and professionally helpful.
Do not mention protected characteristics. Do not invent facts. If evidence is weak, say so.
Return strict JSON only. No markdown fences.`;

function extractJson(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON");
  }

  return content.slice(start, end + 1);
}

export async function analyzeResumeWithOllama(resumeText: string): Promise<ResumeAnalysis> {
  const apiKey = process.env.OLLAMA_API_KEY;
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "https://ollama.com";
  const model = process.env.OLLAMA_MODEL ?? "gpt-oss:120b-cloud";

  if (!apiKey) {
    throw new Error("OLLAMA_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this resume and return JSON matching exactly this shape:
{
  "score": 72,
  "verdict": "Short verdict",
  "roast": ["3 to 7 specific funny observations"],
  "summary": "Useful summary",
  "strengths": ["Specific strengths"],
  "problems": [{"title":"Problem","severity":"high","explanation":"Why it hurts","fix":"Exact fix"}],
  "sections": {"formatting":"...","experience":"...","skills":"...","education":"...","ats":"..."},
  "quick_wins": ["3 to 6 fast fixes"],
  "rewrite_examples": [{"original":"Weak resume bullet or close paraphrase","improved":"Stronger rewritten version"}],
  "final_verdict": "Closing recommendation",
  "interview_readiness": "How ready this resume makes them for interview questions"
}

Resume text:
${resumeText}`
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.message?.content ?? payload.response ?? "";
    const parsed = JSON.parse(extractJson(content));
    return analysisSchema.parse(parsed);
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateCvWithOllama(resumeText: string, analysis?: ResumeAnalysis): Promise<string> {
  const apiKey = process.env.OLLAMA_API_KEY;
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "https://ollama.com";
  const model = process.env.OLLAMA_MODEL ?? "gpt-oss:120b-cloud";

  if (!apiKey) {
    throw new Error("OLLAMA_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer. Rewrite the user's CV into a stronger, ATS-friendly CV. Use only facts present in the original resume. Do not invent employers, dates, titles, degrees, metrics, or tools. Where metrics are missing, use bracketed placeholders like [add metric]. Return clean plain text only. Do not use Markdown, tables, pipes, horizontal rules, code fences, bold markers, or heading hashes."
          },
          {
            role: "user",
            content: `Create an improved CV from this resume.

Use this roast analysis as guidance:
${analysis ? JSON.stringify(analysis) : "No structured analysis provided."}

Original resume text:
${resumeText}`
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.message?.content ?? payload.response ?? "";
    return String(content).trim();
  } finally {
    clearTimeout(timeout);
  }
}
