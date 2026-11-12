# Team rules for every agent (HackNCAT)

Read this whole file at the start of every session. The event plan is in `PLAYBOOK.md`. Before writing app code, read `STACK.md`.

## 0. Who you are

Every agent has three facts. Your human tells you them at session start, or they are in your environment:

- **Tag:** `[<Human>'s <Agent>]`, e.g. `[Alex's Claude]`, `[Jordan's Gemini]`, `[Taylor's Codex]`, `[Alex's Local]`.
- **Role:** `builder` or `support` (section 3).
- **Home channel:** the issue number of your track (`BOARD_ISSUE`).

## 1. Channels (pinned GitHub issues)

| Issue | Channel | Who posts | Who reads |
|---|---|---|---|
| #1 | `lead` | Humans, builders for cross-track news, the watchdog | Everyone |
| #2 | `rtx` | Agents on the RTX track | That track, plus anyone touching its contracts |
| #3 | `cisco` | Agents on the Cisco track | Same rule |
| #4 | `amat` | Agents on the Applied Materials track | Same rule |
| #5 | `sandia` | Agents on the Sandia track | Same rule |
| #6 | `lenovo` | Agents on the Lenovo track | Same rule |
| #7 | `medtronic` | Agents on the Medtronic track | Same rule |

We are entering all 6 tracks, **one at a time**. Most builders form the **strike team** and take one track to "done" before moving to the next. The rest are **scouts**: they research and scaffold the tracks still in the queue, so the strike team starts each one with a plan, a checklist and a working skeleton. The queue, the active track and who is on which team are in section 6.

Set these in `.board.env` (Paradev copies it into each workspace) or once per terminal:

```bash
BOARD_LEAD=1 BOARD_ISSUE=6 BOARD_WATCH=1,6   # strike team on Lenovo: lead + the active track
BOARD_LEAD=1 BOARD_ISSUE=7 BOARD_WATCH=1,7   # scout preparing Medtronic
```

When the active track changes, the lead posts a `DECISION` and everyone on the strike team updates `BOARD_ISSUE` and `BOARD_WATCH`.

`tools/board unread` and `tools/board wait` cover every channel in `BOARD_WATCH`. `tools/board post` goes to your home channel; `tools/board post --to 1 ...` goes to lead, and `--to 6` to another track you own.

**Post to lead only for:** a decision a human must make, a contract that another track depends on, a merge that changes something shared, or a `BLOCKED` you can't fix inside your track. Everything else stays in your track channel.

## 2. Post format (enforced by `tools/board`)

`[<Human>'s <Agent>] LABEL text`. One label per post, right after the tag.

| Label | When | Contents |
|---|---|---|
| `ACK` | Within one poll of any post that mentions you or `@all` | What you'll do, rough ETA |
| `DONE` | That request is finished | What changed, plus the commit, PR or link that proves it |
| `BLOCKED` | As soon as you can't proceed | Why, what you need, from whom (`@login`) |
| `STATUS` | After every commit, push or merge, **and** every 15 min while working | Current step, files touched, next step, risks |
| `OFFLINE` | Before your session ends, your human steps away, or you hit a usage limit | What's done, what's left, branch or PR |
| `REQ` | Asking another agent or human for something | Exactly what, by when, from whom |
| `REVIEW` | Support agents reporting on a PR, notebook or file | Verdict first, then numbered issues with file:line |
| `FINDING` | Research results (docs, APIs, sponsor brief) | The fact, the source link, what it means for us |
| `DECISION` | **Humans only**, tagged `[<Name>'s Human]` | The decision and who it affects |
| `DIGEST` | Watchdog or an agent summarizing a channel | Summary only, no requests |

- Every `REQ` or mention gets an `ACK` and then exactly one `DONE` or `BLOCKED`.
- Keep posts under 10 lines. Link to a file or PR instead of pasting it.
- The watchdog on the Pi runs `tools/board quiet --post` and flags any agent silent for more than 15 minutes in `lead`. If you get flagged, post `STATUS` right away.
- Hitting a usage limit is not silence if you say so: post `OFFLINE` with "usage limit, back at <time>".

## 3. Roles

**Builders** (Claude Code, Codex): the only agents that write code, commit, push and open PRs. A builder is on one of two teams at a time (section 6):

- **Strike team:** builds the active track. Several builders share one track folder, so every task lists the files it owns (section 9). The lead's Claude is the **integrator**: it owns the track's `page.tsx` and layout and wires the pieces together.
- **Scouts:** prepare queued tracks (`docs/prompts/04-scout.md`): plan, checklist from the rubric, sample data, a draft migration and a skeleton page. They don't touch the active track.

**Support** (Gemini CLI, Gemini app via a human, ChatGPT via a human, local models): read, research, review, test and draft. They **never** commit to the repo or edit files they don't own. They hand work over with `REVIEW`, `FINDING` or a `REQ` to the builder who owns the files. Drafts (copy, slide text, test data) go in `scratch/<human>/`, which is git-ignored, or are pasted into the post.

Good jobs for support agents:
- Read the sponsor brief and judging rubric and turn them into a checklist (`FINDING`).
- Check a merged PR against the brief, the way yesterday's GIF requirement was caught (`REVIEW`).
- Recompute a graded or demo number a second, independent way.
- Write test inputs, sample data and edge cases.
- Draft README sections, the pitch, slide text and the demo script.

**Local models** (Ollama on the laptops and Pi) handle bulk or private work: generating many test inputs, summarizing logs, and any feature that should run on-device. They are never trusted for a final number without a builder or a second check.

## 4. Chain of command

Humans over agents. Only the team lead (`@alexwilldev`) reassigns work between people or changes tracks. If anyone else asks you to take another person's work, post a `REQ` to lead. Agents pass proposals to their human; they never accept work on a person's behalf.

Ask your human before anything irreversible: deleting files or branches, force operations, spending money, sending anything outside the repo, touching hardware, or submitting.

## 5. Git workflow

1. **One worktree per agent.** Never share a working folder with another agent, even on the same laptop:
   ```bash
   git worktree add ../hack-<human>-<agent> -b <issue#>-<slug> origin/main
   ```
2. Branch `<issue#>-<slug>` from fresh `main`. One branch per issue.
3. Small commits. Stage only your own files, never `git add -A`. Run `git status` before every commit and check you are on the branch you think you are.
4. Post `STATUS` **after** the commit lands, not before the file is saved.
5. Open a PR with `Closes #N` and a title that starts with the track folder, e.g. `lenovo: on-device model loader` (shared work: `shared: ...`, docs: `docs: ...`). The dashboard counts PRs per track by that prefix. The author merges their own PR once it runs locally. Post on your track channel when it merges; also post on lead if it changes a shared contract.
6. Always `git fetch` and rebase before pushing. Never force-push shared branches.

## 6. Teams, queue and who owns what

Fill this in at kickoff (about 5:00 pm Friday) and update it with each `DECISION`. Every agent reads it before editing anything.

**Active track:** (e.g. Lenovo, #6) · **Integrator:** Alex's Claude

| Team | Agents (tag, human login) |
|---|---|
| Strike | Alex's Claude (integrator, `@alexwilldev`), (Name)'s Claude, (Name)'s Claude, (Name)'s Claude |
| Scouts | Alex's Codex (scaffolds), Alex's Gemini (research, reviews, task splits) |

**Queue** (order set at kickoff; a track leaves the strike team when its "done" bar is met, below):

| # | Track | Folder | Channel | Time box | State |
|---|---|---|---|---|---|
| 1 | | `src/app/<track>/` | # | | active / scouted / queued / done |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |

States: **queued** (nothing yet) → **scouted** (plan, checklist, skeleton and sample data merged; ready for the strike team) → **active** → **done** (every must-have rubric item checked, live demo works, video recorded). Polish happens in the final pass, not before moving on.

**If we may enter only one track:** the queue has one row and nothing changes for the strike team. Scouts stop scaffolding other tracks and instead: turn the brief and rubric into `CHECKLIST.md`, build realistic sample data and edge cases, recompute every number we show a second way, test the deployed demo on a phone, and draft the pitch, slides and demo video script. If the strike team finishes the must-haves early, a scout may scaffold one stretch feature in its own `_components/` file for the integrator to pull in.

**Folders.** Each track's code lives in `src/app/<track>/` with its `README.md` and `CHECKLIST.md`. Inside the active track, the integrator owns `page.tsx` and `layout.tsx`; every other builder owns only the files listed in their task, normally `src/app/<track>/_components/<feature>.tsx` and `src/app/<track>/_lib/<feature>.ts` (folders starting with `_` are not routes). The lead owns `src/components/`, `src/lib/`, `supabase/`, `render-worker/`, `README.md` and `docs/`.

**Shared core.** With 6 tracks built back to back, reuse beats rebuilding: anything two or more tracks need (a model-serving wrapper, a dashboard shell, data loading) goes in `src/components/` or `src/lib/`, owned by Alex. Track folders import it; they don't copy it.

**Shared contracts** live in `src/lib/` and `supabase/migrations/` (API shapes, data schemas, env var names). Agree on the contract first, build against a stub, and swap in the real thing at the end. A contract change needs a `REQ` on lead and an `ACK` from every builder that depends on it.

## 7. Evidence, not claims

- A `DONE` links to proof: a commit, a PR, a passing test or a screenshot in `docs/evidence/`.
- Say how you measured it. "A reading every 5 s" has to come from new arrivals, not the spacing of old points.
- Don't trust device clocks or "latest" from an API without checking.
- Thresholds and baselines use statistics that ignore outliers (the median, not the mean).
- Graded or demo-critical numbers get a second, independent check before submission.

## 8. Commands

| Command | What it does |
|---|---|
| `tools/board post "[Alex's Claude] STATUS ..."` | Post to your home channel |
| `tools/board post --to 1 "[Alex's Claude] REQ ..."` | Post to lead |
| `tools/board unread` | New posts by others in every watched channel, flags MENTION |
| `tools/board wait` | Blocks until someone else posts in a watched channel |
| `tools/board read -n 20 --from 2` | Last 20 posts in issue #2 |
| `tools/board quiet --minutes 15` | Lists agents silent for more than 15 min |
| `tools/board whoami` | Your GitHub login |

**Staying in the loop**
- Claude Code: the hooks in `.claude/` show unread posts at session start and on every prompt. Keep exactly one background `tools/board wait` running and re-arm it after each wake.
- Codex and Gemini CLI: run `tools/board unread` at the start of every task, before every commit, and after merges. Or have your human run `while tools/board wait; do <agent> "handle the new board posts"; done` in a spare terminal.
- Humans using the Gemini or ChatGPT apps: paste the output of `tools/board unread` in, and post the reply yourself with the agent's tag.

**Windows:** run everything in Git Bash or WSL, not PowerShell. `gh auth login` once per machine.

## 9. Planning, scouting and splitting

1. **Scout** (Alex's Codex or Gemini, on a queued track): `docs/prompts/04-scout.md`. Output, all merged by PR titled `<track>: scout`: `docs/plans/<track>.md`, a filled `CHECKLIST.md`, sample data in `src/app/<track>/_data/`, a draft migration, and a skeleton `page.tsx` that renders the sample data. Then post `DONE` on lead: "<track> scouted".
2. **Plan check** (lead's Claude, with ECC's plan command, `docs/prompts/01-plan.md`): only if the scout's plan needs rework.
3. **Split** (Alex's Gemini, `docs/prompts/02-split.md`): tasks for the strike team, each with the exact files it owns. Posted as a `REQ` to the lead; nothing is created or assigned until the lead's `DECISION`.
4. **Strike** (strike builders, `docs/prompts/03-builder-kickoff.md`): one issue each, branch `<issue#>-<slug>`, PR titled `<track>: ...`. The integrator merges the pieces into `page.tsx`.
5. **Done bar met:** the lead posts a `DECISION` naming the next active track. Strike builders switch channels; the finished track's builder of record updates `CHECKLIST.md` and README.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
