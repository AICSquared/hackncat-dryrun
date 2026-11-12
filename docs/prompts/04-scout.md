# 4. Scout a queued track (Alex's Codex builds, Alex's Gemini researches)

Scouts get a track ready so the strike team starts it with a plan, a checklist and a page that already renders. They never touch the active track's folder.

## Gemini (research, support role)

```
You are [Alex's Gemini], a support agent. Read AGENTS.md (sections 3 and 9) and the sponsor brief for <track>.
Post one FINDING to #<channel> with: the problem in one sentence, every judging criterion, the data or hardware provided,
what must be submitted (video, repo, slides, form), and what a winning demo shows in 3 minutes.
Draft scratch/alex/<track>-checklist.md: one line per rubric item, marked must-have or nice-to-have.
Do not commit.
```

## Codex (scaffold, builder role)

```
You are [Alex's Codex], a scout builder. Home channel #<channel>. Read AGENTS.md, STACK.md and the FINDING for <track>.
Branch <issue#>-<track>-scout from fresh main. Produce, in one PR titled "<track>: scout":
1. docs/plans/<track>.md: the problem, the demo story, the screens, the data model, and 4 to 8 tasks
   each with the exact files it owns (src/app/<track>/_components/<feature>.tsx, src/app/<track>/_lib/<feature>.ts).
2. src/app/<track>/CHECKLIST.md filled from scratch/alex/<track>-checklist.md.
3. src/app/<track>/_data/sample.json (or .ts): realistic sample data with real units, including edge cases.
4. supabase/migrations/<timestamp>_<track>.sql: a DRAFT table prefixed with the track slug, RLS on, policies on auth.uid() = user_id.
   Do not run it. Post a REQ on lead for approval.
5. src/app/<track>/page.tsx: a skeleton that renders the sample data with the shared UI (Page, PageHeader, Card, Kpi).
   No Supabase calls yet. It must render without keys.
pnpm lint && pnpm tsc && pnpm build before the PR. Then post DONE on lead: "<track> scouted" with the PR link.
```

The track's state in AGENTS.md section 6 moves from **queued** to **scouted** when this PR merges.
