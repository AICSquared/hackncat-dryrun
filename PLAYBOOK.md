# HackNCAT playbook

**Where:** Martin Engineering and Research Innovation Complex, NC A&T
**When:** Friday 4:00 pm to Saturday a bit after 5:00 pm (about 25 hours). Confirm the exact submission deadline at kickoff and adjust the times below.
**Tracks:** we plan to enter all 6 (RTX, Cisco, Applied Materials, Sandia National Laboratories, Lenovo, Medtronic), **one at a time**. If the rules limit us to one track, the same plan runs with a queue of one (AGENTS.md section 6). Sponsor prompts are revealed at kickoff.

What carries over from JSNN: agree on interfaces, not implementations; make silence easy to spot; check graded numbers a second way; read the source; humans approve anything irreversible. What changes: 4 people and about 10 agents instead of 2 and 2, so the board is split into channels, only builders write code, and a watchdog flags quiet agents.

## 1. The roster

| Person | Machine | Builder agent | Support agents |
|---|---|---|---|
| Alex (lead) | 14" M1 Pro, 16 GB | Claude Code **and** Codex (two tracks, two worktrees) | Gemini, ChatGPT app, local model, Pi watchdog |
| | 14" M5 Pro, 16 GB | Claude Code | Gemini, local model |
| | Lenovo Legion LOQ, 32 GB, RTX 5060 | Claude Code or Gemini CLI | Gemini, **team GPU box**: local 7 to 14B models |
| | Acer, 16 GB | Claude Code or Gemini CLI | Gemini |

Fill in names. The 4 Claudes are the **strike team** (Alex's Claude integrates). Alex's Codex and Gemini are the **scouts**: they research and scaffold the next track in the queue so the strike team never starts from a blank page.

**What each subscription is actually good for here**
- **Claude Pro (x3):** the builders. Shared 5-hour and weekly limits across Claude Code and the app, so don't burn it in the chat app during the event.
- **Gemini (x4):** everyone claims the free Google AI Plus student year (cancel before it renews). Plus helps in the Gemini app (higher limits for reading long sponsor docs, plus image and video generation for slides) but does not raise Gemini CLI limits, so the CLI runs on the free Google-account quota. Gemini stays the review and research layer; Claude, Codex and OpenCode do the building.
- **ChatGPT Plus (Alex):** Codex as Alex's second builder, plus the app for pitch writing and independent rechecks.
- **Local models:** bulk test data, log summaries, and anything that should run on-device. The Lenovo with the 5060 is the strongest; it fits 7 to 8B models fully on the GPU and 14B models with some spillover into its 32 GB of RAM.
- **Local model picks (pull them before Friday):**
  - 16 GB Macs (M1 Pro, M5 Pro): Qwen 3.5 9B at 4-bit as the everyday model (`ollama pull qwen3.5:9b`). Alex also keeps the abliterated build (`huihui_ai/qwen3.5-abliterated:9b`) for internal bulk work only; anything a judge sees or that ships in a demo uses the stock model. `gpt-oss:20b` (about 14 GB) only with everything else closed, so not while the builders are running.
  - Legion (8 GB VRAM, 32 GB RAM): the same 8 to 9B fully on the GPU for speed. Larger models spill into system RAM and get much slower.
  - Skip Kimi locally: even its 2-bit build is about 350 GB. Reach it through Moonshot's API or OpenRouter if a track wants it.
  - Pi 5 8 GB: Qwen 3.5 2B (`huihui_ai/qwen3.5-abliterated:2b`, or stock `qwen3.5:2b`) for watchdog digests. Needs the active cooler.
- **Pi 5 8 GB in the dorm:** runs the watchdog. Too slow for real model work (expect a few tokens a second on a 1 to 3B model). Skip the Pi cluster; the 1 GB Pi 3B would slow it down and setup time is better spent on the project.

**Pitch angle worth checking against the briefs:** an AI feature that runs fully on-device (no data leaves the machine) on the Lenovo could fit the Lenovo track and any track where data privacy or air-gapped systems matter (medical, defense, national labs).

## 2. Claude budget

- Weekly limits reset at 2:00 am Friday for Alex, so everyone with the same reset starts the event with a full week. Check each person's reset time with `/usage`.
- The 5-hour window starts at your first message. If you expect to burn the first window fast, send one short message around 2:00 pm Friday so the first reset lands around 7:00 pm, mid-sprint.
- Yesterday 99.5% of input was the agent re-reading its own long conversation. So: `/clear` or start a fresh session between tasks, and hand off with an `OFFLINE` post plus the branch name instead of keeping one giant session alive.
- Use the lighter model (`/model`) for routine edits, docs and board chatter. Save the strongest model for design, debugging and hard integration.
- **Fable launch week (Nov 9 to Nov 16, 11:59 pm PT):** Pro plans can spend up to 50% of the weekly limit on Fable models, plus one Fable limit reset (Settings, then Usage). Fable drains the limit faster than other models, so it is not extra capacity except for the reset.
  - Default model: Opus 5.5. Routine edits and board chatter: Sonnet. Fable 5.2: kickoff architecture of `shared/`, bugs Opus can't crack in two tries, and the final rubric audit of each track.
  - Each Pro account now has **two** limit resets (Settings, then Usage). A reset refills what you've used, so never press it with plenty left.
    - Reset 1: when that person's limit runs low, most likely overnight or early in Sprint 2 (Saturday 6 to 9 am).
    - Reset 2: hold for the final push (Saturday noon to 3 pm): polish, demo fixes and the Fable rubric audit of each track.
    - Stagger across the three Claude accounts so no two people reset at the same time and someone always has headroom.
    - Both expire with the launch week (Nov 16), so anything unused after Saturday is lost.
  - Fable 5.2 blocks high-risk security work (pen testing, exploit or binary vulnerability analysis) and hands it to an older model. If the Cisco or a defense brief goes there, use Opus 5.5.
  - Anyone whose weekly limit resets before Friday can use Fable freely this week for prep (dashboard, kit, practice runs) at no cost to the event.
- **Extra usage:** buy it before Friday, set a monthly spending cap, then log out and back in to Claude Code and confirm `/usage` shows the balance. People have reported the CLI not picking up a new balance until they did that.
- When a builder hits a limit, it posts `OFFLINE usage limit, back at <time>`, and the human switches to their Gemini or Codex for review work until the reset.

## 3. Timeline (adjust to the real deadline)

Time boxes assume 6 tracks. With fewer, give each one more time; with one, the strike team has the whole event and scouts do research, checks and the pitch.

| Time | What | Done when |
|---|---|---|
| Fri 4:00 to 5:00 | Kickoff. Gemini reads every brief and posts a `FINDING` per track: problem, judging criteria, data or hardware, what must be submitted. Confirm whether we may enter more than one track. | Findings on lead |
| 5:00 to 5:30 | **Queue order** (humans). Score each track 1 to 5 on fit, demoability and what it shares with others. Best fit first, while everyone is fresh; the two weakest last. Spot shared pieces for `src/components` and `src/lib`. | `DECISION` on lead, section 6 filled |
| 5:30 to 6:30 | Strike team plans and splits track 1. Scouts start track 2. | Track 1 issues created |
| 6:30 to 10:30 pm | **Track 1** (about 4 h). | Done bar met |
| 10:30 pm to 2:00 am | **Track 2** (about 3.5 h, already scouted). Scouts on track 3. | Done bar met |
| 2:00 to 5:00 am | Sleep in shifts: two strike builders sleep 3 h while two keep going on **track 3**, then swap. Sleeping builders post `OFFLINE`. No unattended agent touches `main`. | Track 3 near done |
| 5:00 to 8:00 am | Finish track 3; **track 4** (about 3 h). | Done bars met |
| 8:00 to 10:30 am | **Track 5** (Tier 2: smallest thing that fully meets the brief). | Done bar met |
| 10:30 am to 1:00 pm | **Track 6** (Tier 2). Scouts move to videos, READMEs and second-way checks of every number. | Done bar met |
| 1:00 pm | **Feature freeze.** Bug fixes only. | `DECISION` on lead |
| 1:00 to 3:00 pm | Final pass: polish tracks 1 and 2 most, a video per track, slides, Fable rubric audit. | A video per track |
| 3:00 to 4:00 pm | Pitch dry runs. Submit each track as it's ready, all at least an hour before the deadline. | All submissions in |
| After | Run `metrics/collect.py` for the AI report. | |

**Running over:** if a track blows its time box by 30 minutes, the lead decides: cut scope to the must-haves, or park it and come back in the final pass. Never let one track eat the next one's time.

## 4. Channels

Create these issues in this order so the numbers match AGENTS.md. GitHub only pins 3 issues per repo, so pin `lead`, the active track and the next scouted track:

1. `lead`: humans, decisions, cross-track contracts, watchdog digests
2. `rtx`
3. `cisco`
4. `amat` (Applied Materials)
5. `sandia`
6. `lenovo`
7. `medtronic`

Strike builders set `BOARD_ISSUE` to the active track and `BOARD_WATCH=1,<active>`; scouts use the track they're preparing. The lead watches everything.

## 5. Team dashboard

`dashboard/index.html` is a live control room: a countdown, every agent's latest status (yellow after 10 quiet minutes, red after 15, red when BLOCKED), each track's rubric progress from its `CHECKLIST.md`, merged PRs, demo and video links, and a feed of decisions, blocks and requests. It reads the board and repo straight from GitHub, so it uses **no AI credits**.

- **Host it:** in the repo's Settings, then Pages, deploy from the `main` branch. It's served at `https://alexwilldev.github.io/<repo>/dashboard/`.
- **Point it at the repo:** set `CONFIG.repo` (and the deadline) at the top of the file. Until then it shows demo data.
- **Each device, once:** Settings, then paste a fine-grained GitHub token with read-only access to public repositories and no other permissions. It stays in that browser. Without a token it refreshes every 2 minutes, and all devices on the venue Wi-Fi share a 60-calls-an-hour limit, so everyone should add one.
- **Views:** Everyone, or tap a name to see only that person's agents, tracks and mentions. Wall view scales it up for the monitor. Bookmark them: `#wall`, `#person-alex`, `#wall-person-alex`.
- **What keeps it accurate:** posts in the `[Name's Agent] LABEL` format (the board script enforces it), PR titles that start with the track folder, and an up-to-date `CHECKLIST.md` per track.

## 6. Pi watchdog (Alex's dorm)

On the Pi, inside the repo clone, in `tmux` so it survives SSH disconnects:

```bash
gh auth login                     # once
export BOARD_LEAD=1 BOARD_WATCH=1,2,3,4,5,6,7
while true; do tools/board quiet --minutes 15 --post; sleep 300; done
```

It posts a `DIGEST` to lead only when the set of quiet agents changes, so it won't spam. Reach the Pi from the venue with Tailscale (`ssh pi@<tailscale-name>`). Nothing in the demo depends on the Pi; if dorm Wi-Fi or power drops, the event goes on without it.

## 7. Pre-event checklist

**By Wednesday (Alex)**
- [ ] New repo from this kit, issues #1 to #7 created, lead pinned
- [ ] GitHub Pages on, `CONFIG.repo` set in `dashboard/index.html`, a `CHECKLIST.md` in each track folder from the template
- [ ] Everyone opens the dashboard on phone and laptop and adds a token; the wall view runs on the monitor laptop
- [ ] Before the event, have Gemini pull up what each sponsor does and its past hackathon prompts, so the team walks in with a sense of each track
- [ ] Teammates added as collaborators; names and logins filled in sections 1 and 6 of AGENTS.md
- [ ] Ask the organizers for the submission deadline, the judging rubric and whether there's wired Ethernet at the venue

**By Thursday night (everyone)**
- [ ] `gh auth login`, clone, `tools/board whoami`, then post `[<Name>'s Claude] STATUS test` from your own machine
- [ ] Windows laptops: Git for Windows (Git Bash) or WSL, plus `gh`. The board script needs bash.
- [ ] Builder installed and logged in: Claude Code, or Codex for the ChatGPT Plus account
- [ ] Free Google AI Plus student plan claimed; Gemini CLI logged in and picking up AGENTS.md via GEMINI.md
- [ ] Ollama installed, models already downloaded (don't count on venue Wi-Fi); Lenovo has current NVIDIA drivers
- [ ] Extra usage bought and confirmed in `/usage` (Claude users)
- [ ] Chargers, a power strip, and an HDMI or USB-C video adapter for the demo

**Alex's dorm and bag**
- [ ] Ask ITS whether a small unmanaged switch is allowed on the dorm Ethernet port (the network guide bans routers and "similar networking devices" but doesn't name switches), and make sure the Pi and the Mac's Ethernet adapter are registered
- [ ] 5-port unmanaged gigabit switch (a switch, not a router)
- [ ] Cat6 cable long enough for wall port to desk (measure first), plus the existing one
- [ ] 1 to 3 ft Cat6 cable and a USB-C Ethernet adapter for the bag
- [ ] Pi: Tailscale installed, auto-login and sleep off, SSH key from the Mac, watchdog tested. Test the connection from a phone hotspot, not the dorm network.
