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

- Content storage
- Model registry
- Admin UI
- Delivery API
- Media management
- Multisite capability
- Localization support

It is designed primarily for:

- Agency websites
- Corporate marketing sites
- Landing pages
- Multisite environments

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
- Draft/publish states

### Media
- Upload
- Storage (Supabase Storage)
- Referencing in content

### Content Export
- JSON export of content
- Database backup strategy

---

## In Scope (Phase 2)

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

## Technical Layers

### 1. Modeling Layer
Defines schemas and content structures.

- Section definitions
- Field types
- Localization flags

---

### 2. Registry Layer
Registers models from the host website.

- Section registry
- Page types
- Navigation models

---

### 3. Storage Layer
Persists structured content.

- PostgreSQL
- JSONB sections
- Media references

---

### 4. Domain API Layer
Applies business logic.

- Validation
- Slug handling
- Publish states
- Locale resolution

---

### 5. Delivery API Layer
Optimized for frontend consumption.

- Typed responses
- Section unions
- Caching ready

---

### 6. Admin UI Layer
Content management interface.

- Dynamic forms
- Section editors
- Media browser
- Locale switching

---

### 7. Rendering Integration Layer
Maps content to frontend components.

- Section → Component mapping
- Typed props delivery

---

## Functional System Areas

### Content Management (MVP)
- Pages
- Sections
- Navigation

### Media Management (MVP)
- Upload
- Storage
- Referencing

### Localization (Phase 2)
- Field translations
- Locale config
- Fallback logic

### Multisite (Phase 2)
- Site configs
- Domain mapping
- Content isolation

### Developer Experience
- Code‑first schemas
- Typed APIs
- Installable packages

### Delivery
- REST endpoints
- Draft/preview support

---

## Known Limitations & Risks

### Technical Risks
- **Admin UI Complexity**: Dynamic form generation is the largest development effort
- **Supabase Dependency**: Currently tied to Supabase; abstraction layer mitigates but doesn't eliminate
- **Preview Implementation**: Requires frontend integration for draft content viewing

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
