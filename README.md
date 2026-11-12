# HackNCAT team template

Next.js + Supabase app (optional Render worker), plus the tools that let 4 people and about 10 AI agents build six sponsor tracks at once.

## Start here
- **Agents and people:** `AGENTS.md` (rules), `STACK.md` (how the app is built), `PLAYBOOK.md` (the event plan).
- **Tonight:** `docs/DRY-RUN.md`.
- **Prompts:** `docs/prompts/` (plan a track, split it into tasks, start a builder).

## Run it
```bash
pnpm install
cp .env.example .env.local   # Supabase URL and keys
pnpm dev                     # http://localhost:3000
```
Database: run `supabase/migrations/*.sql` in the Supabase SQL editor (or `supabase db push`).

## Layout
| Path | What |
|---|---|
| `src/app/<track>/` | One folder per sponsor track: screens, `README.md`, `CHECKLIST.md` |
| `src/app/dashboard/` | Signed-in example: Server Action creates a job, background work finishes it |
| `src/components/`, `src/lib/` | Shared UI (Direction D) and helpers (Supabase, Render, jobs) |
| `supabase/migrations/` | Schema with Row Level Security |
| `render-worker/` | Optional worker for jobs longer than a minute (`render.yaml` blueprint) |
| `tools/board` | The message board CLI (GitHub issues as channels) |
| `dashboard/` | Team control room on GitHub Pages; no AI tokens |
| `.superset/` | Paradev workspace setup (copies your `.board.env`) |

Fonts (Public Sans, IBM Plex Mono) are bundled under the SIL Open Font License, see `src/app/fonts/`.
