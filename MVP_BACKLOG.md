# StructCMS — MVP Backlog

This document defines the MVP backlog organized by domains. Each domain can be refined further before implementation.

---

## Domain Overview

| Domain | Package | Depends On | Parallel To | Priority |
|--------|---------|------------|-------------|----------|
| Modeling | [`@structcms/core`](./packages/core/README.md) | - | - | 1 (Start) |
| Storage | [`@structcms/api`](./packages/api/README.md) | Modeling | Media | 2 |
| Media | [`@structcms/api`](./packages/api/README.md) | Modeling | Storage | 2 |
| Admin UI | [`@structcms/admin`](./packages/admin/README.md) | Modeling, Storage, Media | Export | 3 |
| Export | [`@structcms/api`](./packages/api/README.md) | Storage | Admin UI | 3 |

For detailed backlog items per domain, see the respective package README files.

---

## Domain Dependency Graph

```
        ┌──────────┐
        │ MODELING │
        └────┬─────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌─────────┐   ┌─────────┐
│ STORAGE │   │  MEDIA  │
└────┬────┘   └────┬────┘
     │             │
     └──────┬──────┘
            ▼
      ┌──────────┐
      │ ADMIN UI │
      └──────────┘
            
┌──────────┐
│  EXPORT  │ ← Can start after Storage
└──────────┘
```

---

## Domain 1: MODELING

**Package**: `@structcms/core`  
**Dependencies**: None  
**Estimated Effort**: Medium

### Backlog Items

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| M-1 | Define Section API | `defineSection()` function accepts Zod schema and returns typed section definition | Todo |
| M-2 | Field Type Definitions | Support for: `string`, `text`, `richtext`, `image`, `reference`, `array`, `object` | Todo |
| M-3 | Type Inference | Zod schema infers TypeScript types for section data | Todo |
| M-4 | Registry API | `createRegistry()` collects and exposes all registered sections | Todo |
| M-5 | Page Type Definition | `definePageType()` specifies allowed sections per page type | Todo |
| M-6 | Navigation Model | `defineNavigation()` for menu/navigation structures | Todo |
| M-7 | Unit Tests | All public APIs have unit tests with >80% coverage | Todo |

### Done Criteria (Domain)
- [ ] All field types implemented and tested
- [ ] Type inference works end-to-end
- [ ] Registry can be created and queried
- [ ] Package builds and exports correctly

---

## Domain 2: STORAGE

**Package**: `@structcms/api`  
**Dependencies**: Modeling  
**Estimated Effort**: Medium

### Backlog Items

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| S-1 | Storage Interface | `StorageAdapter` interface defined with CRUD methods | Todo |
| S-2 | Supabase Adapter | `SupabaseStorageAdapter` implements `StorageAdapter` | Todo |
| S-3 | DB Schema: Pages | `pages` table created with id, slug, page_type, sections (jsonb), timestamps | Todo |
| S-4 | DB Schema: Navigation | `navigation` table created with id, name, items (jsonb), timestamps | Todo |
| S-5 | Page CRUD | Create, Read, Update, Delete operations for pages | Todo |
| S-6 | Navigation CRUD | Create, Read, Update, Delete operations for navigation | Todo |
| S-7 | Slug Handling | Auto-generate slug from title, ensure uniqueness | Todo |
| S-8 | Delivery Endpoints | `GET /api/cms/pages`, `GET /api/cms/pages/:slug`, `GET /api/cms/navigation/:name` | Todo |
| S-9 | Integration Tests | All CRUD operations tested against Supabase | Todo |

### Done Criteria (Domain)
- [ ] Storage interface is Supabase-agnostic
- [ ] All CRUD operations work
- [ ] Delivery endpoints return typed responses
- [ ] Database migrations documented

---

## Domain 3: MEDIA

**Package**: `@structcms/api`  
**Dependencies**: Modeling  
**Estimated Effort**: Medium

### Backlog Items

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| ME-1 | Media Interface | `MediaAdapter` interface defined with upload/list/delete methods | Todo |
| ME-2 | Supabase Media Adapter | `SupabaseMediaAdapter` implements `MediaAdapter` using Supabase Storage | Todo |
| ME-3 | DB Schema: Media | `media` table with id, filename, storage_path, mime_type, size, timestamps | Todo |
| ME-4 | Upload Endpoint | `POST /api/cms/media` accepts file upload, stores in Supabase Storage | Todo |
| ME-5 | List Endpoint | `GET /api/cms/media` returns paginated media list | Todo |
| ME-6 | Delete Endpoint | `DELETE /api/cms/media/:id` removes file and DB record | Todo |
| ME-7 | Media Reference Type | `image` field type resolves to media URL in delivery | Todo |
| ME-8 | Integration Tests | Upload, list, delete tested against Supabase Storage | Todo |

### Done Criteria (Domain)
- [ ] Media interface is Supabase-agnostic
- [ ] Files upload to Supabase Storage
- [ ] Media can be referenced in content
- [ ] URLs are publicly accessible

---

## Domain 4: ADMIN UI

**Package**: `@structcms/admin`  
**Dependencies**: Modeling, Storage, Media  
**Estimated Effort**: High (largest domain)

### Backlog Items

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
| A-14 | E2E Tests | Critical flows: create page, edit section, upload media | Todo |

### Done Criteria (Domain)
- [ ] All field types have working input components
- [ ] Pages can be created, edited, deleted via UI
- [ ] Media can be uploaded and selected
- [ ] Navigation can be edited
- [ ] UI is responsive and accessible

---

## Domain 5: EXPORT

**Package**: `@structcms/api`  
**Dependencies**: Storage  
**Estimated Effort**: Low

### Backlog Items

| ID | Task | Acceptance Criteria | Status |
|----|------|---------------------|--------|
| E-1 | Single Page Export | `GET /api/cms/export/pages/:slug` returns full page JSON | Todo |
| E-2 | All Pages Export | `GET /api/cms/export/pages` returns all pages as JSON array | Todo |
| E-3 | Navigation Export | `GET /api/cms/export/navigation` returns all navigation as JSON | Todo |
| E-4 | Full Export | `GET /api/cms/export` returns complete site content | Todo |
| E-5 | Backup Documentation | Document backup strategy using export endpoints | Todo |

### Done Criteria (Domain)
- [ ] All content exportable as JSON
- [ ] Export format is documented
- [ ] Backup process documented in README

---

## Implementation Order

| Phase | Domains | Can Start When |
|-------|---------|----------------|
| 1 | Modeling | Immediately |
| 2 | Storage, Media | Modeling complete |
| 3 | Admin UI, Export | Storage + Media complete |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| Todo | Not started |
| In Progress | Currently being worked on |
| Review | Implementation complete, needs review |
| Done | Accepted and merged |
| Blocked | Waiting on dependency or decision |

---

## Notes

- Each domain should have its own detailed refinement before implementation
- Tasks within a domain may have internal dependencies not shown here
- Effort estimates are relative, not absolute
- Admin UI is the largest effort and may need further breakdown

---
