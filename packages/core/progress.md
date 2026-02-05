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
