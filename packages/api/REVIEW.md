# @structcms/api — Structure Review

Review date: 2026-02-06 (updated)

---

## Overview

This review evaluates the structural and code-level consistency of `@structcms/api` against the documented architecture in `README.md`, `ARCHITECTURE.md`, and the project's tech stack conventions.

---

## Current Directory Structure

```
src/
├── storage/
│   ├── types.ts                    # StorageAdapter interface, domain types
│   ├── handlers.ts                 # CRUD handlers with validation + slug logic
│   ├── handlers.test.ts
│   ├── supabase-adapter.ts         # Supabase implementation
│   ├── supabase-adapter.test.ts
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
│   ├── types.ts                    # Export response types
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

| Aspect                | storage                | media                  | delivery       | export         |
|-----------------------|------------------------|------------------------|----------------|----------------|
| `types.ts`            | ✅                      | ✅                      | ✅              | ✅              |
| Adapter interface     | ✅ `StorageAdapter`     | ✅ `MediaAdapter`       | — (not needed) | — (not needed) |
| Supabase adapter      | ✅                      | ✅                      | —              | —              |
| `handlers.ts`         | ✅                      | ✅                      | ✅              | ✅              |
| Factory function      | ✅ `createStorageAdapter` | ✅ `createMediaAdapter` | —            | —              |
| Adapter error class   | ✅ `StorageError`       | ✅ `MediaError`         | —              | —              |
| Validation error class| ✅ `StorageValidationError` | ✅ `MediaValidationError` | —          | —              |
| Tests                 | ✅                      | ✅                      | ✅              | ✅              |

---

## Code-Level Comparison

### `types.ts` — Type Definitions

| Aspect          | storage | media | delivery | export |
|-----------------|---------|-------|----------|--------|
| Domain models   | `Page`, `Navigation`, `PageSection`, `NavigationItem` | `MediaFile` | — (imports from storage) | — (imports from storage) |
| Input types     | `CreatePageInput`, `UpdatePageInput`, `CreateNavigationInput`, `UpdateNavigationInput` | `UploadMediaInput` | — | — |
| Filter types    | `PageFilter` | `MediaFilter` | `ListPagesOptions` | — |
| Response types  | — | — | `PageResponse`, `NavigationResponse` | `PageExportResponse`, `NavigationExportResponse`, `AllPagesExportResponse`, `AllNavigationsExportResponse`, `SiteExportResponse`, `MediaExportEntry` |
| Adapter interface | ✅ `StorageAdapter` | ✅ `MediaAdapter` | — | — |
| Constants       | — | `ALLOWED_MIME_TYPES` | — | — |
| Pure types only? | ✅ | ✅ (+ 1 constant) | ✅ | ✅ |

**Status:** ✅ Consistent across all domains.

---

### `handlers.ts` — Signature Patterns

| Domain       | First argument           | Additional arguments        | Return type |
|--------------|--------------------------|------------------------------|-------------|
| **storage**  | `adapter: StorageAdapter` | `input: CreatePageInput` etc. | `Promise<Page>` / `Promise<void>` |
| **media**    | `adapter: MediaAdapter`   | `input: UploadMediaInput` etc. | `Promise<MediaFile>` / `Promise<void>` |
| **delivery** | `adapter: StorageAdapter` | `slug: string`, `options?`   | `Promise<PageResponse \| null>` |
| **export**   | `storageAdapter: StorageAdapter` | `mediaAdapter: MediaAdapter`, `slug` | `Promise<{ data, contentDisposition }>` |

The `export` domain uses different parameter names (`storageAdapter`/`mediaAdapter`) because it requires two adapters simultaneously. This is justified.

**Status:** ✅ Consistent.

---

### `handlers.ts` — Validation Logic

| Domain       | Validates                                          | Location |
|--------------|-----------------------------------------------------|----------|
| **storage**  | Empty titles, empty IDs, empty slugs, slug uniqueness, name uniqueness | `handlers.ts` ✅ |
| **media**    | MIME type against allowlist                         | `handlers.ts` ✅ |
| **delivery** | None (read-only)                                    | — ✅ |
| **export**   | None (read-only)                                    | — ✅ |

**Status:** ✅ Write domains validate in handlers, read domains don't.

---

### `handlers.ts` — Mapping Helpers

| Domain       | Helper                                    | Purpose |
|--------------|-------------------------------------------|---------|
| **delivery** | `toPageResponse()`, `toNavigationResponse()` | `Page` → `PageResponse` (Date → ISO, `meta` wrapper) |
| **export**   | `toPageExport()`, `toNavigationExport()`     | `Page` → `PageExportResponse` (Date → ISO, media resolution) |
| **storage**  | —                                         | Returns domain models directly |
| **media**    | —                                         | Returns domain models directly |

**Status:** ✅ Only domains that need response transformation have mappers.

---

### `supabase-adapter.ts` — Implementation Comparison

| Aspect              | storage                              | media                                |
|----------------------|--------------------------------------|--------------------------------------|
| Class                | `SupabaseStorageAdapter`             | `SupabaseMediaAdapter`               |
| Config               | `{ client }`                         | `{ client, bucketName? }`            |
| Factory              | `createStorageAdapter()`             | `createMediaAdapter()`               |
| Error class          | `StorageError(msg, code?, details?)` | `MediaError(msg, code?, details?)`   |
| Row types            | `PageRow`, `NavigationRow` (module-level) | `MediaRow` (module-level)       |
| Row mapper           | Free functions (`mapPageRowToPage`)  | Instance method (`this.mapRowToMediaFile`) |
| Not-found handling   | `PGRST116` → `return null`          | `PGRST116` → `return null`          |
| List query pattern   | Filter → Order → Limit → Range      | Filter → Order → Limit → Range      |

**Status:** ✅ Mostly consistent. One minor difference noted below.

---

### Error Classes — Signature Comparison

| Class                      | `code` parameter | Location |
|----------------------------|------------------|----------|
| `StorageError`             | `code?: string` (optional) | `supabase-adapter.ts` |
| `MediaError`               | `code?: string` (optional) | `supabase-adapter.ts` |
| `StorageValidationError`   | `code: string` (required)  | `handlers.ts` |
| `MediaValidationError`     | `code: string` (required)  | `handlers.ts` |

Adapter errors have optional `code` (Supabase errors don't always provide one). Validation errors have required `code` (we control them). This is intentional and correct.

**Status:** ✅ Consistent.

---

### `index.ts` — Re-Exports

| Aspect          | storage | media | delivery | export |
|-----------------|---------|-------|----------|--------|
| Types           | ✅ all   | ✅ all | ✅ all    | ✅ all  |
| Adapter class   | ✅       | ✅     | —        | —      |
| Factory         | ✅       | ✅     | —        | —      |
| Error classes   | ✅ both  | ✅ both | —       | —      |
| Handlers        | ✅ all 6 | ✅ all 4 | ✅ all 3 | ✅ all 4 |

**Status:** ✅ Consistent.

---

## Remaining Issues

### 1. Duplicated Slug Logic in Handler AND Adapter (Severity: Medium)

Slug generation and uniqueness checking exists in **two places**:

**`storage/handlers.ts` (lines 32–44):**
```typescript
const slug = input.slug?.trim() || generateSlug(input.title);
const existingPages = await adapter.listPages();
const existingSlugs = existingPages.map((p) => p.slug);
const uniqueSlug = ensureUniqueSlug(slug, existingSlugs);
```

**`storage/supabase-adapter.ts` (lines 131–140):**
```typescript
let slug = input.slug;
if (!slug) {
  slug = generateSlug(input.title);
}
const existingSlugs = await this.getAllSlugs();
slug = ensureUniqueSlug(slug, existingSlugs);
```

**Impact:**
- Double DB queries when called through the handler (`listPages` + `getAllSlugs`)
- Potential double-suffixing (e.g. `hello-world-1-1`)
- Violates single-responsibility: slug logic should live in one place

**Recommendation:** Remove slug generation and uniqueness logic from `SupabaseStorageAdapter.createPage()`. The adapter should store the slug as-is. Slug handling is the handler's responsibility (Layer 4 — Domain API).

---

### 2. Row Mapper Placement Inconsistency (Severity: Cosmetic)

- **storage**: `mapPageRowToPage()` and `mapNavigationRowToNavigation()` are **free functions** at module level
- **media**: `mapRowToMediaFile()` is a **private instance method** on the class

The media adapter needs instance context (`this.getPublicUrl()` requires `this.client` and `this.bucketName`), which justifies the difference. However, the URL generation could be extracted as a parameter to keep the mapper pure.

**Recommendation:** No action required. The difference is functionally justified.

---

### 3. Inconsistent Comment Style (Severity: Cosmetic)

Comment conventions differ between domains, primarily between `storage/` and the rest.

**Trailing periods:** `storage/handlers.ts` ends JSDoc sentences with a period, all other domains don't.

```typescript
// storage/handlers.ts
/** Handler for creating a new page. */

// media/handlers.ts
/** Handler for uploading a media file */

// delivery/handlers.ts
/** Handler for GET /api/cms/pages */
```

**Adapter interface method comments:** `MediaAdapter` has JSDoc on every method, `StorageAdapter` has none (only `// Page operations` / `// Navigation operations` section separators).

```typescript
// storage/types.ts — no method comments
export interface StorageAdapter {
  // Page operations
  getPage(slug: string): Promise<Page | null>;
}

// media/types.ts — JSDoc on every method
export interface MediaAdapter {
  /** Upload a media file */
  upload(input: UploadMediaInput): Promise<MediaFile>;
}
```

**Private methods in adapters:** `SupabaseMediaAdapter` has JSDoc on all private methods (`generateStoragePath`, `getPublicUrl`, `mapRowToMediaFile`). `SupabaseStorageAdapter` has none on its private method (`getAllSlugs`).

**Section separators:** `storage/supabase-adapter.ts` uses `// ====== Page Operations ======` separators. No other file uses this pattern.

**`@param`/`@returns` tags:** Only `utils/slug.ts` uses structured JSDoc tags (`@param`, `@returns`, `@example`). All other files use plain descriptions.

**Recommendation:** Pick one style and apply it consistently. The `media/` pattern (no trailing periods, JSDoc on interface methods, no section separators) is the most common across the codebase.

---

## Summary

| Domain      | Status | Notes                                              |
|-------------|--------|----------------------------------------------------|
| `storage/`  | ⚠️      | Duplicated slug logic between handler and adapter  |
| `media/`    | ✅      | Reference implementation — clean separation        |
| `delivery/` | ✅      | Correct as read-only mapping layer                 |
| `export/`   | ✅      | Functionally complete, clean structure             |
| `utils/`    | ✅      | Clean                                              |

**Overall:** The package is structurally consistent across all domains. The only actionable issue is the duplicated slug logic in `storage/`, which should be removed from the adapter now that the handler layer owns that responsibility.

---
