# StructCMS — Architecture

This document describes the technical layers and their responsibilities within StructCMS.

For package-specific details, see:
- [@structcms/core](./packages/core/README.md) — Modeling, Registry, Types
- [@structcms/api](./packages/api/README.md) — Storage, Domain API, Delivery API
- [@structcms/admin](./packages/admin/README.md) — Admin UI Components
- [E2E Test App](./examples/test-app/README.md) — Integration Testing, Reference Implementation

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

## Layer 1: Modeling Layer

**Purpose**: Defines schemas and content structures using Zod.

### Responsibilities
- Section schema definitions
- Field type definitions (text, richtext, image, reference, etc.)
- Validation rules
- TypeScript type inference from schemas

### Key Concepts
- **Section**: A reusable content block with defined fields
- **Page Type**: A template defining which sections a page can contain
- **Field Types**: Primitives and complex types for content fields

### Example
```typescript
import { z } from 'zod';
import { defineSection } from '@structcms/core';

export const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: z.string().min(1),
    subtitle: z.string().optional(),
    image: z.string().url(), // Media reference
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }).optional(),
  },
});
```

---

## Layer 2: Registry Layer

**Purpose**: Registers models from the host website project.

### Responsibilities
- Section registry (collect all section definitions)
- Page type registry
- Navigation model registry
- Runtime type resolution

### Key Concepts
- **Registry**: Central store for all content model definitions
- **Dynamic Registration**: Host projects register their own models at startup

### Example
```typescript
import { createRegistry } from '@structcms/core';
import { HeroSection, TextSection, GallerySection } from './sections';

export const registry = createRegistry({
  sections: [HeroSection, TextSection, GallerySection],
  pageTypes: ['landing', 'article', 'contact'],
});
```

---

## Layer 3: Storage Layer

**Purpose**: Persists structured content in PostgreSQL.

### Responsibilities
- Content CRUD operations
- JSONB storage for section data
- Media reference management
- Database schema management

### Database Schema (Conceptual)
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

### Abstraction
Storage operations are behind interfaces to allow future migration away from Supabase:

```typescript
interface StorageAdapter {
  getPage(slug: string): Promise<Page | null>;
  savePage(page: Page): Promise<Page>;
  deletePage(id: string): Promise<void>;
  listPages(filter?: PageFilter): Promise<Page[]>;
}
```

---

## Layer 4: Domain API Layer

**Purpose**: Applies business logic to content operations.

### Responsibilities
- Content validation against registered schemas
- Slug generation and uniqueness handling
- Business rule enforcement

### MVP Scope
- Validation
- Slug handling
- CRUD orchestration

### Phase 2 Additions
- Publish state management (draft/published)
- Locale resolution and fallback

---

## Layer 5: Delivery API Layer

**Purpose**: Optimized REST endpoints for frontend consumption.

### Responsibilities
- Typed JSON responses
- Section union types for frontend type safety
- Response shaping for rendering

### Endpoints (MVP)
```
GET  /api/cms/pages              # List all pages
GET  /api/cms/pages/:slug        # Get page by slug
GET  /api/cms/navigation/:name   # Get navigation by name
GET  /api/cms/media              # List media
```

### API Implementation Strategy

`@structcms/api` exports **handler functions**, not complete route handlers. This approach:

- Keeps the package framework-agnostic (not tied to Next.js)
- Allows adapter injection for storage abstraction
- Gives host projects full control over middleware, auth, and caching
- Enables easy unit testing without HTTP layer

**Package exports:**
```typescript
// @structcms/api
export function handleListPages(adapter: StorageAdapter): Promise<PageResponse[]>;
export function handleGetPageBySlug(adapter: StorageAdapter, slug: string): Promise<PageResponse | null>;
export function handleGetNavigation(adapter: StorageAdapter, name: string): Promise<NavigationResponse | null>;
export function handleListMedia(adapter: MediaAdapter): Promise<MediaResponse[]>;
```

**Host project usage:**
```typescript
// app/api/cms/pages/route.ts
import { handleListPages } from '@structcms/api';
import { adapter } from '@/lib/cms-adapter';

export async function GET() {
  const pages = await handleListPages(adapter);
  return Response.json(pages);
}
```

```typescript
// app/api/cms/pages/[slug]/route.ts
import { handleGetPageBySlug } from '@structcms/api';
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

### Response Format
```typescript
interface PageResponse {
  id: string;
  slug: string;
  pageType: string;
  sections: Section[]; // Union of all registered section types
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
```

---

## Layer 6: Admin UI Layer

**Purpose**: Content management interface for editors.

### Responsibilities (MVP)
- Dynamic form generation from Zod schemas
- Section editors with field-type-specific inputs
- Media browser and upload
- Content listing

### Phase 2 Additions
- Locale switching UI
- Draft/publish toggle

### Components
- **PageEditor**: Edit page content and sections
- **SectionEditor**: Edit individual section fields
- **MediaBrowser**: Browse and select media
- **ContentList**: List and filter content

### Tech Stack
- React
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod resolver

---

## Layer 7: Rendering Integration Layer

**Purpose**: Maps CMS content to frontend components.

### Responsibilities
- Section → Component mapping
- Typed props delivery to components
- Rendering utilities for host projects

### Example
```typescript
import { createSectionRenderer } from '@structcms/core';
import { HeroComponent, TextComponent } from './components';

const renderSection = createSectionRenderer({
  hero: HeroComponent,
  text: TextComponent,
  gallery: GalleryComponent,
});

// In page component
export function Page({ sections }) {
  return sections.map((section, i) => renderSection(section, i));
}
```

---

## Data Flow

```
1. Developer defines sections (Modeling Layer)
         ↓
2. Sections registered at startup (Registry Layer)
         ↓
3. Admin UI generates forms from schemas (Admin UI Layer)
         ↓
4. Content validated and saved (Domain API → Storage Layer)
         ↓
5. Frontend fetches content (Delivery API Layer)
         ↓
6. Content rendered to components (Rendering Integration Layer)
```

---

## Package Boundaries

| Package | Contains | Depends On |
|---------|----------|------------|
| `@structcms/core` | Modeling, Registry, Types | zod |
| `@structcms/api` | Storage, Domain API, Delivery API | `@structcms/core`, supabase-js |
| `@structcms/admin` | Admin UI components | `@structcms/core`, react, shadcn/ui |

---

## E2E Testing Layer

**Purpose**: Integration testing of all packages together in a realistic host application.

### Responsibilities
- Full-stack validation: Admin UI → API handlers → Supabase DB/Storage
- E2E tests for critical admin flows (Playwright)
- Reference implementation for host project integration
- Seed data and cleanup for reproducible test runs

### Key Concepts
- **Test App**: Minimal Next.js App Router project in `examples/test-app/`
- **Real Backend**: Connects to Supabase test instance — no mocks
- **Seed Data**: Representative pages, sections, and navigation for test scenarios
- **Reset/Seed Endpoints**: `POST /api/cms/__test__/reset` and `/seed` for test lifecycle

### Tech Stack
- Next.js (App Router)
- Playwright
- Supabase (test instance)

For file structure, adapter setup, seed data, cleanup strategy, and E2E test specifications, see the [E2E Test App README](./examples/test-app/README.md).

---
