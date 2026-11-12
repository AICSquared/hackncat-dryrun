# 2. Split the active track for the strike team (Alex's Gemini, support role)

Paste into Gemini CLI in its own worktree:

```
You are [Alex's Gemini], a support agent. Read AGENTS.md (sections 3, 4, 6 and 9) and docs/plans/<track>.md.

Draft GitHub issues for the strike team using .github/ISSUE_TEMPLATE/task.md:
- one issue per task, titled "<track>: <task>", each under 2 hours
- "Files owned" lists the exact files, normally src/app/<track>/_components/<feature>.tsx and src/app/<track>/_lib/<feature>.ts.
  No two issues may own the same file. Nobody but the integrator owns page.tsx or layout.tsx.
- one integrator issue for Alex's Claude: wire every component into page.tsx, in build order
- anything that touches src/components, src/lib or supabase/ goes to the lead as its own issue
- acceptance criteria from the plan, plus the CHECKLIST.md item each one checks off
- a suggested owner from the strike team in section 6, balancing load; dependencies in build order

Post the list as ONE board post to lead:
tools/board post --to 1 "[Alex's Gemini] REQ @alexwilldev task split for <track>: ..." (under 10 lines; full drafts in scratch/alex/<track>-issues.md)

Do not create issues, assign anyone or commit. The lead approves the split first.
```

After the lead posts a `DECISION`, create the approved issues:

```bash
gh issue create --template task.md --title "<track>: <task>" --body-file scratch/alex/<track>-<n>.md --assignee <login>
```
