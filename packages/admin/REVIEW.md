# @structcms/admin — Code Review

**Date:** 2026-02-06  
**Reviewer:** Cascade (AI pair programmer)  
**Scope:** Full structural and implementation review of the admin package  
**Status:** 14/16 backlog tasks completed (E2E tests outstanding)

---

## Summary

The admin package is well-structured and follows consistent patterns throughout. The codebase demonstrates disciplined, methodical development with good test coverage (186 unit tests). The architecture aligns with the project's ARCHITECTURE.md and package boundary definitions.

There are **2 bugs** and several design issues that should be addressed before E2E testing and Phase 2.

---

## Architecture & Structure

### ✅ What's Good

- **Layer separation** is clean: `ui/` → `inputs/` → `lib/form-generator` → `editors/` → `content/` → `layout/`
- **Package boundaries** are correct: admin depends only on `@structcms/core`, communicates with API via HTTP
- **Build config** (`tsup.config.ts`) correctly externalizes `react`/`react-dom` as peer dependencies
- **Context architecture** (`AdminProvider` → `useAdmin()` → `useApiClient()`) is a clean dependency chain
- **All exports** in `src/index.ts` are complete with types

### File Structure

```
src/
├── components/
│   ├── content/        # PageList, NavigationEditor
│   ├── editors/        # SectionEditor, PageEditor
│   ├── inputs/         # StringInput, TextInput, RichTextEditor, ImagePicker, ArrayField, ObjectField
│   ├── layout/         # AdminLayout
│   ├── media/          # MediaBrowser
│   └── ui/             # Button, Input, Textarea, Label, Skeleton, Toast, ErrorBoundary
├── context/            # AdminProvider
├── hooks/              # useAdmin, useApiClient
├── lib/                # FormGenerator, cn() utility
└── test/               # Vitest setup
```

---

## Bugs

### 🔴 1. MediaBrowser: Upload URL is broken

**File:** `src/components/media/media-browser.tsx:88-95`

```typescript
const response = await fetch(
  `${api.get.toString().includes('baseUrl') ? '' : ''}/media`,
  { method: 'POST', body: formData }
);
```

The ternary expression always evaluates to `''`, making the URL `/media` instead of `${apiBaseUrl}/media`. The upload will hit the wrong endpoint. No test covers the actual upload flow.

**Fix:** Use `apiBaseUrl` from context or extend `useApiClient()` with an `upload()` method that handles `FormData`.

### 🔴 2. FormGenerator: `array` and `object` field types not mapped

**File:** `src/lib/form-generator.tsx:106-177`

The `switch` statement handles `string`, `text`, `richtext`, and `image` but falls through to `default` (renders `StringInput`) for `array` and `object` fields. `ArrayField` and `ObjectField` components exist but are never used by the FormGenerator.

This means any section schema using `fields.array()` or `fields.object()` will silently render a text input instead of the correct component.

**Fix:** Add `case 'array'` and `case 'object'` branches to the switch statement.

---

## Design Issues

### 🟡 3. Three conflicting `NavItem` types

- `NavItem` in `navigation-editor.tsx` — `{ label, href, children? }`
- `NavItem` in `admin-layout.tsx` — `{ label, path }`
- `NavigationItem` in `@structcms/core` — exported but unused by admin

Both admin `NavItem` types are exported (one directly, one via `AdminLayoutProps`). This creates confusion and type incompatibility.

**Recommendation:** Use `NavigationItem` from core for the NavigationEditor. Rename the AdminLayout type to `SidebarNavItem` or similar.

### 🟡 4. `PageSummary` type defined locally

**File:** `src/components/content/page-list.tsx:10-16`

`PageSummary` is defined in admin but represents an API response shape. If the API changes its response format, admin won't know. This type should ideally come from `@structcms/core` or `@structcms/api`.

### 🟡 5. SectionEditor as standalone form → UX issue in PageEditor

Each `SectionEditor` renders its own `FormGenerator` with its own submit button ("Update Section"). In the `PageEditor`, the user must submit each section individually before "Save Page" captures the data. Unsubmitted section changes are silently lost.

**Recommendation:** Either use a single form for the entire page, or implement an auto-sync mechanism (e.g., `onChange` on field blur instead of form submit).

### 🟡 6. `useApiClient()` creates new instance every render

**File:** `src/hooks/use-api-client.ts:139-142`

`createApiClient(apiBaseUrl)` is called on every render without memoization. This causes:
- `useCallback` dependencies on `api` to be ineffective (e.g., `MediaBrowser.fetchMedia`)
- ESLint `react-hooks/exhaustive-deps` warnings, which are suppressed with `eslint-disable` comments in `PageList` and `MediaBrowser`

**Fix:** Wrap `createApiClient` in `useMemo` keyed on `apiBaseUrl`.

### 🟡 7. Toast not integrated into AdminProvider

`ToastProvider` is a separate provider. No existing component (PageList, MediaBrowser, etc.) uses toast notifications for success/error feedback. The consumer must manually nest providers.

**Recommendation:** Consider wrapping `ToastProvider` inside `AdminProvider` for ergonomic usage, and integrate toast calls into API-dependent components.

### 🟡 8. ErrorBoundary has no reset mechanism

Once an error is caught, the boundary stays in error state permanently. There is no `resetErrorBoundary()` method or key-based reset. The user must reload the page.

**Recommendation:** Add a "Retry" button or expose a reset callback.

### 🟡 9. Toast counter is module-level state

**File:** `src/components/ui/toast.tsx:22`

```typescript
let toastCounter = 0;
```

Shared across all `ToastProvider` instances and SSR renders. Should be a `useRef` inside the provider.

---

## Minor Notes

- **Stale initial state** in `PageEditor` (line 38) and `NavigationEditor` (line 36): `useState(initialProps)` ignores prop updates. Acceptable for MVP (manual save, no external updates), but will need attention for Phase 2 (draft/publish).
- **RichTextEditor** `content` prop is only read on mount (TipTap limitation). Same stale-state concern as above.
- **Zod internals access** in `FormGenerator.unwrapSchema()` (lines 18-29): Uses `_def` and `innerType` which are not part of Zod's public API. May break on Zod updates.
- **`reference` field type** from core is not handled in FormGenerator (no UI component for it yet).

---

## Consistency & Patterns

### ✅ Consistently Applied

- `'use client'` directive on all stateful components
- `displayName` set on all components
- `cn()` utility for Tailwind class merging
- `data-testid` attributes for testing
- `aria-invalid` / `aria-describedby` for accessibility on inputs
- `forwardRef` where React Hook Form integration requires it
- Immutable state updates throughout

### ✅ Test Quality

- 186 unit tests total, all passing
- Proper use of `@testing-library/react` + `userEvent`
- Async tests use `waitFor` correctly
- Mocks are properly restored in `beforeEach`
- Edge cases covered (empty states, error states, boundary conditions)

---

## Recommendations (Priority Order)

1. **Fix MediaBrowser upload URL** — This is a runtime bug
2. **Add array/object cases to FormGenerator** — Silent wrong rendering
3. **Memoize `useApiClient()`** — Fixes root cause of eslint-disable workarounds
4. **Consolidate NavItem types** — Use core types, avoid duplicates
5. **Integrate Toast into AdminProvider** — Better DX for consumers
6. **Address SectionEditor/PageEditor form architecture** — Before E2E tests
7. **Add ErrorBoundary reset** — Before production use

---

## Test Coverage Summary

| Component Group | Tests | Status |
|----------------|-------|--------|
| AdminProvider + Hooks | 5 | ✅ |
| StringInput | 10 | ✅ |
| TextInput | 10 | ✅ |
| RichTextEditor | 10 | ✅ |
| ImagePicker | 12 | ✅ |
| ArrayField | 16 | ✅ |
| ObjectField | 10 | ✅ |
| FormGenerator | 18 | ✅ |
| SectionEditor | 9 | ✅ |
| PageEditor | 12 | ✅ |
| PageList | 13 | ✅ |
| NavigationEditor | 14 | ✅ |
| MediaBrowser | 14 | ✅ |
| AdminLayout | 14 | ✅ |
| Skeleton | 5 | ✅ |
| Toast | 9 | ✅ |
| ErrorBoundary | 5 | ✅ |
| **Total** | **186** | ✅ |

---
