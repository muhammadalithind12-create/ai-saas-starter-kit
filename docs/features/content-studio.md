# Content Studio

Public, no-login AI content tools at `/studio`, powered by Google Gemini.
Runs entirely on the Next.js frontend — no FastAPI backend required.

## Routes

| Route | Purpose |
|-------|---------|
| `/studio` | Hub: hero + three tool cards |
| `/studio/blog` | Blog Writer — full posts from a topic |
| `/studio/social` | Social Captions — 5 captions for X/LinkedIn/Instagram |
| `/studio/ideas` | Idea Engine — niche ideas with hooks and angles |

Public chrome lives in `src/app/studio/layout.tsx` (header/nav/footer, no auth
shell). The auth middleware (`src/lib/supabase/middleware.ts`) exempts
`/studio` via `PUBLIC_PATHS`.

## API routes

`src/app/api/studio/{blog,social,ideas}/route.ts` — Next.js route handlers.

- `blog`: `{ topic, tone, length }` → `{ title, content, wordCount }`.
  The model returns `TITLE: <title>` on the first line; the handler strips it.
- `social`: `{ topic, platform, tone }` → `{ captions: string[5] }`.
  Uses `responseMimeType: "application/json"` and validates the parsed array.
- `ideas`: `{ niche, count }` → `{ ideas: [{ title, hook, angle }] }`.
  Count is clamped to 3–10.

All three return `503 { error: "AI is not configured" }` when `GEMINI_API_KEY`
is unset. Inputs are length-capped (topic ≤ 300 chars, niche ≤ 200 chars).

## Client

`src/lib/studio-client.ts` — typed fetch wrappers + `StudioApiError`.
Pages use TanStack Query `useMutation` (no bare `useEffect + fetch`).
Shared UI in `src/app/studio/_components/` (`copy-button.tsx`, `markdown-text.tsx`).

## Configuration

- `GEMINI_API_KEY` — required for generation.
- `GEMINI_MODEL` — default `gemini-3.5-flash-lite` (verified on this account;
  `gemini-2.5-flash` returns 404 for new API users). See `src/lib/gemini.ts`.
