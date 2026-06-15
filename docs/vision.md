# Vision

## Problem
Agency and corporate website teams pay a recurring tax for content management:
external SaaS CMS platforms add deploy/preview/modeling complexity, GUI-driven
schema modeling breaks versioning and type safety, and most setups are oversized
for marketing sites. Reusing CMS infrastructure across client projects is
inefficient.

## Why now
The core/api/admin foundation ships at v0.2.0 with code-first modeling, a dynamic
admin UI, and a Supabase-backed adapter layer. The framework needs a structured
path from this MVP toward draft/publish, localization, and multisite — without
ad-hoc growth that erodes the type-safe, adapter-decoupled architecture.

## Target users
- Primary: developers integrating a CMS into a Next.js/React website codebase.
- Secondary: content editors managing pages, sections, and media via the admin UI.

## Goal
Provide an installable, code-first headless CMS framework that lets developers
model content in TypeScript and get a type-safe admin UI and delivery API for
free — embedded in the host repo, with no platform lock-in and a swappable
storage backend.

## Success criteria
- A developer models a page type + sections in TypeScript and gets a working
  admin form with zero GUI schema steps.
- Content is delivered type-safe via `InferSectionData`; the public API contains
  no `any`.
- The storage backend is swappable through `StorageAdapter`/`MediaAdapter`
  without touching `@structcms/core` or `@structcms/admin`.
- Installs as npm packages into a host Next.js app; the reference `test-app`
  passes its Playwright E2E suite.

## Scope
### In
- Code-first content modeling (zod): sections, page types, navigation, field types.
- Admin UI with dynamic form generation, section editors, media browser.
- Content + media CRUD, typed delivery API, JSON export.
- Storage/auth abstraction (Supabase default, portable to self-hosted Postgres).
- Roadmap extensions: draft/publish, localization, multisite.

### Out
- Visual drag-and-drop page builder.
- Workflow/approval systems, role hierarchies beyond basic auth.
- Content version history, AI content generation, GraphQL API, plugin marketplace.

## Non-goals
- Becoming a SaaS platform — StructCMS lives inside the host repo, by design.
- GUI-driven schema modeling — schemas are code, to keep versioning and types intact.
- Advanced caching layers — left to the host application's framework.
