# StructCMS Tech Stack & Conventions

## Overview

StructCMS is a code-first, installable headless CMS framework distributed as npm packages.

## Monorepo Structure

```
structcms/
├── packages/
│   ├── core/       # @structcms/core - Modeling, Registry, Types
│   ├── api/        # @structcms/api - Storage, Domain API, Delivery API, Auth Layer
│   └── admin/      # @structcms/admin - Admin UI Components, Hooks
├── examples/
│   └── test-app/   # E2E test app (Next.js + Playwright)
├── supabase/
│   └── migrations/ # SQL database migrations
└── docs/           # Architecture, concept, setup guides
```

## Language & Runtime

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 22+
- **Package Manager**: pnpm (workspaces)

## Core Dependencies

### @structcms/core
- `zod` - Schema definition and validation

### @structcms/api
- `@supabase/supabase-js` - Database and storage client
- `sanitize-html` - HTML sanitization
- `zod` - Request validation schemas

### @structcms/admin
- `@structcms/core` - Internal dependency
- `react` - UI framework (peer dependency)
- `react-dom` - DOM rendering (peer dependency)
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `@tiptap/react` - RichText editor
- `@tiptap/starter-kit` - RichText editor starter kit
- `@tiptap/extension-link` - Link extension for rich text
- `@tiptap/pm` - ProseMirror core
- `zod` - Schema validation
- `class-variance-authority` - Utility for component variants
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Utility for merging Tailwind CSS classes

## Security & Auth Layer (packages/api/src/auth/)

StructCMS includes a comprehensive authentication and security layer:

### CSRF Protection
- Token-based CSRF protection (`packages/api/src/auth/csrf.ts`)
- Double-submit cookie pattern
- Automatic token validation on state-changing requests

### Rate Limiting
- Request rate limiting (`packages/api/src/auth/rate-limiter.ts`)
- Configurable limits per endpoint
- IP-based throttling

### Request Validation
- Zod-based request validation (`packages/api/src/validation/`)
- Type-safe schemas for all API endpoints
- Automatic validation middleware

### Supabase Auth Adapter
- Supabase authentication integration (`packages/api/src/auth/supabase-adapter.ts`)
- Session management
- User role and permission handling

### Auth Middleware
- Composable middleware stack (`packages/api/src/auth/middleware.ts`)
- Authentication checks
- Authorization guards
- Request context management

## Admin Hooks (packages/admin/src/hooks/)

React hooks for admin UI:

### useAdmin()
- Access to AdminContext (registry, apiBaseUrl)
- Must be used within AdminProvider
- Provides type-safe access to section registry

### useApiClient()
- Configured API client with base URL from context
- Methods: `get()`, `post()`, `put()`, `delete()`, `upload()`
- Returns structured responses: `{ data, error }`
- Automatic error handling and JSON parsing

### useApiData\<T\>(fetcher, deps)
- Generic data fetching hook with loading/error states
- Cancellation support via AbortController
- `refetch()` method for manual refresh
- Effect-driven fetching with dependency tracking

### useNavigation(name)
- Fetches and manages navigation data
- Save/update operations
- Loading and error states

### usePageData(slug)
- Fetches and manages page data by slug
- Save/update operations
- Loading and error states

## ViewRenderer (packages/admin/src/components/app/view-renderer.tsx)

Extracted routing component that renders the correct admin view based on current path. Keeps the main `StructCMSAdminApp` component lean.

## Audit Logger (packages/api/src/audit/)

Structured audit logging for CMS operations:
- `createAuditLogger(options)` — factory function
- Logs: action, entity type/id, user, timestamp, metadata
- Pluggable output (console, custom handler)

## Database Migrations (supabase/migrations/)

SQL migrations for Supabase PostgreSQL:

- `001_create_pages_table.sql` - Page storage schema
- `002_create_navigation_table.sql` - Navigation structure
- `003_create_media_table.sql` - Media asset management
- `004_enable_rls.sql` - Row Level Security policies
- `005_media_size_bigint.sql` - Media size column INTEGER→BIGINT
- `006_authenticated_policies.sql` - RLS policies for authenticated role

All migrations use PostgreSQL with Supabase extensions.

## Linting & Formatting

- **Biome** (`biome.json`) for both linting and formatting (no Prettier/ESLint)
- `pnpm lint` → `biome check .`
- `pnpm format` → `biome format --write .`
- Cognitive complexity limit: 15

## Code Conventions

### TypeScript
- **No `any` type** - Use `unknown`, explicit types, or generics
- **No `as unknown as` casting** - Fix types properly
- **Strict null checks** enabled
- **All exports typed** - No implicit any in public API

### Naming
- **Files**: kebab-case (`define-section.ts`)
- **Types/Interfaces**: PascalCase (`SectionDefinition`)
- **Functions**: camelCase (`defineSection`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_LOCALE`)

### Code Style
- **Comments**: English only
- **Logging**: English only
- **No emojis** in code unless explicitly requested

## Testing

### Unit Tests
- **Framework**: Vitest
- **Location**: `*.test.ts` next to source files or in `__tests__/`
- **Coverage**: 54+ test files across all packages
- **Coverage target**: >80%

### Integration Tests
- **Framework**: Vitest with test database
- **Location**: `__tests__/integration/` or `*.integration.test.ts`
- Includes auth integration tests

### E2E Tests (Admin)
- **Framework**: Playwright
- **Location**: `examples/test-app/e2e/`
- Full admin UI flow testing

### Verification Commands
```bash
# Run all tests
pnpm test

# Run tests in single-run mode
pnpm test:run

# Run tests for specific package
pnpm --filter @structcms/core test
pnpm --filter @structcms/api test
pnpm --filter @structcms/admin test

# Run with coverage
pnpm test -- --coverage

# Type check all packages
pnpm typecheck

# E2E tests (requires dev server)
pnpm --filter test-app dev          # Terminal 1
pnpm --filter test-app test:e2e     # Terminal 2
```

## Environment Variables

### @structcms/api
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
```

### test-app
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

## Documentation

For detailed documentation, see:

- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical layer documentation
- **[docs/CONCEPT.md](./docs/CONCEPT.md)** - Product vision, scope, positioning
- **[docs/AUTH_SETUP.md](./docs/AUTH_SETUP.md)** - Authentication setup guide
- **[docs/E2E_SETUP.md](./docs/E2E_SETUP.md)** - E2E test configuration
- **[docs/AUTH_AUDIT.md](./docs/AUTH_AUDIT.md)** - Security audit documentation

## Quick Reference

### Create a Section
```typescript
import { defineSection, fields } from '@structcms/core';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string(),
    subtitle: fields.text(),
    image: fields.image(),
  },
});
```

### Use Admin Hooks
```typescript
import { useAdmin, useApiClient } from '@structcms/admin';

function MyComponent() {
  const { registry } = useAdmin();
  const api = useApiClient();
  
  const { data, error } = await api.get('/pages');
}
```

### Set Up API Routes (Next.js)
```typescript
import { createNextPagesRoute } from '@structcms/api/next';
import { storageAdapter, mediaAdapter } from './lib/adapters';

export const { GET, POST, PUT, DELETE } = createNextPagesRoute({
  storageAdapter,
  mediaAdapter,
});
```

## Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Build packages**: `pnpm build`
3. **Run tests**: `pnpm test:run`
4. **Type check**: `pnpm typecheck`
5. **Start dev server**: `pnpm --filter test-app dev`
6. **Lint & format**: `pnpm lint && pnpm format`

## Architecture Layers

```
┌─────────────────────────────────────┐
│   @structcms/admin (React UI)       │
│   - Hooks (useAdmin, useApiClient)  │
│   - Components (Forms, Inputs)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   @structcms/api (Backend)          │
│   - Auth Layer (CSRF, Rate Limit)   │
│   - Validation (Zod Schemas)        │
│   - Route Handlers                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   @structcms/core (Models)          │
│   - Sections, PageTypes             │
│   - Registry                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Supabase Backend                  │
│   - PostgreSQL + RLS                │
│   - Auth + Storage                  │
└─────────────────────────────────────┘
```
