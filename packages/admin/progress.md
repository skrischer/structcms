# @structcms/admin - Progress Log

## Project Overview
Admin UI components for StructCMS.

## Current Status
**Phase**: MVP Development  
**Started**: 2026-02-05

---

## Completed Tasks

_No tasks completed yet._

---

## In Progress

_No tasks in progress._

---

## Log

### 2026-02-05
- Initialized prd.json with 14 tasks
- Tasks organized into groups: Form Generation (1), Field Inputs (6), Editors (2), Content Management (2), Media (1), Layout (1), Testing (1)
- Clarified: RichText uses TipTap editor
- Clarified: Section/Array reordering via Up/Down buttons (no drag & drop)
- Clarified: Manual save only (no autosave)

### 2026-02-06

## Working on AdminProvider Context

**Task:** Create React context provider for registry, API base URL, and shared state.

**Acceptance Criteria:**
1. Provides registry to all child components
2. Configurable apiBaseUrl prop
3. Exposes useAdmin() hook for context access
4. Provides useApiClient() hook for API calls
5. Unit test: context values accessible in child components

**Plan:**
- Create `src/context/admin-context.tsx` with AdminContext and AdminProvider
- Create `src/hooks/use-admin.ts` with useAdmin() hook
- Create `src/hooks/use-api-client.ts` with useApiClient() hook returning fetch wrapper
- Export from `src/index.ts`
- Write unit test `src/context/__tests__/admin-context.test.tsx`

**Files to create:**
- `src/context/admin-context.tsx`
- `src/hooks/use-admin.ts`
- `src/hooks/use-api-client.ts`
- `src/context/__tests__/admin-context.test.tsx`

**Approach:**
- AdminProvider accepts `registry` (from @structcms/core) and `apiBaseUrl` props
- Context stores both values
- useAdmin() returns full context
- useApiClient() returns object with get/post/put/delete methods using configured base URL

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 5 tests passed
- Typecheck passed
- Created files:
  - `src/context/admin-context.tsx` - AdminProvider and AdminContext
  - `src/hooks/use-admin.ts` - useAdmin() hook
  - `src/hooks/use-api-client.ts` - useApiClient() hook with get/post/put/delete
  - `src/context/__tests__/admin-context.test.tsx` - Unit tests
  - `vitest.config.ts` - Vitest config for jsdom environment
- Updated `src/index.ts` with exports
- Installed dev dependencies: @testing-library/react, @testing-library/dom, jsdom
