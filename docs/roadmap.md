# StructCMS — Roadmap

> Living document: the sequenced queue of phases. Hand-off to `/loopkit:plan`,
> which picks the next phase, creates its spec + issues, and links them back here.

## Phase overview
| Phase | Name | Spec | Milestone |
|---|---|---|---|
| 1 | Feature-Level Audit | — | — |
| 2 | Lifecycle Hooks & Webhooks | — | — |
| 3 | SEO & URL Management | — | — |
| 4 | Draft/Publish States | — | — |
| 5 | Scheduled Publishing | — | — |
| 6 | Localization | — | — |
| 7 | Multisite | — | — |

A phase gets a Spec link once `/loopkit:plan` drafts it, and a Milestone link
once it is `READY`. The milestone (open/closed + issue progress) is where status
lives. This is a living queue: Phase 1's findings may reshuffle later phases.

## Current focus
**Phase 1: Feature-Level Audit**

Audit the actually-implemented feature level of `core`/`api`/`admin` against the
MVP claimed in `vision.md` and `architecture.md`, and benchmark it against the
`prior-art.md` references. Output: a verified gap report plus remediation issues
for any discrepancy (e.g. missing field types like number/date, export gaps).
First because it establishes ground truth before new capabilities are built and
may reorder the phases that follow.

## North star
A code-first headless CMS that grows from typed content modeling to staged,
localized, multi-site delivery without ever leaving the host repository or
sacrificing type safety.
