# Code Coverage Report

Generated: 2026-02-25

## Overall Coverage: 62.54%

```
All files: 62.54% statements | 80.32% branches | 69.85% functions
```

## Package Summary

### ✅ @structcms/core - 89.41% coverage
**Status:** Excellent coverage, above 80% threshold

Minor gaps:
- `section-renderer.ts`: Lines 32, 35, 39, 43 (edge cases)
- `fields.ts`: Lines 25-26 (validation edge cases)

### ⚠️ @structcms/api - Mixed coverage
**Overall:** Good coverage in most modules

**Well-covered modules (>85%):**
- Auth handlers & middleware: 93-100%
- Delivery handlers: 100%
- Export handlers: 99%
- Media handlers & resolvers: 87-100%
- Storage handlers: 87-95%
- Utils (sanitize, slug): 98-100%

**Gaps requiring attention:**
- **`next/factories.ts`: 34.39% coverage** ⚠️
  - Lines 659-721, 723-739 uncovered
  - This is the main gap in API package
  - These are Next.js route factories that may need integration tests

- `auth/supabase-adapter.ts`: 88.99%
  - Lines 145-146, 153-154 (error handling paths)

- `media/supabase-adapter.ts`: 78.03%
  - Lines 189-194, 200-201 (cleanup/error paths)

- `storage/supabase-adapter.ts`: 82.21%
  - Lines 290-291, 301-302 (transaction edge cases)

### ⚠️ @structcms/admin - 74-97% coverage per module
**Status:** Generally good, but some critical gaps

**Well-covered modules (>90%):**
- UI components: 97.66%
- Content components: 92.59%
- Dashboard components: 96.91%
- Inputs: 96%
- Layout: 100%
- Media browser: 93.28%

**Critical gaps:**
- **`auth-context.tsx`: 2.4% coverage** ⚠️⚠️
  - Lines 24-197, 200-205 uncovered
  - This is a critical authentication module
  - Likely needs integration/E2E tests for proper coverage

- **`struct-cms-admin-app.tsx`: 66.06% coverage** ⚠️
  - Lines 187-288, 316-321 uncovered
  - Main app component with routing logic
  - Could benefit from more integration tests

- `test/setup.ts`: 46.8%
  - Test infrastructure, less critical

- `hooks/use-api-client.ts`: 72.09%
  - API client hook, error handling paths uncovered

### ❌ examples/test-app - 0% coverage
**Status:** Not tested directly (expected)

The test-app is an integration example, not a library package. Its routes and components serve as documentation and manual testing, but unit tests run against the packages themselves.

## Recommendations

### Priority 1: Critical Auth Module
- **auth-context.tsx** needs immediate attention
  - Current: 2.4% coverage
  - Target: >80%
  - Approach: Add integration tests for auth flows (login, logout, token refresh)

### Priority 2: Next.js Factory Functions
- **next/factories.ts** needs test coverage
  - Current: 34.39% coverage
  - Target: >80%
  - Approach: Add tests for route handler factories or create integration tests

### Priority 3: Main App Component
- **struct-cms-admin-app.tsx** could use more coverage
  - Current: 66.06%
  - Target: >80%
  - Approach: Add tests for routing scenarios and navigation

### Priority 4: Adapter Error Paths
- Supabase adapters have good coverage but missing error handling paths
  - Add tests for error scenarios, rollbacks, and edge cases

## Testing Strategy Notes

1. **Unit tests are strong** for isolated logic (utils, handlers, types)
2. **Integration tests needed** for:
   - Auth flows (context + API)
   - Next.js route handlers (factories)
   - Admin app routing
3. **E2E tests** (see P4.1) would help cover the auth-context and app-level gaps

## Test Execution

```bash
pnpm test:run --coverage
```

**Test Results:**
- 46 test files
- 553 tests passed
- Duration: 104.95s
- All tests passing ✅
