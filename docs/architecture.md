# Architecture

> Seed in loopkit format. Full layer documentation lives in
> `docs/ARCHITECTURE.md`; this file is the loop's "where does new code go" guide.

## Component map
| Component | Responsibility |
| --------- | -------------- |
| `@structcms/core` | Section/page-type modeling, registry, field types, type inference (zod only) |
| `@structcms/api` | Storage/media adapters, domain handler functions, delivery + auth layer |
| `@structcms/admin` | React admin UI: dynamic forms, section editors, media browser, hooks |
| `examples/test-app` | Reference Next.js host + Playwright E2E |
| `supabase/migrations` | PostgreSQL schema (pages, navigation, media, RLS) |

## Boundaries
- `core` depends only on `zod`. `api` depends on `core` + `@supabase/supabase-js`.
  `admin` depends on `core` + React; never on `api` internals.
- Persistence is reachable only via `StorageAdapter`/`MediaAdapter`.
- The host project owns route handlers and component rendering; packages stay
  framework-agnostic.

## Key flows
1. Define sections (core) -> register at startup (registry) -> admin generates
   forms from the zod schema.
2. Admin submits -> domain handler validates against the registered schema ->
   adapter persists to Supabase.
3. Host delivery route injects adapters into handler functions -> returns typed
   content -> host renders sections via a component registry.

## Where new code goes
- New field type -> `@structcms/core` (fields + inference).
- New storage backend -> a new `StorageAdapter`/`MediaAdapter` impl in `@structcms/api`.
- New admin input/editor -> `@structcms/admin` components.
- New endpoint -> a handler function in `@structcms/api` + a thin host route.
- DB shape change -> a new numbered migration in `supabase/migrations`.
