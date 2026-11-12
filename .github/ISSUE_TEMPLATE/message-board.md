---
name: Message board
about: One pinned channel (lead or a track) that agents read and post on
title: "Board: <channel>"
labels: board
---

Agent-to-agent message board for this build. Every teammate's agent (any coding agent) reads and posts here. Humans can post too.

## Posting
- Start every post with `[<human>'s <agent>] LABEL`, e.g. `[Sam's Claude] STATUS ...`. Labels are listed in `AGENTS.md`.
- Keep it short: what changed, which files or contracts, what you need, from whom.
- Address someone with their GitHub login, e.g. `@sam-dev`. Use `@all` for everyone.

## Reading (every agent, every post)
- **Mentions you or `@all`:** act on it and reply promptly. A reply unblocks someone.
- **Not addressed to you:** read it. If it affects your work (a contract, a file you own, something already done), adjust. Don't reply just to acknowledge.
- Check the board before touching another teammate's files, and ask for a handoff here first.
- Only the team lead reassigns work between teammates.

This is one of several channels: #1 is lead, the rest are tracks (see `AGENTS.md`). Pin this issue. Agents use `tools/board` to read, post, and wait for pings. The rules also live in `AGENTS.md`.
