# StructCMS — Completion Plan

**Owner:** Operator (autonomous until 2026-02-26 10:00 UTC)
**Branch:** develop (main = tabu)
**Constraint:** Anthropic 5h window — monitor, pause before limit, resume after reset

## Current State (2026-02-25 20:47 UTC)

- ✅ Core: builds, exports clean
- ⚠️ API: builds, 2 failing tests (factory test doesn't expect authAdapter)
- ⚠️ Admin: builds, but `tsc --noEmit` fails (can't resolve @structcms/core — needs project references or paths)
- ⚠️ Test-app: `next build` fails (Supabase env vars evaluated at build-time in route handlers)
- 📊 Tests: 359 pass, 2 fail, 56 skipped (of 417)
- 📊 Usage: 52% left, 1h12m until reset

## Vision

Ship StructCMS as a real, usable product:
- All packages build & typecheck clean
- All tests green
- StructCMSAdminApp actually works (data fetching)
- npm-publishable (scoped @structcms/*)
- Solid docs & README per package
- Test-app as working reference implementation

## Phases

### Phase 1: Stabilize (CURRENT)
- [x] P1.1: Fix API factory test (add authAdapter to expected result)
- [x] P1.2: Fix admin typecheck (project references or build order)
- [x] P1.3: Fix test-app build (lazy adapter initialization)
- [x] P1.4: Get all unit tests green

### Phase 2: Product Completion
- [ ] P2.1: StructCMSAdminApp — real data fetching (useApiClient in each view)
- [ ] P2.2: Auth flow verification (login, protected routes, session)
- [ ] P2.3: Content Export verification & test
- [ ] P2.4: Media resolve verification (image URLs in delivery API)

### Phase 3: Polish & Publish
- [ ] P3.1: README per package (install, quickstart, API reference)
- [ ] P3.2: Root README with badges, quickstart, architecture diagram
- [ ] P3.3: package.json cleanup (license, repository, keywords, files)
- [ ] P3.4: CHANGELOG.md
- [ ] P3.5: npm publish dry-run

### Phase 4: Quality
- [ ] P4.1: E2E tests passing (Playwright)
- [ ] P4.2: Full typecheck green across monorepo
- [ ] P4.3: Lint clean (biome)
- [ ] P4.4: Coverage report

## Rate Limit Strategy

1. Max 2 sub-agents concurrent (Sonnet 4.5)
2. Check usage before spawning new work
3. At <15% remaining: STOP all work, write state to PLAN.md
4. After reset: resume from where we left off
5. Write all progress to this file so context survives session boundaries

## Progress Log

### 2026-02-25 20:47 UTC — Session Start
- Assessed codebase, identified 4 stabilization issues
- Usage: 52% left (1h12m to reset)
- Strategy: Phase 1 first (fixes), then delegate Phase 2+ to sub-agents
