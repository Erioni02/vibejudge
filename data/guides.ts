export type GuideSection = {
  heading: string;
  body: string[];
  list?: string[];
  example?: { label: string; text: string };
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  readingMinutes: number;
  published: string;
  sections: GuideSection[];
  takeaways: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedExamples: string[];
  relatedGuides: string[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-write-a-resume",
    title: "How to Write a Resume (Step-by-Step Guide for 2026)",
    description:
      "A practical, step-by-step guide to writing a resume: structure, summary, experience bullets, skills, formatting, and the mistakes to avoid. With before/after examples.",
    intro:
      "A resume has one job: earn an interview. Everything else is decoration. This guide walks through writing one from a blank page in the order recruiters actually read it: summary, experience, skills, then the details that get you filtered out if you get them wrong. Every step includes a before/after example so you can see the difference, not just read the theory.",
    readingMinutes: 9,
    published: "2026-01-12",
    sections: [
      {
        heading: "Start with the job posting, not your history",
        body: [
          "The single highest-leverage step happens before you write anything: read the job posting and extract what the role actually is. Note the exact job title, the 5-7 skills repeated most, and any tools named explicitly. Your resume is now a targeted answer to that specific posting, not a general autobiography.",
          "This matters because most companies filter resumes with software before a human sees them. The software matches keywords; the human matches stories. You need both, and both come from the posting."
        ]
      },
      {
        heading: "Write the experience section first",
        body: [
          "Your experience bullets are the core of the resume. Write them before the summary, because the summary is a compression of your best bullets, and you cannot compress what does not exist yet.",
          "Use this pattern for every bullet: strong verb, what you did, and the measurable result. Aim for 3-5 bullets per recent role and fewer for older roles."
        ],
        example: {
          label: "Before and after",
          text: "Before: Responsible for managing the company social media accounts.\n\nAfter: Grew company LinkedIn from 2k to 11k followers in 14 months with 3 weekly posts, generating 240 marketing-qualified leads."
        }
      },
      {
        heading: "Write a summary that proves three things",
        body: [
          "A strong professional summary is 2-3 sentences that answer: what you are, what is your strongest proof, and what do you want next. Skip adjectives about your personality entirely. If a sentence could appear on any resume in your field, delete it."
        ],
        example: {
          label: "Weak vs strong summary",
          text: "Weak: Hardworking professional seeking a challenging role in a growth-oriented company.\n\nStrong: Operations analyst with 3 years in logistics. Cut freight costs 12% ($140k annually) through carrier data analysis. Looking to bring that rigor to a supply chain team at scale."
        }
      },
      {
        heading: "Choose skills the posting recognizes",
        body: [
          "Your skills line should mirror the posting's vocabulary, not yours. If they say Power BI, do not write Microsoft Power BI Desktop. If they say customer support tickets, do not write client relations. Recruiters search for their words, and ATS matches literal strings."
        ]
      },
      {
        heading: "Format for skimmers and software",
        body: [
          "Recruiters spend under a minute on a first pass. Format so the scan works: one column, clear section headers, consistent dates, 10-12pt font, and a file name like Firstname-Lastname-Resume.pdf. Avoid tables, text boxes, headers/footers with critical info, and graphics that parsers cannot read.",
          "Then run your resume through a checker (like VibeJudge) to see what a critical first pass actually catches."
        ]
      }
    ],
    takeaways: [
      "Extract keywords and the real job title from the posting before writing anything",
      "Write experience bullets first; the summary is their compression",
      "Every bullet: action verb, what you did, measurable result",
      "Mirror the posting's exact skill vocabulary",
      "Single column, standard headers, PDF, no tables or text boxes"
    ],
    faq: [
      {
        question: "What are the parts of a resume in order?",
        answer:
          "Header with contact info, professional summary, work experience, skills, then education. Add projects, certifications, or volunteer work where they strengthen the story. Education goes first only for current students."
      },
      {
        question: "How do I write a resume with no experience?",
        answer:
          "Lead with projects, coursework, volunteering, and informal work written in job format: contribution plus outcome. See our guide to writing a resume with no experience for the full method and examples."
      },
      {
        question: "Should my resume be one page?",
        answer:
          "One page if you have under 8-10 years of experience. Two pages is fine for senior careers with a long record of relevant work. Never longer; density is a feature."
      }
    ],
    relatedExamples: ["software-engineer", "marketing-manager", "entry-level", "no-experience"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "ats-resume-guide", "resume-mistakes"]
  },
  {
    slug: "how-to-write-a-resume-with-no-experience",
    title: "How to Write a Resume With No Experience (With Examples)",
    description:
      "No jobs yet? Learn how to write a resume with no work experience using projects, coursework, volunteering, and informal work, with before/after examples you can copy.",
    intro:
      "Every professional's first resume had the same problem: no work experience. The ones that still earned interviews did three things: they led with evidence that was not employment, they wrote informal experience in professional language, and they showed trajectory instead of apologizing for the past. Here is exactly how to do that.",
    readingMinutes: 8,
    published: "2026-01-15",
    sections: [
      {
        heading: "Reframe what counts as experience",
        body: [
          "Employers hiring for entry-level roles do not expect employment history; they expect evidence you finish things and can be trusted with responsibility. That evidence exists in your life already: personal projects, coursework deliverables, volunteering, family business help, tutoring, organizing events, competitive achievements.",
          "The technique is to write these exactly like jobs: a title, a context, and 2-3 bullets with numbers. 'Built a booking website for a family business that now takes 30% of appointments online' is a professional achievement regardless of who signed your paycheck."
        ]
      },
      {
        heading: "Lead with a Projects section",
        body: [
          "Your Projects section replaces the experience section at the top of the page. Give 2-3 projects each a name, your role, the tools, and a measurable outcome: users, downloads, revenue, hours saved, grade earned, adoption."
        ],
        example: {
          label: "Weak vs strong project bullet",
          text: "Weak: Made an app for a class project.\n\nStrong: Led a 4-person team building a campus event app adopted by 3 student organizations; built the backend and deployment pipeline."
        }
      },
      {
        heading: "Convert coursework into deliverables",
        body: [
          "List relevant courses once in education, then convert the best course projects into portfolio entries. A semester analytics project written as client work ('built a GA4 measurement plan that lifted form submissions 22% for a local nonprofit') reads like experience because it functionally was."
        ]
      },
      {
        heading: "Use certifications as receipts",
        body: [
          "Free certifications (Google, freeCodeCamp, HubSpot, AWS skill builder) work when paired with application. The pairing sentence is the trick: 'Completed X certification, then rebuilt my portfolio site using it.' Courses alone are close to invisible to screeners."
        ]
      },
      {
        heading: "Write a summary about what you offer, not what you lack",
        body: [
          "Never write 'no professional experience yet but eager to learn.' Instead, state your strongest verifiable evidence and the role you want. The summary is the first and sometimes only thing read; spend your best claim there."
        ],
        example: {
          label: "Summary formula",
          text: "Self-taught [field] with [2-3 finished artifacts] and [one measured result]. Seeking [specific role] where [your specific strength] matters."
        }
      }
    ],
    takeaways: [
      "Projects, coursework, volunteering, and informal work are experience when written with outcomes",
      "Lead with a Projects section; format it like jobs",
      "Pair every certification with something you built using it",
      "Numbers beat adjectives at every stage of a no-experience resume",
      "Never mention the lack of experience; show the slope instead"
    ],
    faq: [
      {
        question: "Can I get a job with absolutely no experience?",
        answer:
          "Yes. Entry-level hiring expects no employment history; it screens for initiative, reliability, and finished work. Two or three small completed projects with results is the standard evidence that works."
      },
      {
        question: "Should I include part-time or informal jobs like babysitting?",
        answer:
          "Yes, written professionally with scope and outcomes. Reliability, customer interaction, and workload management are exactly what entry-level screeners want to see."
      },
      {
        question: "How long should a no-experience resume be?",
        answer:
          "One page, always. With limited history, a tight page concentrates your evidence; stretching to two pages exposes the thinness."
      }
    ],
    relatedExamples: ["student", "no-experience", "internship", "entry-level"],
    relatedGuides: ["how-to-write-a-resume", "how-long-should-a-resume-be", "resume-skills"]
  },
  {
    slug: "ats-resume-guide",
    title: "ATS Resume Guide: How to Pass Applicant Tracking Systems",
    description:
      "How applicant tracking systems actually read your resume, what breaks parsing, which keywords matter, and a formatting checklist to pass ATS screens without keyword stuffing.",
    intro:
      "Most mid-to-large companies filter resumes with an applicant tracking system (ATS) before a human reads them. Despite the myths, ATS software is not artificial intelligence judging your soul; it is mostly parsing and matching. That is good news, because parsing and matching are exactly the things you can engineer for. This guide explains what actually happens and gives you a checklist that survives every major system.",
    readingMinutes: 8,
    published: "2026-01-20",
    sections: [
      {
        heading: "What an ATS actually does with your resume",
        body: [
          "When you upload a resume, the ATS converts the file to text, splits it into fields (name, contact, work history, education), and indexes the words. Recruiters then search that index with keywords and filter by the fields. Your resume fails when text extraction garbles the content or the searched keywords are missing.",
          "So there are two jobs: make the text extract cleanly (formatting) and make the right words present (matching). Design impresses humans; it does nothing for the parser."
        ]
      },
      {
        heading: "Formatting that parses cleanly",
        body: [
          "The safest ATS format is boring on purpose: one column, standard section headers (Experience, Education, Skills), consistent date formats, and a standard PDF export from your editor. Word and Google Docs exports parse well; heavily designed templates from graphics tools often do not.",
          "Tables, text boxes, columns, images with text, icons next to contact info, and information in headers/footers are the classic parsing breakers. If your name or phone number lives in a header, some systems will never see it."
        ],
        list: [
          "Single column, top-to-bottom flow",
          "Standard headers: Professional Summary, Experience, Skills, Education",
          "Dates as 'Jan 2024 - Mar 2025', consistent everywhere",
          "Contact info in the body, not a header or footer",
          "PDF export (or DOCX when the posting asks for it)",
          "No tables, text boxes, photos, or text inside images"
        ]
      },
      {
        heading: "Keywords: match, do not stuff",
        body: [
          "Take the posting's exact vocabulary. If it says 'project stakeholder management', your resume should contain that phrase, not just 'worked with stakeholders'. Include both the acronym and the expansion once ('SEO (search engine optimization)') so both searches hit.",
          "Keyword stuffing, white-text tricks, and repeating skills in invisible ways get flagged by recruiters and can end your process. Every claimed keyword must have evidence in a bullet. Matching is about coverage, not frequency."
        ]
      },
      {
        heading: "The job title line matters more than you think",
        body: [
          "ATS filters often search previous job titles. If your real title is idiosyncratic ('Growth Ninja IV'), add the standard equivalent in parentheses on the same line: 'Growth Marketing Lead (Digital Marketing Manager)'. Honest, and it fixes title-based filters."
        ]
      },
      {
        heading: "Test your resume before you apply",
        body: [
          "Copy your PDF text and paste it into a plain text editor. Whatever survives is roughly what the ATS sees. If sections are jumbled or text is missing, reformat. Then run it through VibeJudge's ATS analysis for a critical read of both parsing and content."
        ]
      }
    ],
    takeaways: [
      "ATS is parsing plus keyword search; engineer for both",
      "Single column, standard headers, PDF, contact info in the body",
      "Use the posting's exact phrases, including acronyms and expansions",
      "Every keyword needs evidence in a bullet; never stuff",
      "Paste your resume into plain text to preview what parsers see"
    ],
    faq: [
      {
        question: "What file format is best for ATS?",
        answer:
          "PDF exported from Word or Google Docs parses reliably at every major ATS. Use DOCX only when a posting explicitly requests it. Avoid image-heavy PDFs from design tools."
      },
      {
        question: "Do ATS systems reject resumes automatically?",
        answer:
          "Rarely by themselves. Most 'ATS rejections' are low keyword match scores that rank you below other candidates, or parsing failures that hide your experience. Clean formatting plus posting vocabulary fixes both."
      },
      {
        question: "Should I use an ATS resume template?",
        answer:
          "Any simple single-column template works; you do not need a special one. What matters is clean structure and matching vocabulary, not the template brand."
      }
    ],
    relatedExamples: ["software-engineer", "data-analyst", "marketing-manager", "project-manager"],
    relatedGuides: ["how-to-write-a-resume", "resume-skills", "resume-mistakes"]
  },
  {
    slug: "how-to-write-resume-bullet-points",
    title: "How to Write Resume Bullet Points (Formula + 12 Examples)",
    description:
      "The resume bullet formula that works: action verb, task, measurable result. Includes 12 before/after examples across roles and the patterns that make bullets feel senior.",
    intro:
      "Bullet points are where resumes are won. Recruiters read them in a fast scan, and each one either adds evidence or wastes a line. The formula is simple: strong verb, specific action, measurable result. The skill is applying it honestly to your real work. This guide gives you the formula, the verb rules, and a dozen before/after rewrites across different roles.",
    readingMinutes: 7,
    published: "2026-01-22",
    sections: [
      {
        heading: "The formula: verb, action, result",
        body: [
          "Every strong bullet answers three questions in one line: What did you do? On what, at what scale? And what changed because of it? The result is the part most resumes skip, and it is the part recruiters believe least without it.",
          "Not every task has a clean number. When the metric does not exist, use scope (team size, budget, users), frequency (weekly, per release), or consequence (what broke, what improved, what was decided)."
        ],
        example: {
          label: "Same fact, three levels of strength",
          text: "Level 1 (task): Managed the email newsletter.\n\nLevel 2 (action + scope): Wrote and sent the weekly newsletter to 8,000 subscribers.\n\nLevel 3 (action + result): Rebuilt the weekly newsletter's subject-line testing, lifting open rates from 21% to 34% across 8,000 subscribers."
        }
      },
      {
        heading: "Verb rules that instantly upgrade bullets",
        body: [
          "Start with a strong past-tense verb, and vary them. 'Led', 'built', 'shipped', 'cut', 'grew', 'designed', 'migrated', 'automated' each imply a different kind of competence. Weak openers to delete on sight: 'responsible for', 'worked on', 'helped with', 'assisted in', 'involved in', 'tasked with'.",
          "One exception: current roles can use present tense ('lead', 'own') as long as it is consistent. Mixed tense within a role is a red flag for detail-oriented screeners."
        ]
      },
      {
        heading: "Quantify without inventing",
        body: [
          "Numbers make bullets believable, but only true numbers. Use the measures you actually have: percentages, currency, time saved, volume handled, error rates, adoption counts. If the exact figure is confidential, use honest ranges or orders of magnitude ('roughly 10k requests per minute')."
        ]
      },
      {
        heading: "Twelve before/after rewrites",
        body: [
          "Study the pattern in each pair: the weak version states presence; the strong version states change. This is the single most valuable habit in resume writing."
        ],
        list: [
          "Worked on website improvements → Rebuilt checkout page load performance, cutting load time 2.8s to 1.1s and lifting mobile conversion 9%",
          "Helped customers with issues → Resolved 60+ support tickets weekly with a 96% satisfaction score, training 3 new hires on escalation handling",
          "Responsible for social media → Grew LinkedIn following 2k to 11k in 14 months, generating 240 marketing-qualified leads",
          "Did data entry in CRM → Cleaned and deduplicated 12,000 CRM records, raising sales team data confidence and cutting report disputes to zero",
          "Participated in team meetings → Facilitated weekly sprint planning for a 7-person team, sustaining on-time delivery at 93% across 6 months",
          "Made presentations for managers → Built the monthly executive dashboard used by 4 VPs, replacing 6 manual reports",
          "Tested software for bugs → Wrote 200+ automated tests raising coverage 34% to 81%, halving production regressions",
          "Organized company events → Ran 12 customer webinars hosting 2,400 attendees, producing 620 qualified leads at $11 per lead",
          "Handled inventory → Managed $400k of inventory across 2 locations with 99.2% accuracy through weekly cycle counts",
          "Trained new employees → Onboarded 9 new hires with a structured 3-week program, cutting ramp time from 10 weeks to 6",
          "Worked with vendors → Negotiated with 4 suppliers on annual contracts, cutting supply costs 15% ($95k)",
          "Improved processes → Documented and standardized 8 core workflows, cutting new-hire ramp questions by half"
        ]
      },
      {
        heading: "Length and count",
        body: [
          "Keep bullets to one or two lines. If a bullet wraps to three, it is a story, not a bullet: split it or cut it. Use 3-5 bullets for recent roles and 2-3 for older ones. Your strongest bullet goes first in every role; recruiters weight the top of each section heavily."
        ]
      }
    ],
    takeaways: [
      "Formula: strong verb + specific action + measurable result",
      "No metric? Use scope, frequency, or consequence instead",
      "Delete 'responsible for', 'helped with', 'worked on' on sight",
      "One to two lines per bullet; strongest bullet first",
      "Only true numbers: ranges and magnitudes are fine, inventions are not"
    ],
    faq: [
      {
        question: "How many bullet points per job should a resume have?",
        answer:
          "Three to five for your most recent roles, two to three for older ones. Prioritize by impact: the promotion-worthy story leads, the routine support work either quantifies well or gets cut."
      },
      {
        question: "What if my work has no measurable results?",
        answer:
          "Use scope (how many, how big), frequency (how often), or consequence (what changed). 'Processed 80 invoices weekly with zero discrepancies over 2 years' has no business metric and still proves reliability."
      },
      {
        question: "Should bullet points be full sentences?",
        answer:
          "No. Drop the pronoun and the period-heavy structure: start with the verb, keep it to one or two lines. Fragments are the convention and parse fine."
      }
    ],
    relatedExamples: ["software-engineer", "product-manager", "data-analyst", "sales-representative"],
    relatedGuides: ["resume-action-verbs", "how-to-write-a-resume", "how-to-write-a-resume-summary"]
  },
  {
    slug: "how-to-write-a-resume-summary",
    title: "How to Write a Resume Summary (Examples by Situation)",
    description:
      "Write a resume summary that proves your strongest claim in 2-3 sentences. Formula, examples for experienced candidates, career changers, and students, plus what to delete.",
    intro:
      "The professional summary is the most-read and least-written-well part of a resume. Recruiters read it first; many decide your seniority band from it alone. A good summary is not an introduction and not adjectives about your personality. It is a three-part proof: what you are, your strongest verifiable evidence, and what you are aiming at.",
    readingMinutes: 6,
    published: "2026-01-25",
    sections: [
      {
        heading: "The three-part formula",
        body: [
          "Part one: your professional identity in the field's vocabulary ('backend engineer with 6 years in payments'). Part two: your single strongest proof with a number ('cut p95 latency 43% while processing 12k requests per minute'). Part three: the target ('looking to own reliability for a scaling platform').",
          "Two sentences can do this. Three is the maximum. If your summary runs longer, you are writing an overview, and nobody reads overviews."
        ]
      },
      {
        heading: "What to delete on sight",
        body: [
          "Certain phrases mark a summary as filler instantly: 'hardworking', 'passionate', 'team player', 'detail-oriented', 'results-driven professional', 'seeking a challenging role in a dynamic company'. None of these can be verified, and every one of them is asserted on thousands of competing resumes.",
          "Also delete: first-person pronouns ('I am'), objectives about what the company can do for you, and any claim you cannot back in the experience section."
        ]
      },
      {
        heading: "Summaries by situation",
        body: [
          "The formula flexes by career stage. The identity stays; the proof source changes."
        ],
        list: [
          "Experienced: years + domain + best metric. 'Backend engineer with 6 years in payments. Designed the event architecture that cut release cadence from monthly to daily on a platform processing $400M annually.'",
          "Career changer: old strength translated + new-field proof. 'Operations manager of 6 years moving into analytics. Built the KPI dashboard now used by 4 supervisors, cutting weekly reporting from 6 hours to 45 minutes.'",
          "Student / no experience: finished artifacts + trajectory. 'Third-year CS student with two shipped apps (1,200 downloads) and a TA role for the intro programming course. Seeking a summer internship where I can ship from week one.'",
          "Senior / lead: scope + leverage. 'Senior engineer and tech lead. Led a 7-engineer payments team through a PCI-compliant re-architecture with zero Sev-1 incidents; mentored 6 engineers, 3 promoted.'"
        ]
      },
      {
        heading: "Make it specific to each application",
        body: [
          "The last clause should echo the target role. Applying to a fintech? Name payments. Applying to a startup? Name ownership and speed. This is a 30-second edit per application that measurably changes response rates, because it moves the summary from generic to aimed."
        ]
      }
    ],
    takeaways: [
      "Formula: identity + strongest verifiable proof + target",
      "Two to three sentences maximum",
      "Delete all unverifiable adjectives and 'seeking a challenging role'",
      "The proof must be backed by a bullet below it",
      "Aim the last clause at each specific application"
    ],
    faq: [
      {
        question: "Is a resume summary the same as an objective?",
        answer:
          "No. Objectives state what you want; summaries state what you prove. Modern resumes use summaries, with the target folded into the final clause rather than leading the paragraph."
      },
      {
        question: "Should I write a summary with no experience?",
        answer:
          "Yes, but the proof comes from projects, coursework, and informal work instead of jobs. 'Third-year CS student with two shipped apps and a TA role' is a complete summary with zero employment."
      },
      {
        question: "Can a summary be two sentences?",
        answer:
          "Two tight sentences are ideal for most candidates. Three is the ceiling. Density beats length: one number in a summary outweighs a full paragraph of description."
      }
    ],
    relatedExamples: ["senior-software-engineer", "career-change", "student", "marketing-manager"],
    relatedGuides: ["how-to-write-a-resume", "how-to-write-resume-bullet-points", "how-to-write-a-resume-with-no-experience"]
  },
  {
    slug: "resume-skills",
    title: "Resume Skills: What to List and How to Organize Them",
    description:
      "Which skills to put on a resume, how to organize them for ATS and recruiters, hard vs soft skills, and the mistakes that make skill lists look like filler.",
    intro:
      "The skills section looks like the simplest part of a resume and is the most commonly wasted. Done well, it feeds ATS keyword matching, tells recruiters in four seconds what you are, and sets up your interview. Done badly, it is a wall of every software title you have ever opened. Here is how to build a skills section that works.",
    readingMinutes: 6,
    published: "2026-01-28",
    sections: [
      {
        heading: "Hard skills first, chosen by the posting",
        body: [
          "Hard skills are tools, methods, and domains: SQL, Figma, GA4, SOC 2 compliance, demand generation. These are what ATS searches and what recruiters scan for. Build your list from the posting first (their exact words), then add your genuine secondary skills.",
          "Rule of thumb: 8-15 skills total. Fewer looks thin, more dilutes the ones you are actually great at. Every skill listed must be interview-safe: expect to be asked about anything on the page."
        ]
      },
      {
        heading: "Organize by category, not alphabet",
        body: [
          "Grouped skills read as competence; flat lists read as dumping. Three or four labeled groups let a recruiter find your fit instantly and let parsers associate skills with context."
        ],
        example: {
          label: "Grouped example (data analyst)",
          text: "Analysis: SQL, Python, Excel (advanced), statistics\nVisualization: Tableau, Power BI, Looker\nMethods: cohort analysis, A/B test support, KPI definition"
        }
      },
      {
        heading: "Soft skills: show, do not list",
        body: [
          "'Communication', 'leadership', and 'teamwork' listed bare are noise; everyone lists them. The professional move is to demonstrate them in bullets ('trained 9 new hires', 'ran steering committees for a 12-stakeholder program') and keep only role-relevant soft hybrids in the skills line (e.g., 'stakeholder management', 'incident communication')."
        ]
      },
      {
        heading: "Skill levels and honesty",
        body: [
          "Skip star ratings and percentage bars: they mean nothing to parsers and invite skepticism. Instead, control precision through grouping and wording. If you are beginner at something the posting needs, list it only if you can discuss it; otherwise leave it off and let your strengths carry the match."
        ]
      },
      {
        heading: "Keep the skills section synchronized",
        body: [
          "Your three strongest skills should appear in the summary, the skills line, and at least one bullet each. That repetition is what makes a recruiter remember you as 'the Kubernetes person' rather than a generic applicant, and it satisfies keyword matching at the same time."
        ]
      }
    ],
    takeaways: [
      "8-15 skills, sourced first from the posting's exact vocabulary",
      "Group into 3-4 labeled categories",
      "Demonstrate soft skills in bullets instead of listing them bare",
      "No ratings or bars; only interview-safe skills",
      "Synchronize top skills across summary, skills, and bullets"
    ],
    faq: [
      {
        question: "How many skills should be on a resume?",
        answer:
          "Eight to fifteen, grouped by category. The exact number matters less than coverage of the posting's core requirements plus one or two differentiators."
      },
      {
        question: "Should I list soft skills on my resume?",
        answer:
          "List only role-relevant hybrids (stakeholder management, incident communication) and prove them in bullets. Bare adjectives like 'team player' add nothing that recruiters trust."
      },
      {
        question: "Do skills go before or after experience?",
        answer:
          "After experience for most candidates, since experience is the evidence. Technical roles sometimes place a compact skills line above experience for instant fit-checking; both are acceptable if consistent."
      }
    ],
    relatedExamples: ["react-developer", "data-analyst", "cybersecurity", "marketing-manager"],
    relatedGuides: ["ats-resume-guide", "how-to-write-a-resume", "how-to-write-resume-bullet-points"]
  },
  {
    slug: "resume-action-verbs",
    title: "120 Resume Action Verbs (By Skill, With Usage Tips)",
    description:
      "A categorized list of resume action verbs for leadership, building, improving, analyzing, and more, with guidance on choosing verbs that match your actual contribution.",
    intro:
      "The first word of every bullet sets how the reader prices your work. 'Responsible for' prices it at zero; 'led', 'cut', or 'designed' price it by the contribution type. This is a working list of action verbs organized by what they prove, with notes on when each category is honest to use.",
    readingMinutes: 5,
    published: "2026-02-01",
    sections: [
      {
        heading: "Leadership and ownership",
        body: [
          "Use these when you directed work, made the call, or owned an outcome: led, directed, owned, drove, headed, spearheaded, chaired, coordinated, oversaw, delegated, mentored, coached, onboarded, managed.",
          "Honesty check: 'led' requires something led. If you participated, 'contributed to' with a concrete result is stronger than an inflated verb a reference call would deflate."
        ]
      },
      {
        heading: "Building and creating",
        body: [
          "For making things that did not exist: built, developed, designed, created, launched, shipped, engineered, architected, implemented, produced, established, founded, prototyped, automated."
        ]
      },
      {
        heading: "Improving and saving",
        body: [
          "For optimization and cost work: improved, optimized, streamlined, reduced, cut, accelerated, simplified, consolidated, eliminated, increased, grew, expanded, recovered, negotiated.",
          "These verbs beg for numbers. 'Cut processing time 40%' is complete; 'cut processing time' invites the question you cannot answer later."
        ]
      },
      {
        heading: "Analyzing and deciding",
        body: [
          "For research and judgment: analyzed, evaluated, assessed, audited, investigated, diagnosed, forecasted, modeled, researched, identified, recommended, prioritized, decided, justified."
        ]
      },
      {
        heading: "Supporting and operating",
        body: [
          "For reliable execution, especially early-career: operated, maintained, processed, resolved, supported, documented, tracked, scheduled, organized, administered, executed, delivered, handled, monitored.",
          "Early-career tip: one 'owned' or 'led' backed by a real result outweighs five 'supported' verbs. Promote your true ownership moments to strong verbs and let support work quantify itself."
        ]
      },
      {
        heading: "Verbs to delete on sight",
        body: [
          "Responsible for, worked on, helped with, assisted in, involved in, tasked with, participated in, contributed to (unless nothing stronger is true), did, made, handled (in senior resumes). These describe presence. Your resume describes change."
        ]
      }
    ],
    takeaways: [
      "Match the verb category to your actual contribution type",
      "Improvement verbs (cut, grew, reduced) need attached numbers",
      "Vary verbs across bullets; five 'managed' in a row reads as filler",
      "Promote your genuine ownership moments to leadership verbs",
      "Delete presence-verbs ('responsible for') on every edit pass"
    ],
    faq: [
      {
        question: "What are the strongest resume action verbs?",
        answer:
          "The strongest verb is the one that is true and specific to your contribution: 'led', 'built', 'cut', 'designed', 'negotiated', 'automated'. A precise true verb beats an impressive inflated one every time."
      },
      {
        question: "Can I repeat the same action verb multiple times?",
        answer:
          "Try not to. Repeating 'managed' five times flattens distinct contributions. Vary within honest categories: led, directed, coordinated can describe different leadership moments."
      },
      {
        question: "Should current jobs use present-tense verbs?",
        answer:
          "Yes, current roles conventionally use present tense ('lead', 'own', 'build') and past roles use past tense. Consistency within each role matters more than the choice itself."
      }
    ],
    relatedExamples: ["sales-representative", "project-manager", "software-engineer", "devops-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume", "resume-mistakes"]
  },
  {
    slug: "resume-mistakes",
    title: "The 12 Most Common Resume Mistakes (And How to Fix Them)",
    description:
      "The resume mistakes that actually cost interviews: responsibility bullets, missing metrics, formatting that breaks ATS, generic summaries, and more, each with a concrete fix.",
    intro:
      "Most rejected resumes fail for the same dozen reasons. None of them are typos. They are structural choices that make your work invisible to a sixty-second scan. Here is the list, ordered roughly by how often they appear, each with a concrete fix you can apply today.",
    readingMinutes: 7,
    published: "2026-02-04",
    sections: [
      {
        heading: "1. Responsibility bullets instead of achievement bullets",
        body: [
          "'Responsible for managing social media' describes a job description, not your performance. Fix: every bullet gets a verb, an action, and a result. If a bullet would survive being copied into the company's job posting unchanged, it is not about you yet."
        ]
      },
      {
        heading: "2. No numbers anywhere",
        body: [
          "Without metrics, the reader cannot size you. Percentages, currency, time saved, volumes, error rates: use the measures you have, and honest ranges where confidentiality applies. A resume where no bullet contains a digit reads as a resume where nothing measurable happened."
        ]
      },
      {
        heading: "3. One generic resume for every application",
        body: [
          "The summary aimed at three different roles matches none of them. Fix: keep a master resume, then spend five minutes per application adjusting the summary's target clause, the skills vocabulary, and the bullet order."
        ]
      },
      {
        heading: "4. Formatting that breaks parsers",
        body: [
          "Tables, text boxes, multi-column layouts, contact info in headers, and text inside images survive screen design and die in ATS text extraction. Fix: single column, standard headers, PDF export, contact details in the body."
        ]
      },
      {
        heading: "5. The 3-page resume",
        body: [
          "Length signals editing ability. Under 10 years of experience belongs on one page; senior careers fit two. Older roles compress to 2-3 bullets. Nothing before 2010 needs more than a line unless it is your field's foundational work."
        ]
      },
      {
        heading: "6. Generic summary full of adjectives",
        body: [
          "'Results-driven professional seeking a challenging role' is unverifiable filler. Fix: identity + strongest metric + target, in two sentences. See the resume summary guide for the formula and examples."
        ]
      },
      {
        heading: "7. Keyword mismatch with the posting",
        body: [
          "You write 'client communications'; they search 'stakeholder management'. You write 'ReactJS'; they search 'React'. Fix: mirror the posting's exact vocabulary wherever it is true for you, including acronyms and expansions."
        ]
      },
      {
        heading: "8. Unexplained gaps and job-hopping without framing",
        body: [
          "Gaps invite assumptions; frame them in one honest line (caregiving, study, contract work, health) rather than hoping they go unnoticed. Clusters of short roles benefit from a scope statement showing cumulative progression."
        ]
      },
      {
        heading: "9. Including everything instead of what is relevant",
        body: [
          "Every irrelevant line dilutes a relevant one. The marital status, the photo (in the US), the 2011 certification for software you no longer touch, the hobby section with 'reading and traveling': cut them. Relevance is the whole game."
        ]
      },
      {
        heading: "10. Design over substance",
        body: [
          "Skill bars, photos, two-column templates, and decorative fonts cost parsing reliability and add no evidence. Clean typography on a single column wins. Save design energy for portfolios in design fields."
        ]
      },
      {
        heading: "11. Typos in the first line",
        body: [
          "A misspelled job title or company name in the header tells detail-focused employers everything they fear. Fix: read the top third of your resume twice, out loud, then have a checker (human or VibeJudge) take a pass."
        ]
      },
      {
        heading: "12. No call-to-action infrastructure",
        body: [
          "A recruiter who wants to learn more needs a working path: professional email, LinkedIn URL that matches your name, portfolio link if relevant, and a phone number you answer. Test every link the day you apply."
        ]
      }
    ],
    takeaways: [
      "Convert responsibility bullets to achievement bullets with results",
      "Every important bullet carries a number or a scope",
      "Tailor summary, skills, and bullet order per application",
      "Single-column formatting that parses cleanly beats clever design",
      "One page under 10 years; two pages maximum after that"
    ],
    faq: [
      {
        question: "What is the most common resume mistake?",
        answer:
          "Writing responsibilities instead of achievements. It appears on the majority of rejected resumes and is fully fixable in one editing pass using the verb-action-result pattern."
      },
      {
        question: "Do resume mistakes really cause rejections?",
        answer:
          "Individually, rarely. Cumulatively, constantly. A recruiter's sixty-second scan is a series of tiny judgments; each structural mistake nudges you toward the 'no' pile."
      },
      {
        question: "How do I find my own resume's mistakes?",
        answer:
          "Run it through VibeJudge for a critical structured review, paste it into plain text to check parsing, and read the top third aloud. The combination catches most issues in ten minutes."
      }
    ],
    relatedExamples: ["entry-level", "career-change", "data-analyst", "ux-designer"],
    relatedGuides: ["how-to-write-a-resume", "ats-resume-guide", "how-to-write-resume-bullet-points"]
  },
  {
    slug: "how-long-should-a-resume-be",
    title: "How Long Should a Resume Be? (One Page vs Two, By Situation)",
    description:
      "How long a resume should be by experience level and situation: when one page is non-negotiable, when two pages are fine, and how to cut a resume down without losing substance.",
    intro:
      "The one-page rule is real, but it is not absolute. Resume length is a signal about editing judgment, and the right answer depends on your experience, your field, and what the extra page contains. Here is the honest breakdown by situation, plus how to cut a bloated resume without losing the evidence that earns interviews.",
    readingMinutes: 5,
    published: "2026-02-08",
    sections: [
      {
        heading: "The default rules",
        body: [
          "Under 8-10 years of experience: one page. This covers students, interns, entry-level, and most mid-career professionals. Senior, staff, and executive careers with a long record: two pages maximum. Academic, scientific, and federal resumes follow different conventions (CVs can run long); this applies to industry resumes.",
          "The reasoning is mechanical: recruiters spend under a minute on a first pass. A dense, well-edited page gets fully read. A second page usually gets sampled, and anything past page two is effectively invisible."
        ]
      },
      {
        heading: "When two pages are justified",
        body: [
          "Two pages earn their space when the second page is still evidence: 10+ years of relevant roles, multiple significant systems or programs delivered, speaking, patents, or publications the target role values. The test is simple: if every entry on page two could survive the question 'why does this matter for this job?', it stays. Otherwise it goes."
        ]
      },
      {
        heading: "How to cut a page without losing strength",
        body: [
          "Cutting is a hierarchy exercise. In order of what to sacrifice: (1) old roles compress to one or two lines, (2) duplicate bullets merge, (3) 'responsibilities' bullets die, keeping only achievements, (4) skills lists shrink to the interview-safe set, (5) formatting density increases (margins, spacing) as a last resort, never below 0.5 inch margins or 10pt font."
        ]
      },
      {
        heading: "Length by career stage",
        body: [
          "A quick reference for the common situations."
        ],
        list: [
          "Student / internship: one page, education first",
          "Entry-level (0-2 years): one page, education high",
          "Mid-career (3-8 years): one page, experience first",
          "Senior (8-15 years): one to two pages, recent roles detailed, old roles compressed",
          "Executive (15+ years): two pages, scope statements per role",
          "Career changer: one page, transition projects above old roles"
        ]
      },
      {
        heading: "The density test",
        body: [
          "If your one-page resume has half-inch gaps between sections and three bullets per role, you do not have a length problem, you have a content problem: add evidence. If your two-page resume has ten bullets per role going back to 2009, you do not have a length problem either: you have an editing problem. Length is an output of prioritization, not a target."
        ]
      }
    ],
    takeaways: [
      "One page under ~10 years of experience; two pages maximum for long senior careers",
      "Page two must be all evidence, or it becomes page one's weakness",
      "Cut order: old roles → duplicate bullets → responsibilities → skills padding",
      "Never shrink below 0.5 inch margins or 10pt font to fit",
      "Length is an output of prioritization, not a formatting decision"
    ],
    faq: [
      {
        question: "Is a 2-page resume okay with 5 years of experience?",
        answer:
          "Rarely. Five years of relevant work fits one page when bullets are achievements rather than task lists. If it truly overflows, the second page is usually padding that dilutes strong content."
      },
      {
        question: "Do recruiters actually prefer one page?",
        answer:
          "For early and mid-career candidates, yes, strongly. For senior candidates they expect depth. What they universally reward is evidence density: the most proof in the fewest lines."
      },
      {
        question: "How far back should a resume go?",
        answer:
          "Ten to fifteen years is the norm. Older experience gets a single line (company, title, years) unless it is foundational to the target role."
      }
    ],
    relatedExamples: ["student", "entry-level", "senior-software-engineer", "sales-representative"],
    relatedGuides: ["how-to-write-a-resume", "resume-mistakes", "how-to-write-resume-bullet-points"]
  },
  {
    slug: "how-to-explain-a-career-gap",
    title: "How to Explain a Career Gap on Your Resume (With Examples)",
    description:
      "How to explain employment gaps on a resume honestly and briefly: what to write, what to say in interviews, and gap examples for caregiving, health, layoff, and study breaks.",
    intro:
      "Career gaps are normal: caregiving, health, layoffs, study, relocation, or simply a search that took longer than planned. What costs interviews is not the gap itself but the unexplained silence around it. This guide covers how to frame a gap on the resume in one honest line, how to talk about it in interviews, and the specific wording for the most common situations.",
    readingMinutes: 6,
    published: "2026-02-11",
    sections: [
      {
        heading: "The principle: brief, honest, forward-facing",
        body: [
          "A gap explanation needs three qualities: brief (one line, not a paragraph), honest (never invent employment), and forward-facing (what you bring back, not why you left). Recruiters do not penalize caregiving or layoffs; they penalize evasion and inconsistency between resume and interview.",
          "Gaps under six months usually need no explanation at all; month-only date formats ('2024 - 2025') handle short breaks gracefully. Longer gaps get a single resume line."
        ]
      },
      {
        heading: "Wording by situation",
        body: [
          "Use a neutral, factual label. These one-liners go directly in the experience timeline as their own entry or as a note under the adjacent role."
        ],
        list: [
          "Caregiving: 'Career break - full-time caregiver for a family member (2023 - 2024). Managed household logistics, budgeting, and care coordination.'",
          "Layoff: 'Laid off in a company-wide reduction (May 2024) after 4 years of exceeding targets. Completed AWS certification during transition.'",
          "Health: 'Career break for medical leave and recovery (2024). Cleared to return full-time; used break to complete Google Data Analytics certificate.'",
          "Study: 'Full-time M.Sc. study (2023 - 2024), including capstone project on demand forecasting.'",
          "Job search that ran long: 'Planned career break (2024). Completed two contract projects and rebuilt portfolio while targeting senior product roles.'"
        ]
      },
      {
        heading: "Add evidence inside the gap when it exists",
        body: [
          "Most gaps contain something: a course, freelance work, volunteering, family project management. Write it in job format with numbers. 'Managed a family business's bookkeeping 15 hours weekly for 8 months' converts dead air into experience. This is the single most effective gap technique."
        ]
      },
      {
        heading: "The interview answer",
        body: [
          "Prepare a 30-second spoken version: what happened, what you did about it, and why you are ready now. Practice it aloud until it is calm. Interviewers take their emotional cue from yours: a flat, factual answer closes the topic; an apologetic one extends it.",
          "Then redirect to the future: '...and that is also when I completed the certification I am using in this application.' You are not justifying the past; you are connecting it to the role."
        ]
      },
      {
        heading: "What never to do",
        body: [
          "Never fake employment dates (background checks catch this permanently), never write 'unemployed', never over-explain medical details, and never let the gap explanation be longer than the surrounding jobs. One line, evidence where possible, forward motion always."
        ]
      }
    ],
    takeaways: [
      "Gaps under ~6 months need no line; longer gaps get one honest line",
      "Brief, factual, forward-facing: never apologetic, never over-detailed",
      "Convert gap activities (courses, freelancing, family projects) into formatted evidence",
      "Prepare a calm 30-second interview version and redirect to the future",
      "Never fake dates; background checks make it permanent"
    ],
    faq: [
      {
        question: "How do I explain a 2-year gap on my resume?",
        answer:
          "One factual line in the timeline ('Career break - full-time caregiver, 2023-2024') plus any evidence formatted as experience. In interviews, give a calm 30-second version and pivot to what you bring now."
      },
      {
        question: "Do employers care about employment gaps?",
        answer:
          "Far less than candidates fear, especially post-2020. What they screen for is honesty and readiness. A briefly explained gap with evidence of momentum is a non-issue; an unexplained one invites assumptions."
      },
      {
        question: "Should I hide a short gap by removing months from dates?",
        answer:
          "Using years-only dates is a normal formatting choice. Removing months specifically to disguise a gap risks looking evasive if asked, and inconsistent dates across LinkedIn and your resume look worse than the gap itself."
      }
    ],
    relatedExamples: ["career-change", "no-experience", "entry-level"],
    relatedGuides: ["resume-mistakes", "how-to-write-a-resume", "how-to-write-a-resume-summary"]
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
