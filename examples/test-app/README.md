# E2E Test App

Minimal Next.js host application for end-to-end testing and integration verification of all StructCMS packages.

## Description

This app integrates all three packages (`@structcms/core`, `@structcms/api`, `@structcms/admin`) into a running Next.js App Router application. It serves two purposes:

- **E2E testing** of critical admin flows with Playwright
- **Reference implementation** for host project integration

This is **not** a publishable package. It exists solely for testing and as a usage example.

## Architecture

```
examples/test-app/
│
├─ @structcms/core        # Section definitions, registry
├─ @structcms/admin       # Admin UI components
├─ @structcms/api         # Handler functions
├─ Supabase Test Instance  # Real StorageAdapter + MediaAdapter
│
└─ Next.js App Router     # Routing, route handlers, pages
```

The app connects to the existing Supabase test instance using the real `SupabaseStorageAdapter` and `SupabaseMediaAdapter` from `@structcms/api`. No mocks — this validates the full stack including database queries, JSONB serialization, and Storage bucket operations.

## File Structure

```
examples/test-app/
├── app/
│   ├── layout.tsx                        # Root layout (html, body)
│   ├── page.tsx                          # Home page
│   ├── [slug]/
│   │   └── page.tsx                      # Dynamic page rendering
│   ├── admin/
│   │   ├── layout.tsx                    # AdminProvider + AdminLayout
│   │   ├── pages/
│   │   │   ├── page.tsx                  # PageList view
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Create new page
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # PageEditor view
│   │   ├── navigation/
│   │   │   └── page.tsx                  # NavigationEditor view
│   │   └── media/
│   │       └── page.tsx                  # MediaBrowser view
│   └── api/
│       └── cms/
│           ├── pages/
│           │   ├── route.ts              # GET (list), POST (create)
│           │   └── [slug]/
│           │       └── route.ts          # GET, PUT, DELETE
│           ├── navigation/
│           │   └── [name]/
│           │       └── route.ts          # GET, PUT
│           ├── media/
│           │   ├── route.ts              # GET (list), POST (upload)
│           │   └── [id]/
│           │       └── route.ts          # DELETE
│           └── testing/
│               ├── reset/
│               │   └── route.ts          # POST — clear all data
│               └── seed/
│                   └── route.ts          # POST — insert seed data
├── lib/
│   ├── registry.ts                       # Example sections + page types
│   ├── adapters.ts                       # Supabase client + real adapters
│   ├── seed.ts                           # Seed data definitions
│   ├── seed-runner.ts                    # Seed execution logic
│   └── components/                       # Frontend section components
│       ├── index.ts                      # Component registry
│       ├── hero.tsx                      # Hero section renderer
│       └── content.tsx                   # Content section renderer
├── e2e/
│   ├── helpers.ts                        # resetAndSeed(), resetOnly()
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

## Dependencies

```json
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

## Environment

```bash
# .env.local (gitignored)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

CI uses GitHub Secrets for the same variables.

## Adapter Setup

The app uses real Supabase adapters — same code that runs in production:

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

## Example Registry

A small set of representative sections covering all field types:

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

## Route Handlers

Thin wrappers around `@structcms/api` handler functions, injecting the adapters:

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

## Admin Pages

Thin wrappers around `@structcms/admin` components:

```typescript
// app/admin/layout.tsx
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from '@/lib/registry';

export default function Layout({ children }) {
  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout 
        navItems={[
          { label: 'Pages', path: '/admin/pages' },
          { label: 'Navigation', path: '/admin/navigation' },
          { label: 'Media', path: '/admin/media' },
        ]}
        onNavigate={(path) => /* Next.js router.push */}>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}
```

## Seed Data

Representative test data covering multiple page types, nested sections, and navigation with children:

```typescript
// lib/seed.ts
import type { CreatePageInput, CreateNavigationInput } from '@structcms/api';

export const seedPages: CreatePageInput[] = [
  {
    title: 'Home',
    slug: 'home',
    pageType: 'landing',
    sections: [
      { type: 'hero', data: { title: 'Welcome to StructCMS', subtitle: 'A code-first headless CMS', image: '' } },
      { type: 'content', data: { body: '<p>This is the home page content.</p>' } },
    ],
  },
  {
    title: 'About Us',
    slug: 'about',
    pageType: 'landing',
    sections: [
      { type: 'hero', data: { title: 'About Us', subtitle: '', image: '' } },
    ],
  },
  {
    title: 'Blog Post Example',
    slug: 'blog-post-example',
    pageType: 'blog',
    sections: [
      { type: 'content', data: { body: '<h2>Hello World</h2><p>This is a blog post.</p>' } },
    ],
  },
];

export const seedNavigations: CreateNavigationInput[] = [
  {
    name: 'main',
    items: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about', children: [{ label: 'Team', href: '/about/team' }] },
    ],
  },
];
```

The seed can be triggered via:
- **API route**: `POST /api/cms/testing/seed` (for Playwright `beforeEach`)
- **CLI script**: `pnpm --filter test-app seed` (for manual development)

## Cleanup Strategy

Since the Supabase instance is exclusively for testing, cleanup is straightforward.

### Reset Endpoint

```typescript
// app/api/cms/testing/reset/route.ts
export async function POST() {
  const pages = await storageAdapter.listPages();
  for (const page of pages) { await storageAdapter.deletePage(page.id); }

  const navigations = await storageAdapter.listNavigations();
  for (const nav of navigations) { await storageAdapter.deleteNavigation(nav.id); }

  const media = await mediaAdapter.listMedia();
  for (const file of media) { await mediaAdapter.deleteMedia(file.id); }

  return Response.json({ status: 'reset' });
}
```

### E2E Test Lifecycle

```typescript
// e2e/helpers.ts
const BASE_URL = 'http://localhost:3000';

export async function resetAndSeed() {
  await fetch(`${BASE_URL}/api/cms/testing/reset`, { method: 'POST' });
  await fetch(`${BASE_URL}/api/cms/testing/seed`, { method: 'POST' });
}

export async function resetOnly() {
  await fetch(`${BASE_URL}/api/cms/testing/reset`, { method: 'POST' });
}
```

Tests choose their setup:
- **Tests that need existing data** (Page List, Edit Section): `resetAndSeed()`
- **Tests that start from scratch** (Create Page, Upload Media): `resetOnly()`

---

## E2E Test Specifications

Tests use Playwright and follow this pattern:

1. **Reset state** via `POST /api/cms/testing/reset`
2. **Seed data** if needed via API calls
3. **Navigate** to admin page
4. **Interact** with UI components
5. **Assert** UI state and/or API state

### Test: Create Page

```
1. Navigate to /admin/pages
2. Click "Create New Page"
3. Select page type "landing"
4. Add a "hero" section
5. Fill in title, subtitle, image
6. Click "Save Page"
7. Assert: page appears in page list
8. Assert: GET /api/cms/pages/:slug returns the created page
```

### Test: Edit Section

```
1. Seed a page with a hero section via API
2. Navigate to /admin/pages/:slug
3. Edit the hero title field
4. Save the page
5. Assert: updated data persisted via API
```

### Test: Upload Media

```
1. Navigate to /admin/media
2. Click "Upload"
3. Select a test image file
4. Assert: image appears in media grid
5. Navigate to a page with an image field
6. Click "Browse Media" on the image picker
7. Select the uploaded image
8. Assert: image preview shown in form
```

### Test: Navigation

```
1. Navigate to /admin/navigation
2. Add a navigation item (label + href)
3. Add a child item
4. Click "Save Navigation"
5. Assert: GET /api/cms/navigation/:name returns saved items
```

### Test: Page List

```
1. Seed 3 pages via API (2 landing, 1 blog)
2. Navigate to /admin/pages
3. Assert: all 3 pages visible
4. Type search term → assert filtered results
5. Select page type filter → assert filtered results
6. Click a page row → assert navigation to edit page
```

---

## Frontend Rendering

The test-app demonstrates how to render CMS content on the frontend. This includes:

- **Component Mapping**: Mapping section types to React components
- **Page Resolving**: Fetching and rendering pages by slug
- **Navigation Rendering**: Displaying navigation menus

### Component Registry

Section data types are inferred directly from the registry definitions using `InferSectionData`.
This ensures the component props stay in sync with the Zod schemas — no manual type duplication.

```typescript
// lib/components/index.ts
import type { InferSectionData } from '@structcms/core';
import type { HeroSection as HeroSectionDef, ContentSection as ContentSectionDef } from '@/lib/registry';
import { HeroSection } from './hero';
import { ContentSection } from './content';

export type HeroData = InferSectionData<typeof HeroSectionDef>;
export type ContentData = InferSectionData<typeof ContentSectionDef>;

type SectionDataMap = {
  hero: HeroData;
  content: ContentData;
};

export type SectionType = keyof SectionDataMap;

export interface SectionComponentProps<T extends SectionType> {
  data: SectionDataMap[T];
}

export const sectionComponents: {
  [K in SectionType]: React.ComponentType<SectionComponentProps<K>>;
} = {
  hero: HeroSection,
  content: ContentSection,
};

export function isSectionType(type: string): type is SectionType {
  return type in sectionComponents;
}

export function getComponent(
  type: SectionType
): React.ComponentType<{ data: Record<string, unknown> }> {
  return sectionComponents[type] as React.ComponentType<{
    data: Record<string, unknown>;
  }>;
}
```

The `getComponent` helper bridges the gap between the API layer (`Record<string, unknown>`) and
the typed component props. The data is already validated by the Zod schemas on write.

### Section Components

Each section component receives fully typed props inferred from the section schema:

```typescript
// lib/components/hero.tsx
import type { HeroData } from '.';

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      {data.subtitle && <p className="mt-4 text-xl text-gray-600">{data.subtitle}</p>}
      {data.image && <img src={data.image} alt="" className="mt-8 mx-auto max-w-2xl" />}
    </section>
  );
}
```

```typescript
// lib/components/content.tsx
import type { ContentData } from '.';

export function ContentSection({ data }: { data: ContentData }) {
  return (
    <section className="prose max-w-3xl mx-auto py-12">
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </section>
  );
}
```

> **Note:** `dangerouslySetInnerHTML` is safe here because `@structcms/api` sanitizes all
> richtext HTML on write. The database only ever contains sanitized content.

### Page Rendering

Pages are rendered as async Server Components. The catch-all route `[...slug]` supports
nested slugs like `about/team`. Data is fetched directly via `handleGetPageBySlug` — no
HTTP roundtrip needed since we have access to the storage adapter.

```typescript
// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { handleGetPageBySlug } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { isSectionType, getComponent } from '@/lib/components';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = await handleGetPageBySlug(storageAdapter, slug.join('/'));

  if (!page) {
    notFound();
  }

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.sections.map((section, index) => {
        if (!isSectionType(section.type)) {
          console.warn(`Unknown section type: ${section.type}`);
          return null;
        }
        const Component = getComponent(section.type);
        return <Component key={index} data={section.data} />;
      })}
    </main>
  );
}
```

### Navigation Rendering

The navigation component uses `NavigationItem` from `@structcms/core` and renders
nested dropdowns via the Tailwind `group`/`group-hover` pattern:

```typescript
// lib/components/navigation.tsx
import Link from 'next/link';
import type { NavigationItem } from '@structcms/core';

function NavItem({ item }: { item: NavigationItem }) {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        href={item.href}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {item.label}
      </Link>
      <ul className="absolute left-0 top-full hidden min-w-40 rounded-md bg-white py-1 shadow-lg group-hover:block">
        {item.children!.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Navigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav>
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  );
}
```

### Layout Integration

The root layout loads navigation data directly via `handleGetNavigation` and renders
the `Navigation` component in a header:

```typescript
// app/layout.tsx
import './globals.css';
import { handleGetNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { Navigation } from '@/lib/components/navigation';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await handleGetNavigation(storageAdapter, 'main');

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {nav && (
          <header className="border-b bg-white px-6 py-3">
            <Navigation items={nav.items} />
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
```

### Static Generation (Optional)

For static site generation, generate paths from the CMS:

```typescript
// app/[...slug]/page.tsx
import { handleListPages } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';

export async function generateStaticParams() {
  const pages = await handleListPages(storageAdapter);

  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }));
}
```

---
