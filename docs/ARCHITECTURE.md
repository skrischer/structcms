# StructCMS — Architecture

This document describes the technical layers and their responsibilities within StructCMS.

For package-specific details, see:
- [@structcms/core](./packages/core/README.md) — Modeling, Registry, Types
- [@structcms/api](./packages/api/README.md) — Storage, Domain API, Delivery API
- [@structcms/admin](./packages/admin/README.md) — Admin UI Components
- [E2E Test App](./examples/test-app/README.md) — Integration Testing

For product scope and roadmap, see [CONCEPT.md](./CONCEPT.md).

---

## High-Level Architecture

```
Website Project
│
├─ @structcms/core       # Models, validation, types
├─ @structcms/admin      # Admin UI components
├─ @structcms/api        # Route handlers, delivery API
│
└─ Supabase Backend
    ├─ PostgreSQL
    ├─ Auth
    └─ Storage
```

StructCMS is embedded into the host project but connects to managed backend infrastructure.

---

## Layer 1: Modeling Layer (`@structcms/core`)

**Purpose**: Defines schemas and content structures using Zod.

- Section schema definitions via `defineSection`
- Field type definitions (`fields.string()`, `fields.richtext()`, `fields.image()`, etc.)
- Validation rules
- TypeScript type inference from schemas via `InferSectionData`

Key concepts: **Section** (reusable content block with defined fields), **Page Type** (template defining which sections a page can contain), **Field Types** (primitives and complex types for content fields).

See `packages/core/src/` for implementation.

---

## Layer 2: Registry Layer (`@structcms/core`)

**Purpose**: Registers models from the host website project.

- Section registry (collect all section definitions)
- Page type registry
- Navigation model registry
- Runtime type resolution via `createRegistry`

The registry is the central store for all content model definitions. Host projects register their own models at startup.

---

## Layer 3: Storage Layer (`@structcms/api`)

**Purpose**: Persists structured content in PostgreSQL via Supabase.

- Content CRUD operations
- JSONB storage for section data
- Media file management (Supabase Storage)

### Database Schema

```
pages
├─ id (uuid)
├─ slug (text, unique)
├─ page_type (text)
├─ title (text)
├─ sections (jsonb)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

media
├─ id (uuid)
├─ filename (text)
├─ storage_path (text)
├─ mime_type (text)
├─ size (integer)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

navigation
├─ id (uuid)
├─ name (text)
├─ items (jsonb)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)
```

Storage operations are behind `StorageAdapter` and `MediaAdapter` interfaces to allow future migration away from Supabase. See `packages/api/src/storage/` for the adapter interfaces and Supabase implementation.

---

## Layer 4: Domain API Layer (`@structcms/api`)

**Purpose**: Applies business logic to content operations.

- Content validation against registered schemas
- Slug generation and uniqueness handling
- CRUD orchestration

`@structcms/api` exports **handler functions** (e.g. `handleListPages`, `handleCreatePage`), not complete route handlers. This keeps the package framework-agnostic and allows adapter injection. See `packages/api/src/storage/` and `packages/api/src/delivery/` for implementation.

---

## Layer 5: Delivery API Layer (Host Project)

**Purpose**: REST endpoints for frontend consumption.

The host project creates thin route handlers that inject adapters into the handler functions from `@structcms/api`. See `examples/test-app/app/api/cms/` for a reference implementation.

### Endpoints

```
GET  /api/cms/pages              # List all pages
GET  /api/cms/pages/:slug        # Get page by slug
POST /api/cms/pages              # Create page
PUT  /api/cms/pages/:slug        # Update page
DELETE /api/cms/pages/:slug      # Delete page
GET  /api/cms/navigation/:name   # Get navigation by name
PUT  /api/cms/navigation/:name   # Update navigation
GET  /api/cms/media              # List media
POST /api/cms/media              # Upload media
DELETE /api/cms/media/:id        # Delete media
```

---

## Layer 6: Admin UI Layer (`@structcms/admin`)

**Purpose**: Content management interface for editors.

- Dynamic form generation from Zod schemas
- Section editors with field-type-specific inputs
- Media browser and upload
- Content listing and filtering

Key components: `PageEditor`, `SectionEditor`, `MediaBrowser`, `PageList`, `NavigationEditor`, `AdminLayout`, `AdminProvider`.

See `packages/admin/src/components/` for implementation.

---

## Layer 7: Rendering Integration (Host Project)

**Purpose**: Maps CMS content to frontend React components.

- Section type → Component mapping via a component registry
- Type-safe props via `InferSectionData` from `@structcms/core`
- Server Component rendering with direct adapter access (no HTTP roundtrip)

See `examples/test-app/lib/components/` for a reference implementation.

---

## Data Flow

```
1. Developer defines sections          (Modeling Layer)
         ↓
2. Sections registered at startup      (Registry Layer)
         ↓
3. Admin UI generates forms            (Admin UI Layer)
         ↓
4. Content validated and saved          (Domain API → Storage Layer)
         ↓
5. Frontend fetches content             (Delivery API Layer)
         ↓
6. Content rendered to components       (Rendering Integration)
```

---

## Package Boundaries

| Package | Contains | Depends On |
|---------|----------|------------|
| `@structcms/core` | Modeling, Registry, Types | `zod` |
| `@structcms/api` | Storage, Domain API, Delivery API | `@structcms/core`, `@supabase/supabase-js` |
| `@structcms/admin` | Admin UI components | `@structcms/core`, `react`, `tailwindcss`, `shadcn/ui` |

---

## E2E Testing

Integration testing of all packages together in a realistic host application (`examples/test-app/`). Uses Playwright against a real Supabase test instance — no mocks.

For details, see the [E2E Test App README](./examples/test-app/README.md).
