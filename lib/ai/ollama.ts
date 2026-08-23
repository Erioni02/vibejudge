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

const brandedContentPattern =
  /(vibe\s*judge|roasted?\s+by|generated\s+by|generated\s+with|created\s+by|resume\s+score|the\s+roast|as\s+an\s+ai)/i;

function sanitizeGeneratedCv(content: string) {
  return content
    .replace(/```[\s\S]*?(?:```|$)/g, "\n")
    .replace(/\*\*|__|`/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .split("\n")
    .filter((line) => !brandedContentPattern.test(line))
    .join("\n")
    .replace(/vibe\s*judge/gi, "")
    .replace(/\.{3,}|…/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function enforceContactAccuracy(resumeText: string, cv: string) {
  const sourceEmails = Array.from(new Set((resumeText.match(emailPattern) ?? []).map((email) => email.toLowerCase())));
  const primaryEmail = sourceEmails[0];

  if (!primaryEmail) return cv;

  const fixed = cv.replace(emailPattern, (match) => (sourceEmails.includes(match.toLowerCase()) ? match : primaryEmail));

  if (!new RegExp(emailPattern.source, "i").test(fixed)) {
    const lines = fixed.split("\n");
    lines.splice(1, 0, primaryEmail);
    return lines.join("\n");
  }

  return fixed;
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
              "You are an elite executive CV writer trusted by senior leaders at Fortune 500 companies. Rewrite the user's CV into an ultra-professional, impeccably structured, boardroom-ready document.\n\nNon-negotiable rules:\n1. Never mention VibeJudge, AI, models, scores, roasts, feedback, coaching, or this rewriting process anywhere in the output. The CV must read as 100% human-crafted with zero tool branding.\n2. Use only facts present in the original resume. Do not invent employers, job titles, dates, degrees, institutions, certifications, metrics, or technologies.\n3. Leave nothing empty. No bracketed placeholders like [add metric], no TBD, no N/A, no blank sections, no unfinished sentences. When a number is unavailable, express the achievement as a strong qualitative statement instead.\n4. Use exactly this structure: line 1 is the candidate's full name, line 2 is a single contact line (email, phone, city, LinkedIn if present), then these uppercase section headings in order: PROFESSIONAL SUMMARY, CORE COMPETENCIES, PROFESSIONAL EXPERIENCE, EDUCATION. Include CERTIFICATIONS, PROJECTS, LANGUAGES, or AWARDS sections between experience and education only when the resume supports them.\n5. The professional summary is 3 to 4 confident sentences of executive positioning with no first-person pronouns.\n6. Core competencies groups skills into 3 to 5 labeled categories with comma-separated skills.\n7. Each experience entry uses exactly: Job Title | Company | Dates on one line, followed by 3 to 5 result-focused bullet points starting with '- '. Every bullet starts with a decisive action verb and closes with a concrete outcome.\n8. Tone: commanding, polished, corporate-executive. Zero fluff, zero slang, zero humor, no first-person pronouns.\n9. Return clean plain text only. No Markdown, tables, horizontal rules, code fences, asterisks, underscores, backticks, or heading hashes.\n10. Copy every name, email address, phone number, URL, LinkedIn handle, company name, job title, degree, and date character-for-character exactly as written in the resume. Never shorten, merge, split, guess, or autocorrect them. Double-check the email address letter by letter.\n11. Never use ellipses (...), trailing dashes, or unfinished sentences. Every bullet and sentence must be complete from start to finish."
          },
          {
            role: "user",
            content: `Rewrite this resume into an elite executive CV following your structure rules exactly. Complete every section fully using only real information from the resume; where the resume lacks specifics, write confident qualitative statements instead of leaving anything empty.

Internal coaching notes to address (never reference these in the output):
${analysis ? JSON.stringify(analysis) : "None."}

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
    return enforceContactAccuracy(resumeText, sanitizeGeneratedCv(String(content)));
  } finally {
    clearTimeout(timeout);
  }
}
