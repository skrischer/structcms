# StructCMS — Roadmap

> Living document: the sequenced queue of phases. Hand-off to `/loopkit:plan`,
> which picks the next phase, creates its spec + issues, and links them back here.

## Phase overview
| Phase | Name | Spec | Milestone |
|---|---|---|---|
| 1 | Feature-Level Audit | [spec](docs/specs/spec-feature-audit.md) | [Phase 1](https://github.com/skrischer/structcms/milestone/1) |
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
**Phase 2: Lifecycle Hooks & Webhooks**

Phase 1 (Feature-Level Audit) is planned and in progress — see its
[spec](docs/specs/spec-feature-audit.md) and
[milestone](https://github.com/skrischer/structcms/milestone/1). Next to plan:
lifecycle hooks that fire on content events (create/update/publish/delete) plus
outbound webhooks for host integrations. Scope here is provisional — Phase 1's
verified gap report may reorder or reshape this and the phases after it.

## North star
A code-first headless CMS that grows from typed content modeling to staged,
localized, multi-site delivery without ever leaving the host repository or
sacrificing type safety.
