# @structcms/api

Storage, domain API, delivery API, and content export for StructCMS. Provides Supabase-agnostic adapter interfaces, handler functions for content CRUD, media management, and JSON export.

For architectural context, see [ARCHITECTURE.md](../../ARCHITECTURE.md) (Layer 3: Storage, Layer 4: Domain API, Layer 5: Delivery API).

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

This package exports **handler functions**, not complete route handlers. This keeps the package framework-agnostic and allows adapter injection. Host projects create thin route handlers that inject their adapters. See `examples/test-app/app/api/cms/` for a reference implementation.

### Adapter Interfaces

- **`StorageAdapter`** — Interface for page and navigation persistence. See `src/storage/types.ts`.
- **`MediaAdapter`** — Interface for media file operations. See `src/media/types.ts`.

Both have Supabase implementations (`SupabaseStorageAdapter`, `SupabaseMediaAdapter`) but the interfaces are Supabase-agnostic for future portability.

### HTML Sanitization

Rich text content is sanitized on write using `sanitize-html` to prevent XSS. See `src/utils/sanitize.ts`.

## Quickstart

This section shows the minimal setup path for integrating `@structcms/api` into a Next.js App Router project. For a complete working example, see `examples/test-app`.

### 1. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=media  # optional, defaults to "media"
```

### 2. Adapter Setup

Create `lib/adapters.ts` to bootstrap Supabase adapters:

```typescript
import { createSupabaseAdapters } from '@structcms/api/supabase';

const { storageAdapter, mediaAdapter } = createSupabaseAdapters();

export { storageAdapter, mediaAdapter };
```

The `createSupabaseAdapters()` factory reads environment variables automatically. You can also pass explicit configuration:

```typescript
const { storageAdapter, mediaAdapter } = createSupabaseAdapters({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SECRET_KEY,
  storage: { bucketName: 'custom-bucket' }
});
```

### 3. Route Handlers (Next.js Preset Factories)

Use the `@structcms/api/next` preset factories to create route handlers with minimal boilerplate:

**Pages Route** (`app/api/cms/pages/route.ts`):

```typescript
import { createNextPagesRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

const pagesRoute = createNextPagesRoute({ storageAdapter });

export async function GET(request: Request): Promise<Response> {
  return pagesRoute.GET(request) as Promise<Response>;
}

export async function POST(request: Request): Promise<Response> {
  return pagesRoute.POST(request) as Promise<Response>;
}
```

**Page by Slug Route** (`app/api/cms/pages/[slug]/route.ts`):

```typescript
import { createNextPageBySlugRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

const pageBySlugRoute = createNextPageBySlugRoute({ storageAdapter });

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
): Promise<Response> {
  return pageBySlugRoute.GET(request, context) as Promise<Response>;
}
```

**Page by ID Route** (`app/api/cms/pages/[id]/route.ts`):

```typescript
import { createNextPageByIdRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

const pageByIdRoute = createNextPageByIdRoute({ storageAdapter });

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return pageByIdRoute.PUT(request, context) as Promise<Response>;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return pageByIdRoute.DELETE(request, context) as Promise<Response>;
}
```

**Media Route** (`app/api/cms/media/route.ts`):

```typescript
import { createNextMediaRoute } from '@structcms/api/next';
import { mediaAdapter } from '@/lib/adapters';

const mediaRoute = createNextMediaRoute({ mediaAdapter });

export async function GET(request: Request): Promise<Response> {
  return mediaRoute.GET(request) as Promise<Response>;
}

export async function POST(request: Request): Promise<Response> {
  return mediaRoute.POST(request) as Promise<Response>;
}
```

**Media by ID Route** (`app/api/cms/media/[id]/route.ts`):

```typescript
import { createNextMediaByIdRoute } from '@structcms/api/next';
import { mediaAdapter } from '@/lib/adapters';

const mediaByIdRoute = createNextMediaByIdRoute({ mediaAdapter });

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return mediaByIdRoute.DELETE(request, context) as Promise<Response>;
}
```

**Navigation Route** (`app/api/cms/navigation/route.ts`):

```typescript
import { createNextNavigationRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

const navigationRoute = createNextNavigationRoute({ storageAdapter });

export async function GET(request: Request): Promise<Response> {
  return navigationRoute.GET(request) as Promise<Response>;
}

export async function POST(request: Request): Promise<Response> {
  return navigationRoute.POST(request) as Promise<Response>;
}
```

**Navigation by ID Route** (`app/api/cms/navigation/[id]/route.ts`):

```typescript
import { createNextNavigationByIdRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

const navigationByIdRoute = createNextNavigationByIdRoute({ storageAdapter });

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return navigationByIdRoute.PUT(request, context) as Promise<Response>;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return navigationByIdRoute.DELETE(request, context) as Promise<Response>;
}
```

### 4. Advanced: Using Core Handlers Directly

The preset factories are **opt-in convenience APIs**. You can use the core handler functions directly for full control:

```typescript
import { handleListPages, handleCreatePage } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageType = url.searchParams.get('pageType') || undefined;
    
    const pages = await handleListPages(storageAdapter, { pageType });
    return Response.json({ data: pages });
  } catch (error) {
    return Response.json({ error: { message: 'Failed to list pages' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const page = await handleCreatePage(storageAdapter, input);
    return Response.json({ data: page }, { status: 201 });
  } catch (error) {
    return Response.json({ error: { message: 'Failed to create page' } }, { status: 500 });
  }
}
```

This approach gives you complete control over request parsing, validation, error handling, and response formatting.

## Public API

### Storage Handlers

- **`handleCreatePage(adapter, input)`** — Create a page with auto-generated slug
- **`handleUpdatePage(adapter, input)`** — Update an existing page
- **`handleDeletePage(adapter, id)`** — Delete a page by ID
- **`handleCreateNavigation(adapter, input)`** — Create a navigation
- **`handleUpdateNavigation(adapter, input)`** — Update a navigation
- **`handleDeleteNavigation(adapter, id)`** — Delete a navigation

See `src/storage/handlers.ts` for implementation.

### Delivery Handlers

- **`handleListPages(adapter, options?)`** — List pages with optional filtering
- **`handleGetPageBySlug(adapter, slug)`** — Get a single page by slug
- **`handleGetNavigation(adapter, name)`** — Get a navigation by name

See `src/delivery/handlers.ts` for implementation.

### Media Handlers

- **`handleUploadMedia(adapter, input)`** — Upload a media file (validates MIME type)
- **`handleGetMedia(adapter, id)`** — Get media by ID
- **`handleListMedia(adapter, filter?)`** — List media files
- **`handleDeleteMedia(adapter, id)`** — Delete a media file
- **`resolveMediaReferences(adapter, sections)`** — Resolve media IDs to URLs in section data

Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`. See `src/media/types.ts`.

### Export Handlers

- **`handleExportPage(adapter, mediaAdapter, slug)`** — Export a single page with resolved media
- **`handleExportAllPages(adapter, mediaAdapter)`** — Export all pages
- **`handleExportNavigations(adapter)`** — Export all navigations
- **`handleExportSite(adapter, mediaAdapter)`** — Full site export (pages + navigations + media metadata)

See `src/export/handlers.ts` for implementation and `src/export/types.ts` for the export format.

### Adapter Factories

- **`createStorageAdapter({ client })`** — Create a Supabase storage adapter. Returns `SupabaseStorageAdapter`.
- **`createMediaAdapter({ client, bucketName? })`** — Create a Supabase media adapter. Returns `SupabaseMediaAdapter`.

### Adapter Classes

- **`SupabaseStorageAdapter`** — Supabase implementation of `StorageAdapter`. See `src/storage/supabase-adapter.ts`.
- **`SupabaseMediaAdapter`** — Supabase implementation of `MediaAdapter`. See `src/media/supabase-adapter.ts`.

### Error Classes

- **`StorageError`** — Thrown by `SupabaseStorageAdapter` on database errors.
- **`StorageValidationError`** — Thrown by storage handlers on validation failures (empty title, duplicate slug). Has `code` property.
- **`MediaError`** — Thrown by `SupabaseMediaAdapter` on storage/database errors.
- **`MediaValidationError`** — Thrown by media handlers on validation failures (invalid MIME type). Has `code` property.

### Constants

- **`ALLOWED_MIME_TYPES`** — Readonly array of allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`. See `src/media/types.ts`.

### Utilities

- **`generateSlug(title)`** — Generate a URL-safe slug from a title
- **`ensureUniqueSlug(slug, existingSlugs)`** — Ensure slug uniqueness by appending a suffix if needed

## Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database and storage client |
| `sanitize-html` | Server-side HTML sanitization for XSS protection |

## Database

Migrations live in `supabase/migrations/` at the monorepo root. See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the database schema.

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
