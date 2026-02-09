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
- **Runtime**: Node.js 22+
- **Package Manager**: pnpm (workspaces)

## Core Dependencies

### @structcms/core
- `zod` - Schema definition and validation

### @structcms/api
- `@supabase/supabase-js` - Database and storage client
- `sanitize-html` - HTML sanitization

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
SUPABASE_SECRET_KEY=your-secret-key-here
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
See `packages/core/src/index.ts` for all exports including `defineSection`, `createRegistry`, and related types.

### @structcms/api  
See `packages/api/src/index.ts` for all exports including storage, delivery, media, and export handlers.

### @structcms/admin
See `packages/admin/src/index.ts` for all exports including UI components, form generators, and admin utilities.
