# @structcms/core

Core modeling, validation, and types for StructCMS. Provides code-first content schema definitions, a registry for section/page type registration, type inference, and a framework-agnostic section renderer.

For architectural context, see [ARCHITECTURE.md](../../ARCHITECTURE.md) (Layer 1: Modeling, Layer 2: Registry, Layer 7: Rendering).

## File Structure

```
packages/core/
├── src/
│   ├── index.ts                  # Public exports
│   ├── define-section.ts         # defineSection() API
│   ├── define-page-type.ts       # definePageType() API
│   ├── define-navigation.ts      # defineNavigation() API
│   ├── fields.ts                 # Field type helpers (string, text, richtext, image, etc.)
│   ├── registry.ts               # createRegistry() API
│   ├── section-renderer.ts       # createSectionRenderer() API
│   ├── types.ts                  # All type definitions
│   ├── *.test.ts                 # Unit tests (co-located)
├── package.json
├── tsconfig.json
└── tsup.config.ts                # Build config
```

## Public API

### Modeling

- **`defineSection({ name, fields })`** — Define a section with Zod schema fields. Returns a typed `SectionDefinition`. See `src/define-section.ts`.
- **`definePageType({ name, allowedSections })`** — Define which sections a page type allows. See `src/define-page-type.ts`.
- **`defineNavigation({ name, schema? })`** — Define a navigation structure with optional custom item schema. See `src/define-navigation.ts`.

### Fields

- **`fields.string()`** — Short text (single line input)
- **`fields.text()`** — Long text (textarea)
- **`fields.richtext()`** — Rich text (WYSIWYG, outputs HTML)
- **`fields.image()`** — Image reference (media ID or URL)
- **`fields.reference()`** — Page reference (slug or ID)
- **`fields.array(itemSchema)`** — Array field
- **`fields.object(shape)`** — Object field

Each field helper wraps a Zod schema with metadata used by `@structcms/admin` for dynamic form generation. See `src/fields.ts`.

### Registry

- **`createRegistry({ sections, pageTypes?, navigations? })`** — Creates a registry instance that provides `getSection()`, `getAllSections()`, `getPageType()`, `getAllPageTypes()`, `getNavigation()`, `getAllNavigations()`. See `src/registry.ts`.

### Rendering

- **`createSectionRenderer({ components, fallback? })`** — Maps section types to components. Framework-agnostic (React, Preact, Vue, or plain functions). See `src/section-renderer.ts`.

### Type Utilities

- **`InferSectionData<T>`** — Extract the data type from a `SectionDefinition`
- **`SectionComponentProps<T>`** — Props type for section components (`{ data: T, sectionKey: string | number }`)

## Dependencies

- `zod` (peer dependency, `^3.23.0`)

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
