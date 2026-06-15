# Constitution

## Tech stack
| Area | Choice | Rationale |
| ---- | ------ | --------- |
| Language | TypeScript (strict) | Type-safe public API; no `any` |
| Runtime | Node.js 22+ | Modern baseline matching `engines` |
| Package manager | pnpm workspaces | Monorepo with shared lockfile |
| Validation | zod | Schema is the single source of truth + type inference |
| Backend | Supabase (Postgres/Auth/Storage) behind adapters | Managed infra, swappable |
| Admin forms | react-hook-form + @hookform/resolvers | Dynamic forms driven by zod |
| Rich text | TipTap (+ starter-kit, link) | Configurable toolbar via `allowedBlocks` |
| Lint/format | Biome | One tool for lint + format |
| Tests | Vitest (unit) + Playwright (E2E) | Fast units, real-browser E2E |
| Bundling | tsup | Per-package builds |

## Architecture principles
- Public API contains no `any` and no `as unknown as` casts.
- Dependency direction is one-way: `core` -> `api` -> host; `admin` -> `core`.
  `admin` never imports `api` internals; `core` depends only on `zod`.
- All persistence goes through `StorageAdapter`/`MediaAdapter`; no direct
  Supabase calls outside the adapter implementation.
- `@structcms/api` exports handler functions, not framework route handlers.
- Cognitive complexity per function <= 15 (Biome-enforced).

## Conventions
- Files kebab-case; Types/Interfaces PascalCase; functions camelCase;
  constants UPPER_SNAKE_CASE.
- Comments, logs, commit messages in English; no emojis.
- Tests as `*.test.ts` next to source or under `__tests__/`.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

## Quality gates
- `pnpm verify` (Biome check + typecheck) green before any merge.
- `pnpm test:run` green; coverage target > 80%.
- `pnpm build` green for app-affecting changes.
- Playwright E2E green at the milestone QA gate.

## Don'ts
- No `any`, `as unknown as`, or `@ts-ignore`/`@ts-expect-error` without a
  justifying TODO.
- No direct Supabase access outside adapters.
- No new dependency without justification (native/built-in first).
- No GUI-driven schema modeling; no committed secrets.

## Tech debt (brownfield)
| Deviation | Where | Plan |
| --------- | ----- | ---- |
| `typecheck` runs a full `pnpm build` first | root `package.json` | Acceptable for now; split if Verify duration hurts iteration cost |
| Auth layer audited separately | `docs/AUTH_AUDIT.md` | Keep audit current as auth evolves |
