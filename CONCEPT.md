# StructCMS — Product Concept

## Idea / Purpose

StructCMS is an installable, code-first headless CMS framework designed for modern website projects.
It is built to live **inside** the website codebase rather than as an external SaaS platform.

The goal is to provide a lightweight, developer-first content system that enables structured content modeling, typed delivery, and section-based page building — without platform lock-in or GUI-driven schema management.

---

## Core Value Proposition

StructCMS exists to solve common friction in agency and corporate website development:

- External CMS platforms create deployment, modeling, and preview complexity
- GUI-driven schema modeling breaks versioning and type safety
- SaaS CMS setups are often oversized for marketing sites
- Multi-project reuse of CMS infrastructure is inefficient

StructCMS embeds content infrastructure directly into the site stack.

---

## Unique Selling Points (USPs)

### 1. Code-First Modeling
Content models are defined in TypeScript, not in a GUI.

### 2. Embedded Architecture
The CMS runs inside the website repository.

### 3. Installable Framework
Distributed as a dependency, not a platform.

### 4. Typed Content Delivery
Frontend rendering is fully type-safe.

### 5. Section-Native Content
Optimized for page builders and structured website layouts.

### 6. Registry-Driven Extensibility
Website projects register their own models dynamically.

---

## Target Audience

- Agency websites
- Corporate marketing sites
- Landing pages

---

## Scope

### MVP

- **Content Modeling** — Code-defined schemas (Zod), section/block content, page structures, navigation models
- **Admin UI** — Dynamic form generation from schemas, section editors, media selection, content listing & editing
- **API** — Content CRUD, delivery endpoints
- **Backend Abstraction** — Storage interface (Supabase-agnostic), auth interface, future portability to self-hosted PostgreSQL
- **Media** — Upload, storage (Supabase Storage), referencing in content
- **Content Export** — JSON export, database backup strategy

### Phase 2

- **Draft/Publish States** — Content draft mode, publish workflow, preview endpoints
- **Localization** — Field-level translations, configurable locales, fallback handling, admin UI locale switching
- **Multisite** — Site isolation, domain mapping, content isolation

### Out of Scope

- Visual drag-and-drop page builder
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

## Distribution Strategy

StructCMS is distributed as an **npm package** installed into the host project.

### Versioning
- Semantic versioning (semver)
- Breaking changes only in major versions
- Migration guides for major updates

### Update Strategy
- Host projects pin to specific versions
- Changelog documents all changes
- Non-breaking updates via `npm update`

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

StructCMS is a developer-first, installable headless CMS framework that enables structured, typed content modeling directly inside modern website applications.

It prioritizes architecture simplicity, modeling flexibility, and deployment ownership over SaaS abstraction.
