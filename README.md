# StructCMS

A code-first, installable headless CMS framework that lives inside your website codebase. Content models are defined in TypeScript, validated with Zod, and rendered with full type safety.

For product vision, scope, and positioning, see [CONCEPT.md](./CONCEPT.md).

## Monorepo Structure

```
structcms/
├── packages/
│   ├── core/                  # @structcms/core — Modeling, Registry, Types
│   ├── api/                   # @structcms/api — Storage, Domain API, Delivery API
│   └── admin/                 # @structcms/admin — Admin UI Components
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
npx playwright test --project=chromium  # Terminal 2 (from examples/test-app/)
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical layer documentation.

```
Website Project
│
├─ @structcms/core       # Models, validation, types
├─ @structcms/admin      # Admin UI components
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
