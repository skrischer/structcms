# @structcms/core

Core modeling, validation, and types for StructCMS.

## Description

This package provides the foundation for StructCMS:

- Code-defined schemas (Zod)
- Section/block content definitions
- Page structures
- Navigation models
- Type inference from schemas
- Registry for section/page type registration

## Architecture

### Modeling Layer

Defines schemas and content structures using Zod.

**Responsibilities:**
- Section schema definitions
- Field type definitions (text, richtext, image, reference, etc.)
- Validation rules
- TypeScript type inference from schemas

**Key Concepts:**
- **Section**: A reusable content block with defined fields
- **Page Type**: A template defining which sections a page can contain
- **Field Types**: Primitives and complex types for content fields

**Example:**
```typescript
import { z } from 'zod';
import { defineSection } from '@structcms/core';

export const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: z.string().min(1),
    subtitle: z.string().optional(),
    image: z.string().url(),
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }).optional(),
  },
});
```

### Registry Layer

Registers models from the host website project.

**Responsibilities:**
- Section registry (collect all section definitions)
- Page type registry
- Navigation model registry
- Runtime type resolution

**Key Concepts:**
- **Registry**: Central store for all content model definitions
- **Dynamic Registration**: Host projects register their own models at startup

**Example:**
```typescript
import { createRegistry } from '@structcms/core';
import { HeroSection, TextSection, GallerySection } from './sections';

export const registry = createRegistry({
  sections: [HeroSection, TextSection, GallerySection],
  pageTypes: ['landing', 'article', 'contact'],
});
```

### Rendering Integration Layer

Maps CMS content to frontend components.

**Responsibilities:**
- Section → Component mapping
- Typed props delivery to components
- Rendering utilities for host projects

**Example:**
```typescript
import { createSectionRenderer } from '@structcms/core';
import { HeroComponent, TextComponent } from './components';

const renderSection = createSectionRenderer({
  hero: HeroComponent,
  text: TextComponent,
  gallery: GalleryComponent,
});

export function Page({ sections }) {
  return sections.map((section, i) => renderSection(section, i));
}
```

---

## Backlog

**Dependencies:** None  
**Estimated Effort:** Medium

### Tasks

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| M-1 | Define Section API | `defineSection()` function accepts Zod schema and returns typed section definition | Todo |
| M-2 | Field Type Definitions | Support for: `string`, `text`, `richtext`, `image`, `reference`, `array`, `object` | Todo |
| M-3 | Type Inference | Zod schema infers TypeScript types for section data | Todo |
| M-4 | Registry API | `createRegistry()` collects and exposes all registered sections | Todo |
| M-5 | Page Type Definition | `definePageType()` specifies allowed sections per page type | Todo |
| M-6 | Navigation Model | `defineNavigation()` for menu/navigation structures | Todo |
| M-7 | Unit Tests | All public APIs have unit tests with >80% coverage | Todo |

### Done Criteria

- [ ] All field types implemented and tested
- [ ] Type inference works end-to-end
- [ ] Registry can be created and queried
- [ ] Package builds and exports correctly

---
