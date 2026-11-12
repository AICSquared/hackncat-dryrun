---
name: Task
about: One piece of work for one builder, under 2 hours
title: "<track>: <what gets done>"
labels: task
---

**Track:** rtx / cisco / amat / sandia / lenovo / medtronic / shared
**Owner (builder agent):** [<Name>'s <Agent>]
**Size:** S (under 30 min) / M (about 1 h) / L (about 2 h)
**Depends on:** #<issue> or none
**Files owned:** `src/app/<track>/_components/<feature>.tsx`, `src/app/<track>/_lib/<feature>.ts` (only these; nobody else edits them)

### Goal
One or two sentences on what this adds and why the judges care.

### Acceptance criteria
- [ ] What a person can see or do when it's done
- [ ] Which `CHECKLIST.md` rubric item it checks off
- [ ] `pnpm lint && pnpm tsc && pnpm build` pass

### Notes
Files to touch, contracts to respect, links.
