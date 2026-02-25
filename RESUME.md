# StructCMS — Resume Instructions

**Read this when starting a new session to continue work.**

## Context
StructCMS is being completed as a product. Work is tracked in `PLAN.md`.

## How to Resume
1. Read `PLAN.md` for current phase and task status
2. Check `git log --oneline -10` on branch `develop` for recent commits
3. Run `pnpm build && pnpm test:run` to verify current state
4. Pick up the next unchecked task from PLAN.md
5. Spawn sub-agents (agentId: coder) for implementation work
6. Monitor Anthropic usage via session_status — stop at <15%

## Key Rules
- Work ONLY on `develop` branch
- Never touch `main`
- All commits must pass: `pnpm build && pnpm test:run`
- Max 2 concurrent sub-agents
- Update PLAN.md after completing each phase

## Rate Limit Strategy
- Check `session_status` before spawning agents
- At <15% usage remaining → STOP, update PLAN.md with state, wait for reset
- The 5h window resets, then work can continue
- All state is in PLAN.md + git commits — nothing lives only in memory
