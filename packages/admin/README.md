# @structcms/admin

Admin UI components for StructCMS. Provides dynamic form generation from Zod schemas, section/page editors, media browser, navigation editor, and a layout shell for the admin interface.

For architectural context, see [ARCHITECTURE.md](../../ARCHITECTURE.md) (Layer 6: Admin UI).

## File Structure

```
packages/admin/
├── src/
│   ├── index.ts                              # Public exports
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── dashboard-page.tsx             # Main dashboard with KPIs, recent pages, quick actions
│   │   │   ├── kpi-cards.tsx                  # KPI overview cards (pages, media, navigation, sections)
│   │   │   ├── recent-pages.tsx               # Recently updated pages list
│   │   │   └── quick-actions.tsx              # Quick action buttons (create page, upload media)
│   │   ├── editors/
│   │   │   ├── page-editor.tsx               # Page editor with section management
│   │   │   └── section-editor.tsx            # Section form from Zod schema
│   │   ├── inputs/
│   │   │   ├── string-input.tsx              # Single-line text input
│   │   │   ├── text-input.tsx                # Textarea input
│   │   │   ├── rich-text-editor.tsx          # WYSIWYG editor (Tiptap)
│   │   │   ├── image-picker.tsx              # Media browser integration
│   │   │   ├── array-field.tsx               # Add/remove/reorder items
│   │   │   └── object-field.tsx              # Nested object form
│   │   ├── content/
│   │   │   ├── page-list.tsx                 # Page listing with search/filter
│   │   │   └── navigation-editor.tsx         # Navigation item editor
│   │   ├── media/
│   │   │   └── media-browser.tsx             # Browse, upload, select media
│   │   ├── layout/
│   │   │   └── admin-layout.tsx              # Admin shell with sidebar (includes Dashboard)
│   │   └── ui/                               # Base UI primitives (button, input, label, etc.)
│   ├── context/
│   │   └── admin-context.tsx                 # AdminProvider (registry, API base URL)
│   ├── hooks/
│   │   ├── use-admin.ts                      # Access admin context
│   │   └── use-api-client.ts                 # HTTP client for CMS API
│   ├── lib/
│   │   ├── form-generator.tsx                # Zod schema → React Hook Form mapping
│   │   └── utils.ts                          # cn() utility (clsx + tailwind-merge)
│   └── test/                                 # Test setup (jsdom, testing-library)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── tsup.config.ts
```

## Key Concepts

### Form Generation

The `FormGenerator` component reads a Zod schema and renders the appropriate input component for each field based on its `FieldType` metadata (set by `fields.*` helpers from `@structcms/core`). See `src/lib/form-generator.tsx`.

### AdminProvider

Wraps the admin UI with context providing the `registry` (from `@structcms/core`) and `apiBaseUrl`. All admin components access this via the `useAdmin()` hook. See `src/context/admin-context.tsx`.

### API Client

The `useApiClient()` hook provides typed HTTP methods (`get`, `post`, `put`, `del`) for communicating with the CMS API routes in the host project. See `src/hooks/use-api-client.ts`.

## Quickstart

This section shows how to integrate the admin UI into a Next.js App Router project. For a complete working example, see `examples/test-app`.

### 1. Create Registry

Define your sections and page types using `@structcms/core`:

```typescript
// lib/registry.ts
import { createRegistry, defineSection, definePageType, fields } from '@structcms/core';

const heroSection = defineSection({
  name: 'hero',
  label: 'Hero Section',
  fields: {
    title: fields.string({ label: 'Title' }),
    subtitle: fields.text({ label: 'Subtitle', optional: true }),
    image: fields.image({ label: 'Hero Image', optional: true }),
  },
});

const contentSection = defineSection({
  name: 'content',
  label: 'Content Section',
  fields: {
    body: fields.richtext({ label: 'Body' }),
  },
});

const landingPage = definePageType({
  name: 'landing',
  label: 'Landing Page',
  allowedSections: ['hero', 'content'],
});

export const registry = createRegistry({
  sections: [heroSection, contentSection],
  pageTypes: [landingPage],
});
```

### 2. Admin Layout with AdminProvider

Create an admin route group with `AdminProvider` and `AdminLayout`:

```typescript
// app/admin/layout.tsx
'use client';

import { useRouter } from 'next/navigation';
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from '@/lib/registry';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Pages', path: '/admin/pages' },
  { label: 'Navigation', path: '/admin/navigation' },
  { label: 'Media', path: '/admin/media' },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout navItems={navItems} onNavigate={handleNavigate}>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}
```

**Required Props:**
- `registry` — Your section and page type registry from `@structcms/core`
- `apiBaseUrl` — Base URL for CMS API routes (e.g., `/api/cms`)

### 3. Dashboard Page

Create the dashboard as your admin entry point:

```typescript
// app/admin/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { DashboardPage, type PageSummary } from '@structcms/admin';

export default function AdminDashboard() {
  const router = useRouter();

  const handleSelectPage = (page: PageSummary) => {
    router.push(`/admin/pages/${page.slug}`);
  };

  const handleCreatePage = () => {
    router.push('/admin/pages/new');
  };

  const handleUploadMedia = () => {
    router.push('/admin/media');
  };

  return (
    <DashboardPage
      onSelectPage={handleSelectPage}
      onCreatePage={handleCreatePage}
      onUploadMedia={handleUploadMedia}
    />
  );
}
```

### 4. Individual Admin Views

Create routes for each admin view using the provided components:

**Page List** (`app/admin/pages/page.tsx`):

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { PageList, type PageSummary } from '@structcms/admin';

export default function PagesView() {
  const router = useRouter();

  const handleSelectPage = (page: PageSummary) => {
    router.push(`/admin/pages/${page.slug}`);
  };

  const handleCreatePage = () => {
    router.push('/admin/pages/new');
  };

  return (
    <PageList
      onSelectPage={handleSelectPage}
      onCreatePage={handleCreatePage}
    />
  );
}
```

**Page Editor** (`app/admin/pages/[slug]/page.tsx`):

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { PageEditor } from '@structcms/admin';
import { use } from 'react';

export default function EditPageView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const handleSave = () => {
    router.push('/admin/pages');
  };

  return <PageEditor slug={slug} onSave={handleSave} />;
}
```

**Navigation Editor** (`app/admin/navigation/page.tsx`):

```typescript
'use client';

import { NavigationEditor } from '@structcms/admin';

export default function NavigationView() {
  return <NavigationEditor />;
}
```

**Media Browser** (`app/admin/media/page.tsx`):

```typescript
'use client';

import { MediaBrowser } from '@structcms/admin';

export default function MediaView() {
  return <MediaBrowser />;
}
```

### 5. Styling

The admin components use Tailwind CSS. Ensure your `tailwind.config.ts` includes the admin package:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@structcms/admin/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### Advanced: Using Individual Components

For more control, you can use `AdminProvider` with individual components instead of the full layout:

```typescript
'use client';

import { AdminProvider, PageList } from '@structcms/admin';
import { registry } from '@/lib/registry';

export default function CustomAdminPage() {
  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <div className="custom-layout">
        <PageList
          onSelectPage={(page) => console.log('Selected:', page)}
          onCreatePage={() => console.log('Create new page')}
        />
      </div>
    </AdminProvider>
  );
}
```

This approach gives you full control over layout, routing, and composition while still benefiting from the admin components and context.

## Components

### Dashboard
- **`DashboardPage`** — Main dashboard with KPI cards, recent pages, and quick actions. See `src/components/dashboard/dashboard-page.tsx`.
- **`KpiCards`** — KPI overview showing total pages, media files, navigation sets, and sections. See `src/components/dashboard/kpi-cards.tsx`.
- **`RecentPages`** — List of recently updated pages with links to page editor. See `src/components/dashboard/recent-pages.tsx`.
- **`QuickActions`** — Quick action buttons for creating pages and uploading media. See `src/components/dashboard/quick-actions.tsx`.

### Editors
- **`PageEditor`** — Edit page title and sections (add, remove, reorder). See `src/components/editors/page-editor.tsx`.
- **`SectionEditor`** — Renders a form for a single section based on its Zod schema. See `src/components/editors/section-editor.tsx`.

### Field Inputs
- **`StringInput`** — Single-line text (`fields.string()`)
- **`TextInput`** — Textarea (`fields.text()`)
- **`RichTextEditor`** — WYSIWYG editor using Tiptap (`fields.richtext()`)
- **`ImagePicker`** — Media browser integration (`fields.image()`)
- **`ArrayField`** — Dynamic list with add/remove (`fields.array()`)
- **`ObjectField`** — Nested form (`fields.object()`)

### Content
- **`PageList`** — List pages with search and filter. See `src/components/content/page-list.tsx`.
- **`NavigationEditor`** — Edit navigation items with nested children. See `src/components/content/navigation-editor.tsx`.

### Media
- **`MediaBrowser`** — Browse, upload, and select media files. See `src/components/media/media-browser.tsx`.

### Layout
- **`AdminLayout`** — Admin shell with sidebar navigation (includes Dashboard as default). See `src/components/layout/admin-layout.tsx`.

### Dashboard Components
- **`DashboardPage`** — Main dashboard container with error boundaries and loading states
- **`KpiCards`** — Metrics display with skeleton loaders and error handling
- **`RecentPages`** — Paginated recent pages list with error fallbacks
- **`QuickActions`** — Action buttons that don't require API calls

### UI Primitives
`Button`, `Input`, `Textarea`, `Label`, `Skeleton`, `Toast`, `ErrorBoundary` — base components in `src/components/ui/`.

## Dependencies

| Package | Purpose |
|---------|---------|
| `@structcms/core` | Registry, field type metadata |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod resolver for react-hook-form |
| `@tiptap/react` | Rich text editor |
| `@tiptap/starter-kit` | TipTap base extensions (bold, italic, lists, headings) |
| `@tiptap/extension-link` | TipTap link extension |
| `@tiptap/pm` | TipTap ProseMirror bindings |
| `class-variance-authority` | Component variant styling |
| `tailwind-merge` + `clsx` | Conditional class merging |
| `zod` | Schema validation |

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`

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
```

Tests use `@testing-library/react` with `jsdom`. See `src/test/setup.ts` for configuration.
