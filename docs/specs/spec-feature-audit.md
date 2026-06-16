# Spec: Feature-Level Audit (Phase 1)

> Status: DRAFT
> Created: 2026-06-16

Establish ground truth: verify what `core`/`api`/`admin` actually implement
against the MVP claimed in `vision.md`, `architecture.md`, `CLAUDE.md`, and the
package READMEs, and turn every verified discrepancy into structured remediation
output that reshapes the downstream roadmap before new capabilities are built.

## Outcome

- [ ] A verified feature-audit report exists at `docs/audits/feature-audit.md`,
      covering `@structcms/core`, `@structcms/api`, and `@structcms/admin`.
- [ ] Every claimed MVP capability (sourced from `vision.md`, `architecture.md`,
      `CLAUDE.md`, package READMEs) is checked against actual code and marked
      `ok` / `partial` / `missing` / `blocker` / `drift`, each verdict carrying a
      concrete `file:line` citation — no claim recorded as fact without a cite.
- [ ] Prior-art references relevant to the current MVP are benchmarked for
      fit/readiness (light touch; not a deep gap analysis).
- [ ] Each discrepancy is classified by severity and converted into remediation
      output per the accepted remediation-handling model (OPEN — gate decision).
- [ ] `docs/roadmap.md` reflects any reordering the findings imply, or records an
      explicit "no reorder needed" with justification.

## Scope

### In scope

- Feature-level completeness and correctness of **claimed** capabilities: does
  each documented feature exist, and does it actually work end-to-end?
- All three packages plus their cross-cuts: `core` (field types, registry,
  inference, `visibleWhen`), `api` (storage/media/delivery handlers, JSON export,
  the auth/session layer), `admin` (dynamic forms, section editors, media
  browser, hooks, auth UI).
- Documentation accuracy as a first-class finding type (`drift`): where docs
  describe behavior the code no longer has (e.g. the auth docs still describe a
  localStorage/Bearer client the code has since replaced with cookies).
- Verified bugs that render a claimed feature non-functional (e.g. `enableAuth`
  not mounting a gate) — these are `blocker`-class feature gaps.
- The `@structcms/api` auth/session seam already analysed this session is folded
  in as a head-start finding, re-verified against `file:line`.

### Out of scope

- Implementing any fix. This phase produces the report and remediation output
  only; remediation is downstream work.
- Deep security hardening — the auth security track lives in `docs/AUTH_AUDIT.md`
  and is updated there, not duplicated here. (This audit only records whether a
  claimed feature works, plus the bugs that break a claimed feature.)
- Performance, caching, and bundle-size analysis (explicit vision non-goals).

## Constraints

- The audit is static analysis against the codebase plus the existing test suite
  — no behavioral code changes. The only artifacts are the report doc and (per
  the gate decision) issue/roadmap edits. See `docs/constitution.md`.
- Audit method (precedent): verify each claim against `file:line`; distinguish
  *agnostic-by-design* from *unfinished seam* via the litmus test "if every
  consumer must write the same code to make the shipped client work, it belongs
  in the lib." This is the method already applied to the auth layer this session.
- Report location follows the existing audit-doc precedent (`docs/AUTH_AUDIT.md`)
  -> `docs/audits/feature-audit.md`.
- Severity scale (fixed): `blocker` (claimed feature non-functional) / `missing`
  (claimed, absent) / `partial` (claimed, incomplete) / `drift` (docs vs code
  mismatch) / `ok`.
- Prior-art (`docs/prior-art.md`) is indexed by concern and its phase numbers are
  stale relative to the current roadmap — benchmark by concern, ignore the
  numbering.
- Issue decomposition mirrors the architecture component map: one audit issue per
  package (`core`, `api`, `admin`) plus one synthesis issue that consolidates the
  report, classifies severity, emits remediation output, and proposes roadmap
  reordering. The synthesis issue depends on the three package audits.

## Human prerequisites

- [x] none — the audit is read-only static analysis plus the existing test
      suite. Live verification of behavioral claims uses the `test-app` and the
      `.env` / `.env.local` already copied by the worktree Bootstrap command; no
      new secret, account, or external provisioning is required.

## Prior decisions

| Decision | Rationale | Date |
|---|---|---|
| Report lives at `docs/audits/feature-audit.md` | Follows the existing `docs/AUTH_AUDIT.md` audit-doc precedent | 2026-06-16 |
| Audit method = claim -> `file:line` verification; agnostic-by-design vs unfinished-seam litmus test | Already applied to the auth layer this session; produces verifiable, non-speculative findings | 2026-06-16 |
| Fixed severity scale `blocker`/`missing`/`partial`/`drift`/`ok` | Keeps findings comparable and prioritisable across packages | 2026-06-16 |
| Issue split = one audit issue per package + one synthesis issue (synthesis depends on all three) | Mirrors the `architecture.md` component map; parallelisable audits, single consolidation point | 2026-06-16 |
| Doc accuracy (`drift`) is in scope; deep security hardening is not | Stale docs are a real MVP-trust gap; security depth has its own `AUTH_AUDIT.md` track | 2026-06-16 |
| Auth seam findings from this session fold into the `api` audit issue, re-verified | Avoids redoing work while keeping every finding cited | 2026-06-16 |
| OPEN — remediation-handling model: roadmap-first vs backlog-first vs hybrid | resolved at the spec-acceptance gate | — |

## Tracking

The decomposition into steps lives as GitHub issues, not here.

- Milestone: Phase 1: Feature-Level Audit (link added once created)
- Issues: created from this spec once it is `READY` — one per package audit plus
  the synthesis issue.

Each issue references this spec path in its body.

## Verification

This list doubles as the human milestone-QA-gate script.

- [ ] `pnpm verify` passes (the report is docs-only; no code behavior change).
- [ ] `docs/audits/feature-audit.md` covers all three packages, and every
      `present/partial/missing/blocker` verdict carries a `file:line` citation.
- [ ] The known findings are captured at minimum: field-type coverage vs claims
      (e.g. number/date/datetime), JSON-export coverage, the auth client/server
      cookie seam, `enableAuth` not gating, the `ProtectedRoute`
      `NEXT_PUBLIC_DISABLE_AUTH` bypass missing the `NODE_ENV` check, and the
      stale localStorage auth docs.
- [ ] Each discrepancy carries a severity and a remediation output item per the
      accepted model.
- [ ] `docs/roadmap.md` reordering is proposed, or "no reorder needed" is
      justified in the synthesis.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Audit creeps into fixing things | Fixes are explicitly out of scope; the only deliverables are the report + remediation output |
| A claim cannot be verified statically | Use the existing Vitest/Playwright suites; mark `unverified` explicitly rather than guess |
| Stale prior-art phase numbers mislead the benchmark | Benchmark by concern, not by the document's phase numbers |
| Findings imply heavy roadmap churn | Synthesis proposes the reorder; the human accepts changes at the QA gate, not the audit unilaterally |

## Decision log

- 2026-06-16: Report path, audit method, severity scale, issue decomposition, and
  the in/out-of-scope boundary fixed as Prior decisions above. Remediation-handling
  model left OPEN for the spec-acceptance gate.
