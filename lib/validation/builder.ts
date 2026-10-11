import { z } from "zod";

/** Answers from the "No CV yet" interview. Shared by the client form and /api/build-cv. */
export const builderAnswersSchema = z.object({
  targetRole: z.string().trim().min(2, "Tell us what job you're going for.").max(120),
  fullName: z.string().trim().min(2, "Add your full name.").max(100),
  email: z.string().trim().email("That email doesn't look right.").max(200),
  phone: z.string().trim().max(40).default(""),
  location: z.string().trim().max(100).default(""),
  link: z.string().trim().max(200).default(""),
  education: z.string().trim().max(2000).default(""),
  experience: z.string().trim().max(3000).default(""),
  activities: z.string().trim().max(3000).default(""),
  skills: z.string().trim().max(1500).default(""),
  proudOf: z.string().trim().max(1500).default("")
});

export type BuilderAnswers = z.infer<typeof builderAnswersSchema>;

export const emptyBuilderAnswers: BuilderAnswers = {
  targetRole: "",
  fullName: "",
  email: "",
  phone: "",
  location: "",
  link: "",
  education: "",
  experience: "",
  activities: "",
  skills: "",
  proudOf: ""
};

/** The AI needs some real material, or it would have to invent things. */
export const MIN_BUILDER_SUBSTANCE = 60;

export function builderSubstance(answers: BuilderAnswers) {
  return [answers.education, answers.experience, answers.activities, answers.skills, answers.proudOf].join(" ").trim().length;
}

/** Turns answers into labeled notes for the prompt. Empty answers are left out entirely. */
export function builderNotes(answers: BuilderAnswers) {
  const contact = [answers.email, answers.phone, answers.location, answers.link].filter(Boolean).join(" | ");
  const sections: Array<[string, string]> = [
    ["Full name", answers.fullName],
    ["Contact line", contact],
    ["Target role", answers.targetRole],
    ["Education", answers.education],
    ["Work experience (any kind, including informal)", answers.experience],
    ["Projects, volunteering, clubs, activities", answers.activities],
    ["Skills and tools", answers.skills],
    ["Something they're proud of", answers.proudOf]
  ];
  return sections
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}:\n${value.trim()}`)
    .join("\n\n");
}
