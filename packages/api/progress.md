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
