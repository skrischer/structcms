# @structcms/admin

Admin UI components for StructCMS. Provides dynamic form generation from Zod schemas, section/page editors, media browser, navigation editor, and a layout shell for the admin interface.

For architectural context, see [ARCHITECTURE.md](../../ARCHITECTURE.md) (Layer 6: Admin UI).

## File Structure

```
packages/admin/
├── src/
│   ├── index.ts                              # Public exports
│   ├── components/
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
│   │   │   └── admin-layout.tsx              # Admin shell with sidebar
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

## Components

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
- **`AdminLayout`** — Admin shell with sidebar navigation. See `src/components/layout/admin-layout.tsx`.

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
