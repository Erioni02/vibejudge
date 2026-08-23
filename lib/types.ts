export type ProblemSeverity = "high" | "medium" | "low";

export type ResumeProblem = {
  title: string;
  severity: ProblemSeverity;
  explanation: string;
  fix: string;
};

export type RewriteExample = {
  original: string;
  improved: string;
};

export type ResumeAnalysis = {
  score: number;
  verdict: string;
  roast: string[];
  summary: string;
  strengths: string[];
  problems: ResumeProblem[];
  sections: {
    formatting: string;
    experience: string;
    skills: string;
    education: string;
    ats: string;
  };
  quick_wins: string[];
  rewrite_examples: RewriteExample[];
  final_verdict: string;
  interview_readiness: string;
};
