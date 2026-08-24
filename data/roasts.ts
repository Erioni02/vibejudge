export type RoastCase = {
  bad: string;
  roast: string;
  why: string;
  improved: string;
  explanation: string;
};

export type RoastPage = {
  slug: string;
  role: string;
  title: string;
  description: string;
  intro: string;
  cases: RoastCase[];
  patterns: string[];
  relatedRoasts: string[];
  relatedExamples: string[];
};

export const roastPages: RoastPage[] = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    title: "Software Engineer Resume Roast: Real Examples of Weak Bullets Fixed",
    description:
      "Watch VibeJudge-style roasts tear apart weak software engineer resume bullets and rebuild them: vague claims, missing scale, and tech lists with no evidence, each fixed line by line.",
    intro:
      "Software engineer resumes get roasted for one dominant sin: describing proximity to work instead of work. 'Worked on', 'helped with', and 'involved in' appear on thousands of SWE resumes, and every one of them hides a story the engineer could have told. These are fictional but typical examples of the bullets VibeJudge flags most, with the roast, the reason, and the rebuild.",
    cases: [
      {
        bad: "Worked on backend services using Node.js and helped fix bugs.",
        roast: "This bullet has all the commitment of someone standing near a kitchen while other people cook. 'Worked on' and 'helped fix' describe attendance, and the only concrete noun is a framework name. What did you build, at what scale, and what changed?",
        why: "It contains zero evidence: no system, no scale, no outcome. A reviewer cannot tell whether this person shipped a payment platform or restarted a dev server twice.",
        improved: "Rebuilt the checkout API in Node.js, cutting p95 latency from 820ms to 290ms for 15k daily orders and eliminating the weekly timeout incidents.",
        explanation:
          "The rebuild names the system (checkout API), the action (rebuilt), the scale (15k daily orders), and two results (latency, incidents). Now the same sentence proves seniority instead of presence."
      },
      {
        bad: "Familiar with AWS, Docker, Kubernetes, React, Python, Java, Go, and SQL.",
        roast: "Congratulations on knowing twelve technologies to the depth of a Wikipedia summary. A familiarity list is not a skills section; it is a confession that none of these survived contact with production.",
        why: "Skill lists without evidence read as padding, and technical screens probe exactly the items you cannot defend. One deep, proven stack beats twelve shallow names.",
        improved: "Production experience with AWS and Kubernetes (operated a 12-service cluster at 99.95% uptime); built internal tooling in Python; SQL for analytics workloads of 40M+ rows.",
        explanation:
          "Every technology now carries its context and a number. The list shrank, the credibility grew, and interviewers know exactly which questions will land well."
      },
      {
        bad: "Participated in agile ceremonies and code reviews.",
        roast: "You attended meetings and read your teammates' code. That is not an achievement; that is Tuesday. This bullet spends prime resume space proving you are employed.",
        why: "Ceremonies and reviews are baseline expectations for any engineering job. Listing baseline expectations signals you have nothing stronger to say.",
        improved: "Cut code review turnaround from 2 days to 4 hours by introducing review SLAs and pairing rotations, raising deployment frequency to 3x per week.",
        explanation:
          "Same topic (reviews), transformed into an operational improvement with a measurable downstream effect. The difference is not the activity, it is the change you drove."
      }
    ],
    patterns: [
      "Proximity verbs: 'worked on', 'helped with', 'involved in' instead of what you shipped",
      "Technology lists with no production context or scale",
      "Baseline expectations (standups, reviews, git) presented as achievements",
      "No latency, uptime, throughput, or user numbers anywhere in the resume"
    ],
    relatedRoasts: ["frontend-developer", "student", "product-manager"],
    relatedExamples: ["software-engineer", "backend-developer", "senior-software-engineer"]
  },
  {
    slug: "frontend-developer",
    role: "Frontend Developer",
    title: "Frontend Developer Resume Roast: Weak UI Bullets, Rebuilt",
    description:
      "Frontend developer resume roast examples: the vague UI bullets and framework lists that get React resumes skipped, each with the VibeJudge-style roast, why it fails, and the rebuilt version.",
    intro:
      "Frontend resumes get roasted for talking about frameworks instead of users. Every applicant lists React; almost none quantify what their interfaces did to performance, conversion, or accessibility. These fictional but typical examples show the bullets VibeJudge flags most in frontend resumes, with the fix for each.",
    cases: [
      {
        bad: "Created responsive websites using HTML, CSS, and JavaScript.",
        roast: "You used the three technologies that have defined the web since before some of your reviewers were born. This is not a skill, it is literacy. What did the websites do, for whom, and what changed?",
        why: "HTML, CSS, and JavaScript are baseline literacy for frontend roles. Listing them as an achievement invites the reviewer to keep looking for one.",
        improved: "Rebuilt a marketing site in Next.js with responsive breakpoints and image optimization, raising Lighthouse performance 58 to 97 and mobile conversion 14%.",
        explanation:
          "Same foundation, but now there is a framework choice, a performance result, and a business metric. The technologies become context instead of the entire claim."
      },
      {
        bad: "Worked with designers to convert Figma files into code.",
        roast: "Converting Figma files to code is the job description of every frontend role on Earth. This bullet would survive being deleted entirely, which is the test it fails.",
        why: "It describes the default workflow, not your performance of it. The only version of this worth a line is one where you changed the workflow or its quality.",
        improved: "Built a Figma-to-code component pipeline with Storybook docs, cutting design-to-ship time from 9 days to 4 across a 5-person squad.",
        explanation:
          "The collaboration stays, but now it has an innovation, a before/after, and a scope. Collaboration bullets work when you improved the collaboration."
      },
      {
        bad: "Good eye for design and attention to detail.",
        roast: "An 'eye for design' is what people write when their portfolio cannot speak for them. Attention to detail is proven in pixels, not proclaimed in adjectives. Show the audit score or the pixel-perfect handoff rate.",
        why: "Unverifiable self-assessments are the weakest possible evidence, and design-focused reviewers are professionally trained to distrust them.",
        improved: "Shipped 40+ screens matching design specs at a 98% QA acceptance rate; fixed 30 WCAG 2.1 AA violations ahead of an external accessibility audit.",
        explanation:
          "The adjectives become measurements: acceptance rate for detail, audit results for quality. Now the claim survives an interview question."
      }
    ],
    patterns: [
      "Baseline technologies (HTML/CSS/JS) presented as qualifications",
      "Default workflow descriptions ('converted designs to code') with no improvement",
      "Adjective-based self-reviews ('good eye', 'attention to detail') with no artifacts",
      "No performance, accessibility, or conversion numbers for UI work"
    ],
    relatedRoasts: ["software-engineer", "product-manager", "student"],
    relatedExamples: ["frontend-developer", "react-developer", "ui-designer"]
  },
  {
    slug: "student",
    role: "Student",
    title: "Student Resume Roast: Fixing the Empty Resume",
    description:
      "Student resume roast examples: the filler phrases, empty activities, and apologetic summaries that weaken first resumes, each roasted and rebuilt with the VibeJudge approach.",
    intro:
      "Student resumes get roasted for apologizing instead of evidencing. 'Hardworking', 'eager to learn', and 'member of X club' fill pages while proving nothing. Recruiters screening internships are not looking for experience; they are looking for initiative. These fictional but typical examples show what VibeJudge flags and how each becomes evidence.",
    cases: [
      {
        bad: "Hardworking student with a passion for technology and eagerness to learn.",
        roast: "Every one of these words is free, which is exactly what they are worth. Passion is not evidence; it is a mood. What have you built, organized, or finished? Show the receipts.",
        why: "Unverifiable adjectives are the default content of student resumes, which means they differentiate you in exactly zero ways. Finished things are rare; moods are not.",
        improved: "Third-year CS student with two shipped apps (1,200 combined campus downloads) and a TA role for the intro programming course, where I lead weekly labs for 30 students.",
        explanation:
          "The mood became a track record: artifacts, adoption numbers, and a responsibility. Same student, completely different credibility."
      },
      {
        bad: "Member of the computer science club and participated in various events.",
        roast: "Membership: the participation trophy of resumes. 'Various events' is doing a lot of heavy lifting for what I assume was free pizza. What did you organize, lead, or build there?",
        why: "Belonging is not contribution. Club entries only work when they carry a role, an output, or a number.",
        improved: "Organized a 12-week beginner coding workshop for the CS club, teaching 40 students and maintaining a 78% completion rate across the program.",
        explanation:
          "The same club, transformed by a role (organized), a scale (12 weeks, 40 students), and a result (78% completion). Now it proves initiative instead of attendance."
      },
      {
        bad: "Seeking an internship to gain real-world experience in the tech industry.",
        roast: "This sentence explains what the internship does for you. The company is wondering what you do for it. An objective about your personal growth is a request; a summary of your evidence is an application.",
        why: "It centers the applicant's needs over the employer's, and it spends the most-read line of the resume saying nothing the reader can use.",
        improved: "Seeking a summer software internship where coursework in databases and two shipped React projects can contribute to a production team from week one.",
        explanation:
          "The goal remains, but it is now backed by specifics and aimed at the employer's benefit. Wants are fine; wants plus proof get interviews."
      }
    ],
    patterns: [
      "Adjective summaries ('hardworking', 'passionate') with no artifacts",
      "Membership claims ('member of X club') without roles or outputs",
      "Objectives about personal gain instead of offered value",
      "No numbers anywhere: downloads, attendees, grades, hours, results"
    ],
    relatedRoasts: ["software-engineer", "frontend-developer", "product-manager"],
    relatedExamples: ["student", "internship", "no-experience"]
  },
  {
    slug: "product-manager",
    role: "Product Manager",
    title: "Product Manager Resume Roast: Bullets That Hide Your Decisions",
    description:
      "Product manager resume roast examples: team achievements claimed as personal wins, responsibility lists, and metric-free feature bullets, each roasted and rebuilt the VibeJudge way.",
    intro:
      "Product manager resumes get roasted for borrowing credit and hiding decisions. 'We grew revenue 300%' tells a reviewer nothing about you; 'wrote PRDs and ran standups' tells them even less. PM resumes live on decisions made and metrics moved. These fictional but typical examples show what VibeJudge flags in PM resumes.",
    cases: [
      {
        bad: "Led the team to grow revenue by 300% over two years.",
        roast: "'Led the team to grow revenue 300%' is a sentence where you take credit for everyone's year. What did YOU decide? What did you kill? What moved because you were specifically in the room?",
        why: "Team outcomes without your individual decision-making invite the interview question you cannot answer: 'what would have happened without you?'",
        improved: "Prioritized self-serve onboarding over an enterprise feature, lifting trial-to-paid conversion 9% to 15% and adding $600k ARR within two quarters.",
        explanation:
          "Now there is a decision (prioritization), an alternative (the killed feature), and an owned metric. The number shrank and the credibility grew, which is how PM seniority actually reads."
      },
      {
        bad: "Wrote PRDs, managed the backlog, and facilitated sprint ceremonies.",
        roast: "This is a list of PM chores. Writing documents and running meetings is the tax every product manager pays; it is not the job. Where is a decision, a tradeoff, a bet that paid off?",
        why: "Process artifacts are table stakes. A resume of table stakes reads as someone who has held the title but not yet done the job.",
        improved: "Killed a planned ERP integration after 40+ customer interviews showed weak demand, redirecting the quarter to an API product that now drives 22% of new revenue.",
        explanation:
          "The same PM work, expressed as judgment: evidence gathered, a popular plan cancelled, and a better outcome measured. That is what PM hiring managers are buying."
      },
      {
        bad: "Launched multiple features that improved the user experience.",
        roast: "'Multiple features' and 'improved the user experience' are two fog banks in one sentence. Which features? Improved what, for whom, measured how? This bullet could be true of a laptop upgrade.",
        why: "Unmeasured feature lists are the most common PM bullet shape and the least persuasive. Every feature should carry its metric or its strategic reason.",
        improved: "Launched usage-based billing with engineering and finance, enabling $1.4M in expansion revenue from 60 accounts that outgrew flat pricing.",
        explanation:
          "One feature, one mechanism, one number. The fog clears and suddenly the reader can picture you in their roadmap."
      }
    ],
    patterns: [
      "Team achievements claimed without personal decisions",
      "Process chores (PRDs, backlogs, standups) listed as accomplishments",
      "Feature lists with no metrics or strategic rationale",
      "No baseline numbers: 'improved conversion' without the before state"
    ],
    relatedRoasts: ["software-engineer", "frontend-developer", "student"],
    relatedExamples: ["product-manager", "data-analyst", "project-manager"]
  },
  {
    slug: "data-analyst",
    role: "Data Analyst",
    title: "Data Analyst Resume Roast: Reports Without Reasons",
    description:
      "Data analyst resume roast examples: dashboards nobody used, tool lists without questions answered, and analysis without decisions, each roasted and rebuilt with the VibeJudge method.",
    intro:
      "Data analyst resumes get roasted for producing artifacts instead of outcomes. 'Created dashboards and reports' fills resumes while answering nothing: who used them, what changed, what was decided? Analysts are hired to improve decisions; your bullets should read like decision logs. These fictional but typical examples show the VibeJudge pattern.",
    cases: [
      {
        bad: "Created dashboards and reports for various stakeholders.",
        roast: "'Various stakeholders' is where dashboards go to die. Did anyone change a decision because of your charts, or did they just admire the colors in a meeting? Name the audience and the outcome.",
        why: "Report production without adoption or consequence reads as busywork. The value of analysis is entirely in what it changed.",
        improved: "Built the revenue dashboard used in weekly leadership meetings, replacing 6 manual spreadsheets and saving 15 analyst hours weekly across the team.",
        explanation:
          "Audience (leadership), replacement (6 spreadsheets), and consequence (15 hours). The same dashboard, now with evidence of mattering."
      },
      {
        bad: "Strong SQL skills and experience with Tableau, Power BI, and Excel.",
        roast: "A toolbelt is not a resume. Everyone in this candidate pool claims SQL. The question is what you found when you opened the data. Show me a question, an investigation, and a decision.",
        why: "Skills lists belong in the skills section. In bullets, they waste lines that should carry analysis stories with numbers.",
        improved: "Investigated a 3% regional revenue drop through 3 weeks of SQL cohort analysis, tracing it to a misconfigured discount rule and recovering $180k in annual revenue.",
        explanation:
          "The SQL is implicit in the story, and the story has a question, a method, a root cause, and money recovered. Tools serve the narrative, not the reverse."
      },
      {
        bad: "Responsible for maintaining data quality and accuracy.",
        roast: "You were responsible for data quality, and? Did anything break on your watch, or did you catch things? 'Responsible for' is where accountability goes to hide from evidence.",
        why: "Duty statements cannot be interviewed. Caught errors, tests written, and incidents prevented can.",
        improved: "Wrote 60+ dbt tests on revenue-critical models, catching 4 pipeline bugs before they reached executive reporting in the first quarter.",
        explanation:
          "The responsibility becomes a system (tests) with a count and prevented incidents. Now the claim has teeth and an interviewer has a thread to pull."
      }
    ],
    patterns: [
      "Artifact lists ('dashboards and reports') without adoption or decisions",
      "Tool names standing in for analysis stories",
      "'Responsible for' statements hiding unproven accountability",
      "No data scale (rows, sources, cadence) or money attached to any analysis"
    ],
    relatedRoasts: ["software-engineer", "product-manager", "frontend-developer"],
    relatedExamples: ["data-analyst", "data-scientist", "marketing-manager"]
  },
  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    title: "Marketing Manager Resume Roast: Activity Lists vs Pipeline",
    description:
      "Marketing manager resume roast examples: vanity metrics, channel lists without budget or pipeline, and campaign activity with no revenue, each roasted and rebuilt the VibeJudge way.",
    intro:
      "Marketing manager resumes get roasted for confusing activity with results. 'Managed social media', 'ran campaigns', '10k impressions': none of it survives contact with a hiring manager who owns a pipeline number. Marketing resumes are revenue documents. These fictional but typical examples show what VibeJudge flags and how each becomes evidence.",
    cases: [
      {
        bad: "Managed social media accounts and grew engagement significantly.",
        roast: "'Significantly' is doing the work a number should do, and it is bad at the job. Grew engagement toward what? Followers are not pipeline. Show me the leads, the revenue, or admit the channel is decorative.",
        why: "Vanity metrics with adverbs instead of numbers signal junior thinking, and 'significantly' without a baseline is unverifiable by design.",
        improved: "Rebuilt the LinkedIn content engine to 3 posts weekly, growing followers 2k to 11k and generating 240 marketing-qualified leads tracked to closed revenue.",
        explanation:
          "The channel stays, but now it has a cadence, growth numbers, and a line to revenue. Engagement became a funnel stage instead of a feeling."
      },
      {
        bad: "Ran marketing campaigns across multiple channels including email, paid, and events.",
        roast: "A channel tour is not a campaign. What was the goal, the budget, the cost per result? 'Multiple channels' describes a media plan's table of contents, not a marketing achievement.",
        why: "Channel lists without budget or outcomes are unreadable as performance. Every channel has a cost; the achievement is the efficiency or the return.",
        improved: "Owned a $400k paid budget across search and social, cutting cost per SQL 28% by reallocating 15% of spend to bottom-funnel search terms.",
        explanation:
          "Budget, decision, and efficiency: the three facts that make a channel story an achievement. The channels are context; the money math is the point."
      },
      {
        bad: "Worked with the sales team to align marketing and sales efforts.",
        roast: "Marketing and sales alignment: the world's most-claimed, least-demonstrated achievement. What did you align? Was there an SLA, a definition change, a handoff fix? Or just vibes at the quarterly offsite?",
        why: "Alignment claims without mechanisms are unfalsifiable, and unfalsifiable claims earn zero interview credit.",
        improved: "Co-built an MQL-to-SQL service level agreement with sales leadership, raising marketing-sourced win rate from 18% to 26% in three quarters.",
        explanation:
          "The alignment now has an artifact (the SLA) and a shared metric that moved. Collaboration bullets work when the collaboration produced a system."
      }
    ],
    patterns: [
      "Vanity metrics (impressions, followers, engagement) without pipeline or revenue",
      "Channel lists without budgets, costs, or efficiency numbers",
      "Adverbs doing the work of baselines ('significantly', 'greatly')",
      "Alignment and collaboration claims with no mechanisms or shared metrics"
    ],
    relatedRoasts: ["product-manager", "data-analyst", "software-engineer"],
    relatedExamples: ["marketing-manager", "sales-representative", "product-manager"]
  }
];

export function getRoastPage(slug: string) {
  return roastPages.find((page) => page.slug === slug);
}
