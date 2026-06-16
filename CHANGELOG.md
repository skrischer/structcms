# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-06-16

### Documentation

- Correct `@structcms/admin` setup instructions for Tailwind v4. The previous guidance pointed at a Tailwind v3 `tailwind.config.ts` `content` array, which v4 ignores, leaving consumer admin UIs unstyled. The README now documents the `@structcms/admin/styles.css` import, the `@source` directive pointing at `dist`, and the required `data-structcms-admin` scoping.

## [0.2.0] - 2026-06-15

### Features

- Admin design system: foundational atoms, design tokens, and a `DesignSystemPage` showcase
- Redesigned admin views: Dashboard, Pages List, page editor, login, and edit-page view
- Media browser redesign with search, filters, and pagination
- Navigation editor redesign with card layout and hierarchy
- Dynamic admin components: Sidebar, HeaderBar, DataTable, Pagination
- Field system: field groups, field descriptions, and modernized field components built on design-system atoms
- Responsive sidebar collapse replacing the mobile overlay
- Clickable table rows in page list and dashboard

### Fixes

- Normalize raw hex/rgba values and hardcoded sizes to design tokens
- Accessibility improvements across navigation editor and KPI cards (semantic markup, keyboard support)
- Resolve array recursion bug in `resolveDataObject`
- Remove `.js` extensions from audit module imports
- Prevent double scrollbar caused by `sr-only` checkbox inputs

### Build

- Migrate publish pipeline to pnpm 11 with npm OIDC trusted publishing and provenance

## [0.1.0] - Unreleased

### Features

- Code-first content modeling with TypeScript and Zod
- Section-based page building with type inference
- Registry pattern for runtime model resolution
- Supabase storage and media adapters
- RESTful API with handler functions
- Next.js preset factories for quick route setup
- Admin UI with React components (forms, editors, media browser)
- Authentication module with Supabase adapter
- Content export functionality
- Navigation management
- Dynamic form generation from Zod schemas
- Rich text editor with Tiptap
- Media browser with upload and selection
- Page editor with section management
- HTML sanitization for XSS protection
- Slug generation and uniqueness validation
- Type-safe section rendering
- Framework-agnostic adapter interfaces

### Packages

- `@structcms/core` - Core modeling, validation, and types
- `@structcms/api` - Storage, domain API, and delivery API
- `@structcms/admin` - Admin UI components (React)

[0.1.0]: https://github.com/skrischer/structcms/releases/tag/v0.1.0
