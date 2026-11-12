# The app stack (read before writing app code)

Next.js (App Router, TypeScript, pnpm, Tailwind) on Vercel, Supabase for auth and data, and an optional Render worker for long jobs.

## Commands
- `pnpm dev` (http://localhost:3000), `pnpm build`, `pnpm lint`, `pnpm tsc`
- Run `pnpm lint && pnpm tsc` before every commit. Run `pnpm build` before opening a PR.

## Where things go
| What | Where | Owner |
|---|---|---|
| A track's screens | `src/app/<track>/` (route `/<track>`) plus its `README.md` and `CHECKLIST.md` | That track's builder |
| Shared UI | `src/components/` (`ui/index.tsx`: Page, PageHeader, Card, Button, Tag, Field; `kpi.tsx`) | Lead |
| Shared logic | `src/lib/` (Supabase clients, Render client, jobs, tracks list) | Lead |
| Database | `supabase/migrations/` (one new file per change, never edit an old one) | Lead approves |
| Long jobs | `render-worker/` | Lead |

## Next.js rules (this version is newer than most training data)
- Read the guide in `node_modules/next/dist/docs/` before using an API you're unsure of. Heed deprecation notices.
- Request-time code uses `src/proxy.ts`, not `middleware.ts` (renamed).
- `cookies()`, `headers()`, `params` and `searchParams` are async: `await` them.
- Cache Components is off (`next.config.ts`). Pages that read the user or live data are dynamic; add `export const dynamic = "force-dynamic"` when a page must never be cached. Don't turn Cache Components on during the event.
- Mutations are Server Actions in an `actions.ts` with `"use server"`, ending in `revalidatePath(...)`.

## Supabase rules
- `"use client"` components: `createClient()` from `@/lib/supabase/client` (browser client).
- Server Components, Server Actions, Route Handlers: `await createClient()` from `@/lib/supabase/server`. Get the user with `getUser()` from the same file.
- `@/lib/supabase/admin` uses the secret key and skips Row Level Security. Only for trusted background work.
- Every table has Row Level Security on, with policies on `auth.uid() = user_id`. Track tables are prefixed with the track slug (`lenovo_readings`). A schema change is a new migration plus a `REQ` on lead.
- Pages must still render without Supabase keys: check `hasSupabase` and show `<SetupNotice />`.

## Background work
- Default: run it in Next.js with `after()` (see `createJob` in `src/app/dashboard/actions.ts` and `runJob` in `src/lib/jobs.ts`). Keep it under a minute.
- Longer or heavier: send it to Render with `callRenderService(endpoint, { body })` from `@/lib/render/client`. It adds `Authorization: Bearer $RENDER_INTERNAL_SECRET` and returns `{ skipped: true }` when Render isn't configured, so always keep the in-app fallback.

## Look and feel (Direction D: Clinical Calm)
- Use the tokens in `src/app/globals.css` through Tailwind classes (`bg-surface`, `text-ink-2`, `bg-accent`, `rounded-[var(--radius-card)]`). No new colors without asking the lead.
- Headlines say what's going on in plain language ("Line 2 is running, with one issue that needs a person now.").
- Real units and specifics in copy. No gradients, emoji, glassy cards, sparkle icons or "Unlock insights" filler.
- Animate only the 3 to 5 headline numbers, with `<Kpi>` (NumberFlow).
- Every control is a real `<button>`, `<a>` or labeled input, at least 44px tall.
