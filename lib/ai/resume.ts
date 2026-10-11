import { z } from "zod";
import type { ResumeAnalysis } from "@/lib/types";
import { completeWithFailover } from "@/lib/ai/llm";

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

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  return completeWithFailover(
    [
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
    ],
    { json: true, label: "analyze", validate: (content) => analysisSchema.parse(JSON.parse(extractJson(content))) }
  );
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

export async function generateCv(resumeText: string, analysis?: ResumeAnalysis): Promise<string> {
  return completeWithFailover(
    [
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
    ],
    {
      json: false,
      label: "generate-cv",
      validate: (content) => {
        const cv = enforceContactAccuracy(resumeText, sanitizeGeneratedCv(content));
        if (cv.length < 200) throw new Error("CV output too short");
        return cv;
      }
    }
  );
}

const builderSystemPrompt = `You are a warm, expert CV writer who specialises in first CVs: students, school leavers, career changers, and people with little formal experience. You turn a candidate's interview answers into a clean, professional, honest CV.

Non-negotiable rules:
1. Use ONLY facts stated in the candidate's answers. Never invent employers, job titles, dates, schools, degrees, grades, certifications, metrics, numbers, tools, or achievements. If a detail is missing, leave it out; do not guess or add placeholders.
2. Informal and unpaid experience counts. Present part-time work, family business help, freelancing, babysitting, volunteering, clubs, sports, and personal projects honestly and professionally, without inflating titles.
3. Never mention VibeJudge, AI, models, interviews, questions, or this writing process. The CV must read as written by the candidate.
4. No bracketed placeholders, no TBD, no N/A, no empty sections, no unfinished sentences, no ellipses.
5. Structure: line 1 is the candidate's full name exactly as given. Line 2 is the contact line exactly as given. Then uppercase section headings, including only sections the answers support, in this order: PROFESSIONAL SUMMARY, CORE COMPETENCIES, EXPERIENCE, PROJECTS, VOLUNTEERING, EDUCATION, ACHIEVEMENTS.
6. PROFESSIONAL SUMMARY: 2 to 3 confident sentences aimed at the target role, with no first-person pronouns and no claims beyond the answers.
7. CORE COMPETENCIES: group the stated skills into 2 to 4 labeled categories, formatted "Category: skill, skill, skill". Only list skills the candidate mentioned or that are directly evidenced by what they described.
8. Each EXPERIENCE, PROJECTS, or VOLUNTEERING entry: one line "Title | Organisation | Dates" (omit any part the candidate did not give; never invent dates), followed by 2 to 4 bullets starting with "- ". Each bullet starts with a strong action verb and describes what the candidate actually did and any outcome they actually stated.
9. EDUCATION entries: "Qualification or subject | Institution | Dates", using only what was given, plus at most one bullet if they mentioned relevant coursework, grades, or awards.
10. Copy names, emails, phone numbers, links, organisations, and dates character-for-character.
11. Return clean plain text only. No Markdown, tables, asterisks, underscores, backticks, or heading hashes.`;

/** Writes a first CV from the "No CV yet" interview answers. `notes` are labeled answers (see builderNotes). */
export async function buildCvFromAnswers(notes: string): Promise<string> {
  return completeWithFailover(
    [
      { role: "system", content: builderSystemPrompt },
      {
        role: "user",
        content: `Write a complete first CV from these interview answers, following your rules exactly. Use only what is written below.

${notes}`
      }
    ],
    {
      json: false,
      label: "build-cv",
      validate: (content) => {
        const cv = enforceContactAccuracy(notes, sanitizeGeneratedCv(content));
        if (cv.length < 150) throw new Error("CV output too short");
        return cv;
      }
    }
  );
}
