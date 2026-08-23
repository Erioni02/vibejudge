<<<<<<< HEAD
# VibeJudge

VibeJudge is a free AI resume roasting tool for `vibejudge.app`. Users upload or paste a resume, receive a humorous but useful critique, and get concrete fixes before moving on to interview practice with Rehearse.

## Features

- No authentication, signup, payments, or dashboard
- PDF, DOCX, and TXT resume intake
- Server-side text extraction and Ollama analysis
- Structured JSON response rendering
- Resume score, roast, problems, quick wins, rewrite examples, sharing, retry, and Rehearse CTA
- Basic file validation, request limits, timeout handling, and friendly error states
- SEO metadata, Open Graph metadata, and `cv.png` logo/favicon

## Tech Stack

- Next.js
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

## Deployment

Deploy as a standard Next.js application. Configure the Ollama environment variables in the hosting provider and keep `.env.local` out of source control.

## Privacy

VibeJudge should process resumes request-by-request: upload, extract, analyze, return results, then discard. Do not log full resume contents or place resume text in client-side URLs or analytics payloads.
=======
# vibejudge
>>>>>>> 41a1d26a3383d3d6960ffcb46104a820e4b78498
