# @structcms/core

Core modeling, validation, and types for StructCMS. Provides code-first content schema definitions, a registry for section/page type registration, type inference, and a framework-agnostic section renderer.

For architectural context, see [ARCHITECTURE.md](../../ARCHITECTURE.md) (Layer 1: Modeling, Layer 2: Registry, Layer 7: Rendering).

**[← Back to main README](../../README.md)**

## Installation

```bash
npm install @structcms/core
```

## Quick Start

```typescript
import { defineSection, fields, createRegistry } from '@structcms/core';

// Define a section
const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string(),
    subtitle: fields.text(),
    image: fields.image(),
  },
});

// Create a registry
const registry = createRegistry({
  sections: [HeroSection],
});

// Get a section at runtime
const hero = registry.getSection('hero');
```

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

## Key Concepts

### Code-First Modeling

Content schemas are defined in TypeScript using Zod, not in a GUI. The `fields.*` helpers attach metadata that `@structcms/admin` uses for dynamic form generation. See `src/fields.ts`.

### Registry Pattern

The registry collects all section, page type, and navigation definitions at startup and provides runtime access via `getSection()`, `getPageType()`, etc. Host projects create one registry and pass it to `@structcms/admin`. See `src/registry.ts`.

### Type Inference

`InferSectionData<T>` extracts the TypeScript data type from a `SectionDefinition`, enabling fully typed frontend components without manual type definitions. See `src/types.ts`.

## API Reference

### Modeling

- **`defineSection({ name, fields })`** — Define a section with Zod schema fields. Returns a typed `SectionDefinition`.
- **`definePageType({ name, allowedSections })`** — Define which sections a page type allows.
- **`defineNavigation({ name, schema? })`** — Define a navigation structure with optional custom item schema.

### Field Helpers

- **`fields.string()`** — Short text (single line input)
- **`fields.text()`** — Long text (textarea)
- **`fields.richtext()`** — Rich text (WYSIWYG editor, outputs HTML)
- **`fields.image()`** — Image reference (media ID or URL)
- **`fields.reference()`** — Page reference (slug or ID)
- **`fields.array(itemSchema)`** — Array field with add/remove/reorder
- **`fields.object(shape)`** — Nested object field

Each field helper wraps a Zod schema with metadata used by `@structcms/admin` for dynamic form generation.

### Field Utilities

- **`getFieldMeta(schema)`** — Extract `FieldMeta` (including `fieldType`) from a Zod schema. Returns `null` if no metadata is present.
- **`isFieldType(schema, fieldType)`** — Check whether a Zod schema has a specific field type (e.g. `'richtext'`).

### Registry

- **`createRegistry({ sections, pageTypes?, navigations? })`** — Creates a registry instance with methods:
  - `getSection(name)` — Get a section definition by name
  - `getAllSections()` — Get all registered sections
  - `getPageType(name)` — Get a page type definition by name
  - `getAllPageTypes()` — Get all registered page types
  - `getNavigation(name)` — Get a navigation definition by name
  - `getAllNavigations()` — Get all registered navigations

### Rendering

- **`createSectionRenderer({ components, fallback? })`** — Maps section types to components. Framework-agnostic (React, Preact, Vue, or plain functions).

### Type Utilities

- **`InferSectionData<T>`** — Extract the data type from a `SectionDefinition`
- **`SectionComponentProps<T>`** — Props type for section components (`{ data: T, sectionKey: string | number }`)

## Dependencies

| Package | Purpose |
|---------|----------|
| `zod` | Schema definition and validation (peer dependency `^3.23.0`) |

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

**[← Back to main README](../../README.md)**
