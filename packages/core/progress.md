# @structcms/core - Progress Log

## Project Overview
Core modeling, validation, and types for StructCMS.

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
- Initialized prd.json with 7 tasks
- Tasks organized into groups: Modeling (3), Registry (3), Testing (1)

---

## Working on: Define Section API

**Selected because:** Foundation task with no dependencies. All other tasks depend on section definitions.

### Plan

**Files to create:**
- `src/types.ts` - SectionDefinition type and related types
- `src/define-section.ts` - defineSection() function
- `src/define-section.test.ts` - Unit tests

**Approach:**
1. Define `SectionDefinition<T>` type that holds name, schema, and inferred type
2. Create `defineSection()` function using generics to preserve Zod type inference
3. Use `z.infer<>` to extract TypeScript types from Zod schema
4. Write unit test to verify function works and types are inferred

**Acceptance Criteria:**
- [x] defineSection() accepts { name: string, fields: ZodObject }
- [x] Returns SectionDefinition with name, schema, and inferred type
- [x] TypeScript correctly infers field types from Zod schema
- [x] Unit test: defineSection creates valid section definition

**Verification:**
```bash
pnpm test -w @structcms/core
```

**Potential Challenges:**
- Ensuring generic type inference works correctly with Zod schemas
- Preserving field metadata for different field types (text vs richtext)

**Result:** ✅ Success

- All 5 unit tests passing
- TypeScript typecheck passing
- Files created: `src/types.ts`, `src/define-section.ts`, `src/define-section.test.ts`
- Exports added to `src/index.ts`

---

## Working on: Field Type Definitions

**Selected because:** Next logical step after defineSection. Provides field type helpers with metadata for Admin UI to distinguish between text/richtext/image etc.

### Plan

**Files to create:**
- `src/fields.ts` - Field type helper functions with metadata
- `src/fields.test.ts` - Unit tests for field types

**Files to modify:**
- `src/types.ts` - Add FieldMeta type
- `src/index.ts` - Export field helpers

**Approach:**
1. Create helper functions that wrap Zod schemas with metadata (fieldType)
2. Use Zod's `.describe()` or custom brand to store field type info
3. Field helpers: `fields.string()`, `fields.text()`, `fields.richtext()`, `fields.image()`, `fields.reference()`
4. Array and object are native Zod (`z.array()`, `z.object()`) - no wrapper needed

**Acceptance Criteria:**
- [x] string: short text, maps to z.string()
- [x] text: long text, maps to z.string() with metadata
- [x] richtext: HTML content, maps to z.string() with metadata
- [x] image: media reference, maps to z.string().url() or media ID
- [x] reference: page reference, maps to z.string() (slug or ID)
- [x] array: list of items, maps to z.array()
- [x] object: nested structure, maps to z.object()
- [x] Unit test: each field type validates correctly

**Verification:**
```bash
pnpm test --filter @structcms/core -- --run
```

**Result:** ✅ Success

- 15 new unit tests passing (20 total)
- TypeScript typecheck passing
- Files created: `src/fields.ts`, `src/fields.test.ts`
- Types added: `FieldType`, `FieldMeta`
- Exports: `fields`, `getFieldMeta`, `isFieldType`

---

## Working on: Type Inference from Zod Schemas

**Selected because:** Next Modeling task. Ensures TypeScript type inference works correctly with defineSection and fields.

### Plan

**Files to modify:**
- `src/define-section.test.ts` - Add explicit type inference tests
- `src/types.ts` - Add InferSectionData utility type

**Approach:**
1. Add `InferSectionData<T>` utility type for extracting data type from SectionDefinition
2. Add comprehensive type inference tests that verify compile-time behavior
3. Tests already partially exist - extend them to cover all acceptance criteria

**Acceptance Criteria:**
- [x] z.infer<typeof section.schema> returns correct TypeScript type
- [x] Optional fields are typed as T | undefined
- [x] Nested objects preserve type structure
- [x] Unit test: type inference matches expected types

**Verification:**
```bash
pnpm test --filter @structcms/core -- --run
pnpm --filter @structcms/core typecheck
```

**Result:** ✅ Success

- 4 new type inference tests passing (24 total)
- TypeScript typecheck passing
- Added `InferSectionData<T>` utility type
- Tests use vitest `expectTypeOf` for compile-time type verification

---

## Working on: Registry API

**Selected because:** All Modeling tasks complete. Registry is needed for Page Type Definition and Navigation Model.

### Plan

**Files to create:**
- `src/registry.ts` - createRegistry() function
- `src/registry.test.ts` - Unit tests

**Files to modify:**
- `src/types.ts` - Add Registry type
- `src/index.ts` - Export createRegistry

**Approach:**
1. Define `Registry` interface with getSection, getAllSections, getPageTypes methods
2. Create `createRegistry()` that accepts sections and pageTypes arrays
3. Store sections in a Map for O(1) lookup by name

**Acceptance Criteria:**
- [x] createRegistry({ sections, pageTypes }) creates registry instance
- [x] registry.getSection(name) returns section definition or undefined
- [x] registry.getAllSections() returns all registered sections
- [x] registry.getPageTypes() returns registered page type names
- [x] Unit test: registry stores and retrieves sections correctly

**Verification:**
```bash
pnpm test --filter @structcms/core -- --run
```

**Result:** ✅ Success

- 8 new unit tests passing (32 total)
- TypeScript typecheck passing
- Files created: `src/registry.ts`, `src/registry.test.ts`
- Types added: `CreateRegistryConfig`, `Registry`

---

## Working on: Page Type Definition

**Selected because:** Registry API complete. Page types define which sections are allowed per page.

### Plan

**Files to create:**
- `src/define-page-type.ts` - definePageType() function
- `src/define-page-type.test.ts` - Unit tests

**Files to modify:**
- `src/types.ts` - Add PageTypeDefinition type
- `src/registry.ts` - Add getPageType() method
- `src/index.ts` - Export definePageType

**Approach:**
1. Define `PageTypeDefinition` with name and allowedSections array
2. Create `definePageType()` function
3. Extend Registry to accept pageTypes as PageTypeDefinition[]
4. Add `registry.getPageType(name)` method

**Acceptance Criteria:**
- [x] definePageType({ name, allowedSections }) creates page type definition
- [x] allowedSections references registered section names
- [x] registry.getPageType(name) returns page type with allowed sections
- [x] Unit test: page type correctly restricts sections

**Verification:**
```bash
pnpm test --filter @structcms/core -- --run
```

**Result:** ✅ Success

- 7 new unit tests passing (37 total)
- TypeScript typecheck passing
- Files created: `src/define-page-type.ts`, `src/define-page-type.test.ts`
- Types added: `DefinePageTypeConfig`, `PageTypeDefinition`
- Registry updated: `getPageType()`, `getAllPageTypes()`

---

## Working on: Navigation Model

**Selected because:** Last feature task before coverage. Provides typed navigation structures.

### Plan

**Files to create:**
- `src/define-navigation.ts` - defineNavigation() function
- `src/define-navigation.test.ts` - Unit tests

**Files to modify:**
- `src/types.ts` - Add NavigationDefinition type
- `src/registry.ts` - Add navigation support
- `src/index.ts` - Export defineNavigation

**Approach:**
1. Define `NavigationDefinition` with name and schema
2. Create default navigation item schema (label, href, children)
3. Create `defineNavigation()` function
4. Extend Registry to support navigation registration

**Acceptance Criteria:**
- [x] defineNavigation({ name, schema }) creates navigation definition
- [x] Default schema supports label, href, optional children (recursive)
- [x] Navigation can be registered in registry
- [x] Unit test: navigation model validates correctly

**Verification:**
```bash
pnpm test --filter @structcms/core -- --run
```

**Result:** ✅ Success

- 10 new unit tests passing (47 total)
- TypeScript typecheck passing
- Files created: `src/define-navigation.ts`, `src/define-navigation.test.ts`
- Types added: `DefineNavigationConfig`, `NavigationDefinition`, `NavigationItem`
- Registry updated: `getNavigation()`, `getAllNavigations()`
