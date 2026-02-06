# @structcms/admin

Admin UI components for StructCMS.

## Description

This package provides the content management interface:

- Dynamic form generation from schemas
- Section editors
- Media selection
- Basic content listing & editing

## Architecture

### Admin UI Layer

Content management interface for editors.

**Responsibilities (MVP):**
- Dynamic form generation from Zod schemas
- Section editors with field-type-specific inputs
- Media browser and upload
- Content listing

**Phase 2 Additions:**
- Locale switching UI
- Draft/publish toggle

**Components:**
- **PageEditor**: Edit page content and sections
- **SectionEditor**: Edit individual section fields
- **MediaBrowser**: Browse and select media
- **ContentList**: List and filter content

**Tech Stack:**
- React
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod resolver

---

## Backlog

**Dependencies:** Modeling (@structcms/core), Storage (@structcms/api), Media (@structcms/api)  
**Estimated Effort:** High (largest domain)

### Tasks

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| A-1 | Form Generator | Generate React Hook Form from Zod schema | Todo |
| A-2 | String Input | Text input for `string` fields | Todo |
| A-3 | Text Input | Textarea for `text` fields | Todo |
| A-4 | RichText Editor | WYSIWYG editor for `richtext` fields | Todo |
| A-5 | Image Picker | Media browser integration for `image` fields | Todo |
| A-6 | Array Field | Add/remove/reorder items for `array` fields | Todo |
| A-7 | Object Field | Nested form for `object` fields | Todo |
| A-8 | Section Editor | Render form for section based on registry | Todo |
| A-9 | Page Editor | Edit page with multiple sections, add/remove/reorder sections | Todo |
| A-10 | Page List | List all pages with filter/search | Todo |
| A-11 | Navigation Editor | Edit navigation items | Todo |
| A-12 | Media Browser | Browse, upload, select media | Todo |
| A-13 | Layout Shell | Admin layout with sidebar navigation | Todo |

### Done Criteria

- [ ] All field types have working input components
- [ ] Pages can be created, edited, deleted via UI
- [ ] Media can be uploaded and selected
- [ ] Navigation can be edited
- [ ] UI is responsive and accessible

---
