# StructCMS

[![npm version](https://img.shields.io/npm/v/@structcms/core.svg)](https://www.npmjs.com/package/@structcms/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

A code-first, installable headless CMS framework that lives inside your website codebase. Content models are defined in TypeScript, validated with Zod, and rendered with full type safety.

For product vision, scope, and positioning, see [CONCEPT.md](./CONCEPT.md).

## Quick Start

```bash
# 1. Install packages
npm install @structcms/core @structcms/api @structcms/admin

# 2. Define a section
import { defineSection, fields } from '@structcms/core';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string(),
    subtitle: fields.text(),
    image: fields.image(),
  },
});

# 3. Create a registry
import { createRegistry } from '@structcms/core';

const registry = createRegistry({
  sections: [HeroSection],
});

# 4. Set up API routes (Next.js example)
import { createNextPagesRoute } from '@structcms/api/next';
import { storageAdapter, mediaAdapter } from './lib/adapters';

export const GET = createNextPagesRoute({ storageAdapter, mediaAdapter }).GET;
export const POST = createNextPagesRoute({ storageAdapter, mediaAdapter }).POST;

# 5. Add Admin UI
import { AdminProvider, AdminLayout } from '@structcms/admin';

export default function AdminLayoutRoot({ children }) {
  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
```

See the [examples/test-app](./examples/test-app) directory for a complete working integration.

## Key Concepts

### Sections
Reusable content blocks defined with TypeScript and Zod. Sections can be added to pages in any order and combination. Each section has a schema that defines its fields and validation rules.

### Page Types
Templates that define which sections are allowed on a page. For example, a "Blog Post" page type might allow Hero, Content, and Gallery sections, while a "Landing Page" might allow different sections.

### Registry
A runtime collection of all section and page type definitions. The registry is created at application startup and provides type-safe access to your content models throughout the application.

### Adapters
Interface-based persistence layer for storage and media. The default implementation uses Supabase, but the adapter pattern allows for alternative backends (PostgreSQL, MongoDB, filesystem, etc.).

### Admin UI
React-based admin interface with dynamic form generation. Forms are automatically generated from Zod schemas, providing a type-safe editing experience that stays in sync with your content models.

## Monorepo Structure

```
structcms/
├── packages/
│   ├── core/                  # @structcms/core — Modeling, Registry, Types
│   ├── api/                   # @structcms/api — Storage, Domain API, Delivery API
│   └── admin/                 # @structcms/admin — Admin UI Components (React)
├── examples/
│   └── test-app/              # E2E test app (Next.js + Playwright)
├── supabase/                  # Database migrations
├── ARCHITECTURE.md            # Technical layer documentation
├── CONCEPT.md                 # Product vision, scope, risks
├── biome.json                 # Linter/formatter config
├── tsconfig.base.json         # Shared TypeScript config
├── vitest.workspace.ts        # Test workspace config
└── pnpm-workspace.yaml        # Monorepo workspace definition
```

## Packages

| Package | Description | Docs |
|---|---|---|
| `@structcms/core` | Section definitions, page types, registry, type inference | [README](./packages/core/README.md) |
| `@structcms/api` | Supabase storage/media adapters, handler functions | [README](./packages/api/README.md) |
| `@structcms/admin` | Admin UI components (React, Tailwind, shadcn/ui) | [README](./packages/admin/README.md) |
| `test-app` | E2E integration test app | [README](./examples/test-app/README.md) |

## Setup

```bash
# 1. Clone and install
git clone https://github.com/skrischer/structcms.git
cd structcms
pnpm install

# 2. Environment variables
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SECRET_KEY

# 3. Build all packages
pnpm build

# 4. Run tests
pnpm test:run

# 5. Type check
pnpm typecheck
```

## Development

```bash
# Start test app dev server
pnpm --filter test-app dev

# Lint & format
pnpm lint
pnpm format
```

## Testing

```bash
# Unit tests (all packages, watch mode)
pnpm test

# Unit tests (single run)
pnpm test:run

# Tests for a specific package
pnpm --filter @structcms/core test
pnpm --filter @structcms/api test
pnpm --filter @structcms/admin test

# E2E tests (requires running test-app dev server)
pnpm --filter test-app dev          # Terminal 1
pnpm --filter test-app test:e2e     # Terminal 2
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical layer documentation.

```
Website Project
│
├─ @structcms/core       # Models, validation, types
├─ @structcms/admin      # Admin UI components (React)
├─ @structcms/api        # Route handlers, delivery API
│
└─ Supabase Backend
    ├─ PostgreSQL
    ├─ Auth
    └─ Storage
```

## Environment Variables

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
```

## Contributing

Contributions are welcome! Please see our contributing guidelines (coming soon) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
