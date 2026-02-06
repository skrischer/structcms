# StructCMS — Architecture

This document describes the technical layers and their responsibilities within StructCMS.

For package-specific details, see:
- [@structcms/core](./packages/core/README.md) — Modeling, Registry, Types
- [@structcms/api](./packages/api/README.md) — Storage, Domain API, Delivery API
- [@structcms/admin](./packages/admin/README.md) — Admin UI Components

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

### Why a Test App is Required

`@structcms/admin` is a library package — it exports React components but has no standalone dev server, no routing, and no API backend. E2E tests require:

- A running HTTP server with routes
- API endpoints that respond to admin UI requests
- A registry with example section definitions
- A storage backend (real or mocked)

### Architecture

```
examples/test-app/
│
├─ @structcms/core        # Section definitions, registry
├─ @structcms/admin       # Admin UI components
├─ @structcms/api         # Handler functions
├─ In-Memory Adapters     # Mock StorageAdapter + MediaAdapter
│
└─ Next.js App Router     # Routing, route handlers, pages
```

### File Structure

```
examples/
└── test-app/
    ├── app/
    │   ├── layout.tsx                    # Root layout (html, body)
    │   ├── (admin)/
    │   │   ├── layout.tsx                # AdminProvider + AdminLayout
    │   │   ├── pages/
    │   │   │   ├── page.tsx              # PageList view
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx          # PageEditor view
    │   │   ├── pages/new/
    │   │   │   └── page.tsx              # Create new page
    │   │   ├── navigation/
    │   │   │   └── page.tsx              # NavigationEditor view
    │   │   └── media/
    │   │       └── page.tsx              # MediaBrowser view
    │   └── api/
    │       └── cms/
    │           ├── pages/
    │           │   ├── route.ts          # GET (list), POST (create)
    │           │   └── [slug]/
    │           │       └── route.ts      # GET, PUT, DELETE
    │           ├── navigation/
    │           │   └── [name]/
    │           │       └── route.ts      # GET, PUT
    │           ├── media/
    │           │   ├── route.ts          # GET (list), POST (upload)
    │           │   └── [id]/
    │           │       └── route.ts      # DELETE
    │           └── __test__/
    │               ├── reset/
    │               │   └── route.ts      # POST — clear all data
    │               └── seed/
    │                   └── route.ts      # POST — insert seed data
    ├── lib/
    │   ├── registry.ts                   # Example sections + page types
    │   ├── adapters.ts                   # Supabase client + real adapters
    │   ├── seed.ts                       # Seed data definitions
    │   └── seed-runner.ts                # Seed execution logic
    ├── e2e/
    │   ├── helpers.ts                    # resetAndSeed(), resetOnly()
    │   ├── create-page.spec.ts
    │   ├── edit-section.spec.ts
    │   ├── upload-media.spec.ts
    │   ├── navigation.spec.ts
    │   └── page-list.spec.ts
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    └── playwright.config.ts
```

### Backend: Real Supabase DB

The test app connects to the existing Supabase test instance using `SupabaseStorageAdapter` and `SupabaseMediaAdapter` from `@structcms/api`. No mocks — this validates the full stack including database queries, JSONB serialization, and Storage bucket operations.

#### Adapter Setup

```typescript
// lib/adapters.ts
import { createClient } from '@supabase/supabase-js';
import { createStorageAdapter, createMediaAdapter } from '@structcms/api';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const storageAdapter = createStorageAdapter({ client: supabase });
export const mediaAdapter = createMediaAdapter({ client: supabase, bucket: 'media' });
```

#### Environment

```bash
# .env.local (gitignored)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

CI uses GitHub Secrets for the same variables.

### Seed Data

A seed module provides representative test data that covers all field types and content structures. The seed is used by E2E tests and can be run manually for development.

#### Seed Content

```typescript
// lib/seed.ts
import type { CreatePageInput, CreateNavigationInput } from '@structcms/api';

export const seedPages: CreatePageInput[] = [
  {
    title: 'Home',
    slug: 'home',
    pageType: 'landing',
    sections: [
      {
        type: 'hero',
        data: {
          title: 'Welcome to StructCMS',
          subtitle: 'A code-first headless CMS',
          image: '',
        },
      },
      {
        type: 'content',
        data: {
          body: '<p>This is the home page content.</p>',
        },
      },
    ],
  },
  {
    title: 'About Us',
    slug: 'about',
    pageType: 'landing',
    sections: [
      {
        type: 'hero',
        data: {
          title: 'About Us',
          subtitle: '',
          image: '',
        },
      },
    ],
  },
  {
    title: 'Blog Post Example',
    slug: 'blog-post-example',
    pageType: 'blog',
    sections: [
      {
        type: 'content',
        data: {
          body: '<h2>Hello World</h2><p>This is a blog post.</p>',
        },
      },
    ],
  },
];

export const seedNavigations: CreateNavigationInput[] = [
  {
    name: 'main',
    items: [
      { label: 'Home', href: '/' },
      {
        label: 'About',
        href: '/about',
        children: [
          { label: 'Team', href: '/about/team' },
        ],
      },
    ],
  },
];
```

#### Seed Runner

```typescript
// lib/seed-runner.ts
import { storageAdapter, mediaAdapter } from './adapters';
import { seedPages, seedNavigations } from './seed';

export async function runSeed() {
  for (const page of seedPages) {
    await storageAdapter.createPage(page);
  }
  for (const nav of seedNavigations) {
    await storageAdapter.createNavigation(nav);
  }
}
```

The seed can be triggered via:
- **API route**: `POST /api/cms/__test__/seed` (for Playwright `beforeEach`)
- **CLI script**: `pnpm --filter test-app seed` (for manual development)

### Cleanup Strategy

Since the Supabase instance is exclusively for testing, cleanup is straightforward.

#### Reset Endpoint

```typescript
// app/api/cms/__test__/reset/route.ts
import { storageAdapter } from '@/lib/adapters';

export async function POST() {
  // Delete all pages
  const pages = await storageAdapter.listPages();
  for (const page of pages) {
    await storageAdapter.deletePage(page.id);
  }

  // Delete all navigations
  const navigations = await storageAdapter.listNavigations();
  for (const nav of navigations) {
    await storageAdapter.deleteNavigation(nav.id);
  }

  // Delete all media
  const media = await mediaAdapter.listMedia();
  for (const file of media) {
    await mediaAdapter.deleteMedia(file.id);
  }

  return Response.json({ status: 'reset' });
}
```

#### E2E Test Lifecycle

```typescript
// e2e/helpers.ts
const BASE_URL = 'http://localhost:3000';

export async function resetAndSeed() {
  await fetch(`${BASE_URL}/api/cms/__test__/reset`, { method: 'POST' });
  await fetch(`${BASE_URL}/api/cms/__test__/seed`, { method: 'POST' });
}

export async function resetOnly() {
  await fetch(`${BASE_URL}/api/cms/__test__/reset`, { method: 'POST' });
}
```

Tests choose their setup:
- **Tests that need existing data** (Page List, Edit Section): `resetAndSeed()`
- **Tests that start from scratch** (Create Page, Upload Media): `resetOnly()`

### Example Registry

The test app registers a small set of representative sections covering all field types:

```typescript
// lib/registry.ts
import { defineSection, definePageType, createRegistry, fields } from '@structcms/core';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string().min(1),
    subtitle: fields.text().optional(),
    image: fields.image(),
  },
});

const ContentSection = defineSection({
  name: 'content',
  fields: {
    body: fields.richtext(),
  },
});

const LandingPage = definePageType({
  name: 'landing',
  allowedSections: ['hero', 'content'],
});

export const registry = createRegistry({
  sections: [HeroSection, ContentSection],
  pageTypes: [LandingPage],
});
```

### Route Handlers

Route handlers are thin wrappers around `@structcms/api` handler functions, injecting the adapters:

```typescript
// app/api/cms/pages/route.ts
import { handleListPages, handleCreatePage } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';

export async function GET() {
  const pages = await handleListPages(storageAdapter);
  return Response.json(pages);
}

export async function POST(request: Request) {
  const data = await request.json();
  const page = await handleCreatePage(storageAdapter, data);
  return Response.json(page, { status: 201 });
}
```

### Admin Pages

Admin pages are thin wrappers around `@structcms/admin` components:

```typescript
// app/(admin)/layout.tsx
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from '@/lib/registry';

export default function Layout({ children }) {
  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout onNavigate={(path) => /* Next.js router.push */}>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}
```

### Workspace Integration

The test app is included in the pnpm workspace:

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "examples/*"
```

Dependencies reference workspace packages:

```json
// examples/test-app/package.json
{
  "dependencies": {
    "@structcms/core": "workspace:*",
    "@structcms/api": "workspace:*",
    "@structcms/admin": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "typescript": "~5.7.0"
  }
}
```

### E2E Test Specifications

Tests use Playwright and follow this pattern:

1. **Reset state** via `POST /api/cms/__test__/reset`
2. **Seed data** if needed via API calls
3. **Navigate** to admin page
4. **Interact** with UI components
5. **Assert** UI state and/or API state

#### Test: Create Page

```
1. Navigate to /pages
2. Click "Create New Page"
3. Select page type "landing"
4. Add a "hero" section
5. Fill in title, subtitle, image
6. Click "Save Page"
7. Assert: page appears in page list
8. Assert: GET /api/cms/pages/:slug returns the created page
```

#### Test: Edit Section

```
1. Seed a page with a hero section via API
2. Navigate to /pages/:slug
3. Edit the hero title field
4. Save the section / Save the page
5. Assert: updated data persisted via API
```

#### Test: Upload Media

```
1. Navigate to /media
2. Click "Upload"
3. Select a test image file
4. Assert: image appears in media grid
5. Navigate to a page with an image field
6. Click "Browse Media" on the image picker
7. Select the uploaded image
8. Assert: image preview shown in form
```

#### Test: Navigation

```
1. Navigate to /navigation
2. Add a navigation item (label + href)
3. Add a child item
4. Click "Save Navigation"
5. Assert: GET /api/cms/navigation/:name returns saved items
```

#### Test: Page List

```
1. Seed 3 pages via API (2 landing, 1 blog)
2. Navigate to /pages
3. Assert: all 3 pages visible
4. Type search term → assert filtered results
5. Select page type filter → assert filtered results
6. Click a page row → assert navigation to edit page
```

---
