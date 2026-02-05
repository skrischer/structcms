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
