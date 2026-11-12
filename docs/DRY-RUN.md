# Tonight's dry run (about 60 minutes)

Goal: prove the strike-and-scout loop with real agents before Friday. The strike team builds Lenovo while the scouts prep Medtronic, then everyone switches.

## 0. Lead, once (10 min)
1. Merge the template into `main` and push.
2. Create issues #1 to #7 in order, titled `lead`, `rtx`, `cisco`, `amat`, `sandia`, `lenovo`, `medtronic`, from the **Message board** template. Pin #1.
3. Settings > Pages: deploy from `main`, root. The dashboard is at `https://aicsquared.github.io/orchestration-test1/dashboard/`.
4. Supabase: create one project. SQL editor: run `supabase/migrations/20261113000000_init_schema.sql`. In Authentication settings, under the Email provider, turn off "Confirm email" for the event.
5. Vercel: import the repo, add the three Supabase variables from `.env.example`, deploy.
6. Fill in AGENTS.md section 6: active track Lenovo (#6), queue Lenovo then Medtronic. Strike: the 4 Claudes. Scouts: Alex's Codex and Gemini.

## 1. Everyone (10 min)
```bash
gh repo clone aicsquared/orchestration-test1 && cd orchestration-test1
pnpm install
cp .env.example .env.local        # paste the Supabase values from the lead
cp .board.env.example .board.env  # strike: BOARD_ISSUE=6 BOARD_WATCH=1,6 · scouts: BOARD_ISSUE=7 BOARD_WATCH=1,7
tools/board whoami
tools/board post "[<Name>'s Human] STATUS online"
pnpm dev                           # http://localhost:3000 should show the six tracks
```
Windows: Git Bash or WSL. Mac: Paradev workspaces copy `.board.env` automatically.

## 2. Plan and split Lenovo (10 min)
Fake brief: "Show a live view of a laptop fleet's battery health, flag any device below 70%, and let an operator mark it for service."
1. Lead's Claude: `docs/prompts/01-plan.md` with that brief, save `docs/plans/lenovo.md` with tasks and the files each one owns.
2. Lead's Gemini: `docs/prompts/02-split.md`. It posts a `REQ` on #1.
3. Lead posts `[Alex's Human] DECISION ...` and creates 4 issues: 3 component tasks plus the integrator task.

## 3. Strike and scout at the same time (20 min)
- **Strike (4 Claudes):** `docs/prompts/03-builder-kickoff.md`, one issue each, only the files listed. The integrator wires them into `page.tsx` as PRs land.
- **Scouts:** Gemini posts a `FINDING` for this fake Medtronic brief: "Track a patient's glucose readings and alert a nurse when 2 in a row are out of range." Codex follows `docs/prompts/04-scout.md` and opens `medtronic: scout`.

## 4. Switch tracks (5 min)
Lead posts `DECISION: Lenovo done, Medtronic active`. Strike builders change `.board.env` to `BOARD_ISSUE=7 BOARD_WATCH=1,7`, `/clear`, and each picks up one task from the scouted plan. Time how long it takes until the first Medtronic PR opens.

## 5. Drills (5 min)
- Close one agent without `OFFLINE`, then run `tools/board quiet --minutes 3`. It should be flagged.
- Post without a label. The script should refuse it.
- Two builders edit the same file on purpose. Note how the conflict shows up and who catches it.
- `/rc` in one Claude session and approve something from a phone.

## It passed if
- Every agent shows on the dashboard; every `REQ` got `ACK` then `DONE`.
- Lenovo PRs merged with no conflicts, `pnpm build` green, and the Vercel preview shows the new Lenovo screen.
- The Medtronic scout PR merged and its page rendered sample data before the strike team arrived.
- A job created at `/dashboard` goes from queued to done.

Write every snag on #1 as a `STATUS` post. Fix the kit before Friday.
