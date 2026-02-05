# @structcms/api

Storage, domain API, and delivery API for StructCMS.

## Description

This package provides the backend infrastructure:

- Content CRUD operations
- Delivery endpoints
- Storage interface (Supabase-agnostic)
- Auth interface (Supabase-agnostic)
- Media upload, storage, and referencing
- JSON export of content
- Database backup strategy

## Architecture

### Storage Layer

Persists structured content in PostgreSQL.

**Responsibilities:**
- Content CRUD operations
- JSONB storage for section data
- Media reference management
- Database schema management

**Database Schema (Conceptual):**
```
pages
├─ id (uuid)
├─ slug (text, unique)
├─ page_type (text)
├─ sections (jsonb)
├─ created_at (timestamp)
└─ updated_at (timestamp)

media
├─ id (uuid)
├─ filename (text)
├─ storage_path (text)
├─ mime_type (text)
├─ size (integer)
└─ created_at (timestamp)

navigation
├─ id (uuid)
├─ name (text)
├─ items (jsonb)
└─ updated_at (timestamp)
```

**Abstraction:**

Storage operations are behind interfaces to allow future migration away from Supabase:

```typescript
interface StorageAdapter {
  getPage(slug: string): Promise<Page | null>;
  savePage(page: Page): Promise<Page>;
  deletePage(id: string): Promise<void>;
  listPages(filter?: PageFilter): Promise<Page[]>;
}
```

### Domain API Layer

Applies business logic to content operations.

**Responsibilities:**
- Content validation against registered schemas
- Slug generation and uniqueness handling
- Business rule enforcement

**MVP Scope:**
- Validation
- Slug handling
- CRUD orchestration

**Phase 2 Additions:**
- Publish state management (draft/published)
- Locale resolution and fallback

### Delivery API Layer

Optimized REST endpoints for frontend consumption.

**Responsibilities:**
- Typed JSON responses
- Section union types for frontend type safety
- Response shaping for rendering

**Endpoints (MVP):**
```
GET  /api/cms/pages              # List all pages
GET  /api/cms/pages/:slug        # Get page by slug
GET  /api/cms/navigation/:name   # Get navigation by name
GET  /api/cms/media              # List media
```

### API Implementation Strategy

This package exports **handler functions**, not complete route handlers.

**Rationale:**
- Framework-agnostic (not tied to Next.js)
- Adapter injection for storage abstraction
- Host projects control middleware, auth, caching
- Easy unit testing without HTTP layer

**Exported Handlers:**
```typescript
// Delivery API
export function handleListPages(adapter: StorageAdapter): Promise<PageResponse[]>;
export function handleGetPageBySlug(adapter: StorageAdapter, slug: string): Promise<PageResponse | null>;
export function handleGetNavigation(adapter: StorageAdapter, name: string): Promise<NavigationResponse | null>;
export function handleListMedia(adapter: MediaAdapter): Promise<MediaResponse[]>;

// Admin API
export function handleCreatePage(adapter: StorageAdapter, data: CreatePageInput): Promise<PageResponse>;
export function handleUpdatePage(adapter: StorageAdapter, id: string, data: UpdatePageInput): Promise<PageResponse>;
export function handleDeletePage(adapter: StorageAdapter, id: string): Promise<void>;
export function handleUploadMedia(adapter: MediaAdapter, file: File): Promise<MediaResponse>;
export function handleDeleteMedia(adapter: MediaAdapter, id: string): Promise<void>;
```

**Usage in Host Project:**
```typescript
// app/api/cms/pages/route.ts
import { handleListPages, handleCreatePage } from '@structcms/api';
import { adapter } from '@/lib/cms-adapter';

export async function GET() {
  const pages = await handleListPages(adapter);
  return Response.json(pages);
}

export async function POST(request: Request) {
  const data = await request.json();
  const page = await handleCreatePage(adapter, data);
  return Response.json(page, { status: 201 });
}
```

```typescript
// app/api/cms/pages/[slug]/route.ts
import { handleGetPageBySlug, handleUpdatePage, handleDeletePage } from '@structcms/api';
import { adapter } from '@/lib/cms-adapter';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const page = await handleGetPageBySlug(adapter, params.slug);
  if (!page) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json(page);
}
```

**Response Format:**
```typescript
interface PageResponse {
  id: string;
  slug: string;
  pageType: string;
  sections: Section[];
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
```

---

## Backlog

This package contains three domains: Storage, Media, and Export.

### Domain: STORAGE

**Dependencies:** Modeling (@structcms/core)  
**Estimated Effort:** Medium

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| S-1 | Storage Interface | `StorageAdapter` interface defined with CRUD methods | Todo |
| S-2 | Supabase Adapter | `SupabaseStorageAdapter` implements `StorageAdapter` | Todo |
| S-3 | DB Schema: Pages | `pages` table created with id, slug, page_type, sections (jsonb), timestamps | Todo |
| S-4 | DB Schema: Navigation | `navigation` table created with id, name, items (jsonb), timestamps | Todo |
| S-5 | Page CRUD | Create, Read, Update, Delete operations for pages | Todo |
| S-6 | Navigation CRUD | Create, Read, Update, Delete operations for navigation | Todo |
| S-7 | Slug Handling | Auto-generate slug from title, ensure uniqueness | Todo |
| S-8 | Delivery Endpoints | `GET /api/cms/pages`, `GET /api/cms/pages/:slug`, `GET /api/cms/navigation/:name` | Todo |
| S-9 | Integration Tests | All CRUD operations tested against Supabase | Todo |

**Done Criteria:**
- [ ] Storage interface is Supabase-agnostic
- [ ] All CRUD operations work
- [ ] Delivery endpoints return typed responses
- [ ] Database migrations documented

---

### Domain: MEDIA

**Dependencies:** Modeling (@structcms/core)  
**Estimated Effort:** Medium

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| ME-1 | Media Interface | `MediaAdapter` interface defined with upload/list/delete methods | Todo |
| ME-2 | Supabase Media Adapter | `SupabaseMediaAdapter` implements `MediaAdapter` using Supabase Storage | Todo |
| ME-3 | DB Schema: Media | `media` table with id, filename, storage_path, mime_type, size, timestamps | Todo |
| ME-4 | Upload Endpoint | `POST /api/cms/media` accepts file upload, stores in Supabase Storage | Todo |
| ME-5 | List Endpoint | `GET /api/cms/media` returns paginated media list | Todo |
| ME-6 | Delete Endpoint | `DELETE /api/cms/media/:id` removes file and DB record | Todo |
| ME-7 | Media Reference Type | `image` field type resolves to media URL in delivery | Todo |
| ME-8 | Integration Tests | Upload, list, delete tested against Supabase Storage | Todo |

**Done Criteria:**
- [ ] Media interface is Supabase-agnostic
- [ ] Files upload to Supabase Storage
- [ ] Media can be referenced in content
- [ ] URLs are publicly accessible

---

### Domain: EXPORT

**Dependencies:** Storage  
**Estimated Effort:** Low

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| E-1 | Single Page Export | `GET /api/cms/export/pages/:slug` returns full page JSON | Todo |
| E-2 | All Pages Export | `GET /api/cms/export/pages` returns all pages as JSON array | Todo |
| E-3 | Navigation Export | `GET /api/cms/export/navigation` returns all navigation as JSON | Todo |
| E-4 | Full Export | `GET /api/cms/export` returns complete site content | Todo |
| E-5 | Backup Documentation | Document backup strategy using export endpoints | Todo |

**Done Criteria:**
- [ ] All content exportable as JSON
- [ ] Export format is documented
- [ ] Backup process documented in README

---

## Database Migrations

SQL migrations are located in `migrations/`. Apply them in order via Supabase SQL Editor or CLI.

### 001_create_pages_table.sql

Creates the `pages` table for storing CMS pages.

```sql
-- Apply via Supabase SQL Editor
-- Or: supabase db push (if using Supabase CLI)
```

**Schema:**
- `id` (UUID, primary key, auto-generated)
- `slug` (TEXT, unique, indexed)
- `page_type` (TEXT, indexed)
- `title` (TEXT)
- `sections` (JSONB, default `[]`)
- `created_at` (TIMESTAMPTZ, auto-set)
- `updated_at` (TIMESTAMPTZ, auto-updated via trigger)

### 002_create_navigation_table.sql

Creates the `navigation` table for storing navigation structures.

**Schema:**
- `id` (UUID, primary key, auto-generated)
- `name` (TEXT, unique, indexed)
- `items` (JSONB, default `[]`)
- `created_at` (TIMESTAMPTZ, auto-set)
- `updated_at` (TIMESTAMPTZ, auto-updated via trigger)

### 003_create_media_table.sql

Creates the `media` table for storing media file metadata.

**Schema:**
- `id` (UUID, primary key, auto-generated)
- `filename` (TEXT, original filename)
- `storage_path` (TEXT, path in Supabase Storage bucket, indexed)
- `mime_type` (TEXT, indexed)
- `size` (INTEGER, file size in bytes)
- `created_at` (TIMESTAMPTZ, auto-set, indexed DESC)
- `updated_at` (TIMESTAMPTZ, auto-updated via trigger)

---
