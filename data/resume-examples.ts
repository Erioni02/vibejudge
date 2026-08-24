export type ResumeExample = {
  slug: string;
  role: string;
  category: "engineering" | "data" | "product-design" | "business" | "career-stage";
  title: string;
  description: string;
  introduction: string;
  skills: Array<{ label: string; items: string[] }>;
  summaryExample: { text: string; why: string };
  bulletExamples: Array<{ bad: string; good: string; why: string }>;
  commonMistakes: string[];
  atsKeywords: string[];
  formattingTips: string[];
  exampleResume: string;
  faq: Array<{ question: string; answer: string }>;
  relatedRoles: string[];
  relatedGuides: string[];
};

export const resumeExamples: ResumeExample[] = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    category: "engineering",
    title: "Software Engineer Resume Example (With Tips)",
    description:
      "A complete software engineer resume example with strong summary and bullet point samples, ATS keywords, formatting tips, and the mistakes that get SWE resumes rejected.",
    introduction:
      "This page is for software engineers applying to product companies, startups, or enterprise teams. Software engineer resumes are judged fast: a recruiter spends under a minute deciding whether your experience sounds senior, relevant, and measurable. A strong resume leads with impact shipped to production, names the stack precisely, and quantifies scale wherever possible.",
    skills: [
      { label: "Languages", items: ["TypeScript", "Python", "Go", "Java", "SQL"] },
      { label: "Frameworks", items: ["React", "Node.js", "Next.js", "Django", "Spring Boot"] },
      { label: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
      { label: "Practices", items: ["Code review", "Testing", "Agile", "System design", "Observability"] }
    ],
    summaryExample: {
      text: "Software engineer with 5 years building and scaling web platforms serving 2M+ monthly users. Cut API p95 latency 43% by redesigning the caching layer, and led the migration of 120k lines of legacy code to TypeScript with zero downtime. Comfortable owning features from design doc to production monitoring.",
      why: "It leads with years and scale, proves impact with two concrete metrics, and ends with ownership scope. Every claim is verifiable in the experience section below it."
    },
    bulletExamples: [
      {
        bad: "Worked on backend services and fixed bugs when needed.",
        good: "Rebuilt the orders service in Go, cutting p95 response time from 840ms to 310ms and eliminating 90% of timeout alerts during peak traffic.",
        why: "The bad version lists presence, not contribution. The good version names the system, the action, and before/after numbers a hiring manager can trust."
      },
      {
        bad: "Responsible for writing unit tests for the team.",
        good: "Raised unit test coverage from 34% to 81% across 9 services, reducing production regressions by roughly half over two quarters.",
        why: "It converts a duty into an outcome. Coverage numbers plus the business result (fewer regressions) show judgment, not just compliance."
      },
      {
        bad: "Helped with the migration to the cloud.",
        good: "Led the AWS migration of 14 services across 3 teams, finishing 2 weeks early and cutting monthly infrastructure spend by $4,300 through right-sized instances.",
        why: "Scope (14 services, 3 teams), outcome (early, cheaper), and initiative are all visible. 'Helped with' tells the reader nothing about your actual role."
      }
    ],
    commonMistakes: [
      "Listing every technology you have ever touched instead of the stack the job posting names",
      "Describing responsibilities ('worked on', 'responsible for') instead of shipped outcomes",
      "Omitting scale, so a 100-user side project reads the same as a 2M-user platform",
      "Burying your strongest achievement in the middle of an older role",
      "A 3-page resume where 1 page would carry the same evidence"
    ],
    atsKeywords: [
      "software engineer",
      "backend",
      "frontend",
      "full-stack",
      "system design",
      "REST API",
      "microservices",
      "unit testing",
      "CI/CD",
      "code review",
      "agile",
      "distributed systems"
    ],
    formattingTips: [
      "One page under 8 years of experience, two pages maximum after that",
      "Order sections: summary, experience, skills, projects, education",
      "Start every bullet with a past-tense action verb and keep them to two lines",
      "Put the jobs-relevant stack in a dedicated skills line so parsers and recruiters find it instantly"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | San Francisco, CA | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Software engineer with 5 years building and scaling web platforms serving 2M+ monthly users. Cut API p95 latency 43% and led a zero-downtime migration of 120k lines of legacy code to TypeScript.

PROFESSIONAL EXPERIENCE
Software Engineer | Northwind Labs | 2022 - Present
- Rebuilt the orders service in Go, cutting p95 response time from 840ms to 310ms and eliminating 90% of peak-hour timeout alerts.
- Led the AWS migration of 14 services across 3 teams, finishing two weeks early and cutting monthly infrastructure spend by $4,300.
- Introduced load testing in CI, catching 3 capacity-breaking regressions before each reached production.

Junior Software Engineer | BrightApps | 2020 - 2022
- Shipped 30+ features for a React and Node.js SaaS product used by 40,000 monthly active users.
- Raised unit test coverage from 34% to 81% across 9 services, halving production regressions.

SKILLS
TypeScript, Python, Go, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes, CI/CD

EDUCATION
B.S. Computer Science, University of California, 2020`,
    faq: [
      {
        question: "How long should a software engineer resume be?",
        answer:
          "One page if you have under 8 years of experience. Two pages is acceptable for senior or staff engineers with a long record of shipped systems. Anything longer usually means responsibilities are being listed instead of outcomes."
      },
      {
        question: "Should I list every programming language I know?",
        answer:
          "No. List the languages the target role actually uses, plus your strongest secondary languages. A wall of 20 technologies dilutes the stack you are genuinely strong in and can look like keyword stuffing to reviewers."
      },
      {
        question: "Do personal projects count on a software engineer resume?",
        answer:
          "Yes, especially with under 3 years of professional experience. Treat projects like jobs: one or two lines each with the problem, the stack, and a measurable outcome such as users, stars, or performance results."
      }
    ],
    relatedRoles: ["backend-developer", "frontend-developer", "full-stack-developer", "senior-software-engineer", "devops-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "ats-resume-guide"]
  },
  {
    slug: "frontend-developer",
    role: "Frontend Developer",
    category: "engineering",
    title: "Frontend Developer Resume Example (With Tips)",
    description:
      "Frontend developer resume example with summary and bullet samples, ATS keywords, formatting advice, and the mistakes that stop React and UI engineer resumes from getting interviews.",
    introduction:
      "This page is for frontend developers and UI engineers applying for React, Vue, or design-system heavy roles. Frontend resumes win interviews when they connect UI work to user outcomes: performance scores, conversion rates, accessibility gains, and component reuse. Listing frameworks alone is not enough, because every applicant lists the same frameworks.",
    skills: [
      { label: "Core", items: ["JavaScript", "TypeScript", "HTML", "CSS", "Accessibility (WCAG)"] },
      { label: "Frameworks", items: ["React", "Next.js", "Vue", "Tailwind CSS", "Redux"] },
      { label: "Tooling", items: ["Vite", "Webpack", "Jest", "Playwright", "Storybook"] },
      { label: "Practices", items: ["Core Web Vitals", "Responsive design", "Design systems", "Figma handoff"] }
    ],
    summaryExample: {
      text: "Frontend developer with 4 years building React applications for e-commerce and SaaS products. Improved Lighthouse performance from 54 to 96 on a storefront with 300k monthly visitors and cut checkout drop-off 12% by rebuilding the payment flow. Strong in accessibility, shipping WCAG 2.1 AA compliant interfaces.",
      why: "It names the domain (e-commerce), proves performance and revenue impact with numbers, and adds a specialization (accessibility) that many competitors skip."
    },
    bulletExamples: [
      {
        bad: "Built user interfaces with React and CSS.",
        good: "Built a reusable React component library of 45+ components adopted by 4 product teams, cutting new-feature UI build time by roughly 30%.",
        why: "The bad line could describe any applicant. The good line shows leverage: one piece of work, four teams, measurable time saved."
      },
      {
        bad: "Made the website faster.",
        good: "Raised Lighthouse performance from 54 to 96 by code-splitting bundles, compressing images, and deferring third-party scripts, reducing bounce rate 9% on mobile.",
        why: "It shows method (three specific techniques), before/after numbers, and the user-facing result instead of a vague claim."
      },
      {
        bad: "Worked with designers to implement designs.",
        good: "Partnered with 2 product designers to ship 20+ Figma-specified features, maintaining a 95%+ design fidelity score across releases.",
        why: "Collaboration is quantified and quality is measurable. 'Worked with designers' is what every frontend resume already says."
      }
    ],
    commonMistakes: [
      "Listing HTML, CSS, and JavaScript as achievements rather than baseline expectations",
      "No performance, accessibility, or conversion metrics anywhere on the page",
      "Ignoring the design-to-code workflow tools (Figma, Storybook) that teams screen for",
      "Describing visual work with no link, screenshot, or portfolio reference for recruiters to open",
      "Using the same generic summary for frontend, full-stack, and backend applications"
    ],
    atsKeywords: [
      "frontend developer",
      "React",
      "TypeScript",
      "Next.js",
      "responsive design",
      "accessibility",
      "WCAG",
      "Core Web Vitals",
      "component library",
      "REST API integration",
      "design system",
      "cross-browser"
    ],
    formattingTips: [
      "Lead the skills line with the framework in the job posting (React, Vue, or Angular)",
      "Include a portfolio or GitHub link and make sure it loads fast on mobile",
      "Quantify UI work with performance scores, conversion, or adoption numbers",
      "Keep the resume one page; your portfolio carries the visual evidence"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Berlin, Germany | alexmorgan.dev

PROFESSIONAL SUMMARY
Frontend developer with 4 years building React applications for e-commerce and SaaS. Improved Lighthouse performance from 54 to 96 on a storefront with 300k monthly visitors and cut checkout drop-off 12%.

PROFESSIONAL EXPERIENCE
Frontend Developer | Shopline GmbH | 2022 - Present
- Built a reusable React component library of 45+ components adopted by 4 product teams, cutting new-feature UI build time by roughly 30%.
- Raised Lighthouse performance from 54 to 96 through code-splitting and image optimization, reducing mobile bounce rate 9%.
- Shipped WCAG 2.1 AA compliant checkout flow, passing external accessibility audit with zero critical findings.

Junior Frontend Developer | Pixelwerk | 2020 - 2022
- Delivered 20+ Figma-specified features for a B2B SaaS used by 12,000 users, maintaining 95%+ design fidelity.
- Migrated a legacy jQuery codebase to React and TypeScript, reducing bundle size 41%.

SKILLS
TypeScript, React, Next.js, Tailwind CSS, Redux, Jest, Playwright, Storybook, Figma, WCAG 2.1

EDUCATION
B.A. Interactive Media Design, Berlin University of the Arts, 2020`,
    faq: [
      {
        question: "What skills should a frontend developer put on a resume?",
        answer:
          "Lead with the framework the job posting names, then TypeScript or JavaScript, styling systems, testing tools, and performance or accessibility practices. Match the posting's wording so ATS filters recognize your experience."
      },
      {
        question: "Do frontend developers need a portfolio?",
        answer:
          "For most frontend roles, yes. A portfolio with 3 to 5 projects that show live interfaces outperforms any bullet list. Put the link at the top of your resume and keep the site itself fast."
      },
      {
        question: "How do I show UI work on a text resume?",
        answer:
          "Translate visuals into outcomes: performance scores, conversion changes, accessibility audit results, and component adoption numbers. The portfolio shows the pixels; the resume proves the impact."
      }
    ],
    relatedRoles: ["react-developer", "full-stack-developer", "ui-designer", "ux-designer", "software-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-skills", "how-to-write-a-resume-summary"]
  },
  {
    slug: "backend-developer",
    role: "Backend Developer",
    category: "engineering",
    title: "Backend Developer Resume Example (With Tips)",
    description:
      "Backend developer resume example with API, database, and infrastructure bullet samples, ATS keywords, and formatting tips for server-side engineer resumes that pass ATS and impress hiring managers.",
    introduction:
      "This page is for backend engineers working on APIs, services, databases, and infrastructure. Backend resumes are read by technical interviewers who look for scale, reliability, and ownership: throughput numbers, latency improvements, uptime, and migrations shipped safely. Vague service descriptions are the most common reason strong engineers get overlooked.",
    skills: [
      { label: "Languages", items: ["Python", "Go", "Java", "Node.js", "SQL"] },
      { label: "Data", items: ["PostgreSQL", "Redis", "Kafka", "Elasticsearch", "MongoDB"] },
      { label: "Infrastructure", items: ["AWS", "Kubernetes", "Terraform", "Docker", "Prometheus"] },
      { label: "Practices", items: ["System design", "Observability", "Incident response", "Load testing"] }
    ],
    summaryExample: {
      text: "Backend engineer with 6 years designing APIs and data pipelines processing 40M+ events per day. Reduced infrastructure costs 28% by re-architecting a Kafka pipeline and led the zero-downtime migration of a 3TB PostgreSQL cluster. Focused on reliability, observability, and boring on-call shifts.",
      why: "Scale (40M events/day), cost impact, and a risky migration handled safely. The closing line adds personality while staying professional."
    },
    bulletExamples: [
      {
        bad: "Developed and maintained REST APIs.",
        good: "Designed 25+ REST endpoints for the billing platform handling 12k requests per minute, sustaining 99.98% uptime over 18 months.",
        why: "The bad line is a job description. The good line gives traffic, reliability, and timeframe: three facts interviewers can probe productively."
      },
      {
        bad: "Optimized slow database queries.",
        good: "Cut a 9-second report query to 400ms by adding covering indexes and rewriting 14 ORM calls, unlocking daily reporting for 300 internal users.",
        why: "Before/after numbers plus the user impact make the optimization concrete instead of anecdotal."
      },
      {
        bad: "Involved in on-call rotations and incident response.",
        good: "Cut mean time to recovery from 42 to 11 minutes by introducing structured runbooks, alert deduplication, and a PagerDuty escalation policy.",
        why: "It shows you improved the system of work, not just participated in it. MTTR numbers are instantly credible to engineering managers."
      }
    ],
    commonMistakes: [
      "No throughput, latency, or uptime numbers anywhere despite working on measurable systems",
      "Listing databases and clouds without saying what you did with them",
      "Hiding infrastructure-as-code and CI/CD experience that screening managers actively search for",
      "Writing one bullet per employer when the work clearly involved multiple shipped systems",
      "Skipping security practices (auth, encryption, secrets handling) that backend screens expect"
    ],
    atsKeywords: [
      "backend engineer",
      "REST API",
      "microservices",
      "PostgreSQL",
      "Kafka",
      "Redis",
      "Kubernetes",
      "AWS",
      "system design",
      "high availability",
      "observability",
      "database optimization"
    ],
    formattingTips: [
      "Quantify every system: requests per second, events per day, data size, uptime",
      "Separate 'you built it' from 'you operated it': both matter for backend roles",
      "Group skills into languages, data stores, and infrastructure for fast parsing",
      "Two pages is fine at 6+ years; keep the first page focused on your most recent role"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Amsterdam, NL | github.com/alexmorgan

PROFESSIONAL SUMMARY
Backend engineer with 6 years designing APIs and data pipelines processing 40M+ events per day. Cut infrastructure costs 28% and led a zero-downtime migration of a 3TB PostgreSQL cluster.

PROFESSIONAL EXPERIENCE
Backend Engineer | Flowmetrics | 2021 - Present
- Designed 25+ REST endpoints for the billing platform handling 12k requests per minute, sustaining 99.98% uptime over 18 months.
- Led zero-downtime migration of a 3TB PostgreSQL cluster to a partitioned schema, cutting backup restore time 65%.
- Reduced mean time to recovery from 42 to 11 minutes with runbooks, alert deduplication, and PagerDuty escalation policies.

Backend Engineer | Datastack BV | 2018 - 2021
- Re-architected a Kafka event pipeline processing 40M events per day, reducing infrastructure costs 28%.
- Cut a 9-second report query to 400ms with covering indexes and ORM rewrites, unlocking daily reporting for 300 users.

SKILLS
Python, Go, Node.js, PostgreSQL, Redis, Kafka, Kubernetes, AWS, Terraform, Prometheus

EDUCATION
B.Sc. Computer Science, Delft University of Technology, 2018`,
    faq: [
      {
        question: "How do I describe backend work without revealing company secrets?",
        answer:
          "Use orders of magnitude instead of exact internal figures: 'roughly 10k requests per minute', 'multi-terabyte cluster', 'double-digit percentage cost reduction'. Recruiters need scale context, not confidential numbers."
      },
      {
        question: "Should backend resumes include frontend skills?",
        answer:
          "Briefly, if relevant. 'Built internal React admin tools' is a plus for product teams. Do not pad the skills line with frontend frameworks you would not want to be interviewed on."
      },
      {
        question: "What achievements matter most for backend roles?",
        answer:
          "Reliability improvements, latency and throughput gains, cost reductions, safe migrations, and security wins. These map directly to what backend hiring managers are held accountable for."
      }
    ],
    relatedRoles: ["software-engineer", "devops-engineer", "full-stack-developer", "senior-software-engineer", "cybersecurity"],
    relatedGuides: ["how-to-write-resume-bullet-points", "ats-resume-guide", "resume-action-verbs"]
  },
  {
    slug: "full-stack-developer",
    role: "Full-Stack Developer",
    category: "engineering",
    title: "Full-Stack Developer Resume Example (With Tips)",
    description:
      "Full-stack developer resume example showing how to present frontend and backend work together, with summary samples, ATS keywords, formatting tips, and common mistakes to avoid.",
    introduction:
      "This page is for developers who work across the stack and need a resume that proves depth on both sides. The full-stack trap is shallowness: listing a little of everything convinces no one. Strong full-stack resumes pick a primary stack, show one end-to-end feature shipped solo or as lead, and quantify outcomes on both the interface and the service.",
    skills: [
      { label: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
      { label: "Backend", items: ["Node.js", "Express", "PostgreSQL", "REST & GraphQL"] },
      { label: "Platform", items: ["AWS", "Docker", "CI/CD", "Vercel"] },
      { label: "Practices", items: ["End-to-end testing", "Agile", "Feature ownership"] }
    ],
    summaryExample: {
      text: "Full-stack developer with 5 years shipping SaaS features end-to-end with React, Node.js, and PostgreSQL. Solely built and launched a customer portal now used by 8,000 accounts, and cut page load times 58% by redesigning both the API layer and the frontend data fetching.",
      why: "It names one coherent stack, proves end-to-end ownership with a real feature, and shows a win that required both halves of the stack."
    },
    bulletExamples: [
      {
        bad: "Worked on both frontend and backend tasks.",
        good: "Shipped a self-serve onboarding flow end-to-end (React, Node.js, PostgreSQL) that raised trial-to-paid conversion from 11% to 17% in one quarter.",
        why: "One feature, both layers, one business metric. That is the definition of full-stack value; 'both frontend and backend tasks' is not."
      },
      {
        bad: "Built features using the company tech stack.",
        good: "Replaced a legacy jQuery admin with a Next.js dashboard backed by 9 new API endpoints, cutting support tickets about reporting 35%.",
        why: "It names what was replaced and why it mattered. Support ticket reduction ties full-stack work to operations cost."
      },
      {
        bad: "Maintained the database and server code.",
        good: "Introduced Prisma migrations and seeded CI databases, eliminating 100% of 'works on my machine' data bugs reported by the team over 6 months.",
        why: "Infrastructure work is framed by the problem it removed, which is how generalists prove judgment."
      }
    ],
    commonMistakes: [
      "Splitting the resume into 'frontend tasks' and 'backend tasks' lists with no end-to-end story",
      "Claiming 12 technologies with no evidence of depth in any of them",
      "No product metrics: full-stack developers sit closest to user outcomes and should prove it",
      "Omitting deployment and DevOps exposure, which is often the real differentiator for startups",
      "A summary that says 'passionate about technology' instead of naming a stack and a result"
    ],
    atsKeywords: [
      "full-stack developer",
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "REST API",
      "GraphQL",
      "Next.js",
      "AWS",
      "end-to-end",
      "feature ownership",
      "CI/CD"
    ],
    formattingTips: [
      "Pick one headline stack and repeat it in summary, skills, and bullets",
      "For each role, lead with your most end-to-end achievement before narrower work",
      "Include at least one metric per side of the stack (UI performance plus API reliability)",
      "Link a project where reviewers can see both the interface and the repo"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Remote | github.com/alexmorgan

PROFESSIONAL SUMMARY
Full-stack developer with 5 years shipping SaaS features end-to-end with React, Node.js, and PostgreSQL. Solely built a customer portal now used by 8,000 accounts and cut page load times 58%.

PROFESSIONAL EXPERIENCE
Full-Stack Developer | Taskhive | 2021 - Present
- Shipped a self-serve onboarding flow end-to-end (React, Node.js, PostgreSQL), raising trial-to-paid conversion from 11% to 17%.
- Built a customer portal used by 8,000 accounts, including billing, audit logs, and SSO.
- Cut page load times 58% by redesigning API pagination and frontend data fetching.

Full-Stack Developer | Webforge Studio | 2019 - 2021
- Replaced a legacy jQuery admin with a Next.js dashboard and 9 new API endpoints, cutting reporting support tickets 35%.
- Introduced Prisma migrations and seeded CI databases, eliminating environment data bugs for a 6-person team.

SKILLS
TypeScript, React, Next.js, Node.js, Express, PostgreSQL, GraphQL, AWS, Docker, CI/CD

EDUCATION
B.Sc. Information Systems, University of Amsterdam, 2019`,
    faq: [
      {
        question: "How do I prove full-stack depth without looking like a generalist?",
        answer:
          "Anchor the resume to one primary stack and show at least one feature you owned end-to-end, from database schema to deployed interface, with a business metric attached."
      },
      {
        question: "Should a full-stack resume list more technologies than a specialist resume?",
        answer:
          "Slightly more, but organized. Group them by layer (frontend, backend, platform). An unstructured list of 15 technologies reads as shallow; the same list in three groups reads as versatile."
      },
      {
        question: "Are side projects important for full-stack applications?",
        answer:
          "Very. A deployed project with a real URL, a repo, and a few hundred users is the fastest proof that you can own a product alone. Treat it like a job entry with metrics."
      }
    ],
    relatedRoles: ["software-engineer", "frontend-developer", "react-developer", "backend-developer", "devops-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "resume-skills"]
  },
  {
    slug: "react-developer",
    role: "React Developer",
    category: "engineering",
    title: "React Developer Resume Example (With Tips)",
    description:
      "React developer resume example with component, state management, and performance bullet samples, ATS keywords including React ecosystem tools, and formatting tips for frontend React roles.",
    introduction:
      "This page is for developers targeting roles where React is the core requirement. Because React appears on almost every frontend resume, the differentiators are ecosystem depth (state, testing, rendering patterns) and outcomes: render performance, bundle size, component adoption, and shipping cadence. Your resume should read like you reason about React, not just use it.",
    skills: [
      { label: "Core React", items: ["React 18", "Hooks", "Context", "Server Components", "React Query"] },
      { label: "State", items: ["Redux Toolkit", "Zustand", "React Query", "URL state"] },
      { label: "Ecosystem", items: ["Next.js", "Vite", "React Testing Library", "Playwright", "Storybook"] },
      { label: "Quality", items: ["TypeScript", "Core Web Vitals", "Accessibility", "Code splitting"] }
    ],
    summaryExample: {
      text: "React developer with 4 years building data-heavy dashboards in React 18 and TypeScript. Cut initial bundle size 47% with route-level code splitting and Suspense, and led adoption of React Query across 3 teams, removing 4,000 lines of manual data-fetching code.",
      why: "It names a specific app type (data-heavy dashboards), a modern stack, and two wins that show React-specific judgment rather than generic frontend work."
    },
    bulletExamples: [
      {
        bad: "Used React hooks and components to build features.",
        good: "Refactored a 900-line class-based dashboard into 18 typed function components with React Query, reducing re-renders on filter changes by 70%.",
        why: "It shows a before state, a modernization decision, and a performance result that required understanding React's rendering model."
      },
      {
        bad: "Managed application state with Redux.",
        good: "Migrated 12 Redux slices to React Query and URL state, deleting 4,000 lines of boilerplate and cutting state-related bugs reported per sprint from 6 to 1.",
        why: "Architectural decisions with deletions and bug counts prove seniority. 'Managed state with Redux' proves only exposure."
      },
      {
        bad: "Wrote tests for React components.",
        good: "Raised React Testing Library coverage on the checkout flow to 88%, catching 11 checkout-breaking regressions in the three releases before Black Friday.",
        why: "Testing is tied to a revenue-critical flow and a deadline, which shows you understand what tests are for."
      }
    ],
    commonMistakes: [
      "Writing 'React.js' or 'ReactJS' inconsistently when the posting says React (pick the posting's spelling)",
      "Listing Redux for a role whose posting emphasizes server state and React Query",
      "No rendering or bundle performance numbers, the easiest React wins to quantify",
      "Omitting TypeScript despite it being the default for new React teams",
      "Describing components built without saying who used them or what improved"
    ],
    atsKeywords: [
      "React",
      "React developer",
      "TypeScript",
      "hooks",
      "Next.js",
      "Redux",
      "React Query",
      "React Testing Library",
      "code splitting",
      "component library",
      "JSX",
      "state management"
    ],
    formattingTips: [
      "Name the React version and major libraries you actually use (React 18, React Query, Redux Toolkit)",
      "Quantify rendering wins: bundle size, re-render counts, interaction latency",
      "Show testing depth with coverage and caught-regression counts",
      "Keep education below experience unless you are a recent graduate"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Warsaw, PL | github.com/alexmorgan

PROFESSIONAL SUMMARY
React developer with 4 years building data-heavy dashboards in React 18 and TypeScript. Cut initial bundle size 47% with route-level code splitting and led React Query adoption across 3 teams.

PROFESSIONAL EXPERIENCE
React Developer | Insurboard | 2022 - Present
- Refactored a 900-line class-based dashboard into 18 typed function components with React Query, reducing re-renders on filter changes by 70%.
- Migrated 12 Redux slices to React Query and URL state, deleting 4,000 lines of boilerplate and cutting state-related bugs from 6 to 1 per sprint.
- Raised React Testing Library coverage on checkout to 88%, catching 11 regressions before Black Friday releases.

Frontend Developer (React) | Codewave | 2020 - 2022
- Cut initial bundle size 47% with route-level code splitting, Suspense, and per-route data prefetching.
- Built a Storybook component library of 40+ components used by 3 product squads.

SKILLS
React 18, TypeScript, Next.js, React Query, Redux Toolkit, Zustand, Playwright, Storybook, Vite

EDUCATION
B.Sc. Computer Science, Warsaw University of Technology, 2020`,
    faq: [
      {
        question: "What React skills do employers look for in 2026?",
        answer:
          "React 18+ patterns (Suspense, Server Components where relevant), TypeScript, server-state libraries like React Query or SWR, testing with React Testing Library or Playwright, and performance work such as code splitting and memoization."
      },
      {
        question: "Should I learn and list Next.js for React roles?",
        answer:
          "If target postings mention it, yes. Next.js appears in a large share of React job descriptions, and even one shipped Next.js project with measured results makes your resume match more searches."
      },
      {
        question: "How do I show React experience without professional work?",
        answer:
          "Build two or three deployed projects with different requirements: one data-heavy app with server state, one with complex client state, one with performance or accessibility focus. Measure something in each and put those numbers on the resume."
      }
    ],
    relatedRoles: ["frontend-developer", "full-stack-developer", "software-engineer", "ui-designer"],
    relatedGuides: ["resume-skills", "how-to-write-resume-bullet-points", "ats-resume-guide"]
  },
  {
    slug: "senior-software-engineer",
    role: "Senior Software Engineer",
    category: "engineering",
    title: "Senior Software Engineer Resume Example (With Tips)",
    description:
      "Senior software engineer resume example focused on leadership, system design, and business impact. Includes summary samples, ATS keywords, and how to show seniority beyond years of experience.",
    introduction:
      "This page is for engineers stepping up to senior or staff roles, where resumes are judged on leverage rather than output. At this level, hiring managers look for systems you designed, engineers you grew, incidents you prevented, and decisions that outlived you. A senior resume that reads like a longer junior resume is the most common rejection reason.",
    skills: [
      { label: "Architecture", items: ["System design", "Domain-driven design", "Event-driven architecture", "API strategy"] },
      { label: "Leadership", items: ["Mentoring", "Tech lead", "Hiring", "RFCs and design reviews"] },
      { label: "Execution", items: ["Roadmap planning", "Estimation", "Cross-team initiatives", "Incident command"] },
      { label: "Technical", items: ["Distributed systems", "Performance", "Security", "Cost optimization"] }
    ],
    summaryExample: {
      text: "Senior software engineer with 9 years owning platforms at scale. Tech lead for a payments platform processing $400M annually; designed the event-driven architecture that cut release cadence from monthly to daily and mentored 6 engineers, 3 of whom were promoted.",
      why: "Money processed, an architectural decision with a lasting outcome, and engineers grown: the three pillars of senior-level evidence, stated in three sentences."
    },
    bulletExamples: [
      {
        bad: "Led the engineering team and mentored junior developers.",
        good: "Tech-led a 7-engineer payments team through a PCI-compliant re-architecture, shipping 11 months of roadmap with zero Sev-1 incidents.",
        why: "Team size, a hard constraint (PCI), duration, and reliability outcome. Leadership is proven by what the team achieved, not the verb 'led'."
      },
      {
        bad: "Involved in architectural decisions and design reviews.",
        good: "Authored the RFC that standardized event schemas across 5 teams, cutting cross-service integration bugs 44% the following year.",
        why: "It shows influence beyond your own team and measures the result of a decision, which is exactly what senior promotion committees look for."
      },
      {
        bad: "Helped junior engineers grow.",
        good: "Mentored 6 engineers through weekly design reviews; 3 promoted within 18 months, and 2 now lead their own services.",
        why: "Growth of others, with timeframes and outcomes, is the clearest seniority signal a resume can carry."
      }
    ],
    commonMistakes: [
      "Listing individual-contributor tasks with no evidence of leverage or influence",
      "Years of experience stated but never demonstrated through scope or outcomes",
      "No architecture decisions: senior resumes need at least one 'I decided X and Y happened'",
      "Omitting hiring, interviewing, or mentoring, which distinguish senior from mid-level",
      "Two pages of dense bullets with no narrative of increasing scope across roles"
    ],
    atsKeywords: [
      "senior software engineer",
      "tech lead",
      "system design",
      "architecture",
      "mentoring",
      "cross-functional",
      "design reviews",
      "distributed systems",
      "roadmap",
      "incident management",
      "scalability",
      "stakeholder management"
    ],
    formattingTips: [
      "Lead each role with 1-2 leadership bullets before individual contributions",
      "Show scope progression across roles: systems owned, team sizes, blast radius",
      "Include one paragraph-style 'scope statement' per recent role if titles do not convey seniority",
      "Cut older roles to 2-3 bullets each; the first page should be your last 5 years"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | New York, NY | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Senior software engineer with 9 years owning platforms at scale. Tech lead for a payments platform processing $400M annually; designed the event architecture that cut release cadence from monthly to daily and mentored 6 engineers.

PROFESSIONAL EXPERIENCE
Senior Software Engineer, Payments | Meridian Financial | 2020 - Present
- Tech-led a 7-engineer payments team through a PCI-compliant re-architecture, shipping 11 months of roadmap with zero Sev-1 incidents.
- Authored the RFC that standardized event schemas across 5 teams, cutting cross-service integration bugs 44%.
- Mentored 6 engineers through weekly design reviews; 3 promoted within 18 months.

Software Engineer II | Corelink Systems | 2016 - 2020
- Designed the order-state service handling 3M orders per day at peak.
- Drove the move from monthly release trains to daily deploys via test automation and feature flags.

Software Engineer | Corelink Systems | 2014 - 2016
- Shipped billing and reporting features for a B2B platform with 900 enterprise customers.

SKILLS
System design, event-driven architecture, TypeScript, Go, PostgreSQL, Kafka, AWS, mentoring, incident command

EDUCATION
B.Sc. Computer Science, New York University, 2014`,
    faq: [
      {
        question: "How many years of experience do you need for a senior engineer role?",
        answer:
          "Most companies expect 5 to 8 years, but the title follows demonstrated leverage: systems designed, engineers mentored, and incidents led. Two of those shown clearly on a resume beat ten years of task lists."
      },
      {
        question: "Should a senior resume include coding achievements?",
        answer:
          "Yes, but frame them by impact: the system, the constraint, and the result. Senior coding bullets should show judgment (what you chose not to build, tradeoffs accepted) as much as output."
      },
      {
        question: "How do I show leadership if my title is not 'senior'?",
        answer:
          "Use evidence instead of titles: 'tech-led a 7-engineer initiative', 'authored the RFC adopted by 5 teams', 'mentored 6 engineers, 3 promoted'. Hiring managers read scope, not labels."
      }
    ],
    relatedRoles: ["software-engineer", "backend-developer", "devops-engineer", "product-manager"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-action-verbs", "how-to-write-a-resume-summary"]
  },
  {
    slug: "devops-engineer",
    role: "DevOps Engineer",
    category: "engineering",
    title: "DevOps Engineer Resume Example (With Tips)",
    description:
      "DevOps engineer resume example with infrastructure-as-code, CI/CD, and reliability bullet samples, ATS keywords for cloud and platform roles, and formatting tips for DevOps resumes.",
    introduction:
      "This page is for DevOps, platform, and site reliability engineers. DevOps resumes are evaluated on the systems you automated and the reliability you created: deployment frequency, recovery times, uptime, and cost. The strongest resumes read like an uptime report with a personality, not a list of tools installed.",
    skills: [
      { label: "Cloud", items: ["AWS", "GCP", "Azure", "Terraform", "CloudFormation"] },
      { label: "Containers", items: ["Kubernetes", "Docker", "Helm", "ArgoCD"] },
      { label: "CI/CD", items: ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI"] },
      { label: "Reliability", items: ["Prometheus", "Grafana", "SLOs", "Incident response", "Chaos testing"] }
    ],
    summaryExample: {
      text: "DevOps engineer with 6 years building platform infrastructure for 40+ engineering teams. Cut deployment time from 45 minutes to 6 with a self-service pipeline, raised uptime from 99.5% to 99.95%, and reduced AWS spend $18k per month through rightsizing and spot strategies.",
      why: "Three metrics, three different DevOps responsibilities (delivery, reliability, cost). It reads like the job description of every platform team, proven."
    },
    bulletExamples: [
      {
        bad: "Managed cloud infrastructure on AWS.",
        good: "Codified 100% of production infrastructure in Terraform across 3 AWS accounts, cutting environment drift incidents from monthly to zero in a year.",
        why: "Coverage, scope, and the problem eliminated. 'Managed infrastructure' could mean clicking in the console; this shows engineering."
      },
      {
        bad: "Set up CI/CD pipelines for the teams.",
        good: "Built a self-service GitHub Actions pipeline with ephemeral preview environments, raising deployment frequency from weekly to 20+ deploys per day across 12 teams.",
        why: "Deployment frequency is the DevOps north-star metric. Before/after plus team count makes the platform work tangible."
      },
      {
        bad: "Handled on-call incidents and monitoring.",
        good: "Introduced SLOs and error budgets for 9 services, cutting pager volume 60% while raising measured uptime from 99.5% to 99.95%.",
        why: "It shows modern reliability practice (SLOs) and the rare win of fewer alerts AND better uptime, which demonstrates real observability skill."
      }
    ],
    commonMistakes: [
      "A wall of tool names with no before/after reliability or delivery metrics",
      "No security or compliance mention (IAM, secrets management, audit) for roles that expect it",
      "Describing manual operations work as if it were automation",
      "Omitting cost optimization, which has become a core DevOps KPI",
      "Listing Kubernetes without stating cluster size, workloads, or what you operated on it"
    ],
    atsKeywords: [
      "DevOps engineer",
      "site reliability",
      "Kubernetes",
      "Terraform",
      "infrastructure as code",
      "CI/CD",
      "AWS",
      "Docker",
      "observability",
      "SLO",
      "incident response",
      "cost optimization"
    ],
    formattingTips: [
      "Lead with reliability and delivery metrics; tools support the story, not the reverse",
      "Quantify platform scope: teams served, services operated, requests or hosts managed",
      "Include a security bullet (secrets, IAM, compliance) on every DevOps resume",
      "Certifications (AWS, CKA) go in education, never in place of experience"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Dublin, IE | github.com/alexmorgan

PROFESSIONAL SUMMARY
DevOps engineer with 6 years building platform infrastructure for 40+ engineering teams. Cut deployment time from 45 minutes to 6, raised uptime from 99.5% to 99.95%, and reduced AWS spend $18k per month.

PROFESSIONAL EXPERIENCE
DevOps Engineer | Kellscale | 2021 - Present
- Built a self-service GitHub Actions pipeline with ephemeral preview environments, raising deployment frequency from weekly to 20+ deploys per day across 12 teams.
- Introduced SLOs and error budgets for 9 services, cutting pager volume 60% while raising uptime from 99.5% to 99.95%.
- Reduced AWS spend by $18k per month through rightsizing, spot fleets, and storage lifecycle policies.

Platform Engineer | Arclight Systems | 2018 - 2021
- Codified 100% of production infrastructure in Terraform across 3 AWS accounts, eliminating environment drift incidents.
- Migrated 30 legacy VMs to Kubernetes, cutting average recovery time from hours to minutes.
- Implemented centralized secrets management with Vault, passing the company's first external security audit.

SKILLS
AWS, Terraform, Kubernetes, Docker, Helm, ArgoCD, GitHub Actions, Prometheus, Grafana, Vault

CERTIFICATIONS
AWS Solutions Architect Associate, Certified Kubernetes Administrator (CKA)`,
    faq: [
      {
        question: "What metrics should a DevOps resume include?",
        answer:
          "Deployment frequency, lead time to production, mean time to recovery, uptime or error rates, pager volume, and cloud cost changes. These map to the DORA metrics hiring managers know."
      },
      {
        question: "Are DevOps certifications worth listing?",
        answer:
          "Yes for AWS, Azure, GCP, and CKA certifications, especially early career or when switching clouds. List them under education or certifications, but never as a substitute for infrastructure experience."
      },
      {
        question: "How do I describe on-call experience positively?",
        answer:
          "Show what you changed: runbooks written, alerts deduplicated, MTTR reduced, pager volume cut. On-call participation is expected; on-call improvement is an achievement."
      }
    ],
    relatedRoles: ["backend-developer", "software-engineer", "cybersecurity", "senior-software-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "ats-resume-guide", "resume-action-verbs"]
  },
  {
    slug: "cybersecurity",
    role: "Cybersecurity Analyst",
    category: "engineering",
    title: "Cybersecurity Resume Example (With Tips)",
    description:
      "Cybersecurity resume example for analysts and security engineers, with incident response and risk bullet samples, ATS keywords for security roles, and formatting tips that pass security team screening.",
    introduction:
      "This page is for security analysts, engineers, and SOC professionals. Security resumes are screened for scope (what you protected), detection and response evidence (what you caught, how fast), and risk reduction you can quantify. Certifications matter in this field, but demonstrated incidents handled matter more.",
    skills: [
      { label: "Defense", items: ["SIEM (Splunk, Sentinel)", "EDR", "Threat hunting", "Incident response"] },
      { label: "Offense", items: ["Penetration testing", "Burp Suite", "Metasploit", "Vulnerability management"] },
      { label: "Governance", items: ["ISO 27001", "SOC 2", "NIST CSF", "Risk assessments"] },
      { label: "Engineering", items: ["Python", "SQL", "Cloud security (AWS/IAM)", "Automation"] }
    ],
    summaryExample: {
      text: "Cybersecurity analyst with 5 years in SOC and incident response roles. Cut mean time to detect from 9 hours to 40 minutes by rebuilding SIEM correlation rules, and led response for 30+ confirmed incidents including a ransomware containment with zero data loss. GIAC certified.",
      why: "Detection speed, incident volume with a high-stakes example, and certification in one breath. Security hiring managers scan for exactly these three signals."
    },
    bulletExamples: [
      {
        bad: "Monitored security alerts and responded to threats.",
        good: "Triage 200+ daily alerts across 5,000 endpoints, escalating 3% for investigation with a documented 98% true-positive rate.",
        why: "Volume, scope, and precision. It shows judgment under load, which is the core SOC skill, instead of a generic monitoring claim."
      },
      {
        bad: "Performed vulnerability scans and reports.",
        good: "Reduced critical vulnerabilities open beyond SLA from 40 to 3 by automating patch tracking and negotiating remediation windows with 6 product teams.",
        why: "The before/after plus the cross-team method shows both technical and influence skills, which senior security roles require."
      },
      {
        bad: "Knowledge of compliance frameworks.",
        good: "Owned evidence collection for SOC 2 Type II across 11 controls, achieving zero exceptions across two annual audits.",
        why: "Framework knowledge becomes real when tied to specific controls and audit outcomes. Zero exceptions is a verifiable claim."
      }
    ],
    commonMistakes: [
      "Listing tools (Splunk, Nessus) without the outcomes achieved through them",
      "No incident metrics: detection time, response time, incidents handled, false-positive rates",
      "Certifications listed prominently while hands-on evidence is missing",
      "Ignoring cloud security, which now dominates most corporate attack surfaces",
      "Writing 'top secret' style vague claims ('protected the company from cyber threats') with nothing verifiable"
    ],
    atsKeywords: [
      "cybersecurity analyst",
      "incident response",
      "SIEM",
      "threat detection",
      "vulnerability management",
      "SOC",
      "penetration testing",
      "risk assessment",
      "ISO 27001",
      "SOC 2",
      "cloud security",
      "IAM"
    ],
    formattingTips: [
      "Put certifications (Security+, GIAC, OSCP) directly under the summary if you have fewer than 5 years of experience",
      "Quantify incidents handled and detection/response times; security runs on these numbers",
      "Separate defensive, offensive, and governance experience so screeners can route you correctly",
      "Keep classified or employer-restricted details generic; describe scope, not secrets"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Washington, DC | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Cybersecurity analyst with 5 years in SOC and incident response. Cut mean time to detect from 9 hours to 40 minutes by rebuilding SIEM rules, and led response for 30+ confirmed incidents with zero data loss.

PROFESSIONAL EXPERIENCE
Senior Security Analyst | Bastion Health | 2022 - Present
- Rebuilt SIEM correlation rules, cutting mean time to detect from 9 hours to 40 minutes across 5,000 endpoints.
- Led containment of a ransomware attempt in under 90 minutes, resulting in zero data loss and 4 hours of downtime.
- Owned SOC 2 Type II evidence for 11 controls, achieving zero exceptions across two annual audits.

Security Analyst | Clearwatch SOC | 2019 - 2022
- Triaged 200+ daily alerts, escalating 3% with a documented 98% true-positive rate.
- Reduced critical vulnerabilities open beyond SLA from 40 to 3 through automated patch tracking.
- Ran quarterly phishing simulations, raising employee report rates from 31% to 76%.

SKILLS
Splunk, Microsoft Sentinel, CrowdStrike EDR, Burp Suite, Python, AWS IAM, NIST CSF, ISO 27001

CERTIFICATIONS
GIAC GCIH, CompTIA Security+, AWS Security Specialty`,
    faq: [
      {
        question: "What certifications help a cybersecurity resume most?",
        answer:
          "Security+ for entry level, GIAC (GCIH, GCIA) for incident response and SOC roles, OSCP for offensive work, and CISSP once you meet the experience requirement. Match the certification to the job family, not the trend."
      },
      {
        question: "How do I show security experience without revealing sensitive details?",
        answer:
          "Describe scope and outcomes: endpoint counts, incident categories, detection times, audit results. Avoid client names, exploit details, and internal tooling specifics."
      },
      {
        question: "Can I move into security from IT or development?",
        answer:
          "Yes, and your resume should bridge deliberately: automation you wrote, incidents you supported, secure coding or hardening you did. Security teams value builders who understand systems."
      }
    ],
    relatedRoles: ["devops-engineer", "backend-developer", "software-engineer"],
    relatedGuides: ["ats-resume-guide", "how-to-write-resume-bullet-points", "resume-skills"]
  },
  {
    slug: "data-scientist",
    role: "Data Scientist",
    category: "data",
    title: "Data Scientist Resume Example (With Tips)",
    description:
      "Data scientist resume example with modeling, experimentation, and business impact bullet samples, ATS keywords for ML and analytics roles, and formatting tips that survive both ATS and technical screens.",
    introduction:
      "This page is for data scientists applying to product, growth, or ML teams. Data science resumes fail when they list models instead of decisions influenced. The strongest resumes connect analysis to business outcomes: revenue influenced, metrics moved, experiments run, and models deployed to production with measured lift.",
    skills: [
      { label: "Analysis", items: ["Python", "SQL", "pandas", "A/B testing", "Causal inference"] },
      { label: "Modeling", items: ["scikit-learn", "XGBoost", "PyTorch", "forecasting"] },
      { label: "Engineering", items: ["Airflow", "dbt", "Spark", "Git"] },
      { label: "Communication", items: ["Executive reporting", "Dashboards", "Experiment design", "Data storytelling"] }
    ],
    summaryExample: {
      text: "Data scientist with 4 years turning product data into decisions at scale. Designed 40+ A/B tests influencing $6M in annual revenue, and deployed a churn model that cut monthly churn 1.8 points by triggering targeted retention offers.",
      why: "Experiments run, money influenced, and a model in production with a measured effect. It answers the question every DS hiring manager asks: 'so what?'"
    },
    bulletExamples: [
      {
        bad: "Built machine learning models to predict customer behavior.",
        good: "Deployed an XGBoost churn model scoring 2M customers weekly; retention offers triggered by it cut monthly churn from 4.1% to 2.3%.",
        why: "Model type, scale, and the business metric it moved. The bad line describes homework; the good line describes production impact."
      },
      {
        bad: "Analyzed A/B test results for the product team.",
        good: "Designed and analyzed 40+ A/B tests per year, catching a flawed winning variant that would have cost an estimated $300k in annual support costs.",
        why: "It shows experiment design ownership and judgment (catching a bad result), which separates scientists from tool operators."
      },
      {
        bad: "Created dashboards for stakeholders.",
        good: "Built the company's first self-serve metrics layer in dbt and Looker, adopted by 60 weekly users and cutting ad-hoc analysis requests 55%.",
        why: "Adoption and request reduction show leverage. Dashboards nobody uses appear on thousands of resumes; measured adoption appears on few."
      }
    ],
    commonMistakes: [
      "Listing algorithms (random forest, LSTM) without the decision or metric they influenced",
      "No experiment statistics: test counts, lift sizes, significance handling",
      "Kaggle projects presented as work experience",
      "Omitting SQL, still the most-screened data science skill",
      "Describing data cleaning in loving detail while burying the result it enabled"
    ],
    atsKeywords: [
      "data scientist",
      "machine learning",
      "A/B testing",
      "Python",
      "SQL",
      "statistical modeling",
      "experimentation",
      "predictive modeling",
      "data pipeline",
      "causal inference",
      "dashboard",
      "product analytics"
    ],
    formattingTips: [
      "Structure bullets as: action, dataset/scale, decision or metric influenced",
      "Put your strongest production model or influential analysis first, not your most recent task",
      "Keep a short 'technical toolkit' line rather than a full-page skills matrix",
      "Link a portfolio or blog post if your best work is behind company walls"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Toronto, CA | github.com/alexmorgan

PROFESSIONAL SUMMARY
Data scientist with 4 years turning product data into decisions. Designed 40+ A/B tests influencing $6M in annual revenue and deployed a churn model that cut monthly churn 1.8 points.

PROFESSIONAL EXPERIENCE
Data Scientist | Maplestream | 2022 - Present
- Deployed an XGBoost churn model scoring 2M customers weekly; retention offers triggered by it cut monthly churn from 4.1% to 2.3%.
- Designed and analyzed 40+ A/B tests per year, catching a flawed winning variant that would have added $300k in annual support costs.
- Partnered with pricing to build an elasticity model that informed a repricing strategy lifting gross margin 2.1 points.

Junior Data Scientist | Northlight Analytics | 2020 - 2022
- Built the company's first self-serve metrics layer (dbt, Looker), adopted by 60 weekly users, cutting ad-hoc requests 55%.
- Automated weekly executive reporting in Python, saving 12 analyst hours per week.

SKILLS
Python, SQL, pandas, scikit-learn, XGBoost, PyTorch, Airflow, dbt, Looker, A/B testing, causal inference

EDUCATION
M.Sc. Statistics, University of Toronto, 2020`,
    faq: [
      {
        question: "Should a data science resume include every model I have built?",
        answer:
          "No. Include the models that reached production or changed a decision, with their measured effect. A resume listing ten experiments with no outcomes reads as unfocused; two deployed models with business impact reads as senior."
      },
      {
        question: "How important is SQL for data scientist resumes?",
        answer:
          "Critical. SQL remains the most commonly screened data skill. Show it implicitly through scale ('analyzed 400M-row event data') and list it in skills even if it feels basic."
      },
      {
        question: "Do Kaggle competitions belong on a data science resume?",
        answer:
          "Only with strong results (top percentile) and framed briefly. One line maximum. Hiring managers weight production impact and experiments far more."
      }
    ],
    relatedRoles: ["data-analyst", "product-manager", "software-engineer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "resume-mistakes"]
  },
  {
    slug: "data-analyst",
    role: "Data Analyst",
    category: "data",
    title: "Data Analyst Resume Example (With Tips)",
    description:
      "Data analyst resume example with SQL, dashboard, and stakeholder bullet samples, ATS keywords for analytics roles, and formatting tips that show business impact, not just report production.",
    introduction:
      "This page is for data analysts at any level. Analyst resumes are screened for SQL depth, dashboard and reporting ownership, and the decisions your analysis supported. The most common weakness is listing reports produced; the strongest resumes list questions answered and what changed because of the answer.",
    skills: [
      { label: "Core", items: ["SQL", "Excel (advanced)", "Python", "Statistics"] },
      { label: "Visualization", items: ["Tableau", "Power BI", "Looker", "dbt"] },
      { label: "Practices", items: ["KPI definition", "Cohort analysis", "Funnel analysis", "A/B test support"] },
      { label: "Stakeholders", items: ["Executive reporting", "Requirement gathering", "Data storytelling"] }
    ],
    summaryExample: {
      text: "Data analyst with 3 years supporting a 20-person commercial team. Built the revenue dashboard used in every weekly leadership meeting and identified a pricing error that recovered $180k in annual recurring revenue.",
      why: "Two concrete artifacts with consequences: a dashboard leadership depends on and an analysis with direct revenue recovery. No fluff, no tool lists."
    },
    bulletExamples: [
      {
        bad: "Created reports and dashboards for stakeholders.",
        good: "Built and maintained the revenue dashboard used in weekly leadership meetings, replacing 6 manual spreadsheets and saving 15 hours of analyst time weekly.",
        why: "It names the audience, the thing replaced, and the time saved. 'Created dashboards' says nothing about adoption or value."
      },
      {
        bad: "Analyzed sales data to find insights.",
        good: "Investigated a 3% regional revenue drop and traced it to a misconfigured discount rule, recovering $180k in annual recurring revenue.",
        why: "A specific question, a root cause, and money recovered. This is the difference between analysis and reporting."
      },
      {
        bad: "Responsible for data quality checks.",
        good: "Wrote 60+ dbt tests covering revenue-critical models, catching 4 pipeline bugs before they reached executive reporting in the first quarter.",
        why: "It shows proactive engineering practice and the incidents prevented, which is what analytics managers actually need."
      }
    ],
    commonMistakes: [
      "Listing every chart ever made instead of the decisions they enabled",
      "No SQL evidence: query complexity, data volume, or optimization",
      "Tool lists (Excel, Tableau) with no business context attached",
      "Ignoring data quality work, which is a major real-world analyst responsibility",
      "Vocabulary mismatch with the posting (e.g., saying 'reports' when the role says 'analytics')"
    ],
    atsKeywords: [
      "data analyst",
      "SQL",
      "Tableau",
      "Power BI",
      "Excel",
      "data visualization",
      "reporting",
      "KPI",
      "dashboard",
      "cohort analysis",
      "ETL",
      "stakeholder management"
    ],
    formattingTips: [
      "Lead each bullet with the business question or artifact, then the tool, then the result",
      "Quantify data scale (rows, sources, refresh cadence) to show real-world complexity",
      "Include one 'caught a problem' story; analysts are hired to protect decision quality",
      "Match the posting's exact tool names (Power BI vs Tableau) in your skills line"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Chicago, IL | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Data analyst with 3 years supporting a 20-person commercial team. Built the revenue dashboard used in weekly leadership meetings and identified a pricing error that recovered $180k in annual recurring revenue.

PROFESSIONAL EXPERIENCE
Data Analyst | Great Lakes Retail Group | 2022 - Present
- Built and maintained the revenue dashboard used in weekly leadership meetings, replacing 6 manual spreadsheets and saving 15 analyst hours weekly.
- Investigated a 3% regional revenue drop and traced it to a misconfigured discount rule, recovering $180k in annual recurring revenue.
- Wrote 60+ dbt tests on revenue-critical models, catching 4 pipeline bugs before executive reporting.

Junior Data Analyst | Midwest Logistics | 2020 - 2022
- Automated carrier invoice reconciliation in SQL and Python, flagging $95k in duplicate charges in year one.
- Delivered cohort retention analysis that reshaped the loyalty program, lifting 90-day repeat purchase rate 8%.

SKILLS
SQL, Python, Excel, Tableau, Power BI, dbt, Looker, cohort analysis, funnel analysis

EDUCATION
B.B.A. Information Systems, University of Illinois, 2020`,
    faq: [
      {
        question: "What skills belong on a data analyst resume?",
        answer:
          "SQL first, then the visualization tool in the job posting (Tableau or Power BI), spreadsheet skills, a scripting language (Python or R), and analysis methods like cohort, funnel, and A/B test support."
      },
      {
        question: "How do I show impact as a data analyst?",
        answer:
          "Tie analyses to decisions: revenue recovered, costs cut, programs changed, hours saved. If you only produced reports, describe their audience, cadence, and the manual work they replaced."
      },
      {
        question: "Should I include Excel on a modern analyst resume?",
        answer:
          "Yes when the posting mentions it or the industry is finance, retail, or operations. Say what you did in it (modeling, reconciliation, Power Query) rather than listing it bare."
      }
    ],
    relatedRoles: ["data-scientist", "product-manager", "marketing-manager"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-skills", "resume-mistakes"]
  },
  {
    slug: "product-manager",
    role: "Product Manager",
    category: "product-design",
    title: "Product Manager Resume Example (With Tips)",
    description:
      "Product manager resume example showing how to present shipped products, metrics owned, and cross-functional leadership, with summary samples, ATS keywords, and PM-specific formatting tips.",
    introduction:
      "This page is for product managers applying to B2B or consumer teams. PM resumes are judged on outcomes you owned: metrics moved, products shipped, decisions made under uncertainty. The most common failure is writing a team's achievements without showing your specific decisions and their results.",
    skills: [
      { label: "Discovery", items: ["User research", "Opportunity sizing", "Jobs-to-be-done", "Roadmapping"] },
      { label: "Delivery", items: ["Agile", "Backlog ownership", "A/B testing", "Launch management"] },
      { label: "Analytics", items: ["Funnel analysis", "Retention metrics", "SQL basics", "Experiment reading"] },
      { label: "Leadership", items: ["Stakeholder alignment", "Engineering partnership", "Executive communication"] }
    ],
    summaryExample: {
      text: "Product manager with 5 years owning B2B SaaS products through growth stage. Owned the self-serve onboarding redesign that lifted trial-to-paid conversion from 9% to 15% and grew the platform from $2M to $5M ARR in two years.",
      why: "Conversion metric with before/after, plus revenue growth during tenure. It shows ownership of both a feature and a business line."
    },
    bulletExamples: [
      {
        bad: "Managed the product roadmap and worked with engineering.",
        good: "Prioritized a 12-month roadmap with 3 squads, cutting time-to-launch for enterprise features from 9 months to 4 by killing 2 low-impact initiatives.",
        why: "It shows a decision (killing work), a mechanism, and a speed result. Roadmap ownership without decisions is just calendar management."
      },
      {
        bad: "Improved user engagement through new features.",
        good: "Redesigned onboarding around a 4-step activation checklist, lifting trial-to-paid conversion from 9% to 15% and adding $600k ARR.",
        why: "Specific change, specific metric, specific money. PM bullets live or die on this triangle."
      },
      {
        bad: "Conducted user research and gathered requirements.",
        good: "Ran 40+ customer interviews that killed a planned ERP integration and redirected the quarter to an API product now 22% of new revenue.",
        why: "Research that changed strategy is worth ten research bullets that produced decks. It also shows courage, which PM screens probe for."
      }
    ],
    commonMistakes: [
      "Claiming team outcomes ('grew revenue 300%') without your specific role in the outcome",
      "Listing responsibilities (wrote PRDs, ran standups) instead of decisions and results",
      "No baseline numbers: 'improved conversion' means nothing without the before state",
      "Feature laundry lists with no user or business metric attached to any of them",
      "Ignoring failed experiments, which often demonstrate the strongest PM judgment"
    ],
    atsKeywords: [
      "product manager",
      "roadmap",
      "product strategy",
      "A/B testing",
      "user research",
      "KPIs",
      "go-to-market",
      "agile",
      "stakeholder management",
      "B2B SaaS",
      "product-led growth",
      "backlog"
    ],
    formattingTips: [
      "Give each role a one-line scope statement: product, revenue, team size",
      "Use metric-first bullets: 'Lifted X from A to B by doing C'",
      "Include one strategic kill or pivot decision; PMs are paid to choose",
      "Keep education short; PM interviews barely touch it after your first job"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Austin, TX | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Product manager with 5 years owning B2B SaaS products through growth stage. Owned the onboarding redesign that lifted trial-to-paid conversion from 9% to 15% and grew the platform from $2M to $5M ARR.

PROFESSIONAL EXPERIENCE
Product Manager, Growth | Beaconly | 2022 - Present
- Redesigned onboarding around a 4-step activation checklist, lifting trial-to-paid conversion from 9% to 15% and adding $600k ARR.
- Ran 40+ customer interviews that killed a planned ERP integration and redirected the quarter to an API product now 22% of new revenue.
- Owned pricing experiments with finance, raising average contract value 11% with under 2% logo churn.

Product Manager | Beaconly | 2019 - 2022
- Prioritized a 12-month roadmap with 3 squads, cutting enterprise feature launch time from 9 months to 4 by killing 2 low-impact initiatives.
- Launched usage-based billing with engineering and finance, enabling $1.4M in expansion revenue.

SKILLS
Product strategy, roadmapping, A/B testing, user research, SQL, funnel and retention analysis, go-to-market, agile

EDUCATION
B.B.A. Marketing, University of Texas at Austin, 2019`,
    faq: [
      {
        question: "How do I quantify impact as a product manager?",
        answer:
          "Use before/after metrics for things you shipped (conversion, retention, ARR, activation) and scope statements for ownership (product line, revenue, team size). Every feature bullet should end in a number."
      },
      {
        question: "Should PM resumes mention engineering collaboration?",
        answer:
          "Show it through outcomes and speed ('cut launch time from 9 to 4 months with 3 squads') rather than the generic 'worked closely with engineering'."
      },
      {
        question: "How long should a product manager resume be?",
        answer:
          "One to two pages. Under 8 years of experience, one page forces the discipline PMs are hired for: choosing what matters."
      }
    ],
    relatedRoles: ["data-analyst", "ux-designer", "marketing-manager", "project-manager"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "resume-mistakes"]
  },
  {
    slug: "ux-designer",
    role: "UX Designer",
    category: "product-design",
    title: "UX Designer Resume Example (With Tips)",
    description:
      "UX designer resume example with research and usability bullet samples, portfolio guidance, ATS keywords for design roles, and formatting tips that get UX resumes past both ATS and design leads.",
    introduction:
      "This page is for UX designers and researchers. UX resumes are read by design leads who want evidence of process quality and outcomes: research that changed decisions, usability results, and shipped flows with measured improvement. The resume's job is to earn the portfolio click; the portfolio's job is the interview.",
    skills: [
      { label: "Research", items: ["Usability testing", "Interviews", "Surveys", "Journey mapping"] },
      { label: "Design", items: ["Wireframing", "Prototyping", "Figma", "Design systems"] },
      { label: "Validation", items: ["A/B testing", "Accessibility (WCAG)", "Analytics (Amplitude)"] },
      { label: "Collaboration", items: ["Design ops", "Workshops", "Developer handoff", "Content design"] }
    ],
    summaryExample: {
      text: "UX designer with 4 years designing data-heavy B2B products. Led the redesign of a claims workflow that cut task completion time 38% and support tickets 25%, based on 30+ usability sessions. Comfortable from research plan to shipped, tested flow.",
      why: "It names the product domain, ties research volume to two measured outcomes, and closes with end-to-end capability, the trifecta design leads scan for."
    },
    bulletExamples: [
      {
        bad: "Designed user interfaces and improved user experience.",
        good: "Redesigned a 9-step claims flow to 4 steps after 12 usability sessions, cutting completion time 38% and support tickets 25%.",
        why: "Research input, design decision, and two measured outcomes. 'Improved UX' is unprovable; this is not."
      },
      {
        bad: "Conducted user research and created personas.",
        good: "Ran 30+ interviews and usability sessions across 3 quarters; findings killed a planned feature and redirected capacity to a reporting gap cited by 60% of users.",
        why: "Research that changed the roadmap shows influence. Personas without decisions are decoration."
      },
      {
        bad: "Worked with developers to implement designs.",
        good: "Built a Figma component system with 80+ variants and documented states, cutting design-to-dev QA back-and-forth by half over two release cycles.",
        why: "It measures collaboration quality with a concrete operational result, which matters to design-ops-mature teams."
      }
    ],
    commonMistakes: [
      "No portfolio link, or a portfolio link buried at the bottom",
      "Process words (empathize, ideate, iterate) with no outcomes attached",
      "Claiming metrics the designer cannot explain in an interview",
      "Ignoring accessibility, now a screening requirement at most product companies",
      "A resume as visually experimental that the ATS cannot parse; save the creativity for the portfolio"
    ],
    atsKeywords: [
      "UX designer",
      "user experience",
      "user research",
      "usability testing",
      "Figma",
      "prototyping",
      "wireframes",
      "design system",
      "accessibility",
      "WCAG",
      "information architecture",
      "interaction design"
    ],
    formattingTips: [
      "Put the portfolio URL at the top, and make the case studies measurable",
      "Keep the resume layout conservative and single-column for ATS; creativity lives in the portfolio",
      "Every project bullet: research input, design change, measured outcome",
      "Name your tools but let outcomes carry the bullets"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Portland, OR | alexmorgan-design.portfolio.site

PROFESSIONAL SUMMARY
UX designer with 4 years designing data-heavy B2B products. Led the redesign of a claims workflow that cut task completion time 38% and support tickets 25%, based on 30+ usability sessions.

PROFESSIONAL EXPERIENCE
UX Designer | Claimly | 2022 - Present
- Redesigned a 9-step claims flow to 4 steps after 12 usability sessions, cutting completion time 38% and support tickets 25%.
- Ran 30+ interviews and usability sessions; findings killed a planned feature and redirected capacity to a gap cited by 60% of users.
- Built a Figma component system with 80+ documented variants, cutting design-to-dev QA cycles by half.

Junior UX Designer | Fieldnote Software | 2020 - 2022
- Led usability testing for a mobile field app used by 2,000 technicians, raising task success rate from 71% to 93%.
- Shipped WCAG 2.1 AA fixes across 40 screens, passing external accessibility audit.

SKILLS
Figma, usability testing, journey mapping, prototyping, design systems, WCAG 2.1, Amplitude, Miro

EDUCATION
B.F.A. Interaction Design, Pacific Northwest College of Art, 2020`,
    faq: [
      {
        question: "Do UX designers need a portfolio or is a resume enough?",
        answer:
          "A portfolio is mandatory for most UX roles. The resume's job is to win the click: lead with measurable outcomes that make a design lead want to see the case studies behind them."
      },
      {
        question: "How do I quantify UX work?",
        answer:
          "Use task completion rates, time on task, error or ticket rates, conversion, accessibility audit results, and research volume that changed decisions. Only claim numbers you can walk an interviewer through."
      },
      {
        question: "Should a UX resume be designed differently from other resumes?",
        answer:
          "Keep it clean and single-column so ATS can parse it. Subtle typographic care is fine; elaborate layouts get truncated by parsers and annoy the design leads reading for substance."
      }
    ],
    relatedRoles: ["ui-designer", "product-manager", "react-developer", "marketing-manager"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-mistakes", "how-to-write-a-resume-summary"]
  },
  {
    slug: "ui-designer",
    role: "UI Designer",
    category: "product-design",
    title: "UI Designer Resume Example (With Tips)",
    description:
      "UI designer resume example with visual design and design system bullet samples, portfolio and ATS keywords, and formatting tips for interface design roles at product companies and agencies.",
    introduction:
      "This page is for UI designers focusing on visual interface design, design systems, and front-end-adjacent craft. UI resumes are judged on visual evidence and shipped surface area: components designed, products styled, consistency achieved. Like UX roles, the resume wins the portfolio click; specificity about shipped work wins the interview.",
    skills: [
      { label: "Visual", items: ["Typography", "Color systems", "Layout & grid", "Iconography"] },
      { label: "Tools", items: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping"] },
      { label: "Systems", items: ["Design tokens", "Component libraries", "Dark mode", "Responsive design"] },
      { label: "Delivery", items: ["Developer handoff", "Design QA", "Motion basics", "Brand guidelines"] }
    ],
    summaryExample: {
      text: "UI designer with 4 years designing product interfaces and design systems for SaaS and fintech. Built a token-based component library covering 120+ components across web and mobile, and redesigned a fintech dashboard that lifted daily active usage 19%.",
      why: "Systems scale (120+ components), platform range, and a usage outcome. It shows both craft and product sense, which UI screens look for together."
    },
    bulletExamples: [
      {
        bad: "Designed screens and visual assets for the product.",
        good: "Designed 60+ production screens for a fintech platform across web and iOS, maintaining a 98% developer handoff acceptance rate.",
        why: "Volume, platforms, and a quality metric that matters to teams (handoff acceptance). 'Designed screens' has no scale or standard."
      },
      {
        bad: "Created and maintained the design system.",
        good: "Built a token-based design system of 120+ components with dark mode, cutting new-screen design time 40% and visual QA bugs 55%.",
        why: "System scope plus the two costs it reduced. Design systems are leverage; this bullet proves the leverage was real."
      },
      {
        bad: "Improved the visual design of the app.",
        good: "Led a visual refresh of the core dashboard: new type scale, spacing system, and chart styles, lifting daily active usage 19% in the following quarter.",
        why: "It names the specific craft decisions and ties them to a usage metric, connecting visual work to product results."
      }
    ],
    commonMistakes: [
      "A text-only resume for a visual role with no portfolio URL at the top",
      "Dribbble-style shots presented without product context or outcomes",
      "Listing Photoshop-era tooling first when the posting is Figma-first",
      "No design system experience shown, despite it being a top UI hiring filter",
      "Inconsistent personal branding between resume, portfolio, and LinkedIn"
    ],
    atsKeywords: [
      "UI designer",
      "interface design",
      "Figma",
      "design system",
      "component library",
      "design tokens",
      "typography",
      "responsive design",
      "prototyping",
      "visual design",
      "dark mode",
      "design QA"
    ],
    formattingTips: [
      "Portfolio link first, resume second; UI hiring starts with visual evidence",
      "Quantify shipped surface: screens, components, platforms",
      "Show system thinking (tokens, variants, states) not just one-off screens",
      "Keep the resume itself typographically clean; it is your first work sample"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Lisbon, PT | alexmorgan-design.portfolio.site

PROFESSIONAL SUMMARY
UI designer with 4 years designing product interfaces and design systems for SaaS and fintech. Built a token-based library of 120+ components across web and mobile and redesigned a fintech dashboard that lifted daily active usage 19%.

PROFESSIONAL EXPERIENCE
UI Designer | Finlytics | 2022 - Present
- Built a token-based design system of 120+ components with dark mode, cutting new-screen design time 40% and visual QA bugs 55%.
- Led a visual refresh of the core dashboard (type scale, spacing, chart styles), lifting daily active usage 19%.
- Designed 60+ production screens across web and iOS with a 98% developer handoff acceptance rate.

UI Designer | Studio Marca | 2020 - 2022
- Designed marketing sites and product UI for 12 agency clients, from wireframe to developer-ready specs.
- Created the agency's Figma component starter kit, now used on every new client project.

SKILLS
Figma, design tokens, component libraries, typography, color systems, prototyping, Adobe Creative Suite, dark mode

EDUCATION
B.A. Graphic Design, University of Lisbon, 2020`,
    faq: [
      {
        question: "What is the difference between a UI and UX resume?",
        answer:
          "UI resumes emphasize visual craft, design systems, and shipped screens; UX resumes emphasize research, flows, and measured behavior change. Both need portfolios, but the bullet evidence differs."
      },
      {
        question: "How many projects should a UI design portfolio have?",
        answer:
          "Three to five strong case studies with product context and outcomes. Ten shallow visual dumps weaken a UI application; depth and shipped evidence win."
      },
      {
        question: "Do UI designers need to know code?",
        answer:
          "Not required, but understanding CSS layout, tokens, and component states makes handoff dramatically smoother and is increasingly listed as a plus in UI job postings."
      }
    ],
    relatedRoles: ["ux-designer", "frontend-developer", "react-developer", "marketing-manager"],
    relatedGuides: ["resume-skills", "how-to-write-resume-bullet-points", "resume-mistakes"]
  },
  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    category: "business",
    title: "Marketing Manager Resume Example (With Tips)",
    description:
      "Marketing manager resume example with campaign, growth, and budget bullet samples, ATS keywords for marketing roles, and formatting tips that show revenue impact instead of activity lists.",
    introduction:
      "This page is for marketing managers across growth, brand, demand gen, or product marketing. Marketing resumes are screened for pipeline and revenue contribution, budget ownership, and channel depth. Activity lists ('ran campaigns', 'managed social media') are the fastest way to blend in with every other applicant.",
    skills: [
      { label: "Acquisition", items: ["SEO", "Paid search", "Paid social", "Lifecycle email"] },
      { label: "Analytics", items: ["GA4", "HubSpot", "Funnel metrics", "Attribution", "A/B testing"] },
      { label: "Content", items: ["Content strategy", "Positioning", "Copywriting", "Webinars"] },
      { label: "Leadership", items: ["Budget ownership", "Agency management", "Cross-functional launches"] }
    ],
    summaryExample: {
      text: "Marketing manager with 6 years owning demand generation for B2B SaaS. Grew qualified pipeline 62% in two years on a flat $800k budget by rebuilding lifecycle email and shifting spend to bottom-funnel search, cutting cost per SQL 34%.",
      why: "Pipeline growth, budget discipline, and efficiency gains in one paragraph. Every B2B marketing screen looks for these three numbers."
    },
    bulletExamples: [
      {
        bad: "Managed marketing campaigns across multiple channels.",
        good: "Owned a $800k annual budget across paid search, social, and events, cutting cost per SQL 34% by reallocating 20% of spend to bottom-funnel search.",
        why: "Budget, decision, and efficiency result. 'Multiple channels' with no numbers could describe an intern's summer."
      },
      {
        bad: "Responsible for email marketing and newsletters.",
        good: "Rebuilt lifecycle email into 14 behavior-triggered sequences, lifting trial-to-paid conversion 27% and generating $1.1M in attributed revenue.",
        why: "Scope (14 sequences), conversion lift, and attributed revenue turn a chore into a growth channel."
      },
      {
        bad: "Worked with sales to generate leads.",
        good: "Aligned with sales on an MQL-to-SQL service level agreement, raising marketing-sourced win rate from 18% to 26% in three quarters.",
        why: "It shows cross-team leadership measured at the metric both teams care about, which is what senior marketing screens probe."
      }
    ],
    commonMistakes: [
      "Listing channels managed without spend, pipeline, or revenue attached",
      "Vanity metrics (impressions, followers) presented as achievements",
      "No attribution method mentioned, leaving claims unverifiable",
      "Generic summaries that could belong to any marketing role in any industry",
      "Hiding budget ownership, the clearest signal of marketing seniority"
    ],
    atsKeywords: [
      "marketing manager",
      "demand generation",
      "SEO",
      "paid media",
      "conversion rate",
      "marketing funnel",
      "HubSpot",
      "GA4",
      "lifecycle marketing",
      "content strategy",
      "go-to-market",
      "pipeline"
    ],
    formattingTips: [
      "Attach a number to every channel: spend, pipeline, conversion, or efficiency",
      "State your attribution approach once so metric claims have a method",
      "Lead with revenue-adjacent results before activity or content work",
      "Match seniority to budget: if you owned budget, put the figure in the summary"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Denver, CO | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Marketing manager with 6 years owning demand generation for B2B SaaS. Grew qualified pipeline 62% in two years on a flat $800k budget, cutting cost per SQL 34%.

PROFESSIONAL EXPERIENCE
Marketing Manager, Demand Gen | Cloudpine | 2021 - Present
- Owned an $800k annual budget across paid search, social, and events; cut cost per SQL 34% by reallocating 20% of spend to bottom-funnel search.
- Rebuilt lifecycle email into 14 behavior-triggered sequences, lifting trial-to-paid conversion 27% and generating $1.1M attributed revenue.
- Aligned with sales on MQL-to-SQL SLAs, raising marketing-sourced win rate from 18% to 26%.

Marketing Specialist | Cloudpine | 2018 - 2021
- Grew organic traffic 140% in 18 months through a topic-cluster SEO strategy and 60+ published assets.
- Launched the company webinar program, producing 32 sessions and 4,200 MQLs at $11 per lead.

SKILLS
SEO, paid search, paid social, lifecycle email, HubSpot, GA4, attribution, content strategy, webinar programs

EDUCATION
B.B.A. Marketing, University of Colorado, 2018`,
    faq: [
      {
        question: "What metrics matter most on a marketing manager resume?",
        answer:
          "Pipeline or revenue generated, cost per lead or SQL, conversion rates, and budget owned. Vanity metrics like impressions only support a story; they cannot be the story."
      },
      {
        question: "How do I show marketing impact if attribution is messy?",
        answer:
          "State your method and use directional ranges: 'self-reported attribution plus first-touch modeling showed...'. Hiring managers trust claimed numbers more when the measurement approach is named."
      },
      {
        question: "Should I include social media management on a marketing manager resume?",
        answer:
          "Only with business outcomes attached: leads, revenue, or audience-to-pipeline conversion. Bare 'managed social channels' reads as junior for a manager-level role."
      }
    ],
    relatedRoles: ["product-manager", "data-analyst", "sales-representative", "ux-designer"],
    relatedGuides: ["how-to-write-resume-bullet-points", "how-to-write-a-resume-summary", "resume-action-verbs"]
  },
  {
    slug: "sales-representative",
    role: "Sales Representative",
    category: "business",
    title: "Sales Representative Resume Example (With Tips)",
    description:
      "Sales representative resume example with quota attainment and pipeline bullet samples, ATS keywords for sales roles, and formatting tips that prove you hit numbers, not just activity.",
    introduction:
      "This page is for sales development reps, account executives, and account managers. Sales resumes are the most numeric resumes in any company: quota, attainment, pipeline generated, deal size, cycle length. If your resume has fewer numbers than your CRM dashboard, it is underselling you.",
    skills: [
      { label: "Selling", items: ["Prospecting", "Discovery calls", "Negotiation", "Closing"] },
      { label: "Tools", items: ["Salesforce", "HubSpot", "Outreach", "LinkedIn Sales Navigator"] },
      { label: "Metrics", items: ["Quota attainment", "Pipeline coverage", "Win rate", "Average deal size"] },
      { label: "Motion", items: ["Inbound", "Outbound", "Channel sales", "Enterprise cycles"] }
    ],
    summaryExample: {
      text: "Account executive with 4 years in mid-market SaaS sales. Closed $2.3M in new ARR over the last two years at 112% of quota, with an average deal size of $48k and a 90-day sales cycle. President's Club in 2024.",
      why: "Revenue, attainment, deal economics, and a recognition signal. A sales leader can size you up in four seconds, which is exactly the point."
    },
    bulletExamples: [
      {
        bad: "Responsible for selling software to new and existing customers.",
        good: "Closed $1.2M in new ARR in 2024 at 118% of a $1M quota, ranking 2nd of 14 reps company-wide.",
        why: "Revenue, quota context, and rank. Sales resumes are comparative documents; this bullet makes comparison possible."
      },
      {
        bad: "Prospected and generated leads for the sales team.",
        good: "Built 45+ qualified opportunities per quarter through targeted outbound, feeding $3.8M of pipeline annually to account executives.",
        why: "Activity tied to pipeline value. SDR resumes live on qualified volume and its dollar equivalent."
      },
      {
        bad: "Maintained relationships with existing customers.",
        good: "Managed 60 renewal accounts worth $2.1M, lifting net revenue retention from 94% to 108% through structured QBRs and expansion plays.",
        why: "Book of business plus the retention metric you moved. Account management value is retention math, and this shows it."
      }
    ],
    commonMistakes: [
      "Describing duties ('prospected', 'cold called') without quota, attainment, or pipeline numbers",
      "Omitting quota context, making 100% attainment unreadable (easy quota or hard?)",
      "No CRM tool listed, which screens filter on for sales ops compatibility",
      "Rankings and President's Club awards left out, the strongest social proof in sales",
      "A generic objective statement instead of a numbers-first summary"
    ],
    atsKeywords: [
      "sales representative",
      "account executive",
      "quota attainment",
      "pipeline",
      "ARR",
      "CRM",
      "Salesforce",
      "prospecting",
      "closing",
      "business development",
      "SaaS sales",
      "territory management"
    ],
    formattingTips: [
      "Put quota and attainment in the summary; sales resumes are scanned for these first",
      "Every role needs at least two numbers: volume (deals, calls, accounts) and value (revenue, pipeline)",
      "Include rankings, clubs, and awards; they are instantly understood",
      "One page. Sales leaders respect brevity and hate digging"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Atlanta, GA | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Account executive with 4 years in mid-market SaaS sales. Closed $2.3M in new ARR over two years at 112% of quota, averaging $48k deals in a 90-day cycle. President's Club 2024.

PROFESSIONAL EXPERIENCE
Account Executive | Relayware SaaS | 2022 - Present
- Closed $1.2M in new ARR in 2024 at 118% of a $1M quota, ranking 2nd of 14 reps company-wide.
- Built a 3x pipeline coverage system through targeted outbound, exceeding pipeline goals 6 consecutive quarters.
- Shortened average sales cycle from 120 to 90 days by introducing mutual action plans on deals above $30k.

Sales Development Representative | Relayware SaaS | 2020 - 2022
- Generated 45+ qualified opportunities per quarter, feeding $3.8M of annual pipeline to account executives.
- Led the team in connect-to-meeting rate (12%) by rebuilding outreach sequences around trigger events.

SKILLS
Salesforce, Outreach, LinkedIn Sales Navigator, prospecting, discovery, negotiation, mutual close plans

EDUCATION
B.B.A. Finance, Georgia State University, 2020`,
    faq: [
      {
        question: "What numbers should every sales resume include?",
        answer:
          "Quota, attainment percentage, revenue or pipeline generated, and average deal size. Rankings and awards add context. If a number is confidential, use ranges or percentiles."
      },
      {
        question: "How do I write a sales resume with no quota yet?",
        answer:
          "Lead with activity-to-result conversion: dials to connects, connects to meetings, meetings to opportunities. SDR and entry-level screens hire on conversion efficiency and drive."
      },
      {
        question: "Should I list every sales tool I have used?",
        answer:
          "List the CRM and sequencing tools in the posting (Salesforce, HubSpot, Outreach) plus one or two differentiators. Tool fluency matters, but numbers close the interview."
      }
    ],
    relatedRoles: ["marketing-manager", "account-manager", "project-manager"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-action-verbs", "how-long-should-a-resume-be"]
  },
  {
    slug: "project-manager",
    role: "Project Manager",
    category: "business",
    title: "Project Manager Resume Example (With Tips)",
    description:
      "Project manager resume example with delivery, budget, and stakeholder bullet samples, ATS keywords including PMP and Agile, and formatting tips that show projects delivered on time and on budget.",
    introduction:
      "This page is for project managers and program managers. PM resumes are screened for delivery evidence: projects shipped on time and on budget, budgets managed, risks handled, and stakeholders aligned across functions. The strongest resumes treat every project like a case study with constraints, actions, and results.",
    skills: [
      { label: "Delivery", items: ["Project planning", "Risk management", "Agile & Scrum", "Waterfall"] },
      { label: "Tools", items: ["Jira", "Asana", "MS Project", "Smartsheet"] },
      { label: "Financial", items: ["Budget management", "Forecasting", "Vendor management"] },
      { label: "Leadership", items: ["Stakeholder alignment", "Executive reporting", "Cross-team facilitation"] }
    ],
    summaryExample: {
      text: "Project manager with 7 years delivering technology programs up to $3.5M. Led 14 cross-functional projects with a 93% on-time delivery rate, and rescued a failing ERP rollout, bringing it live 3 weeks late instead of the forecasted 6 months.",
      why: "Portfolio scale, a delivery rate, and a rescue story with a quantified save. It signals both steady delivery and crisis competence."
    },
    bulletExamples: [
      {
        bad: "Managed projects from start to finish and coordinated teams.",
        good: "Directed a $1.2M, 9-month platform migration across 4 vendors and 30 staff, delivering 2 weeks early and 6% under budget.",
        why: "Budget, duration, scope, and the two numbers every PM is hired for: on time, on budget."
      },
      {
        bad: "Handled project risks and issues.",
        good: "Built a risk register and escalation model across 6 concurrent projects, cutting Sev-1 delivery blockers from 5 per quarter to 1.",
        why: "It shows a system you created and the incident reduction it caused, not just participation in risk meetings."
      },
      {
        bad: "Communicated with stakeholders regularly.",
        good: "Ran steering committees for a 12-stakeholder ERP program, securing 3 scope decisions in one session that saved an estimated 400 hours of rework.",
        why: "Governance with an outcome. Stakeholder communication becomes valuable when it produces decisions, and this bullet proves it."
      }
    ],
    commonMistakes: [
      "Listing methodology certifications while every bullet stays activity-based",
      "No budget or team-size figures, leaving project scale unreadable",
      "Every project 'delivered successfully' with no on-time/on-budget numbers",
      "Omitting rescued or failed projects, which show the judgment PMs are paid for",
      "Tool lists without governance evidence (reporting cadence, RAID logs, change control)"
    ],
    atsKeywords: [
      "project manager",
      "program management",
      "PMP",
      "agile",
      "scrum",
      "stakeholder management",
      "risk management",
      "budget",
      "on-time delivery",
      "Jira",
      "cross-functional",
      "change management"
    ],
    formattingTips: [
      "Give each project one line of scope: budget, duration, team, vendors",
      "Report the delivery record as a rate (93% on time), not just anecdotes",
      "Include one rescue or turnaround story; it differentiates quickly",
      "Certifications (PMP, CSM) under education; evidence above them"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Charlotte, NC | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Project manager with 7 years delivering technology programs up to $3.5M. 93% on-time delivery across 14 cross-functional projects; rescued a failing ERP rollout to go live 3 weeks late instead of 6 months.

PROFESSIONAL EXPERIENCE
Senior Project Manager | Piedmont Financial Group | 2021 - Present
- Directed a $1.2M, 9-month platform migration across 4 vendors and 30 staff, delivering 2 weeks early and 6% under budget.
- Built a risk register and escalation model across 6 concurrent projects, cutting Sev-1 delivery blockers from 5 per quarter to 1.
- Ran steering committees for a 12-stakeholder ERP program, securing 3 scope decisions in one session that saved 400 hours of rework.

Project Manager | Carolina Software Co. | 2017 - 2021
- Rescued a stalled ERP rollout, re-baselining scope with executives and going live 3 weeks late versus a forecasted 6-month slip.
- Managed a portfolio of 9 concurrent client implementations with a 95% on-time record and $2.8M combined budget.

SKILLS
Agile, Scrum, Waterfall, Jira, MS Project, Smartsheet, budget management, risk management, vendor management

CERTIFICATIONS
PMP, Certified ScrumMaster (CSM)`,
    faq: [
      {
        question: "What should a project manager resume include for each project?",
        answer:
          "Budget, duration, team size, and outcome: on-time/on-budget status or the variance explained. One line of scope plus one line of result per project keeps it readable."
      },
      {
        question: "Is PMP certification worth it for project managers?",
        answer:
          "For roles in construction, finance, government, and enterprise IT, yes. Agile certifications (CSM, PSM) carry more weight in software product companies. List them, but lead with delivery evidence."
      },
      {
        question: "How do I show failed or troubled projects on a resume?",
        answer:
          "Frame them as rescues: what you found, what you changed, and the recovered outcome. PM hiring managers trust a candidate who can discuss a turnaround far more than one with a spotless but vague record."
      }
    ],
    relatedRoles: ["product-manager", "devops-engineer", "sales-representative", "data-analyst"],
    relatedGuides: ["how-to-write-resume-bullet-points", "resume-action-verbs", "how-to-write-a-resume-summary"]
  },
  {
    slug: "student",
    role: "Student",
    category: "career-stage",
    title: "Student Resume Example (With Tips)",
    description:
      "Student resume example for university applications, internships, and first jobs. Includes a one-page template, project and coursework bullet samples, and formatting tips for students with limited experience.",
    introduction:
      "This page is for current students applying to internships, part-time jobs, and competitive programs. With limited work history, your resume runs on projects, coursework, leadership, and potential. The goal is not to look experienced; it is to look like the student who gets things done with what they have.",
    skills: [
      { label: "Technical", items: ["Course-relevant tools", "Python / Excel / Figma", "Git basics"] },
      { label: "Academic", items: ["Research", "Data analysis", "Technical writing", "Presentations"] },
      { label: "Leadership", items: ["Club roles", "Event organization", "Peer mentoring"] },
      { label: "Work habits", items: ["Time management", "Team collaboration", "Customer service"] }
    ],
    summaryExample: {
      text: "Third-year computer science student with two shipped apps (1,200 combined downloads) and a teaching assistant role for the intro programming course. Seeking a summer software internship where coursework in data structures and real project experience can contribute from week one.",
      why: "It replaces work history with proof of execution (shipped apps, TA role) and states a specific goal. For students, specificity is the entire game."
    },
    bulletExamples: [
      {
        bad: "Member of the computer science club.",
        good: "Organized a 12-week beginner coding workshop for the CS club, teaching 40 students and maintaining a 78% completion rate.",
        why: "A role becomes evidence when it has numbers. Attendance, output, and completion turn membership into initiative."
      },
      {
        bad: "Did a group project building an app for class.",
        good: "Led a 4-person team building a campus event app adopted by 3 student organizations, handling the backend and deployment.",
        why: "It shows your specific contribution, users, and outcome. Class projects are fine on student resumes when framed like real products."
      },
      {
        bad: "Good at time management and teamwork.",
        good: "Balanced 15 credit hours with 12 hours per week at a part-time job and a TA position, earning 'TA of the Semester' from course evaluations.",
        why: "The claim is demonstrated with context and a third-party signal instead of asserted as an adjective."
      }
    ],
    commonMistakes: [
      "A high-school-style resume listing every activity with no depth on any",
      "No projects section despite coursework projects being perfectly valid evidence",
      "Objective statements about what you want with nothing about what you offer",
      "Listing GPA only when strong; omitting it invites assumptions when it is above 3.5",
      "Two pages for what should be the tightest one-pager of your career"
    ],
    atsKeywords: [
      "student",
      "internship",
      "coursework",
      "research assistant",
      "teaching assistant",
      "projects",
      "leadership",
      "teamwork",
      "python",
      "excel",
      "time management",
      "dean's list"
    ],
    formattingTips: [
      "One page, always. Education goes first while you are a student",
      "Include a Projects section with 2-3 entries framed like jobs: role, contribution, outcome",
      "Add honors, scholarships, and dean's list as one compact line",
      "Tailor the summary's final sentence to each application type (internship, part-time, program)"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@university.edu | Phone: +1 555 010 0091 | Boston, MA | github.com/alexmorgan

EDUCATION
B.Sc. Computer Science, Boston University, Expected 2027
GPA: 3.8/4.0 | Dean's List: Fall 2024, Spring 2025
Relevant coursework: Data Structures, Databases, Web Development, Statistics

PROJECTS
CampusConnect - Event App
- Led a 4-person team building a campus event app adopted by 3 student organizations; built the backend and deployment.
- 1,200 combined downloads across two shipped apps on campus app stores.

Study Buddy - Matching Platform
- Built a study-group matching web app in React and Firebase for a database course; earned the top project grade.

EXPERIENCE
Teaching Assistant, CS 111 | Boston University | 2025 - Present
- Lead weekly labs for 30 students; earned 'TA of the Semester' from course evaluations.
Part-Time Barista | Brew & Co. | 2024 - Present
- Train new hires and manage peak-hour service, working 12 hours weekly alongside 15 credit hours.

LEADERSHIP
Workshop Lead, Computer Science Club
- Organized a 12-week beginner coding workshop for 40 students with a 78% completion rate.

SKILLS
Python, Java, React, Firebase, Git, Excel`,
    faq: [
      {
        question: "What should a student put on a resume with no work experience?",
        answer:
          "Projects, coursework, teaching or research assistant roles, club leadership, volunteering, and part-time jobs. Frame each with a contribution and a number, exactly as you would a full-time role."
      },
      {
        question: "Should students include GPA on a resume?",
        answer:
          "Include it if it is roughly 3.5 or above, or if the employer requests it. Below that, leave it off and let projects and leadership carry the page."
      },
      {
        question: "How long should a student resume be?",
        answer:
          "One page, no exceptions. Recruiters expect focus; a dense single page beats a stretched two pages every time at this stage."
      }
    ],
    relatedRoles: ["internship", "no-experience", "entry-level", "software-engineer"],
    relatedGuides: ["how-to-write-a-resume-with-no-experience", "how-to-write-a-resume", "how-long-should-a-resume-be"]
  },
  {
    slug: "internship",
    role: "Internship",
    category: "career-stage",
    title: "Internship Resume Example (With Tips)",
    description:
      "Internship resume example showing how students and career changers win internship offers, with project bullet samples, ATS keywords, and formatting tips tailored to internship applications.",
    introduction:
      "This page is for anyone applying to internships: students, recent graduates, and career changers testing a new field. Internship screening is fast and volume-heavy, so your resume must connect your existing evidence (coursework, projects, jobs in other fields) to the internship's requirements within seconds.",
    skills: [
      { label: "Field basics", items: ["Core tools of the target field", "Relevant coursework"] },
      { label: "Transferable", items: ["Communication", "Excel / data handling", "Customer interaction"] },
      { label: "Evidence", items: ["Personal projects", "Case competitions", "Volunteering"] },
      { label: "Habits", items: ["Reliability", "Fast learning", "Documentation"] }
    ],
    summaryExample: {
      text: "Second-year marketing student seeking a summer digital marketing internship. Runs a study-content Instagram account with 4,500 followers at 8% engagement and completed a semester-long analytics project using GA4 and Excel for a local nonprofit.",
      why: "It proves marketing behavior already happens (an account run with real engagement metrics) and names tools the internship posting will list."
    },
    bulletExamples: [
      {
        bad: "Interested in gaining marketing experience through an internship.",
        good: "Grew a study-content Instagram account to 4,500 followers with 8% engagement by posting 3 times weekly and testing posting times over 6 months.",
        why: "Interest becomes evidence when there is a metric and a method. Interns are hired on demonstrated initiative at small scale."
      },
      {
        bad: "Completed coursework relevant to the internship.",
        good: "Built a GA4 measurement plan and Excel dashboard for a local nonprofit in a semester project, identifying 2 channel reallocations that lifted inquiry form submissions 22%.",
        why: "Coursework framed as client work with a result reads like experience, which is exactly the translation internships reward."
      },
      {
        bad: "Hard worker with great communication skills.",
        good: "Balanced 20 weekly restaurant hours with 16 credit hours while maintaining dean's list standing for 3 semesters.",
        why: "Reliability is shown through a load-and-result fact, not adjectives. Screeners of internship piles look for exactly this kind of evidence."
      }
    ],
    commonMistakes: [
      "Writing an objective about what the internship will do for you",
      "Leaving off jobs like food service or retail that prove reliability employers actually value",
      "No numbers anywhere: follower counts, grades, hours, event attendance",
      "One generic resume sent to internships in different subfields",
      "Burying the target field's keywords because they came from coursework, not jobs"
    ],
    atsKeywords: [
      "internship",
      "intern",
      "coursework",
      "projects",
      "teamwork",
      "communication",
      "microsoft excel",
      "research",
      "part-time",
      "dean's list",
      "volunteer",
      "leadership"
    ],
    formattingTips: [
      "One page; education and projects lead, paid work follows",
      "Mirror the internship posting's exact keywords in your skills line",
      "Include availability (dates, hours) in the summary; screeners need it",
      "Add one line on why this field, shown through action not adjectives"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@university.edu | Phone: +1 555 010 0091 | Chicago, IL | linkedin.com/in/alexmorgan

EDUCATION
B.B.A. Marketing, DePaul University, Expected 2027
GPA: 3.7/4.0 | Dean's List: 3 semesters
Relevant coursework: Digital Marketing, Marketing Analytics, Consumer Behavior

PROJECTS & INITIATIVES
Study-Content Instagram Account
- Grew to 4,500 followers at 8% engagement through 3 weekly posts and 6 months of timing tests.
Nonprofit Analytics Project (Course-based)
- Built a GA4 measurement plan and Excel dashboard; identified 2 channel reallocations lifting form submissions 22%.

EXPERIENCE
Shift Lead | Luna Cafe | 2024 - Present
- Run peak-hour service and train 5 new hires, working 20 hours weekly alongside 16 credit hours.
Volunteer Tutor | Chicago Tutoring Collective | 2023 - Present
- Tutor 6 students weekly in algebra; 5 raised their grades within one semester.

SKILLS
GA4, Excel, Instagram & TikTok analytics, content calendars, Canva, survey design

AVAILABILITY
Full-time June-August; 15 hours weekly during fall semester`,
    faq: [
      {
        question: "What do internship recruiters look for in a resume?",
        answer:
          "Evidence of initiative at any scale, coursework aligned to the role, reliability, and availability. They are not expecting years of experience; they are screening for trajectory and follow-through."
      },
      {
        question: "Should I include unrelated part-time jobs on an internship resume?",
        answer:
          "Yes, briefly. Jobs in service or retail prove reliability, customer skills, and workload management. One or two lines each with a number is enough."
      },
      {
        question: "How do I write a resume for my first internship?",
        answer:
          "Lead with education and projects, translate coursework into deliverables, add any self-started initiative with metrics, and state your availability clearly in the summary."
      }
    ],
    relatedRoles: ["student", "no-experience", "entry-level", "marketing-manager"],
    relatedGuides: ["how-to-write-a-resume-with-no-experience", "how-to-write-a-resume", "resume-skills"]
  },
  {
    slug: "entry-level",
    role: "Entry-Level",
    category: "career-stage",
    title: "Entry-Level Resume Example (With Tips)",
    description:
      "Entry-level resume example for graduates with 0-2 years of experience. Includes summary and bullet samples, ATS keywords, and formatting tips that turn limited experience into a competitive resume.",
    introduction:
      "This page is for graduates and early-career professionals with up to two years of experience applying to full-time roles. Entry-level screening looks for trajectory: internships converted, skills applied, responsibility earned quickly. Your resume should show a slope, not just a starting point.",
    skills: [
      { label: "Role skills", items: ["The 3-4 tools your target job lists", "Core methods of the field"] },
      { label: "Evidence", items: ["Internship projects", "Freelance or volunteer work", "Campus leadership"] },
      { label: "Professional", items: ["Documentation", "Meetings & reporting", "Feedback incorporation"] },
      { label: "Growth", items: ["Certifications in progress", "Self-taught tools", "Mentorship received and applied"] }
    ],
    summaryExample: {
      text: "Junior data analyst with 18 months of experience and a promotion into a lead reporting role. Automated the weekly sales report in SQL and Python, saving 15 analyst hours per week, and now trains two new hires on the dashboard stack.",
      why: "Time-bound experience, one quantified win, and early responsibility (training others). It shows slope: 18 months in, already compounding."
    },
    bulletExamples: [
      {
        bad: "Assisted senior analysts with reports and data requests.",
        good: "Automated the weekly sales report in SQL and Python, saving 15 analyst hours per week and eliminating the team's most common data error.",
        why: "Ownership of an artifact plus measured time saved. 'Assisted' invites the reader to discount everything that follows."
      },
      {
        bad: "Learned quickly and took on more responsibility.",
        good: "Promoted to lead weekly reporting within 9 months, onboarding 2 new hires and owning the dashboard stack for a 12-person team.",
        why: "Promotion speed and named responsibility show trajectory, which is the core question of entry-level screening."
      },
      {
        bad: "Completed internship tasks as assigned by managers.",
        good: "Converted my internship project into a production tool now used by 40 sales reps, earning a return offer before the program ended.",
        why: "Internship-to-production conversion and a return offer are the strongest early-career signals that exist. Use them if you have them."
      }
    ],
    commonMistakes: [
      "Padding with coursework adjectives instead of converting internships and projects into result bullets",
      "Copying the internship description verbatim instead of what changed because of you",
      "No numbers: entry-level resumes with zero metrics read as zero impact",
      "Listing 'proficient in Microsoft Office' as a headline skill in a technical application",
      "Applying with the same resume to analyst, coordinator, and associate roles across fields"
    ],
    atsKeywords: [
      "entry level",
      "junior",
      "graduate",
      "internship experience",
      "projects",
      "training",
      "collaboration",
      "reporting",
      "process improvement",
      "certification",
      "data analysis",
      "customer support"
    ],
    formattingTips: [
      "One page; education first if within 2 years of graduation, otherwise experience first",
      "Convert every internship into 2-3 result bullets with at least one number each",
      "Add a compact certifications line, especially if it matches the posting exactly",
      "Customize the summary's role title to each application; 'entry-level' is not a job title"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Minneapolis, MN | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Junior data analyst with 18 months of experience and a promotion into a lead reporting role. Automated the weekly sales report in SQL and Python, saving 15 analyst hours per week, and trains new hires on the dashboard stack.

PROFESSIONAL EXPERIENCE
Data Analyst | Northstar Foods | 2024 - Present
- Automated the weekly sales report in SQL and Python, saving 15 analyst hours per week and eliminating the team's most common data error.
- Promoted to lead weekly reporting within 9 months; owns the dashboard stack for a 12-person commercial team.
- Onboards and trains new analysts on SQL workflows and dashboard conventions.

Data Analyst Intern | Northstar Foods | Summer 2023
- Converted my internship project into a production pricing tool now used by 40 sales reps; earned a return offer.
- Cleaned and merged 3 years of regional sales data, enabling the company's first margin-by-region analysis.

SKILLS
SQL, Python, Excel, Tableau, dbt basics, reporting automation

EDUCATION
B.S. Economics, University of Minnesota, 2023`,
    faq: [
      {
        question: "How long should an entry-level resume be?",
        answer:
          "One page. With under two years of experience, a single focused page is both expected and strategically better: it forces your best evidence to the top."
      },
      {
        question: "Do internships count as work experience on an entry-level resume?",
        answer:
          "Yes. Treat internships like jobs with result bullets and numbers. An internship converted into a return offer or production tool is the strongest entry-level evidence available."
      },
      {
        question: "Should I include my GPA after graduation?",
        answer:
          "Include it for your first year or two if it is 3.5+, especially for structured early-career programs that screen on it. After that, experience takes over entirely."
      }
    ],
    relatedRoles: ["student", "internship", "no-experience", "career-change"],
    relatedGuides: ["how-to-write-a-resume", "how-to-write-a-resume-summary", "how-to-write-resume-bullet-points"]
  },
  {
    slug: "no-experience",
    role: "No Experience",
    category: "career-stage",
    title: "Resume With No Experience Example (With Tips)",
    description:
      "Resume example for job seekers with no formal work experience. Learn how to use projects, volunteering, and self-taught skills to build a first resume that gets interviews.",
    introduction:
      "This page is for first-time job seekers with no formal employment history: school leavers, self-taught career switchers at the very start, and anyone whose experience is informal. The core technique is reframing: projects, volunteering, caregiving, and self-teaching all become evidence when written with contributions and outcomes.",
    skills: [
      { label: "Self-taught", items: ["Tools you can demonstrate", "Free certifications completed"] },
      { label: "Informal work", items: ["Family business help", "Babysitting / tutoring", "Community organizing"] },
      { label: "Projects", items: ["Personal projects with users or results", "School capstones"] },
      { label: "Foundations", items: ["Reliability", "Communication", "Willingness to learn", "Basic software"] }
    ],
    summaryExample: {
      text: "Self-taught web developer with 3 completed client sites for local businesses and a freeCodeCamp certification. Built a booking site for a neighborhood barbershop that now takes 30% of its appointments online. Seeking a junior developer role where shipped curiosity beats years.",
      why: "No employer, no problem: the summary leads with verifiable output (3 client sites), one measured result, and a certification. That is a real junior profile."
    },
    bulletExamples: [
      {
        bad: "No professional experience yet but eager to learn.",
        good: "Built and launched a booking website for a neighborhood barbershop that now handles 30% of appointments online, cutting phone interruptions during work hours.",
        why: "A real deliverable with a real user and a measured result beats any adjective. 'Eager to learn' is what every no-experience resume says; this proves it."
      },
      {
        bad: "Helped out at my family's restaurant.",
        good: "Ran Saturday inventory and supplier orders for a family restaurant serving 200+ customers weekly, negotiating with 4 suppliers and cutting waste roughly 15%.",
        why: "Informal work becomes experience when you name the responsibility, the scale, and the outcome. Nobody discounts this once it is written like a job."
      },
      {
        bad: "Completed several online courses.",
        good: "Completed freeCodeCamp's Responsive Web Design certification and built all 5 portfolio projects, then rebuilt one client site from scratch to apply them.",
        why: "Courses matter only when connected to application. The rebuild shows the learning loop employers actually want."
      }
    ],
    commonMistakes: [
      "An empty experience section with a plea for a chance instead of evidence elsewhere",
      "Listing courses and tutorials with nothing built from them",
      "Leaving off informal work (family business, babysitting, volunteering) that proves reliability",
      "A skills list of tools you cannot demonstrate in an interview",
      "Apologizing in the summary for what the resume lacks"
    ],
    atsKeywords: [
      "motivated",
      "quick learner",
      "projects",
      "volunteer",
      "certification",
      "self-taught",
      "teamwork",
      "communication",
      "customer service",
      "time management",
      "problem solving",
      "willingness to learn"
    ],
    formattingTips: [
      "One page. Lead with a Projects or Highlights section before any education details",
      "Write informal work exactly like jobs: title, context, bullets, numbers",
      "Include free certifications with completion dates",
      "End the summary with the role you want so screeners can route you"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Tucson, AZ | github.com/alexmorgan

PROJECTS
Freelance Web Developer (Self-directed)
- Built and launched 3 client websites for local businesses, including a booking site for a barbershop that now handles 30% of appointments online.
- Rebuilt a bakery's site from scratch after a course, cutting load time by half on mobile.
- Manage hosting, updates, and small feature requests for all 3 clients.

INFORMAL EXPERIENCE
Operations Helper | Family Restaurant | 2023 - Present
- Run Saturday inventory and supplier orders for a restaurant serving 200+ customers weekly.
- Negotiated with 4 suppliers and adjusted order timing, cutting waste roughly 15%.

CERTIFICATIONS
freeCodeCamp Responsive Web Design, 2025
Google Digital Marketing Fundamentals, 2024

EDUCATION
High School Diploma, Tucson High School, 2023

SKILLS
HTML, CSS, JavaScript basics, WordPress, Canva, customer service, scheduling`,
    faq: [
      {
        question: "Can I get a job with no experience at all?",
        answer:
          "Yes, at entry level every hire starts there. What employers screen for instead is evidence you finish things: projects, informal work, certifications applied to real output. Build two or three small, finished things and write them with numbers."
      },
      {
        question: "How do I write a resume with zero work experience?",
        answer:
          "Lead with a Projects section, write informal work (family business, volunteering, tutoring) in job format with outcomes, add certifications, and keep education brief. One page, no apologies."
      },
      {
        question: "Do online certifications help a no-experience resume?",
        answer:
          "They help when paired with something built. A certificate plus a deployed project using it tells a coherent story; certificates alone are close to invisible to screeners."
      }
    ],
    relatedRoles: ["student", "career-change", "entry-level", "internship"],
    relatedGuides: ["how-to-write-a-resume-with-no-experience", "how-to-write-a-resume", "how-long-should-a-resume-be"]
  },
  {
    slug: "career-change",
    role: "Career Change",
    category: "career-stage",
    title: "Career Change Resume Example (With Tips)",
    description:
      "Career change resume example showing how to reposition existing experience for a new field. Includes transferable skills bullet samples, ATS keywords, and formatting tips for switchers.",
    introduction:
      "This page is for professionals switching fields who need a resume that makes the pivot obvious and safe. Career-change resumes fail when they read like a history of the old field; they win when they translate past achievements into the new field's language and lead with proof you have already started the new work.",
    skills: [
      { label: "Bridge skills", items: ["New-field tools already used", "Certifications or courses completed"] },
      { label: "Transferable", items: ["Stakeholder management", "Data analysis", "Project delivery", "Communication"] },
      { label: "Proof", items: ["Side projects in the new field", "Volunteer work using new skills", "Internal projects at current job"] },
      { label: "Domain", items: ["Old-industry knowledge as an asset", "Regulatory or customer context"] }
    ],
    summaryExample: {
      text: "Operations manager of 6 years transitioning into data analytics. Completed a Google Data Analytics certificate and built the warehouse KPI dashboard now used by 4 supervisors, cutting weekly reporting time from 6 hours to 45 minutes.",
      why: "It names the pivot, proves skill acquisition, and shows the new skill already producing value inside the old job. That de-risks the hire completely."
    },
    bulletExamples: [
      {
        bad: "Seeking to transition into a data analytics career.",
        good: "Built a warehouse KPI dashboard (Power BI, SQL) now used by 4 supervisors, cutting weekly reporting time from 6 hours to 45 minutes.",
        why: "The pivot is demonstrated, not requested. One artifact with adoption and time saved says more than any objective statement."
      },
      {
        bad: "Strong analytical and problem-solving skills from previous career.",
        good: "Analyzed 18 months of shipment data to renegotiate carrier contracts, cutting freight costs 12% ($140k annually) in my operations role.",
        why: "It proves the analytical claim with an old-field achievement expressed in new-field language (data analysis, quantified outcome)."
      },
      {
        bad: "Completed online courses in SQL and data visualization.",
        good: "Completed Google Data Analytics certificate and a 12-week SQL course, then rebuilt my team's manual reports as scheduled SQL queries within a month.",
        why: "Course-to-application pairing again. The follow-through is the evidence; the certificate is just the receipt."
      }
    ],
    commonMistakes: [
      "A chronological resume that buries the pivot at the bottom",
      "Old-field jargon that the new field's screeners cannot map to their needs",
      "No new-field artifact: switchers without a dashboard, portfolio, or project look like risks",
      "Explaining why you are leaving instead of what you bring",
      "Listing courses without application, the career-change equivalent of name-dropping"
    ],
    atsKeywords: [
      "career change",
      "transferable skills",
      "certification",
      "cross-functional",
      "process improvement",
      "stakeholder management",
      "data analysis",
      "project management",
      "training",
      "adaptability",
      "process documentation",
      "reporting"
    ],
    formattingTips: [
      "Use a summary-first structure that states the pivot and the proof in two sentences",
      "Create a 'Transition Projects' section above older roles",
      "Translate old-role bullets into the new field's vocabulary",
      "Keep old roles but compress them: 2-3 bullets each, transfer-relevant only"
    ],
    exampleResume: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: +1 555 010 0091 | Columbus, OH | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Operations manager of 6 years transitioning into data analytics. Google Data Analytics certified; built the warehouse KPI dashboard now used by 4 supervisors, cutting weekly reporting from 6 hours to 45 minutes.

TRANSITION PROJECTS
Warehouse KPI Dashboard (Power BI, SQL)
- Designed and built the KPI dashboard used by 4 supervisors; cut weekly reporting time from 6 hours to 45 minutes.
- Wrote scheduled SQL queries replacing 3 manual reports, eliminating copy-paste errors entirely.

PROFESSIONAL EXPERIENCE
Operations Manager | Buckeye Logistics | 2019 - Present
- Analyzed 18 months of shipment data to renegotiate carrier contracts, cutting freight costs 12% ($140k annually).
- Manage a 22-person warehouse operation with 99.2% inventory accuracy.
- Trained 8 team leads on the new reporting workflows, sustaining adoption after rollout.

Operations Coordinator | Buckeye Logistics | 2017 - 2019
- Coordinated daily inbound schedules across 5 carriers, raising on-time unloading from 88% to 97%.

CERTIFICATIONS
Google Data Analytics Professional Certificate, 2025

EDUCATION
B.S. Business Administration, Ohio State University, 2017`,
    faq: [
      {
        question: "How do I write a resume when changing careers?",
        answer:
          "Lead with a summary that states the pivot and your proof, add a Transition Projects section showing new-field work, translate old achievements into the new field's vocabulary, and compress old roles to their transferable essence."
      },
      {
        question: "What skills transfer best between careers?",
        answer:
          "Analysis, stakeholder management, project delivery, writing, and training. Name them in the new field's terms and back each with a metric from your old role."
      },
      {
        question: "Should a career-change resume be functional instead of chronological?",
        answer:
          "Use a hybrid: summary and transition projects first, then compressed chronological roles. Pure functional formats confuse ATS parsers and raise flags with recruiters."
      }
    ],
    relatedRoles: ["no-experience", "entry-level", "data-analyst", "project-manager"],
    relatedGuides: ["how-to-explain-a-career-gap", "how-to-write-a-resume-summary", "resume-skills"]
  }
];

export function getResumeExample(slug: string) {
  return resumeExamples.find((example) => example.slug === slug);
}
