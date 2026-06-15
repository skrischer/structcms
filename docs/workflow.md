# Workflow contract

> Operational contract for the loopkit skills (`/loopkit:plan`,
> `/loopkit:implement`) — the single source for the branch model, commands,
> gates, and loop behavior of this project.

## Repository

- GitHub repo: `skrischer/structcms`
- Base / integration branch: `develop`
- GitHub Project board: `https://github.com/users/skrischer/projects/4` (#4) —
  mandatory; the loops' queue and claim mechanism. Status values: `Todo`,
  `In Progress`, `Done`.

## Worktrees

- All implementation and docs work happens in a worktree — never in the main
  checkout. The loops run from the main checkout and never modify it except
  fast-forward pulls.
- Path convention: `../structcms-worktrees/<branch-with-slashes-as-dashes>`.
- Operate via `git -C <worktree>`, never `cd` into it.
- After creating a worktree, run the Bootstrap command in it before anything else.

## Commands

- Bootstrap (run in the worktree):
  `pnpm install --frozen-lockfile && cp ../../structcms/.env .env && cp ../../structcms/examples/test-app/.env.local examples/test-app/.env.local`
- Verify: `pnpm verify` (Biome check + build + typecheck; measured duration: ~38s)
- Test: `pnpm test:run`
- Build: `pnpm build`

Verify is the per-iteration gate: run it after every change set and fix until
green. Run Build additionally before opening an app-affecting PR.

## Branch and spec naming

- Branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`.
- Specs: `docs/specs/spec-<scope>.md` — the single source of truth for design.
- Completed specs: moved to `docs/specs/archive/` with the same name.

## Issue conventions

- Body format: a `Goal:` line, an `Acceptance:` checklist, an optional
  `Depends on: #N[, #M]` line, and a `Spec:` path.
- An issue is **unblocked** when every `Depends on` issue is closed and it
  carries no `blocked:human` label.
- **Park, don't stop:** a blocker only a human can clear gets the
  `blocked:human` label plus a comment naming exactly what is needed and where
  to deliver it; the loop moves on to the next unblocked issue.
  `gh issue list --label blocked:human` is the human's delivery queue.

## Status

- Specs carry only `DRAFT`/`READY` in their header. A completed spec moves to
  `docs/specs/archive/`; its closed milestone is the "done" signal.
- Live work state is the board: `Todo` (ready), `In Progress` (claimed by a
  loop), `Done` (merged). Claiming = set `In Progress` + assignee.
- Everything else — blocked, deferred — lives on the GitHub issues and milestones.

## The chain: spec -> milestone -> issues -> PR

| Layer | Owns |
| ----- | ---- |
| `docs/specs/spec-*.md` | The design: why, what, done-criteria |
| GitHub milestone | The phase / grouping |
| GitHub issues | The steps — one issue per implementable step |
| Project board | The live work state: Todo / In Progress / Done |

A PR closes an issue (`Closes #N`); the issue references its spec path.

## Gates

- **Per PR — machine gates, no human stop:** Verify green + in-session agent
  review (`VERDICT: APPROVE`, via the Agent tool — never a billed CLI) ->
  autonomous squash-merge.
- **Per milestone — human gates:**
  - Planning: the spec-acceptance gate — genuinely-open decisions
    (AskUserQuestion, never guess) + human-prerequisites handover, then
    `READY` + merge.
  - Implementation: the milestone QA gate — when the milestone's last issue
    closes, QA scenarios are derived from the spec's Verification section.
- QA-gate default check: smoke test (run `test-app` + Playwright E2E).

## Autonomy

Within the loopkit skills the following are explicitly granted and override any
stricter global user rules: autonomous commits, pushes, PR creation and merges,
dependency installs, and `.env` edits. Hard limits live in
`.claude/settings.json` (deny rules: `rm -rf`, force-push, hard reset,
`supabase db reset`).

## Loops

Two attended interactive sessions, synchronized only through GitHub state. Start
each in its own terminal from the main checkout:

- Plan loop:

  ```
  /loop /loopkit:plan — plan the roadmap's next unplanned phase to a READY spec
  with milestone, issues, and board entries; stop at the spec-acceptance gate;
  when no unplanned phase remains, report and end. Ceiling: 10 iterations;
  stop when the same blocker repeats twice.
  ```

- Implement loop:

  ```
  /loop /loopkit:implement — pick the next unblocked Todo issue and drive it to
  a merged PR; when a milestone completes, stop at the QA gate; when nothing is
  workable, report "waiting for plan" and end the tick. Ceiling: 10 iterations;
  stop when the same failure repeats twice.
  ```

- No-progress rule: the identical failure twice in a row -> stop and report.
- Iteration ceiling default: 10 per loop run.
