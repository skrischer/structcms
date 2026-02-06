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

---

## Working on Navigation Editor Component

**Task:** Editor for navigation items with nested structure support.

**Acceptance Criteria:**
1. Displays navigation items as list
2. Edit label and href for each item
3. Add/remove items
4. Support nested children (one level)
5. Save button persists changes
6. Unit test: navigation editing

**Plan:**
- Create `src/components/content/navigation-editor.tsx` - NavigationEditor component
- Write unit test `src/components/content/__tests__/navigation-editor.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/content/navigation-editor.tsx`
- `src/components/content/__tests__/navigation-editor.test.tsx`

**Approach:**
- NavigationEditor accepts items (NavigationItem[]), onSave callback
- Each item has label (string) and href (string) fields
- Each item can have children (one level deep)
- Add/Remove buttons for top-level and child items
- Save button calls onSave with updated items
- Uses Input, Button, Label components

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 139 tests passed (125 previous + 14 NavigationEditor)
- Typecheck passed
- Created files:
  - `src/components/content/navigation-editor.tsx` - NavigationEditor component
  - `src/components/content/__tests__/navigation-editor.test.tsx` - 14 unit tests
- Updated `src/index.ts` with exports

---

## Working on Media Browser Component

**Task:** Browse, upload, and select media files.

**Acceptance Criteria:**
1. Grid display of uploaded media
2. Upload button with file input
3. Click to select (for Image Picker integration)
4. Delete button on each media item
5. Pagination or infinite scroll
6. Unit test: browse and select flow

**Plan:**
- Create `src/components/media/media-browser.tsx` - MediaBrowser component
- Write unit test `src/components/media/__tests__/media-browser.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/media/media-browser.tsx`
- `src/components/media/__tests__/media-browser.test.tsx`

**Approach:**
- MediaBrowser fetches media from API via useApiClient (`/media`)
- Grid layout for media items (thumbnail + filename)
- Upload button with hidden file input
- Click on item calls onSelect callback (for ImagePicker integration)
- Delete button on each item calls API delete
- Simple pagination with "Load More" button
- Loading/error states

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 153 tests passed (139 previous + 14 MediaBrowser)
- Typecheck passed
- Created files:
  - `src/components/media/media-browser.tsx` - MediaBrowser component
  - `src/components/media/__tests__/media-browser.test.tsx` - 14 unit tests
- Updated `src/index.ts` with exports

---

## Working on Admin Layout Shell

**Task:** Admin layout with sidebar navigation, header, and content area.

**Acceptance Criteria:**
1. Sidebar with links: Pages, Navigation, Media
2. Header with app title
3. Responsive: sidebar collapses on mobile
4. Uses shadcn/ui components and Tailwind
5. Unit test: layout renders correctly

**Plan:**
- Create `src/components/layout/admin-layout.tsx` - AdminLayout component
- Write unit test `src/components/layout/__tests__/admin-layout.test.tsx`
- Export from `src/index.ts`

**Files to create:**
- `src/components/layout/admin-layout.tsx`
- `src/components/layout/__tests__/admin-layout.test.tsx`

**Approach:**
- AdminLayout accepts children, optional title, optional navItems
- Default nav items: Pages, Navigation, Media
- Sidebar with nav links, header with app title
- Mobile: toggle button to show/hide sidebar
- Uses Button, cn() utility, Tailwind classes
- onNavigate callback for link clicks (routing handled by consumer)

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 167 tests passed (153 previous + 14 AdminLayout)
- Typecheck passed
- Created files:
  - `src/components/layout/admin-layout.tsx` - AdminLayout component
  - `src/components/layout/__tests__/admin-layout.test.tsx` - 14 unit tests
- Updated `src/index.ts` with exports

---

## Working on Loading and Error States

**Task:** Reusable components for loading indicators and error handling with toast notifications.

**Acceptance Criteria:**
1. Skeleton components for content loading
2. Toast notifications for success/error feedback
3. Error boundary for component-level errors
4. useToast() hook for triggering notifications
5. Unit test: loading and error states render correctly

**Plan:**
- Create `src/components/ui/skeleton.tsx` - Skeleton loading component
- Create `src/components/ui/toast.tsx` - Toast notification component + useToast hook
- Create `src/components/ui/error-boundary.tsx` - ErrorBoundary component
- Write unit tests for all three
- Export from `src/index.ts`

**Files to create:**
- `src/components/ui/skeleton.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/error-boundary.tsx`
- `src/components/ui/__tests__/skeleton.test.tsx`
- `src/components/ui/__tests__/toast.test.tsx`
- `src/components/ui/__tests__/error-boundary.test.tsx`

**Approach:**
- Skeleton: simple div with pulse animation, configurable width/height
- Toast: context-based toast system with ToastProvider, useToast hook, auto-dismiss
- ErrorBoundary: class component catching render errors, fallback UI
- All using Tailwind + cn() utility

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 186 tests passed (167 previous + 5 Skeleton + 9 Toast + 5 ErrorBoundary)
- Typecheck passed
- Created files:
  - `src/components/ui/skeleton.tsx` - Skeleton loading component
  - `src/components/ui/toast.tsx` - ToastProvider + useToast hook
  - `src/components/ui/error-boundary.tsx` - ErrorBoundary component
  - `src/components/ui/__tests__/skeleton.test.tsx` - 5 unit tests
  - `src/components/ui/__tests__/toast.test.tsx` - 9 unit tests
  - `src/components/ui/__tests__/error-boundary.test.tsx` - 5 unit tests
- Updated `src/index.ts` with exports

---

## Working on Fix MediaBrowser Upload URL

**Task:** Upload URL is broken — ternary always evaluates to empty string, hitting `/media` instead of `${apiBaseUrl}/media`.

**Acceptance Criteria:**
1. Upload uses apiBaseUrl from context or useApiClient upload() method
2. Upload sends FormData to correct endpoint
3. Unit test: upload triggers correct API call
4. Existing MediaBrowser tests still pass

**Plan:**
- Add `upload<T>(path: string, body: FormData): Promise<ApiResponse<T>>` method to `ApiClient` interface and `createApiClient`
- Update `MediaBrowser.handleUpload` to use `api.upload('/media', formData)` instead of raw `fetch`
- Add unit test verifying upload calls the correct endpoint
- Update `ApiClient` type export in `src/index.ts` if needed

**Files to modify:**
- `src/hooks/use-api-client.ts` — add `upload` method
- `src/components/media/media-browser.tsx` — use `api.upload`
- `src/components/media/__tests__/media-browser.test.tsx` — add upload test

**Approach:**
- Best fix: extend ApiClient with an `upload()` method that sends FormData without JSON serialization
- This keeps the upload logic consistent with the rest of the API client pattern
- MediaBrowser then uses `api.upload` like it uses `api.get`/`api.delete`

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 187 tests passed (186 previous + 1 upload endpoint test)
- Typecheck passed
- Modified files:
  - `src/hooks/use-api-client.ts` — added `upload()` method to ApiClient interface and implementation
  - `src/components/media/media-browser.tsx` — replaced broken fetch with `api.upload()`
  - `src/components/media/__tests__/media-browser.test.tsx` — added upload endpoint verification test

---

## Working on Add Array and Object Cases to FormGenerator

**Task:** FormGenerator switch statement missing array/object cases, silently renders StringInput instead of ArrayField/ObjectField.

**Acceptance Criteria:**
1. FormGenerator renders ArrayField for array field types
2. FormGenerator renders ObjectField for object field types
3. Unit test: array and object fields render correct components
4. Existing FormGenerator tests still pass

**Plan:**
- Add `case 'array'` and `case 'object'` to the switch in `renderField()`
- Import ArrayField and ObjectField
- For `array`: use Controller + ArrayField with generic renderItem (StringInput per item)
- For `object`: use ObjectField wrapper, recursively render inner shape fields
- Add unit tests for both cases

**Files to modify:**
- `src/lib/form-generator.tsx` — add array/object cases + imports
- `src/lib/__tests__/form-generator.test.tsx` — add tests

**Challenge:**
- ArrayField requires `renderItem` and `createDefaultItem` — we need sensible defaults
- ObjectField requires `children` — we need to render sub-fields from the inner ZodObject shape
- Must handle unwrapped schemas to get inner types

**Verification:** `pnpm --filter @structcms/admin test run`

**Result:** Success

- All 189 tests passed (187 previous + 2 array/object FormGenerator tests)
- Typecheck passed
- Modified files:
  - `src/lib/form-generator.tsx` — added array/object cases + ArrayField/ObjectField/Input imports
  - `src/lib/__tests__/form-generator.test.tsx` — added 2 tests for array and object rendering
  - `src/components/inputs/array-field.tsx` — added `data-testid="array-field"` to wrapper

---

## Working on Memoize useApiClient

**Task:** `createApiClient(apiBaseUrl)` is called on every render without memoization, causing `useCallback` dependencies on `api` to be ineffective and requiring `eslint-disable` comments.

**Acceptance Criteria:**
1. `createApiClient` wrapped in `useMemo` keyed on `apiBaseUrl`
2. Remove `eslint-disable` comments in PageList and MediaBrowser
3. Existing tests still pass
4. Typecheck passes

**Plan:**
- Wrap `createApiClient(apiBaseUrl)` in `React.useMemo` inside `useApiClient()` hook
- Import `useMemo` from React
- Remove `eslint-disable-line react-hooks/exhaustive-deps` from `media-browser.tsx` line 70 and `page-list.tsx` line 74
- Add `api` to the dependency arrays of those useEffects

**Files to modify:**
- `src/hooks/use-api-client.ts` — add useMemo
- `src/components/media/media-browser.tsx` — remove eslint-disable, add api to deps
- `src/components/content/page-list.tsx` — remove eslint-disable, add api to deps

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 189 tests passed
- Typecheck passed
- Modified files:
  - `src/hooks/use-api-client.ts` — wrapped `createApiClient` in `useMemo` keyed on `apiBaseUrl`
  - `src/components/media/media-browser.tsx` — removed `eslint-disable`, added `fetchMedia` to deps
  - `src/components/content/page-list.tsx` — removed `eslint-disable`, added `api` to deps

---

## Working on Consolidate NavItem Types

**Task:** Three conflicting NavItem types exist: `NavItem` in navigation-editor (label, href, children), `NavItem` in admin-layout (label, path), and `NavigationItem` from @structcms/core (label, href, children — identical to navigation-editor's NavItem).

**Acceptance Criteria:**
1. NavigationEditor uses `NavigationItem` from `@structcms/core`
2. AdminLayout `NavItem` renamed to `SidebarNavItem`
3. No duplicate NavItem exports
4. Existing tests still pass

**Plan:**
- In `navigation-editor.tsx`: remove local `NavItem` interface, import `NavigationItem` from `@structcms/core`, replace all `NavItem` usages with `NavigationItem`
- In `admin-layout.tsx`: rename `NavItem` to `SidebarNavItem`
- In `src/index.ts`: export `NavigationEditorProps` (no more `NavItem` from navigation-editor), export `SidebarNavItem` from admin-layout
- Update tests if they reference `NavItem` type

**Files to modify:**
- `src/components/content/navigation-editor.tsx`
- `src/components/layout/admin-layout.tsx`
- `src/index.ts`
- Possibly test files if they import `NavItem`

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 189 tests passed
- Typecheck passed
- Modified files:
  - `src/components/content/navigation-editor.tsx` — replaced local `NavItem` with `NavigationItem` from `@structcms/core`
  - `src/components/layout/admin-layout.tsx` — renamed `NavItem` to `SidebarNavItem`
  - `src/index.ts` — removed `NavItem` export, added `SidebarNavItem` export
  - `src/components/content/__tests__/navigation-editor.test.tsx` — updated type references

---

## Working on Integrate Toast into AdminProvider

**Task:** ToastProvider is separate from AdminProvider. No component uses toast for feedback. Consumer must manually nest providers.

**Acceptance Criteria:**
1. AdminProvider wraps ToastProvider internally
2. useToast() works inside AdminProvider without extra nesting
3. Existing tests still pass

**Plan:**
- In `admin-context.tsx`: import `ToastProvider`, wrap `children` with `<ToastProvider>`
- Existing AdminProvider tests need to verify `useToast()` works inside AdminProvider
- Add one test: render component using `useToast()` inside `AdminProvider` without separate `ToastProvider`

**Files to modify:**
- `src/context/admin-context.tsx` — wrap children with ToastProvider
- `src/context/__tests__/admin-context.test.tsx` — add test for useToast inside AdminProvider

**Challenge:**
- Must not break existing tests that may already wrap with ToastProvider separately

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 190 tests passed (189 previous + 1 toast integration test)
- Typecheck passed
- Modified files:
  - `src/context/admin-context.tsx` — wrapped children with `<ToastProvider>`
  - `src/context/__tests__/admin-context.test.tsx` — added toast integration test

---

## Working on SectionEditor Auto-Sync in PageEditor

**Task:** Each SectionEditor has its own submit button via FormGenerator. Unsubmitted section changes are silently lost when "Save Page" is clicked.

**Acceptance Criteria:**
1. Section data syncs to PageEditor on field change (onChange/onBlur)
2. Save Page captures all current section data without per-section submit
3. Existing PageEditor tests updated accordingly
4. Unit test: unsaved section data is included in Save Page

**Plan:**
- Add optional `onChange` callback to `FormGeneratorProps` that fires on every field change via `useForm.watch()`
- When `onChange` is provided, hide the submit button (no per-section submit needed)
- Update `SectionEditor` to pass `onChange` to FormGenerator instead of relying on `onSubmit`
- PageEditor already has `handleSectionChange` — SectionEditor's `onChange` will call it on every field change
- Add test: type into a section field, click Save Page without submitting the section, verify onSave includes the typed data

**Files to modify:**
- `src/lib/form-generator.tsx` — add `onChange` prop, use `watch()` to sync
- `src/components/editors/section-editor.tsx` — pass `onChange` to FormGenerator
- `src/components/editors/__tests__/page-editor.test.tsx` — add auto-sync test

**Challenge:**
- `watch()` fires on every keystroke — need to debounce or use `useEffect` with watch subscription
- Must not break existing FormGenerator usage (standalone forms still need submit button)

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 189 tests passed (190 previous - 4 obsolete submit-based SectionEditor tests + 3 new tests)
- Typecheck passed
- Modified files:
  - `src/lib/form-generator.tsx` — added `onChange` prop with `watch()` subscription, hide submit when `onChange` set
  - `src/components/editors/section-editor.tsx` — pass `onChange` to FormGenerator for live sync
  - `src/components/editors/__tests__/section-editor.test.tsx` — updated tests for auto-sync behavior
  - `src/components/editors/__tests__/page-editor.test.tsx` — added auto-sync capture test

---

## Working on ErrorBoundary Reset Mechanism

**Task:** ErrorBoundary has no reset mechanism. User must reload the page after an error.

**Acceptance Criteria:**
1. Default error UI includes a Retry button
2. Retry resets error state and re-renders children
3. Optional `onReset` callback prop
4. Unit test: reset clears error state
5. Existing ErrorBoundary tests still pass

**Plan:**
- Add `onReset?: () => void` to `ErrorBoundaryProps`
- Add `handleReset()` method that sets state back to `{ hasError: false, error: null }` and calls `onReset` if provided
- Add a "Retry" Button to the default error UI that calls `handleReset()`
- Add tests: click Retry → children re-render, onReset callback is called

**Files to modify:**
- `src/components/ui/error-boundary.tsx` — add reset mechanism + Retry button
- `src/components/ui/__tests__/error-boundary.test.tsx` — add reset tests

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 192 tests passed (189 previous + 3 new ErrorBoundary reset tests)
- Typecheck passed
- Modified files:
  - `src/components/ui/error-boundary.tsx` — added `onReset` prop, `handleReset()` method, Retry button
  - `src/components/ui/__tests__/error-boundary.test.tsx` — added 3 tests for Retry button, reset, and onReset callback

---

## Working on Fix Toast Counter Module-Level State

**Task:** Toast counter is a module-level `let toastCounter = 0`, shared across all ToastProvider instances and SSR renders. This can cause hydration mismatches and non-deterministic IDs.

**Acceptance Criteria:**
1. Toast ID generation uses `useRef` inside ToastProvider
2. Multiple ToastProvider instances have independent counters
3. Existing Toast tests still pass

**Plan:**
- Remove `let toastCounter = 0` module-level variable
- Add `const counterRef = React.useRef(0)` inside `ToastProvider`
- Use `counterRef.current` instead of `toastCounter` in `addToast`
- Add test: two separate ToastProvider instances generate independent IDs

**Files to modify:**
- `src/components/ui/toast.tsx` — replace module-level counter with useRef
- `src/components/ui/__tests__/toast.test.tsx` — add independent counter test

**Verification:** `pnpm --filter @structcms/admin test run && pnpm --filter @structcms/admin typecheck`

**Result:** Success

- All 193 tests passed (192 previous + 1 independent counter test)
- Typecheck passed
- Modified files:
  - `src/components/ui/toast.tsx` — replaced module-level `toastCounter` with `useRef` inside ToastProvider
  - `src/components/ui/__tests__/toast.test.tsx` — added test for independent counters across instances
