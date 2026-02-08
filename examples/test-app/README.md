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
│   ├── layout.tsx                        # Root layout with navigation
│   ├── globals.css                       # Tailwind CSS imports
│   ├── page.tsx                          # Home page (renders "home" slug)
│   ├── [...slug]/
│   │   └── page.tsx                      # Catch-all dynamic page rendering
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
│   ├── registry.ts                       # Section + page type definitions
│   ├── adapters.ts                       # Supabase client + real adapters
│   ├── seed.ts                           # Seed data definitions
│   ├── seed-runner.ts                    # Seed execution logic
│   └── components/                       # Frontend section components
│       ├── index.ts                      # Component registry + type inference
│       ├── hero.tsx                      # Hero section renderer
│       ├── content.tsx                   # Content section renderer
│       └── navigation.tsx                # Navigation renderer
├── e2e/
│   ├── helpers.ts                        # resetAndSeed(), resetOnly(), seedOnly()
│   ├── fixtures/                         # Test assets (e.g. test images)
│   ├── create-page.spec.ts
│   ├── edit-section.spec.ts
│   ├── upload-media.spec.ts
│   ├── navigation.spec.ts
│   └── page-list.spec.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── playwright.config.ts
```

## Setup

```bash
# 1. Copy environment variables
cp .env.example .env.local
# Fill in SUPABASE_URL and SUPABASE_SECRET_KEY

# 2. Install dependencies (from monorepo root)
pnpm install

# 3. Start dev server
pnpm --filter test-app dev

# 4. Seed test data (optional)
curl -X POST http://localhost:3000/api/cms/testing/seed
```

## Environment

```bash
# .env.local (gitignored)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=eyJ...
```

CI uses GitHub Secrets for the same variables.

## Key Concepts

### Adapter Setup

The app uses real Supabase adapters — same code that runs in production. See `lib/adapters.ts` for the `storageAdapter` and `mediaAdapter` configuration.

### Registry

Section definitions (`hero`, `content`) and page types (`landing`, `blog`) are defined in `lib/registry.ts` using `@structcms/core` APIs (`defineSection`, `definePageType`, `createRegistry`).

### Route Handlers

All API routes under `app/api/cms/` are thin wrappers around `@structcms/api` handler functions, injecting the adapters from `lib/adapters.ts`. Each route includes error handling with appropriate HTTP status codes.

### Admin Pages

Admin pages under `app/admin/` wrap `@structcms/admin` components (`PageList`, `PageEditor`, `NavigationEditor`, `MediaBrowser`). The admin layout in `app/admin/layout.tsx` sets up `AdminProvider` with the registry and API base URL.

### Frontend Rendering

The app demonstrates how to render CMS content on the frontend:

- **Component Registry** (`lib/components/index.ts`): Maps section types to React components using `InferSectionData` for type-safe props inferred from Zod schemas
- **Page Rendering** (`app/[...slug]/page.tsx`): Async Server Component that fetches pages by slug directly via `handleGetPageBySlug` — no HTTP roundtrip
- **Navigation** (`lib/components/navigation.tsx`): Renders nested navigation menus, loaded in `app/layout.tsx` via `handleGetNavigation`

### Seed Data

Representative test data is defined in `lib/seed.ts` and executed by `lib/seed-runner.ts`. It covers multiple page types, nested sections, and navigation with children.

The seed can be triggered via:
- **API route**: `POST /api/cms/testing/seed` (for Playwright `beforeEach`)
- **Reset route**: `POST /api/cms/testing/reset` (clears all pages, navigations, and media)

## E2E Tests

```bash
# Run E2E tests (requires running dev server in another terminal)
pnpm --filter test-app dev          # Terminal 1
pnpm --filter test-app test:e2e     # Terminal 2
```

Tests use Playwright and follow this lifecycle:

1. **Reset state** via `POST /api/cms/testing/reset`
2. **Seed data** if needed via `POST /api/cms/testing/seed`
3. **Navigate** to admin page, **interact** with UI, **assert** results

Test helpers in `e2e/helpers.ts` provide `resetOnly()`, `seedOnly()`, and `resetAndSeed()`.

### Test Coverage

- **create-page** — Creates a new landing page via admin UI, verifies via API
- **edit-section** — Edits a hero section title, verifies persistence
- **upload-media** — Uploads a test image, verifies it appears in media list
- **navigation** — Displays and saves navigation items
- **page-list** — Displays seeded pages, filters by search, navigates to edit
