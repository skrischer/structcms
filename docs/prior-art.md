# Prior Art

> Descriptive, living document. Indexed BY CONCERN, not by project. Verdicts
> note what to take and what to skip for StructCMS's zod-schema + JSONB model.

## Draft/Publish states (Roadmap Phase 1)
### payloadcms/payload — drafts on top of versions
- Path: `docs/versions/drafts.mdx`; docs at https://payloadcms.com/docs/versions/drafts
- License: MIT
- Verdict: reference-only — drafts build on a versions table; a single `_status`
  field (`draft` | `published`) is injected, and `find`/`findByID` expose a
  `draft` boolean to switch perspective.
- Date: 2026-06-15
- Notes: Take the `_status` column idea and the `draft` request parameter — both
  map cleanly onto our `pages` table + delivery API. Skip the full versions
  table for Phase 1 (version history is an explicit vision non-goal).

### strapinnn/strapi — Draft & Publish (Strapi 5)
- Path: docs at https://docs.strapi.io/cms/features/draft-and-publish
- License: MIT (core)
- Verdict: reference-only — three states (Draft / Modified / Published), a
  `status` query param (`draft` | `published`) replaced the old `publicationState`.
- Date: 2026-06-15
- Notes: The `status` delivery param is the clearest API shape to copy. The
  "Modified" state (published doc with unpublished edits) implies storing draft
  and published payloads separately — decide in the spec whether we need it or
  just a binary `_status`.

### sanity-io/sanity — draft document id convention
- Path: docs at https://www.sanity.io/docs/content-lake/drafts
- License: Studio MIT; content platform is SaaS
- Verdict: avoid (for our model) — drafts live as separate documents with a
  `drafts.` id prefix; queries pick a "perspective" (`published` vs `drafts`).
- Date: 2026-06-15
- Notes: Conceptually clean but doubles rows and forks ids — wrong fit for our
  single-row JSONB pages. Keep only the "perspective" mental model for the
  delivery API (published-only vs draft-inclusive reads).

## Field-level localization (Roadmap Phase 2)
### payloadcms/payload — config-driven localization
- Path: `docs/configuration/localization.mdx`; docs at https://payloadcms.com/docs/configuration/localization
- License: MIT
- Verdict: reference-only — a top-level `localization` config (locale list +
  `fallback`), a per-field `localized: true` flag, and `locale` /
  `fallback-locale` request params with a `none` escape hatch.
- Date: 2026-06-15
- Notes: Closest match to our vision's "field-level translations". The
  per-field `localized` flag fits a zod field option; the `fallback-locale`
  param fits the delivery API. Strong candidate for the Phase 2 design.

### directus/directus — translations as a relational collection
- Path: docs at https://directus.io/docs/guides/content/translations
- License: BSL 1.1 (not OSI-open) — do not copy code
- Verdict: reference-only — a `translations` (O2M) field auto-generates a
  `languages` collection and a `<collection>_translations` table.
- Date: 2026-06-15
- Notes: The separate-table approach is heavier than per-field localization and
  the BSL license bars code reuse. Useful only as a contrast: it argues for
  keeping translations inline in our JSONB rather than splitting tables.

## Multisite / multi-tenancy (Roadmap Phase 3)
### payloadcms/payload — multi-tenant plugin
- Path: `packages/plugin-multi-tenant`; docs at https://payloadcms.com/docs/plugins/multi-tenant
- License: MIT
- Verdict: reference-only — adds a `tenant` field to selected collections plus a
  `Tenants` collection; `isGlobal` enforces one doc per tenant; data is queried
  by tenant.
- Date: 2026-06-15
- Notes: The tenant-field-per-row + tenants-table pattern maps directly onto a
  `site_id` column on `pages`/`media`/`navigation` enforced via Supabase RLS.
  Best single reference for Phase 3.

## Code-first content modeling
### payloadcms/payload — config-as-code collections
- Path: docs at https://payloadcms.com/docs/configuration/collections
- License: MIT
- Verdict: reference-only — collections/fields defined in TypeScript config,
  close to our `defineSection` goal, but coupled to Payload's own server/runtime.
- Date: 2026-06-15
- Notes: Validates the code-first thesis; we stay framework-agnostic via adapters
  and zod rather than a bundled server.

## Dynamic forms from schema
### react-hook-form/react-hook-form + @hookform/resolvers (zod)
- Path: `resolvers/zod` in @hookform/resolvers
- License: MIT
- Verdict: reuse — already our admin form engine; the zod schema drives both
  validation and form state.
- Date: 2026-06-15
- Notes: Keep using the zod resolver as the bridge from `defineSection` schemas
  to generated admin forms.
