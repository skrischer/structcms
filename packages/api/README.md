# @structcms/api

Storage, domain API, delivery API, and content export for StructCMS. Provides Supabase-agnostic adapter interfaces, handler functions for content CRUD, media management, and JSON export.

For architectural context, see [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) (Layer 3: Storage, Layer 4: Domain API, Layer 5: Delivery API).

**[← Back to main README](../../README.md)**

## Installation

```bash
npm install @structcms/api
```

## Quick Start

```typescript
import { createStorageAdapter, createMediaAdapter } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { createNextPagesRoute } from '@structcms/api/next';

// 1. Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// 2. Create adapters
const storageAdapter = createStorageAdapter({ client: supabase });
const mediaAdapter = createMediaAdapter({ client: supabase });

// 3. Create Next.js API route handlers
export const { GET, POST } = createNextPagesRoute({ 
  storageAdapter, 
  mediaAdapter 
});
```

See [examples/test-app/app/api/cms/](../../examples/test-app/app/api/cms/) for complete route handler implementations.

## File Structure

```
packages/api/
├── src/
│   ├── index.ts                          # Public exports
│   ├── storage/
│   │   ├── types.ts                      # StorageAdapter interface, Page, Navigation types
│   │   ├── supabase-adapter.ts           # Supabase implementation of StorageAdapter
│   │   ├── handlers.ts                   # Page/Navigation CRUD handlers
│   │   └── *.test.ts
│   ├── delivery/
│   │   ├── types.ts                      # PageResponse, NavigationResponse types
│   │   ├── handlers.ts                   # Delivery handlers (list, get by slug)
│   │   └── *.test.ts
│   ├── media/
│   │   ├── types.ts                      # MediaAdapter interface, MediaFile types
│   │   ├── supabase-adapter.ts           # Supabase implementation of MediaAdapter
│   │   ├── handlers.ts                   # Upload, list, delete handlers
│   │   ├── resolve.ts                    # Media reference resolution
│   │   └── *.test.ts
│   ├── export/
│   │   ├── types.ts                      # Export response types
│   │   ├── handlers.ts                   # Export handlers (page, site, navigation)
│   │   └── *.test.ts
│   ├── utils/
│   │   ├── slug.ts                       # Slug generation and uniqueness
│   │   └── sanitize.ts                   # HTML sanitization (XSS protection)
│   └── types/
│       └── database.types.ts             # Generated Supabase types
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Key Concepts

### Handler Functions

This package exports **handler functions**, not complete route handlers. This keeps the package framework-agnostic and allows adapter injection. Host projects create thin route handlers that inject their adapters.

### Adapter Interfaces

- **`StorageAdapter`** — Interface for page and navigation persistence
- **`MediaAdapter`** — Interface for media file operations

Both have Supabase implementations but the interfaces are Supabase-agnostic for future portability.

### HTML Sanitization

Rich text content is sanitized on write using `sanitize-html` to prevent XSS attacks.

## API Reference

### Adapter Factories

- **`createStorageAdapter({ client })`** — Create a Supabase storage adapter
- **`createMediaAdapter({ client, bucketName? })`** — Create a Supabase media adapter

### Storage Handlers

- **`handleCreatePage(adapter, input)`** — Create a page with auto-generated slug
- **`handleUpdatePage(adapter, input)`** — Update an existing page
- **`handleDeletePage(adapter, id)`** — Delete a page by ID
- **`handleCreateNavigation(adapter, input)`** — Create a navigation
- **`handleUpdateNavigation(adapter, input)`** — Update a navigation
- **`handleDeleteNavigation(adapter, id)`** — Delete a navigation

### Delivery Handlers

- **`handleListPages(adapter, options?)`** — List pages with optional filtering
- **`handleGetPageBySlug(adapter, slug)`** — Get a single page by slug
- **`handleGetNavigation(adapter, name)`** — Get a navigation by name

### Media Handlers

- **`handleUploadMedia(adapter, input)`** — Upload a media file (validates MIME type)
- **`handleGetMedia(adapter, id)`** — Get media by ID
- **`handleListMedia(adapter, filter?)`** — List media files
- **`handleDeleteMedia(adapter, id)`** — Delete a media file
- **`resolveMediaReferences(adapter, sections)`** — Resolve media IDs to URLs in section data

**Allowed MIME types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

### Export Handlers

- **`handleExportPage(adapter, mediaAdapter, slug)`** — Export a single page with resolved media
- **`handleExportAllPages(adapter, mediaAdapter)`** — Export all pages
- **`handleExportNavigations(adapter)`** — Export all navigations
- **`handleExportSite(adapter, mediaAdapter)`** — Full site export (pages + navigations + media)

### Next.js Preset Factories

- **`createNextPagesRoute({ storageAdapter, mediaAdapter })`** — List and create pages
- **`createNextPageBySlugRoute({ storageAdapter, mediaAdapter })`** — Get page by slug
- **`createNextPageByIdRoute({ storageAdapter })`** — Update/delete page by ID
- **`createNextMediaRoute({ mediaAdapter })`** — List and upload media
- **`createNextMediaByIdRoute({ mediaAdapter })`** — Delete media by ID
- **`createNextNavigationRoute({ storageAdapter })`** — List and create navigation
- **`createNextNavigationByIdRoute({ storageAdapter })`** — Update/delete navigation by ID

### Error Classes

- **`StorageError`** — Thrown by storage adapter on database errors
- **`StorageValidationError`** — Thrown on validation failures (empty title, duplicate slug). Has `code` property.
- **`MediaError`** — Thrown by media adapter on storage/database errors
- **`MediaValidationError`** — Thrown on validation failures (invalid MIME type). Has `code` property.

### Constants

- **`ALLOWED_MIME_TYPES`** — Readonly array of allowed MIME types

### Utilities

- **`generateSlug(title)`** — Generate a URL-safe slug from a title
- **`ensureUniqueSlug(slug, existingSlugs)`** — Ensure slug uniqueness by appending a suffix if needed

## Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database and storage client |
| `sanitize-html` | Server-side HTML sanitization for XSS protection |

## Database

Migrations live in `supabase/migrations/` at the monorepo root. See [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for the database schema.

## Development

```bash
# Run tests (watch mode)
pnpm test

# Run tests once
pnpm test run

# Build
pnpm build

# Type check
pnpm typecheck

# Regenerate Supabase types
pnpm gen:types
```

**[← Back to main README](../../README.md)**
