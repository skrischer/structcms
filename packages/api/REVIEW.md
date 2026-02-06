# @structcms/api — Structure Review

Review date: 2026-02-06

---

## Overview

This review evaluates the structural consistency of `@structcms/api` against the documented architecture in `README.md`, `ARCHITECTURE.md`, and the project's tech stack conventions.

---

## Current Directory Structure

```
src/
├── storage/
│   ├── types.ts                    # StorageAdapter interface, domain types
│   ├── supabase-adapter.ts         # Supabase implementation
│   ├── supabase-adapter.test.ts
│   ├── supabase-client.ts          # ⚠️ Unused client factory
│   ├── types.test.ts
│   ├── verify-schema.test.ts
│   └── index.ts
│
├── media/
│   ├── types.ts                    # MediaAdapter interface, domain types
│   ├── handlers.ts                 # Handler functions (upload, get, list, delete)
│   ├── handlers.test.ts
│   ├── resolve.ts                  # Media reference resolution
│   ├── resolve.test.ts
│   ├── supabase-adapter.ts         # Supabase implementation
│   ├── supabase-adapter.test.ts
│   ├── types.test.ts
│   ├── verify-schema.test.ts
│   └── index.ts
│
├── delivery/
│   ├── types.ts                    # Response types (PageResponse, etc.)
│   ├── handlers.ts                 # Read-only delivery handlers
│   ├── handlers.test.ts
│   └── index.ts
│
├── export/
│   ├── types.ts                    # Export response types + contentDisposition utility
│   ├── handlers.ts                 # Export handlers (page, all pages, navigation, site)
│   ├── handlers.test.ts
│   └── index.ts
│
├── types/
│   └── database.types.ts           # Supabase generated DB types
│
├── utils/
│   ├── slug.ts                     # Slug generation utilities
│   ├── slug.test.ts
│   └── index.ts
│
└── index.ts                        # Package entry point
```

---

## Domain Consistency Matrix

| Aspect                | storage        | media          | delivery       | export         |
|-----------------------|----------------|----------------|----------------|----------------|
| `types.ts`            | ✅              | ✅              | ✅              | ✅              |
| Adapter interface     | ✅ StorageAdapter | ✅ MediaAdapter | — (not needed) | — (not needed) |
| Supabase adapter      | ✅              | ✅              | —              | —              |
| `handlers.ts`         | ❌ **Missing**  | ✅              | ✅              | ✅              |
| Factory function      | ✅ createStorageAdapter | ✅ createMediaAdapter | —    | —              |
| Error class           | ✅ StorageError | ✅ MediaError + MediaValidationError | — | —    |
| Tests                 | ✅              | ✅              | ✅              | ✅              |

---

## Issues Found

### 1. Missing Storage Handlers (Severity: High)

The `README.md` explicitly defines the API strategy:

> This package exports **handler functions**, not complete route handlers.

And lists these handlers in the public API:

```typescript
export function handleCreatePage(adapter: StorageAdapter, data: CreatePageInput): Promise<PageResponse>;
export function handleUpdatePage(adapter: StorageAdapter, id: string, data: UpdatePageInput): Promise<PageResponse>;
export function handleDeletePage(adapter: StorageAdapter, id: string): Promise<void>;
```

**These do not exist.** The `storage/` domain exports the adapter directly without a handler layer. The `delivery/` domain provides read-only handlers, but the admin write handlers (create, update, delete for both pages and navigation) are missing entirely.

The `media/` domain does this correctly — `handlers.ts` wraps adapter calls with validation logic.

**Impact:** Host projects must call adapter methods directly for write operations, bypassing any business logic layer (validation, slug handling). This contradicts the documented architecture where Layer 4 (Domain API) orchestrates CRUD operations.

**Recommendation:** Add `storage/handlers.ts` with handlers for page and navigation CRUD operations. These should handle validation, slug generation, and delegate to the adapter — mirroring the pattern in `media/handlers.ts`.

---

### 2. `supabase-client.ts` is Dead Code (Severity: Low)

`src/storage/supabase-client.ts` defines `createSupabaseClient()`, but neither `SupabaseStorageAdapter` nor `SupabaseMediaAdapter` use it. Both adapters accept a pre-built `SupabaseClient` via their config objects.

**Recommendation:** Remove the file, or move it to `utils/` if it is intended as a convenience export for host projects. If kept, it should be re-exported from `index.ts`.

---

### 3. `contentDisposition` Misplaced in `types.ts` (Severity: Low)

`src/export/types.ts` contains a utility function (`contentDisposition`) alongside type definitions. This breaks the convention that `types.ts` files contain only types and constants.

**Recommendation:** Move `contentDisposition` to `utils/` (e.g. `utils/http.ts`) or into `export/handlers.ts` where it is consumed.

---

### 4. Inline Import in `export/types.ts` (Severity: Cosmetic)

```typescript
// src/export/types.ts:30
items: import('../storage/types').NavigationItem[];
```

All other files use top-level imports. This should be consistent.

**Recommendation:** Replace with a standard top-level import:

```typescript
import type { NavigationItem } from '../storage/types';
```

---

### 5. Duplicated Navigation Mapping in Export Handlers (Severity: Low)

The navigation-to-export mapping logic appears twice in `src/export/handlers.ts`:

- Lines 88–93 (`handleExportNavigations`)
- Lines 123–128 (`handleExportSite`)

The page export already uses a shared `toPageExport()` helper. Navigation should follow the same pattern.

**Recommendation:** Extract a `toNavigationExport()` helper function, analogous to `toPageExport()`.

---

## Reference Pattern

The `media/` domain serves as the **reference implementation**. Every domain should follow this structure where applicable:

```
domain/
├── types.ts                # Interfaces, types, constants
├── handlers.ts             # Framework-agnostic handler functions
├── handlers.test.ts        # Handler tests
├── supabase-adapter.ts     # Supabase implementation (only if domain has own persistence)
├── supabase-adapter.test.ts
└── index.ts                # Re-exports
```

- **`delivery/`** is correctly minimal (no adapter needed — it's a pure mapping layer over `StorageAdapter`).
- **`export/`** is correctly minimal (no adapter needed — it composes `StorageAdapter` + `MediaAdapter`).
- **`storage/`** is missing its handler layer.

---

## Summary

| Domain      | Status | Notes                                              |
|-------------|--------|----------------------------------------------------|
| `storage/`  | ⚠️      | Missing handlers, dead code (`supabase-client.ts`) |
| `media/`    | ✅      | Reference implementation — clean separation        |
| `delivery/` | ✅      | Correct as read-only mapping layer                 |
| `export/`   | ✅      | Functionally complete, minor cosmetic issues       |
| `utils/`    | ✅      | Clean                                              |

**Overall:** The package is functionally solid but structurally inconsistent. The `media/` domain should be used as the blueprint for aligning the other domains.

---
