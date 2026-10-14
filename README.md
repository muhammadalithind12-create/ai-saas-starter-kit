# ContentPilot

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React 19](https://img.shields.io/badge/React-19-149eca?logo=react)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase)

**AI blog & social content generator for creators and marketers — from idea to published in minutes.**

ContentPilot turns a single topic into publish-ready content: full SEO-friendly blog posts, platform-tuned social captions for X/LinkedIn/Instagram, and scroll-stopping content ideas with hooks. The public **Content Studio** is free to try with no signup; signed-in users get the full SaaS workspace (dashboard, billing, file manager, admin console).

## Live demo

- **Content Studio (try it now, no login):** `/studio`
- **Blog Writer:** `/studio/blog` · **Social Captions:** `/studio/social` · **Idea Engine:** `/studio/ideas`

## Features

### Content Studio (public, Gemini-powered)
- **Blog Writer** — complete blog posts from a topic: SEO title, hook intro, H2 sections, takeaways, CTA. Five tones, three lengths.
- **Social Captions** — 5 ready-to-post captions per topic, shaped for X (punchy), LinkedIn (insightful), or Instagram (visual), with hashtags.
- **Idea Engine** — content ideas for any niche, each with an attention-grabbing hook and a unique angle.
- Copy-to-clipboard on every output; graceful "AI not configured" state when `GEMINI_API_KEY` is missing.

### SaaS workspace (from the starter foundation)
- **Authentication** — Supabase email/password + email-code (OTP), protected routes, profiles, admin role
- **Subscription billing** — Stripe Checkout + Billing Portal, Free/Pro/Team plans, webhook sync
- **Dashboard** — plan, usage, and activity at a glance
- **File manager** — drag-and-drop uploads with progress, previews, and metadata
- **Admin console** — users, subscriptions, jobs, files, and audit log

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, TanStack Query
- **AI:** Google Gemini (`gemini-3.5-flash-lite` default, override via `GEMINI_MODEL`) via `@google/generative-ai`
- **Backend:** Supabase (Postgres + Auth), FastAPI service (`services/api`) for the original media/billing workflows
- **Billing:** Stripe · **Monorepo:** pnpm workspaces (`apps/web`, `packages/shared`, `services/api`)

## Quick start

```bash
pnpm install
```

### Environment

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only
GEMINI_API_KEY=your-gemini-api-key                # powers the Content Studio
# Optional:
GEMINI_MODEL=gemini-3.5-flash-lite                # default model
NEXT_PUBLIC_API_URL=http://localhost:8000         # FastAPI backend (workspace features)
```

Get a free Gemini key at [Google AI Studio](https://aistudio.google.com) (no billing required).

```bash
pnpm dev:web     # frontend only — the Content Studio works standalone
```

Open `http://localhost:3000/studio` — no login needed.

## Monorepo layout

```
apps/web/          Next.js 16 frontend — Content Studio + SaaS workspace
services/api/      FastAPI backend (billing/media workflows from the starter)
packages/shared/   Shared TypeScript types
supabase/          Migrations and edge function config
docs/              Feature and workflow documentation
```

## API reference (Studio)

| Method | Route | Body | Returns |
|--------|-------|------|---------|
| POST | `/api/studio/blog` | `{ topic, tone, length }` | `{ title, content, wordCount }` |
| POST | `/api/studio/social` | `{ topic, platform, tone }` | `{ captions[] }` |
| POST | `/api/studio/ideas` | `{ niche, count }` | `{ ideas[{ title, hook, angle }] }` |

All three return `503 { error: "AI is not configured" }` when `GEMINI_API_KEY` is unset.

## Deploy

The web app deploys to Vercel with **Root Directory `apps/web`** and install command `cd ../.. && pnpm install` (monorepo). Set `GEMINI_API_KEY` plus the Supabase vars in the Vercel dashboard. The Studio routes run entirely on Vercel — no extra backend needed.

## Attribution

ContentPilot is built on the excellent **[ai-saas-starter-kit](https://github.com/backblaze-labs/ai-saas-starter-kit)** by Backblaze Labs (MIT licensed — see `LICENSE`). The SaaS workspace shell (auth, billing, dashboard, file manager, admin) comes from the starter; the **Content Studio** — all three AI content tools, the Gemini integration, the public studio pages, and the ContentPilot branding — was designed and built on top of it.
