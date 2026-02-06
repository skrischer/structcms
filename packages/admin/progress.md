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

---

## Working on String Input Component

**Task:** Text input component for string fields with label, placeholder, validation error display.

**Acceptance Criteria:**
1. Renders shadcn/ui Input component
2. Displays label and optional placeholder
3. Shows validation errors below input
4. Supports required/optional indicator
5. Unit test: renders and validates correctly

**Plan:**
- Create `src/lib/utils.ts` with `cn()` utility for Tailwind class merging
- Create `src/components/ui/input.tsx` - shadcn/ui Input component
- Create `src/components/ui/label.tsx` - shadcn/ui Label component
- Create `src/components/inputs/string-input.tsx` - StringInput component
- Write unit test `src/components/inputs/__tests__/string-input.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/lib/utils.ts`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/inputs/string-input.tsx`
- `src/components/inputs/__tests__/string-input.test.tsx`

**Approach:**
- StringInput wraps shadcn Input with label, error display, and required indicator
- Props: name, label, placeholder, error, required, and standard input props
- Uses React Hook Form's register pattern (forwardRef)
- Styled with Tailwind CSS

**Challenges:**
- Need to install tailwind-merge, clsx, class-variance-authority first

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 15 tests passed (5 AdminProvider + 10 StringInput)
- Typecheck passed
- Created files:
  - `src/lib/utils.ts` - cn() utility for Tailwind class merging
  - `src/components/ui/input.tsx` - shadcn/ui Input component
  - `src/components/ui/label.tsx` - shadcn/ui Label component
  - `src/components/inputs/string-input.tsx` - StringInput component
  - `src/components/inputs/__tests__/string-input.test.tsx` - 10 unit tests
  - `src/test/setup.ts` - Vitest setup for jest-dom matchers
- Updated `src/index.ts` with exports
- Updated `vitest.config.ts` with setupFiles
- Installed dependencies: tailwind-merge, clsx, class-variance-authority, @testing-library/user-event, @testing-library/jest-dom

---

## Working on Text Input Component

**Task:** Textarea component for long text fields.

**Acceptance Criteria:**
1. Renders shadcn/ui Textarea component
2. Supports configurable rows
3. Displays label and validation errors
4. Unit test: renders correctly

**Plan:**
- Create `src/components/ui/textarea.tsx` - shadcn/ui Textarea component
- Create `src/components/inputs/text-input.tsx` - TextInput component (wraps Textarea)
- Write unit test `src/components/inputs/__tests__/text-input.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/ui/textarea.tsx`
- `src/components/inputs/text-input.tsx`
- `src/components/inputs/__tests__/text-input.test.tsx`

**Approach:**
- TextInput follows same pattern as StringInput
- Props: name, label, placeholder, error, required, rows (default: 3)
- Uses forwardRef for React Hook Form compatibility

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 25 tests passed (5 AdminProvider + 10 StringInput + 10 TextInput)
- Typecheck passed
- Created files:
  - `src/components/ui/textarea.tsx` - shadcn/ui Textarea component
  - `src/components/inputs/text-input.tsx` - TextInput component
  - `src/components/inputs/__tests__/text-input.test.tsx` - 10 unit tests
- Updated `src/index.ts` with exports

---

## Working on RichText Editor Component

**Task:** WYSIWYG editor for richtext fields using TipTap.

**Acceptance Criteria:**
1. Integrates TipTap editor
2. Supports bold, italic, links, lists, headings
3. Outputs HTML string
4. Styled to match shadcn/ui design
5. Unit test: editor renders and outputs HTML

**Plan:**
- Install TipTap dependencies: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link
- Create `src/components/inputs/rich-text-editor.tsx` - RichTextEditor component
- Write unit test `src/components/inputs/__tests__/rich-text-editor.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/inputs/rich-text-editor.tsx`
- `src/components/inputs/__tests__/rich-text-editor.test.tsx`

**Approach:**
- RichTextEditor follows same pattern as other inputs (label, error, required)
- Uses TipTap with StarterKit (bold, italic, lists, headings) + Link extension
- Toolbar with buttons for formatting
- Outputs HTML via editor.getHTML()
- Uses forwardRef pattern but with controlled value/onChange

**Challenges:**
- TipTap testing requires special setup (mocking contenteditable)
- Need to install TipTap dependencies first

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 35 tests passed (5 AdminProvider + 10 StringInput + 10 TextInput + 10 RichTextEditor)
- Typecheck passed
- Created files:
  - `src/components/inputs/rich-text-editor.tsx` - RichTextEditor component with TipTap
  - `src/components/inputs/__tests__/rich-text-editor.test.tsx` - 10 unit tests
- Updated `src/index.ts` with exports
- Installed dependencies: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/pm

---

## Working on Image Picker Component

**Task:** Component for image fields that opens MediaBrowser for selection.

**Acceptance Criteria:**
1. Shows current image preview if selected
2. Button to open MediaBrowser modal
3. Stores media ID or URL in form
4. Clear button to remove selection
5. Unit test: selection flow

**Plan:**
- Create `src/components/ui/button.tsx` - shadcn/ui Button component (needed for actions)
- Create `src/components/inputs/image-picker.tsx` - ImagePicker component
- Write unit test `src/components/inputs/__tests__/image-picker.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/ui/button.tsx`
- `src/components/inputs/image-picker.tsx`
- `src/components/inputs/__tests__/image-picker.test.tsx`

**Approach:**
- ImagePicker accepts value (URL string), onChange, onBrowse (callback to open MediaBrowser)
- Shows image preview when value is set
- "Browse" button triggers onBrowse callback (MediaBrowser integration comes later)
- "Clear" button sets value to empty string
- Uses Label for accessibility

**Note:** MediaBrowser modal integration will be done when MediaBrowser component is implemented. For now, onBrowse is a callback prop.

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 47 tests passed (5 AdminProvider + 10 StringInput + 10 TextInput + 10 RichTextEditor + 12 ImagePicker)
- Typecheck passed
- Created files:
  - `src/components/ui/button.tsx` - shadcn/ui Button component
  - `src/components/inputs/image-picker.tsx` - ImagePicker component
  - `src/components/inputs/__tests__/image-picker.test.tsx` - 12 unit tests
- Updated `src/index.ts` with exports

---

## Working on Array Field Component

**Task:** Component for array fields with add/remove/reorder (buttons) functionality.

**Acceptance Criteria:**
1. Add button appends new item
2. Remove button on each item
3. Up/Down buttons for reordering
4. Renders nested form for each item
5. Unit test: add, remove, reorder operations

**Plan:**
- Create `src/components/inputs/array-field.tsx` - ArrayField component
- Write unit test `src/components/inputs/__tests__/array-field.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/inputs/array-field.tsx`
- `src/components/inputs/__tests__/array-field.test.tsx`

**Approach:**
- ArrayField accepts value (array), onChange, renderItem (render prop for each item)
- Add button appends default item to array
- Each item has Remove, Up, Down buttons
- Up/Down disabled at boundaries
- Uses Button component for actions
- Generic component that works with any item type

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 63 tests passed (5 AdminProvider + 10 StringInput + 10 TextInput + 10 RichTextEditor + 12 ImagePicker + 16 ArrayField)
- Typecheck passed
- Created files:
  - `src/components/inputs/array-field.tsx` - ArrayField component
  - `src/components/inputs/__tests__/array-field.test.tsx` - 16 unit tests
- Updated `src/index.ts` with exports

---

## Working on Object Field Component

**Task:** Component for nested object fields, rendering sub-form.

**Acceptance Criteria:**
1. Renders nested form fields for object properties
2. Visually grouped (card or indentation)
3. Supports nested validation
4. Unit test: nested form renders

**Plan:**
- Create `src/components/inputs/object-field.tsx` - ObjectField component
- Write unit test `src/components/inputs/__tests__/object-field.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/inputs/object-field.tsx`
- `src/components/inputs/__tests__/object-field.test.tsx`

**Approach:**
- ObjectField accepts label, children (nested form fields), error, required
- Wraps children in a visually grouped container (card-like with border)
- Supports nested validation by passing error prop
- Simple wrapper component - actual field rendering is done by parent

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 73 tests passed (5 AdminProvider + 10 StringInput + 10 TextInput + 10 RichTextEditor + 12 ImagePicker + 16 ArrayField + 10 ObjectField)
- Typecheck passed
- Created files:
  - `src/components/inputs/object-field.tsx` - ObjectField component
  - `src/components/inputs/__tests__/object-field.test.tsx` - 10 unit tests
- Updated `src/index.ts` with exports

---

## Working on Form Generator from Zod Schema

**Task:** Create component that generates React Hook Form from Zod schema, mapping field types to appropriate input components.

**Acceptance Criteria:**
1. Accepts Zod schema and generates form fields
2. Integrates with React Hook Form + Zod resolver
3. Maps each field type to corresponding input component
4. Handles validation errors from Zod
5. Unit test: form generation from sample schema

**Plan:**
- Install dependencies: react-hook-form, @hookform/resolvers
- Create `src/lib/form-generator.tsx` - FormGenerator component
- Write unit test `src/lib/__tests__/form-generator.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/lib/form-generator.tsx`
- `src/lib/__tests__/form-generator.test.tsx`

**Approach:**
- FormGenerator accepts a Zod schema (ZodObject), iterates over its shape
- Uses `getFieldMeta()` from @structcms/core to determine field type
- Maps field types to input components: string→StringInput, text→TextInput, richtext→RichTextEditor, image→ImagePicker, array→ArrayField, object→ObjectField
- Integrates React Hook Form with zodResolver
- Passes validation errors to each field
- Accepts onSubmit callback

**Challenges:**
- Need to install react-hook-form and @hookform/resolvers
- Unwrapping optional/default Zod wrappers to find field meta
- Array/Object fields need recursive rendering

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 91 tests passed (73 previous + 18 FormGenerator)
- Typecheck passed
- Created files:
  - `src/lib/form-generator.tsx` - FormGenerator component with resolveFieldType, fieldNameToLabel
  - `src/lib/__tests__/form-generator.test.tsx` - 18 unit tests (6 resolveFieldType + 3 fieldNameToLabel + 9 FormGenerator)
- Updated `src/index.ts` with exports
- Installed dependencies: react-hook-form, @hookform/resolvers, zod

---

## Working on Section Editor Component

**Task:** Component that renders form for a section based on its schema from registry.

**Acceptance Criteria:**
1. Accepts section type and data
2. Looks up schema from registry
3. Generates form using Form Generator
4. Emits onChange with updated section data
5. Unit test: renders form for section type

**Plan:**
- Create `src/components/editors/section-editor.tsx` - SectionEditor component
- Write unit test `src/components/editors/__tests__/section-editor.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/editors/section-editor.tsx`
- `src/components/editors/__tests__/section-editor.test.tsx`

**Approach:**
- SectionEditor accepts sectionType (string), data (Record<string, unknown>), onChange callback
- Uses useAdmin() hook to get registry
- Looks up section definition via registry.getSection(sectionType)
- Passes section schema to FormGenerator
- On form submit, calls onChange with updated data
- Shows error if section type not found in registry

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 100 tests passed (91 previous + 9 SectionEditor)
- Typecheck passed
- Created files:
  - `src/components/editors/section-editor.tsx` - SectionEditor component
  - `src/components/editors/__tests__/section-editor.test.tsx` - 9 unit tests
- Updated `src/index.ts` with exports

---

## Working on Page Editor Component

**Task:** Full page editor with multiple sections, add/remove/reorder sections using buttons.

**Acceptance Criteria:**
1. Displays list of sections with SectionEditor for each
2. Add Section button with section type selector
3. Remove button on each section
4. Up/Down buttons for section reordering
5. Save button triggers onSave callback
6. Unit test: section management operations

**Plan:**
- Create `src/components/editors/page-editor.tsx` - PageEditor component
- Write unit test `src/components/editors/__tests__/page-editor.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/editors/page-editor.tsx`
- `src/components/editors/__tests__/page-editor.test.tsx`

**Approach:**
- PageEditor accepts sections (SectionData[]), allowedSections (string[]), onSave callback
- Renders each section with SectionEditor
- Add Section button with select dropdown for section type
- Remove/Up/Down buttons per section (reuses pattern from ArrayField)
- Save button triggers onSave with all section data
- Uses useAdmin() for registry access

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 112 tests passed (100 previous + 12 PageEditor)
- Typecheck passed
- Created files:
  - `src/components/editors/page-editor.tsx` - PageEditor component
  - `src/components/editors/__tests__/page-editor.test.tsx` - 12 unit tests
- Updated `src/index.ts` with exports

---

## Working on Page List Component

**Task:** List all pages with filter/search, link to edit each page.

**Acceptance Criteria:**
1. Fetches and displays pages from API
2. Search input filters by title/slug
3. Filter by page type
4. Click row navigates to PageEditor
5. Create New Page button
6. Unit test: list renders and filters

**Plan:**
- Create `src/components/content/page-list.tsx` - PageList component
- Write unit test `src/components/content/__tests__/page-list.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/content/page-list.tsx`
- `src/components/content/__tests__/page-list.test.tsx`

**Approach:**
- PageList uses useApiClient() to fetch pages from `/pages`
- Renders a table/list of pages with title, slug, page type
- Search input filters client-side by title/slug
- Page type filter dropdown
- Click row calls onSelectPage callback (navigation handled by consumer)
- Create New Page button calls onCreatePage callback
- Loading and error states

**Challenges:**
- Need to mock fetch in tests for API calls
- Need to define PageSummary type for the list data

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 125 tests passed (112 previous + 13 PageList)
- Typecheck passed
- Created files:
  - `src/components/content/page-list.tsx` - PageList component
  - `src/components/content/__tests__/page-list.test.tsx` - 13 unit tests
- Updated `src/index.ts` with exports
