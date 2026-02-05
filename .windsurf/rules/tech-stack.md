# StructCMS Tech Stack & Conventions

## Overview

StructCMS is a code-first, installable headless CMS framework distributed as npm packages.

## Monorepo Structure

```
structcms/
├── packages/
│   ├── core/       # @structcms/core - Modeling, Registry, Types
│   ├── api/        # @structcms/api - Storage, Domain API, Delivery API
│   └── admin/      # @structcms/admin - Admin UI Components
```

## Language & Runtime

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 18+
- **Package Manager**: npm (workspaces)

## Core Dependencies

### @structcms/core
- `zod` - Schema definition and validation

### @structcms/api
- `@structcms/core` - Internal dependency
- `@supabase/supabase-js` - Database and storage client

### @structcms/admin
- `@structcms/core` - Internal dependency
- `react` - UI framework
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `tailwindcss` - Styling
- `@tiptap/react` - RichText editor
- shadcn/ui components (installed individually)

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
- **Coverage target**: >80%

### Integration Tests
- **Framework**: Vitest with test database
- **Location**: `__tests__/integration/`

### E2E Tests (Admin)
- **Framework**: Playwright
- **Location**: `e2e/`

### Verification Commands
```bash
# Run all tests
npm test

# Run tests for specific package
npm test -w @structcms/core
npm test -w @structcms/api
npm test -w @structcms/admin

# Run with coverage
npm test -- --coverage

# Type check
npm run typecheck
```

## Environment Variables

### @structcms/api
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Supabase Storage
- **Bucket name**: `media`
- **Public access**: enabled for media bucket

## API Conventions

### REST Endpoints
- **Base path**: `/api/cms/`
- **Public (Delivery)**: No auth required
- **Admin (CRUD)**: Supabase Auth required (future)

### Response Format
```typescript
// Success
{ data: T }

// Error
{ error: { message: string, code?: string } }
```

## Git Conventions

### Commit Messages
```
feat: add defineSection API
fix: handle empty registry
test: add unit tests for slug generation
docs: update README with examples
```

### Branch Strategy
- `main` - stable releases
- `develop` - integration branch
- `feat/*` - feature branches

## Package Exports

### @structcms/core
```typescript
export { defineSection } from './define-section';
export { definePageType } from './define-page-type';
export { defineNavigation } from './define-navigation';
export { createRegistry } from './registry';
export type { SectionDefinition, PageTypeDefinition, Registry } from './types';
```

### @structcms/api
```typescript
export { createStorageAdapter } from './storage';
export { createMediaAdapter } from './media';
export type { StorageAdapter, MediaAdapter, Page, MediaFile } from './types';
```

### @structcms/admin
```typescript
export { PageEditor } from './components/page-editor';
export { SectionEditor } from './components/section-editor';
export { MediaBrowser } from './components/media-browser';
export { AdminLayout } from './components/admin-layout';
```
