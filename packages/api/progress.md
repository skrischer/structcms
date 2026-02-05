# @structcms/api - Progress Log

## Project Overview
Storage, domain API, and delivery API for StructCMS.

## Current Status
**Phase**: MVP Development  
**Started**: 2026-02-05

---

## Completed Tasks

_No tasks completed yet._

---

## In Progress

_No tasks in progress._

---

## Log

### 2026-02-05
- Initialized prd.json with 22 tasks
- Tasks organized into groups: Storage (9), Media (8), Export (5)
- Clarified: Media accepts jpg, jpeg, png, gif, webp, svg only
- Clarified: Export includes resolved media URLs for backup/migration use case

---

## Working on: Storage Interface Definition

**Selected because:** Foundation task with no dependencies. All Storage operations depend on this interface.

### Plan

**Files to create:**
- `src/storage/types.ts` - StorageAdapter interface, Page type, PageFilter type
- `src/storage/types.test.ts` - Type compilation tests

**Files to modify:**
- `src/index.ts` - Export types

**Approach:**
1. Define `Page` type with id, slug, pageType, sections, timestamps
2. Define `PageFilter` for list filtering (by pageType, etc.)
3. Define `StorageAdapter` interface with CRUD methods
4. Keep interface Supabase-agnostic (no Supabase types)

**Acceptance Criteria:**
- [x] StorageAdapter interface defined with getPage, savePage, deletePage, listPages
- [x] PageFilter type defined for list filtering
- [x] Interface is Supabase-agnostic (no Supabase types in interface)
- [x] Unit test: interface types compile correctly

**Verification:**
```bash
pnpm test --filter @structcms/api -- --run
pnpm --filter @structcms/api typecheck
```

**Result:** ✅ Success

- 10 unit tests passing
- TypeScript typecheck passing
- Files created: `src/storage/types.ts`, `src/storage/types.test.ts`, `src/storage/index.ts`
- Types: Page, PageSection, PageFilter, Navigation, NavigationItem, StorageAdapter

---

## Working on: Slug Generation and Uniqueness

**Selected because:** Independent utility task. Required for Page CRUD. Can be fully unit tested.

### Plan

**Files to create:**
- `src/utils/slug.ts` - generateSlug() function
- `src/utils/slug.test.ts` - Unit tests

**Files to modify:**
- `src/index.ts` - Export slug utilities

**Approach:**
1. Create `generateSlug(title)` that converts title to URL-safe slug
2. Handle special characters, spaces, umlauts (ä→ae, ö→oe, ü→ue, ß→ss)
3. Create `ensureUniqueSlug(slug, existingSlugs)` for uniqueness check
4. Append -1, -2, etc. if slug exists

**Acceptance Criteria:**
- [x] generateSlug(title) creates URL-safe slug
- [x] Handles special characters, spaces, umlauts
- [x] Appends -1, -2, etc. if slug exists
- [x] Unit test: slug generation and uniqueness

**Verification:**
```bash
pnpm test --filter @structcms/api -- --run
```

**Result:** ✅ Success

- 20 new unit tests passing (30 total)
- Files created: `src/utils/slug.ts`, `src/utils/slug.test.ts`, `src/utils/index.ts`
- Exports: `generateSlug`, `ensureUniqueSlug`

---

## Working on: Database Schema - Pages Table

**Selected because:** Foundation for all page storage operations. Required before Supabase adapter.

### Plan

**Files to create:**
- `migrations/001_create_pages_table.sql` - SQL migration

**Files to modify:**
- `README.md` - Document migration

**Approach:**
1. Create pages table with: id (uuid), slug (unique), page_type, title, sections (jsonb), timestamps
2. Add unique constraint on slug
3. Set default timestamps
4. Document in README

**Acceptance Criteria:**
- [x] SQL migration creates pages table
- [x] slug has unique constraint
- [x] sections stored as JSONB
- [x] created_at and updated_at timestamps with defaults
- [x] Migration documented in README

**Verification:**
```bash
npx supabase db push
pnpm test --filter @structcms/api -- --run src/storage/verify-schema.test.ts
```

**Result:** ✅ Success

- Migration applied via `supabase db push`
- 4 integration tests passing (unique constraint, UUID generation, timestamps, JSONB)
- Files: `migrations/001_create_pages_table.sql`, `src/storage/verify-schema.test.ts`

---

## Working on: Database Schema - Navigation Table

**Selected because:** Required for navigation CRUD. Similar pattern to pages table.

### Plan

**Files to create:**
- `migrations/002_create_navigation_table.sql`

**Files to modify:**
- `README.md` - Document migration
- `src/storage/verify-schema.test.ts` - Add navigation tests

**Acceptance Criteria:**
- [x] SQL migration creates navigation table
- [x] name has unique constraint
- [x] items stored as JSONB (array of nav items)
- [x] Migration documented in README

**Verification:**
```bash
npx supabase db push
pnpm test --filter @structcms/api -- --run src/storage/verify-schema.test.ts
```

**Result:** ✅ Success

- Migration applied via `supabase db push`
- 3 new integration tests passing (7 total)
- Files: `migrations/002_create_navigation_table.sql`

---

## Working on: Supabase Storage Adapter

**Selected because:** Foundation for all CRUD operations. Implements StorageAdapter interface.

### Plan

**Files to create:**
- `src/storage/supabase-adapter.ts` - SupabaseStorageAdapter implementation
- `src/storage/supabase-adapter.test.ts` - Integration tests

**Files to modify:**
- `src/storage/index.ts` - Export adapter
- `src/index.ts` - Export createStorageAdapter

**Approach:**
1. Implement SupabaseStorageAdapter class implementing StorageAdapter
2. Map between DB snake_case and TypeScript camelCase
3. Handle connection errors gracefully
4. Integration tests for all CRUD operations

**Acceptance Criteria:**
- [x] SupabaseStorageAdapter implements StorageAdapter
- [x] Uses supabase-js client for database operations
- [x] Handles connection errors gracefully
- [x] Integration test: CRUD operations work against Supabase

**Verification:**
```bash
pnpm test --filter @structcms/api -- --run
```

**Result:** ✅ Success

- 20 new integration tests passing (57 total)
- Full Page CRUD: create, get, getById, update, delete, list, filter, paginate
- Full Navigation CRUD: create, get, getById, update, delete, list
- Auto slug generation with uniqueness
- StorageError class for error handling
- Files: `src/storage/supabase-adapter.ts`, `src/storage/supabase-adapter.test.ts`

---

## Working on: Delivery Endpoints

**Selected because:** User explicitly requested this task. All dependencies are met (Storage Interface, Supabase Adapter, Page CRUD, Navigation CRUD).

### Plan

**Files to create:**
- `src/delivery/types.ts` - PageResponse, NavigationResponse types
- `src/delivery/handlers.ts` - Handler functions (handleListPages, handleGetPageBySlug, handleGetNavigation)
- `src/delivery/handlers.test.ts` - Integration tests
- `src/delivery/index.ts` - Barrel export

**Files to modify:**
- `src/index.ts` - Export delivery handlers

**Approach:**
1. Define response types (PageResponse, NavigationResponse) with ISO date strings
2. Create handler functions that take StorageAdapter as parameter
3. Map internal Page/Navigation types to response types
4. Return null for not found (caller handles 404)
5. Integration tests against real Supabase

**Acceptance Criteria:**
- [x] GET /api/cms/pages returns all pages (public)
- [x] GET /api/cms/pages/:slug returns single page (public)
- [x] GET /api/cms/navigation/:name returns navigation (public)
- [x] Responses match PageResponse/NavigationResponse types
- [x] 404 for non-existent resources
- [x] Integration test: all endpoints

**Verification:**
```bash
pnpm test --filter @structcms/api -- --run
```

**Result:** ✅ Success

- 7 new integration tests passing (64 total)
- Handler functions: `handleListPages`, `handleGetPageBySlug`, `handleGetNavigation`
- Response types: `PageResponse`, `NavigationResponse` with ISO date strings
- Files created: `src/delivery/types.ts`, `src/delivery/handlers.ts`, `src/delivery/handlers.test.ts`, `src/delivery/index.ts`
- Exports added to `src/index.ts`

---

## Working on: Media Interface Definition

**Selected because:** Foundation task for all Media operations. No dependencies. All subsequent Media tasks depend on this interface.

### Plan

**Files to create:**
- `src/media/types.ts` - MediaAdapter interface, MediaFile type, input types
- `src/media/types.test.ts` - Type compilation tests
- `src/media/index.ts` - Barrel export

**Files to modify:**
- `src/index.ts` - Export media types

**Approach:**
1. Define `MediaFile` type with id, filename, url, mimeType, size, createdAt
2. Define input types for upload and list operations
3. Define `MediaAdapter` interface with upload, getMedia, listMedia, deleteMedia
4. Keep interface Supabase-agnostic (no Supabase types)
5. Unit tests to verify types compile correctly

**Acceptance Criteria:**
- [x] MediaAdapter interface with upload, getMedia, listMedia, deleteMedia
- [x] MediaFile type with id, filename, url, mimeType, size
- [x] Interface is Supabase-agnostic
- [x] Unit test: interface types compile

**Verification:**
```bash
pnpm test --filter @structcms/api -- --run
pnpm --filter @structcms/api typecheck
```

**Result:** ✅ Success

- 11 new unit tests passing (75 total)
- Types: `MediaFile`, `MediaAdapter`, `UploadMediaInput`, `MediaFilter`, `AllowedMimeType`
- Constant: `ALLOWED_MIME_TYPES` (jpeg, png, gif, webp, svg)
- Files created: `src/media/types.ts`, `src/media/types.test.ts`, `src/media/index.ts`
- Exports added to `src/index.ts`

---

## Working on: Database Schema: Media Table

**Selected because:** Required before Supabase Media Adapter. The adapter needs a table to store media metadata.

### Plan

**Files to create:**
- `migrations/003_create_media_table.sql` - SQL migration

**Files to modify:**
- `README.md` - Document migration

**Approach:**
1. Create media table with: id (uuid), filename, storage_path, mime_type, size, timestamps
2. Add index on storage_path for lookups
3. Reuse existing updated_at trigger function
4. Document in README

**Acceptance Criteria:**
- [x] SQL migration creates media table
- [x] storage_path references Supabase Storage path
- [x] Migration documented in README

**Verification:**
```bash
npx supabase db push
```

**Result:** ✅ Success

- Migration `003_create_media_table.sql` applied to remote database
- 3 integration tests passing (schema verification)
- Table: `media` with id, filename, storage_path, mime_type, size, timestamps
- Indexes: storage_path, mime_type, created_at DESC
- Files: `supabase/migrations/003_create_media_table.sql`, `src/media/verify-schema.test.ts`
- README updated with schema documentation

---

## Working on: Supabase Media Adapter

**Selected because:** All dependencies met (MediaAdapter interface ✅, Media table ✅). Required for all Media endpoint tasks.

### Plan

**Files to create:**
- `src/media/supabase-adapter.ts` - SupabaseMediaAdapter implementation
- `src/media/supabase-adapter.test.ts` - Integration tests

**Files to modify:**
- `src/media/index.ts` - Export adapter
- `src/index.ts` - Export createMediaAdapter

**Approach:**
1. Create SupabaseMediaAdapter class implementing MediaAdapter
2. Upload: Store file in Supabase Storage bucket, create DB record
3. getMedia: Fetch from DB, construct public URL
4. listMedia: Query DB with pagination, construct URLs
5. deleteMedia: Delete from Storage and DB
6. Integration tests against real Supabase

**Challenges:**
- Need to create Storage bucket "media" if not exists
- Public URL generation from storage path

**Acceptance Criteria:**
- [x] SupabaseMediaAdapter implements MediaAdapter
- [x] Files uploaded to Supabase Storage bucket
- [x] Public URLs generated for uploaded files
- [x] Integration test: upload and retrieve file

**Verification:**
```bash
SUPABASE_URL=... SUPABASE_SECRET_KEY=... pnpm test --filter @structcms/api -- --run src/media/supabase-adapter.test.ts
```

**Result:** ✅ Success

- 10 integration tests passing
- SupabaseMediaAdapter: upload, getMedia, listMedia, deleteMedia
- Storage bucket "media" created with public access
- Public URLs generated via Supabase Storage API
- Files: `src/media/supabase-adapter.ts`, `src/media/supabase-adapter.test.ts`
- Exports: `SupabaseMediaAdapter`, `createMediaAdapter`, `MediaError`
