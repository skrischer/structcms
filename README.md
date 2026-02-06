# StructCMS — MVP

## Idea / Purpose

StructCMS is an installable, code-first headless CMS framework designed for modern website projects.  
It is built to live **inside** the website codebase rather than as an external SaaS platform.

The goal is to provide a lightweight, developer‑first content system that enables structured content modeling, typed delivery, and section‑based page building — without platform lock‑in or GUI‑driven schema management.

---

## Core Value Proposition

StructCMS exists to solve common friction in agency and corporate website development:

- External CMS platforms create deployment, modeling, and preview complexity
- GUI‑driven schema modeling breaks versioning and type safety
- SaaS CMS setups are often oversized for marketing sites
- Multi‑project reuse of CMS infrastructure is inefficient

StructCMS embeds content infrastructure directly into the site stack.

---

## Unique Selling Points (USPs)

### 1. Code‑First Modeling
Content models are defined in TypeScript, not in a GUI.

### 2. Embedded Architecture
The CMS runs inside the website repository.

### 3. Installable Framework
Distributed as a dependency, not a platform.

### 4. Typed Content Delivery
Frontend rendering is fully type‑safe.

### 5. Section‑Native Content
Optimized for page builders and structured website layouts.

### 6. Registry‑Driven Extensibility
Website projects register their own models dynamically.

---

## Project Description

StructCMS provides:

- Content storage with PostgreSQL/JSONB
- Code-first model registry
- Admin UI with dynamic form generation
- REST Delivery API
- Media management

Planned for Phase 2:
- Multisite capability
- Localization support
- Draft/Publish workflow

It is designed primarily for:

- Agency websites
- Corporate marketing sites
- Landing pages

---

## In Scope (MVP)

### Content Modeling
- Code‑defined schemas (Zod)
- Section/block content
- Page structures
- Navigation models

### Admin UI
- Dynamic form generation from schemas
- Section editors
- Media selection
- Basic content listing & editing

### API
- Content CRUD
- Delivery endpoints

### Backend Abstraction
- Storage interface (Supabase-agnostic)
- Auth interface (Supabase-agnostic)
- Future portability to self-hosted PostgreSQL

### Media
- Upload
- Storage (Supabase Storage)
- Referencing in content

### Content Export
- JSON export of content
- Database backup strategy

---

## In Scope (Phase 2)

### Draft/Publish States
- Content draft mode
- Publish workflow
- Preview endpoints

### Localization
- Field‑level translations
- Configurable locales
- Fallback handling
- Admin UI locale switching

### Multisite
- Site isolation
- Domain mapping
- Content isolation

---

## Out of Scope

- Visual drag‑and‑drop page builder
- Workflow/approval systems
- Role hierarchies beyond basic auth
- Version history / Content versioning
- AI content generation
- Translation automation
- Enterprise publishing pipelines
- Advanced caching layers
- GraphQL API
- Plugin marketplace

---

## Tech Stack

### Runtime
- Next.js (App Router)
- Node.js
- React

### Language
- TypeScript

### Modeling & Validation
- Zod

### Database
- PostgreSQL

### Backend Platform
- Supabase (DB, Auth, Storage)
- **Abstraction Layer**: Storage and Auth behind interfaces for future portability

### API Layer
- REST (Route Handlers)
- PostgREST (storage access)

### Admin UI
- React
- Tailwind
- shadcn/ui
- React Hook Form

### Media Storage
- Supabase Storage (S3‑compatible)

---

## Distribution Strategy

StructCMS is distributed as an **npm package** installed into the host project.

### Package Structure
```
@structcms/core      # Models, validation, types
@structcms/admin     # Admin UI components
@structcms/api       # Route handlers, delivery API
```

For package-specific documentation, see:
- [@structcms/core](./packages/core/README.md)
- [@structcms/api](./packages/api/README.md)
- [@structcms/admin](./packages/admin/README.md)

### Versioning
- Semantic versioning (semver)
- Breaking changes only in major versions
- Migration guides for major updates

### Update Strategy
- Host projects pin to specific versions
- Changelog documents all changes
- Non-breaking updates via `npm update`

---

## High‑Level Architecture

```
Website Project
│
├─ StructCMS Core
├─ StructCMS Admin
├─ StructCMS API
├─ StructCMS Models
│
└─ Supabase Backend
    ├─ PostgreSQL
    ├─ Auth
    └─ Storage
```

StructCMS is embedded but connects to managed backend infrastructure.

---

## E2E Test Application

Since `@structcms/admin` is a library package (no standalone dev server), a minimal Next.js host application is required for E2E testing and integration verification.

### Purpose

- Provide a running application that integrates all three packages (`core`, `api`, `admin`)
- Enable Playwright E2E tests for critical admin flows
- Serve as a reference implementation for host project integration
- Validate the full data flow: Admin UI → API → Storage → Delivery

### Location

```
examples/
└── test-app/           # Minimal Next.js App Router project
```

The test app is part of the pnpm workspace but is **not** a publishable package. It exists solely for testing and as a reference.

### Backend Strategy

The test app uses an **in-memory mock adapter** instead of a real Supabase instance:

- **Deterministic**: No external dependencies, tests are reproducible
- **Fast**: No network calls, no database setup
- **Isolated**: Each test run starts with a clean state
- **Portable**: Runs in CI without infrastructure

The mock adapter implements the same `StorageAdapter` and `MediaAdapter` interfaces from `@structcms/api`, ensuring that the integration is realistic while remaining self-contained.

### E2E Test Scope

| Flow | Description |
|------|-------------|
| Create Page | Create a new page with sections via PageEditor |
| Edit Section | Edit an existing section's fields and save |
| Upload Media | Upload a file via MediaBrowser and select in content |
| Navigation | Edit navigation items and save |
| Page List | Search, filter, and navigate to pages |

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md#e2e-testing-layer).

---

## Technical Layers

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical layer documentation.

Summary:
1. **Modeling Layer** - Zod schemas, field types
2. **Registry Layer** - Section/page type registration
3. **Storage Layer** - PostgreSQL, JSONB sections
4. **Domain API Layer** - Validation, slug handling
5. **Delivery API Layer** - Typed REST responses
6. **Admin UI Layer** - Dynamic forms, media browser
7. **Rendering Integration** - Section → Component mapping

---

## Known Limitations & Risks

### Technical Risks
- **Admin UI Complexity**: Dynamic form generation is the largest development effort
- **Supabase Dependency**: Currently tied to Supabase; abstraction layer mitigates but doesn't eliminate

### Operational Risks
- **Multi-Project Updates**: Breaking changes require coordinated updates across client projects
- **Schema Migrations**: Content model changes may require data migrations

### Mitigations
- Abstraction interfaces for Storage and Auth
- Semantic versioning with clear migration paths
- Content export for data portability
- Comprehensive TypeScript types for early error detection

---

## Positioning Statement

StructCMS is a developer‑first, installable headless CMS framework that enables structured, typed content modeling directly inside modern website applications.

It prioritizes architecture simplicity, modeling flexibility, and deployment ownership over SaaS abstraction.

---
