# 1. Plan a track (lead's Claude, with ECC)

Paste into Claude Code in the main clone, after `/plan` (ECC's plan command), with the sponsor's prompt filled in:

```
Plan the <TRACK> track for HackNCAT. Read AGENTS.md, STACK.md and src/app/<track>/README.md first.

Sponsor prompt and judging criteria:
<PASTE THE BRIEF>

Constraints: a time box of <hours> (from AGENTS.md section 6), our stack only (Next.js + Supabase, Render only if a job runs longer than a minute), Direction D look. Reuse src/components and src/lib before adding anything.

Write the plan to docs/plans/<track>.md with:
1. The demo in 90 seconds: what a judge sees, click by click.
2. Rubric map: each judging criterion and the feature or evidence that answers it.
3. Data: tables (prefixed <track>_, with RLS) and any sample data we must make.
4. Tasks: each under 2 hours, in build order, with dependencies and acceptance criteria.
5. Risks and the fallback for each.
Don't write app code yet.
```
