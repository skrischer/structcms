# @structcms/admin

Admin UI components for StructCMS. Provides dynamic form generation from Zod schemas, section/page editors, media browser, navigation editor, and a layout shell for the admin interface.

For architectural context, see [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) (Layer 6: Admin UI).

**[← Back to main README](../../README.md)**

## Installation

```bash
npm install @structcms/admin
```

## Quick Start

```typescript
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from './lib/registry'; // Your section registry

export default function AdminLayoutRoot({ children }) {
  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
```

**Tailwind Configuration:** Add `./node_modules/@structcms/admin/dist/**/*.{js,mjs}` to your `tailwind.config.ts` content array.

See [examples/test-app/app/admin/](../../examples/test-app/app/admin/) for complete admin view implementations.

## File Structure

```
packages/admin/
├── src/
│   ├── index.ts                              # Public exports
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── dashboard-page.tsx             # Main dashboard with KPIs, recent pages, quick actions
│   │   │   ├── kpi-cards.tsx                  # KPI overview cards
│   │   │   ├── recent-pages.tsx               # Recently updated pages list
│   │   │   └── quick-actions.tsx              # Quick action buttons
│   │   ├── editors/
│   │   │   ├── page-editor.tsx               # Page editor with section management
│   │   │   └── section-editor.tsx            # Section form from Zod schema
│   │   ├── inputs/
│   │   │   ├── string-input.tsx              # Single-line text input
│   │   │   ├── text-input.tsx                # Textarea input
│   │   │   ├── url-input.tsx                 # URL input with validation
│   │   │   ├── boolean-input.tsx             # Checkbox/toggle input
│   │   │   ├── select-input.tsx              # Dropdown select input
│   │   │   ├── rich-text-editor.tsx          # WYSIWYG editor (Tiptap)
│   │   │   ├── image-picker.tsx              # Image media browser integration
│   │   │   ├── file-picker.tsx               # Document/file media browser integration
│   │   │   ├── array-field.tsx               # Add/remove/reorder items
│   │   │   └── object-field.tsx              # Nested object form
│   │   ├── content/
│   │   │   ├── page-list.tsx                 # Page listing with search/filter
│   │   │   └── navigation-editor.tsx         # Navigation item editor
│   │   ├── media/
│   │   │   └── media-browser.tsx             # Browse, upload, select media (supports category filter)
│   │   ├── layout/
│   │   │   └── admin-layout.tsx              # Admin shell with sidebar
│   │   └── ui/                               # Base UI primitives
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

The `FormGenerator` component reads a Zod schema and renders the appropriate input component for each field based on its `FieldType` metadata (set by `fields.*` helpers from `@structcms/core`). Fields with `visibleWhen` metadata are conditionally shown/hidden based on other field values.

### AdminProvider

Wraps the admin UI with context providing the `registry` (from `@structcms/core`) and `apiBaseUrl`. All admin components access this via the `useAdmin()` hook.

### API Client

The `useApiClient()` hook provides typed HTTP methods (`get`, `post`, `put`, `del`) for communicating with the CMS API routes in the host project.

## API Reference

### Context & Providers

- **`AdminProvider`** — Context provider with `registry` and `apiBaseUrl` props. Wraps all admin components.

### Hooks

- **`useAdmin()`** — Access admin context (registry, apiBaseUrl)
- **`useApiClient()`** — HTTP client for CMS API with methods: `get`, `post`, `put`, `del`

### Dashboard Components

- **`DashboardPage`** — Main dashboard container with KPIs, recent pages, and quick actions
- **`KpiCards`** — Metrics display (total pages, media files, navigation sets, sections)
- **`RecentPages`** — Paginated list of recently updated pages
- **`QuickActions`** — Action buttons for creating pages and uploading media

### Editor Components

- **`PageEditor`** — Edit page title and sections (add, remove, reorder)
- **`SectionEditor`** — Renders a form for a single section based on its Zod schema

### Field Input Components

- **`StringInput`** — Single-line text input for `fields.string()`
- **`TextInput`** — Textarea for `fields.text()`
- **`UrlInput`** — URL input with `type="url"` for `fields.url()`
- **`BooleanInput`** — Checkbox/toggle for `fields.boolean()`
- **`SelectInput`** — Dropdown select for `fields.select()`
- **`RichTextEditor`** — WYSIWYG editor using Tiptap for `fields.richtext()`. Supports `allowedBlocks` prop to restrict toolbar buttons (e.g. `['bold', 'italic', 'heading2', 'list']`)
- **`ImagePicker`** — Media browser integration for `fields.image()` (filters to image category)
- **`FilePicker`** — Media browser integration for `fields.file()` (filters to document category)
- **`ArrayField`** — Dynamic list with add/remove/reorder for `fields.array()`
- **`ObjectField`** — Nested form for `fields.object()`

### Content Components

- **`PageList`** — List pages with search and filter
- **`NavigationEditor`** — Edit navigation items with nested children

### Media Components

- **`MediaBrowser`** — Browse, upload, and select media files. Supports `category` prop (`'image'` or `'document'`) to filter by media type

### Layout Components

- **`AdminLayout`** — Admin shell with sidebar navigation and dashboard

### UI Primitives

Base components in `src/components/ui/`: `Button`, `Input`, `Textarea`, `Label`, `Skeleton`, `Toast`, `ErrorBoundary`

### Utilities

- **`FormGenerator`** — Maps Zod schemas to React Hook Form inputs with field type detection. Supports conditional field visibility via `visibleWhen()` metadata

## Dependencies

| Package | Purpose |
|---------|---------|
| `@structcms/core` | Registry, field type metadata |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod resolver for react-hook-form |
| `@tiptap/react` | Rich text editor |
| `@tiptap/starter-kit` | TipTap base extensions (bold, italic, lists, headings) |
| `@tiptap/extension-link` | TipTap link extension |
| `class-variance-authority` | Component variant styling |
| `tailwind-merge` + `clsx` | Conditional class merging |
| `zod` | Schema validation |

**Peer dependencies:** `react ^19.0.0`, `react-dom ^19.0.0`

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

Tests use `@testing-library/react` with `jsdom`.

**[← Back to main README](../../README.md)**
