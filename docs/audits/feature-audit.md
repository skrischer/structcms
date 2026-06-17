# StructCMS Feature-Level Audit (Phase 1)

> Verifies what `core`/`api`/`admin` actually implement against the claimed MVP
> (`vision.md`, `architecture.md`, `CLAUDE.md`, package READMEs). Every verdict is
> backed by a `file:line` citation — no claim recorded as fact without one.
>
> Method: claim -> `file:line` verification; *agnostic-by-design* vs *unfinished
> seam* litmus test. Spec: `docs/specs/spec-feature-audit.md`.
>
> Status: in progress — package sections are filled per issue (#24 core, #25 api,
> #26 admin); the synthesis (#27) consolidates, stitches the cross-package auth
> seam, classifies severity, and emits the roadmap-first remediation.

## Severity legend

| Verdict | Meaning |
| --- | --- |
| `ok` | Claimed capability exists and works as documented |
| `partial` | Claimed, but incomplete or works only under conditions |
| `missing` | A reasonable MVP capability is absent |
| `blocker` | A claimed capability is present but non-functional / misleading |
| `drift` | Docs describe behavior the code no longer has, or a silent footgun |

---

## @structcms/core

Claimed responsibility (`architecture.md:9`, `CLAUDE.md`): "Section/page-type
modeling, registry, field types, type inference (zod only)". Verified against
`packages/core/src`.

### Findings

| # | Claim / capability | Verdict | Evidence | Note |
| --- | --- | --- | --- | --- |
| C1 | Code-first section modeling (`defineSection`) | `ok` | `define-section.ts:21-32` | Wraps `z.object(config.fields)`; types inferred |
| C2 | Page-type modeling (`definePageType`) | `ok` | `index.ts:2`, `types.ts:70-81` | Thin `{ name, allowedSections }` |
| C3 | Navigation modeling (`defineNavigation`) | `ok` | `index.ts:3-7`, `types.ts:86-97` | Optional custom item schema |
| C4 | Registry (`createRegistry` + getters, duplicate-name guards) | `ok` | `registry.ts:25-85` | Throws on duplicate names (`:31-35`); freezes single gets (`:60,69,78`) |
| C5 | Type inference (`InferSectionData`) | `ok` | `types.ts:65` | `z.infer<T['schema']>` |
| C6 | Conditional visibility (`visibleWhen`) | `partial` | `fields.ts:147-160` | No-op on raw zod schemas — returns the schema unchanged when no field meta is present (`:153`); only works on `fields.*`-wrapped schemas |
| C7 | Field types: `string`, `text`, `richtext`, `image`, `reference`, `array`, `object`, `boolean`, `select`, `file`, `url` | `ok` | `fields.ts:60-140`, `types.ts:6-17` | 11 types present; `FieldType` union matches the helpers |
| C8 | Field type: `number` | `missing` | `fields.ts:60-140` (absent) | No numeric field. Modelling a number needs raw `z.number()`, which loses the admin field-type (see R2); `z.number()` appears only in core test files |
| C9 | Field types: `date` / `datetime` | `missing` | `fields.ts:60-140` (absent) | No temporal field type — a common CMS need (publish dates, event dates) |
| C10 | Framework-agnostic section renderer (`createSectionRenderer`) | `partial` | `section-renderer.ts:28-56` | See R1 — calls components as plain functions; safe for stateless/Server components, breaks React Client Components |
| C11 | `core` depends only on `zod` | `ok` | `index.ts:1-30`, all `src/*` imports | Constitution boundary respected (`constitution.md`); `packages/core/src` is `any`-free (grep-verified, tests excluded) |

### Notes & risks

- **R1 — `createSectionRenderer` calls components as plain functions
  (`section-renderer.ts:38`).** It invokes `component({ data, sectionKey })`
  directly rather than as a React element (`<Component {...props} />`). For
  stateless function components and React Server Components this renders fine, but
  a **React Client Component** that uses hooks, state, or context is invoked
  outside React's reconciler — hooks throw or misbehave. The renderer's doc
  comment claims "Framework-agnostic: works with React, Preact, Vue"
  (`section-renderer.ts:5`, echoed in `packages/core/README.md:117`), which holds
  only for stateless components. This matches the project's recorded
  guidance to prefer a typed `getComponent()` map for RSC client components.
  Classified `partial`, not `blocker`, because the documented stateless usage
  works.

- **R2 — Field metadata is smuggled through the zod `description`
  (`fields.ts:9-15, 65-139`).** Each `fields.*` helper stores its metadata as a
  JSON string in `.describe()`. A consumer who calls `.describe('my label')`
  *after* a field helper (e.g. `fields.string().describe('Title')`) silently
  overwrites the metadata, so `getFieldMeta` returns `null` (`fields.ts:21-25`)
  and the admin loses the field type. This is an undocumented footgun
  (`drift`-class): the natural zod API for adding a description collides with the
  metadata channel. No guard or warning exists.

- **C8/C9 (number, date)** are the headline core capability gaps. They are not
  claimed in the docs' field list, so they are `missing` capabilities rather than
  `drift`; for a content CMS their absence is material. They are currently
  unscheduled on the roadmap — routing them for scheduling (new field types ->
  `@structcms/core` per `architecture.md:32`) is the synthesis issue's (#27) job.

- **Verdict summary (core):** 7 `ok`, 2 `partial`, 2 `missing`, 0 `blocker`,
  0 `drift` finding (R2 is a risk note attached to an `ok` capability). No phantom
  exports — every symbol in `packages/core/README.md` resolves in `index.ts:1-30`.

<!-- @structcms/api — added by #25 -->

<!-- @structcms/admin — added by #26 -->

<!-- Synthesis, severity roll-up, prior-art readiness, roadmap-first remediation — added by #27 -->
