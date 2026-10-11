# VibeJudge

<a href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light" alt="VibeJudge - AI&#0032;that&#0032;brutally&#0032;roasts&#0032;your&#0032;resume | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

VibeJudge is a free AI CV platform for `vibejudge.app` with one job: roast your CV, download the roast, or generate a better CV.

1. **Upload a CV** (PDF, DOCX, TXT, or pasted text) and get a brutally honest, specific, useful roast with a score.
2. **Download the roast** as a privacy-safe share card (PNG) — no name, contact details, or CV text.
3. **Generate a new CV** with AI (with or without the roast as input), edit it, and download it as a text-based PDF or PNG.

## Features

- No authentication, signup, payments, or dashboard
- PDF, DOCX, TXT upload (drag and drop) or pasted text, with client- and server-side validation
- Server-side text extraction and Ollama analysis
- Structured results: score, verdict, roast, strengths, problems by severity, feedback by category, before/after rewrites, quick-win checklist, final verdict
- Share card (1080×1350 PNG) with an optional "score only" mode, native share where supported
- AI-generated CV rendered as a document; editable; downloadable as ATS-readable PDF (jsPDF, lazy-loaded) or PNG
- Loading, cancel, error, and retry states for both AI calls; per-IP fair-use limits on both AI routes
- Basic file validation, request limits, timeout handling, and friendly error states
- SEO metadata, Open Graph metadata, JSON-LD structured data, sitemap, and robots.txt
- Programmatic SEO: landing pages, resume examples, guides, and roast pages

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS (design tokens in `tailwind.config.ts`, component classes in `app/globals.css`)
- jsPDF (client-side PDF export, dynamically imported)
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
```

Never expose `OLLAMA_API_KEY` with a `NEXT_PUBLIC_` prefix. AI calls happen in `app/api/analyze/route.ts`.

## Development

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Design system

- **Type**: Bricolage Grotesque (display), Inter (UI/body), Instrument Serif italic (roast lines and verdicts).
- **Color**: warm paper neutrals (`paper`, `line`, `ink`), one accent (`ember`), and two semantic colors (`moss` = fixed/good, `amber` = caution).
- **Components**: `.btn` (+ `btn-primary`, `btn-dark`, `btn-secondary`, `btn-ghost`, sizes), `.card`, `.eyebrow`, `.chip`, `.link`, `.section`.
- Score bands and severity styles live in `lib/score.ts` so the UI, demo, and share card agree.

## Code map

```text
app/page.tsx                    Homepage (server component)
components/home/roast-studio    Upload → roast → generate state machine (client)
components/home/upload-panel    Dropzone / paste text, loading, errors
components/roast/*              Score dial, roast report, share panel
components/cv/*                 Generated CV document + workspace (edit, PDF/PNG/copy)
components/site/*               Shared header, footer, logo
lib/cv/parse.ts                 Plain-text CV → structured document
lib/export/*                    Roast card, CV PDF/PNG renderers
lib/server/rate-limit.ts        Per-IP limiter used by both AI routes
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
- **Analytics**: funnel events (`lib/analytics.ts`) post to `/api/track` via `navigator.sendBeacon`: `resume_upload_started`, `resume_upload_completed`, `resume_analysis_completed`, `resume_analysis_failed`, `resume_score_viewed`, `resume_roast_viewed`, `cv_generation_started`, `cv_generation_completed`, `cv_generation_failed`, `cv_downloaded`, `roast_card_downloaded`, `share_clicked`. Only event names are sent; never resume text.

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
