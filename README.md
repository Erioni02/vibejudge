# VibeJudge

VibeJudge is a free AI resume roasting tool for `vibejudge.app`. Users upload or paste a resume, receive a humorous but useful critique, and get concrete fixes before moving on to interview practice with Rehearse.

## Features

- No authentication, signup, payments, or dashboard
- PDF, DOCX, and TXT resume intake
- Server-side text extraction and Ollama analysis
- Structured JSON response rendering
- Resume score, roast, problems, quick wins, rewrite examples, sharing, retry, and Rehearse CTA
- AI-generated clean CV download
- Basic file validation, request limits, timeout handling, and friendly error states
- SEO metadata, Open Graph metadata, JSON-LD structured data, sitemap, and robots.txt
- Programmatic SEO: landing pages, resume examples, guides, and roast pages

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- Ollama API with `gpt-oss:120b-cloud`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in `.env.local`:

```env
OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gpt-oss:120b-cloud
REHEARSE_URL=https://rehearse-rouge.vercel.app
```

Never expose `OLLAMA_API_KEY` with a `NEXT_PUBLIC_` prefix. AI calls happen in `app/api/analyze/route.ts`.

## Development

```bash
npm run dev
npm run build
npm run start
```

## URL Architecture

```text
/
 /ai-resume-checker        AI resume checker landing page
 /free-resume-checker      Free resume checker landing page
 /resume-review            Resume review checklist landing page
 /resume-roast             Resume roast hub (+ /resume-roast/[slug])
 /resume-feedback          Resume feedback landing page
 /ats-resume-checker       ATS resume checker landing page

 /resume-examples          Resume examples hub
 /resume-examples/[slug]   20 role & career-stage example pages (data/resume-examples.ts)

 /guides                   Guides hub
 /guides/[slug]            10 in-depth guides (data/guides.ts)

 /resume-roast/[slug]      Role-specific roast examples (data/roasts.ts)

 /privacy                  Privacy policy
 /terms                    Terms of service
```

All page data lives in `data/`. Adding a new resume example, guide, or roast page is a data-file edit: routes, sitemap entries, metadata, and internal links generate automatically.

## SEO Architecture

- **Metadata**: every indexable page generates a unique title, meta description, canonical URL, Open Graph, and Twitter metadata via `lib/seo.ts` (`pageMetadata`). No duplicated generic metadata across pSEO pages.
- **Structured data (JSON-LD)**:
  - `WebApplication` + organization info site-wide (app/layout.tsx)
  - `BreadcrumbList` on all pSEO pages
  - `FAQPage` where visible FAQs exist
  - `Article` on guides
  - No fake reviews, ratings, authors, or claims
- **Sitemap**: `app/sitemap.ts` generates `/sitemap.xml` from the data files automatically. API routes are excluded.
- **Robots**: `app/robots.ts` generates `/robots.txt`, allows all public pages, disallows `/api/`.
- **Headings**: exactly one H1 per page, logical H2/H3 below.
- **Internal linking**: homepage links to all hubs; examples cross-link related roles and guides; guides link to examples and tools; all links are crawlable `<a>`/`<Link>` elements with breadcrumbs.
- **Privacy of results**: analysis results are client-side state with no URL. Resume text never enters URLs, metadata, sitemaps, or analytics payloads. Uploaded resumes are processed per request and discarded.
- **Analytics**: funnel events (`lib/analytics.ts`) post to `/api/track` via `navigator.sendBeacon`: `resume_upload_started`, `resume_upload_completed`, `resume_analysis_completed`, `resume_analysis_failed`, `resume_score_viewed`, `resume_roast_viewed`, `cv_generation_completed`, `rehearse_cta_clicked`, `share_clicked`. Only event names are sent; never resume text.

## Google Search Console Setup

1. Deploy the site and confirm `https://vibejudge.app/sitemap.xml` and `https://vibejudge.app/robots.txt` respond correctly.
2. In [Google Search Console](https://search.google.com/search-console), add `vibejudge.app` as a property (Domain property recommended).
3. Verify ownership via your DNS provider (TXT record) or the hosting provider's verification method.
4. Submit `https://vibejudge.app/sitemap.xml` under **Sitemaps**.
5. Use **URL Inspection** on the homepage and a few pSEO pages to confirm "Page is indexable" and correct canonicals.
6. Monitor **Core Web Vitals** and **Coverage** reports weekly for the first month; new pSEO pages typically index within days of the sitemap submission.
7. If pages are removed or renamed, keep 301 redirects in the hosting provider so indexed URLs do not 404.

## Deployment

Deploy as a standard Next.js application. Configure the Ollama environment variables in the hosting provider and keep `.env.local` out of source control.

## Privacy

VibeJudge processes resumes request-by-request: upload, extract, analyze, return results, then discard. Do not log full resume contents or place resume text in client-side URLs or analytics payloads.
