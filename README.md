# Rich Girl Bodied — by Coach Akeera

An AI image transformation app for creators who already have an AI girl and
want to customize or improve her body while preserving her identity.

Upload your character → choose a body direction → lock what stays her →
generate transformed images directly in the app → compare, favorite, and
refine. **This app generates images — it never generates or shows prompts
to the user.**

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (Black Cherry `#511827` / Nude Blush `#D8B2A6` design system)
- Supabase (auth, Postgres, private storage) — optional, see "Demo mode" below
- A provider-agnostic image generation service layer (`lib/image-generation/`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have; see below
npm run dev
```

### Demo mode (no setup required)

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are left
empty, the app runs in **demo mode**: the entire upload → consultation →
lock traits → settings → generate → results → adjust flow works end to end,
using a single implicit "demo" identity and no database. Uploaded images are
inlined as data URIs instead of being persisted to storage, and the mock
image provider (see below) hands them back as the "transformed" result so
you can exercise the whole product without any credentials. Accounts,
My Girls, and Account/Usage require Supabase to be configured.

### Full setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor. It creates every table
   (`profiles`, `characters`, `character_references`, `body_sessions`,
   `generations`, `credits`, `generation_events`), enables Row Level
   Security with owner-only policies, and a trigger that gives new users a
   profile + 5 starter credits.
3. Create two **private** storage buckets: `references` and `generations`
   (Storage tab, or the SQL at the bottom of `schema.sql`), then add the
   folder-scoped RLS policies shown there so each user can only read/write
   under their own `user_id/` prefix.
4. Copy your project URL, anon key, and service role key into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never exposed to the client)

### Wiring up real image generation

No image provider is bundled by default — `IMAGE_GENERATION_PROVIDER=mock`
(the default) echoes the uploaded reference back as the result so the
product flow can be demoed and tested without a paid API. To go live:

1. Pick a reference-conditioned image editing model (one that accepts an
   input image + instructions and returns an edited image while preserving
   likeness — e.g. a Flux Kontext-style model on Replicate, or an
   equivalent hosted API).
2. Implement `ImageGenerationProvider` in a new file under
   `lib/image-generation/providers/` (see `replicate-provider.ts` for a
   structured starting point — it's a real implementation against
   Replicate's prediction API, just needs a model version pinned).
3. Register it in `lib/image-generation/provider.ts` and set
   `IMAGE_GENERATION_PROVIDER` to its name.

**No other file needs to change.** Every page, component, and API route
talks to `generateBodyTransformation()` from `lib/image-generation/provider.ts`
— never to a concrete provider — so swapping models is a one-line env
change plus one new file.

## How identity + safety rules are enforced

The consultation UI never lets the user type or see a "prompt". Instead,
`lib/instructions/buildTransformationInstructions.ts` builds the actual
system instructions sent to the provider entirely server-side, from the
structured body settings + locked-trait toggles. That file is the single
place encoding the brand's non-negotiables: identity/face/complexion
preservation, no lightening or grey-washing melanin-rich skin, locked
traits stay locked, realistic anatomy, preserved outfit when requested,
etc. The client only ever receives image URLs back.

## Architecture

```
app/                        Pages (App Router) — one route per step of the flow
  upload/ consultation/ lock-traits/ generation-settings/
  generating/ results/[batchId]/ adjust/[generationId]/
  projects/ projects/[id]/ account/
  api/                       Route handlers (upload, generate, generations, characters, credits)
components/                  UI building blocks (design system, upload, results, layout)
lib/
  image-generation/          Provider abstraction — see above
  instructions/               Hidden, server-only prompt construction
  supabase/                  Browser / server / admin Supabase clients
  storage/                   Private-storage upload helper (falls back to data URIs in demo mode)
  wizard/                    Client-side multi-step flow state (Zustand)
  auth/                      Request-user resolution (real session, or demo fallback)
  utils/                     File validation, in-memory rate limiting
  constants/                 All consultation option lists (body direction, waist, hips, …)
supabase/schema.sql          Full DB schema + RLS policies + storage policy snippets
middleware.ts                Redirects unauthenticated users away from app routes (Supabase mode only)
```

## Security notes

- Every generation/upload API route resolves the acting user server-side
  and never trusts a client-supplied user id.
- `SUPABASE_SERVICE_ROLE_KEY` is only read from `lib/supabase/admin.ts`,
  marked `server-only`, and used solely for storage writes — all database
  reads/writes from API routes go through the session-scoped client so
  Row Level Security applies.
- Reference/generation storage buckets are private; the app hands back
  signed, time-limited URLs rather than public links.
- `/api/upload` and `/api/generate` are rate-limited per user (in-memory —
  swap for a shared store like Upstash before running multiple instances).
- `middleware.ts` blocks unauthenticated access to every app route once
  Supabase is configured.

## Known limitations / next steps

- The in-memory rate limiter and demo-mode "no persistence" are fine for a
  single instance / local demo but should be swapped for Redis-backed
  limiting and real storage before a multi-instance production deploy.
- No payment provider is wired up yet; `credits` exists as a table and is
  decremented per generation, but there's no Stripe checkout flow to top
  up balance — add one behind `/api/billing` when ready.
- `npm audit` still reports a handful of advisories against Next.js 14.2.x
  that are only fully resolved in the Next.js 16 major (a breaking
  upgrade, e.g. new async APIs and a React 19 requirement). 14.2.35 is the
  latest patch on the 14.x line as of this writing; plan a deliberate
  Next 16 migration rather than a silent bump.
- The comparison slider and downloads are best-effort for cross-origin
  signed URLs (browsers ignore the `download` attribute for cross-origin
  files without a `Content-Disposition: attachment` response header) —
  add that header when serving generated images from your own storage if
  you need guaranteed "save as" behavior.
