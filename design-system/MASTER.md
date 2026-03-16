# StructCMS Admin -- Design System

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** StructCMS Admin
**Type:** CMS Admin Dashboard / Backend-UI
**Target Users:** Content editors, developers
**Language:** English (UI labels, content)
**Form of Address:** Neutral ("you" / imperative)
**Generated:** 2026-03-16
**Category:** Admin Dashboard / Productivity Tool

---

## Design Philosophy

StructCMS Admin is a **productivity tool** -- not a marketing site. Every design decision optimizes for:

1. **Information density** -- Show maximum useful data without clutter
2. **Scannability** -- Clear visual hierarchy for fast comprehension
3. **Predictability** -- Consistent patterns reduce cognitive load
4. **Quiet confidence** -- Professional, not flashy; the content is the star

---

## Color Palette

### Brand / Primary

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary-50` | `#EFF6FF` | 239, 246, 255 | Primary tint, selected row bg |
| `--color-primary-100` | `#DBEAFE` | 219, 234, 254 | Active sidebar item bg |
| `--color-primary-200` | `#BFDBFE` | 191, 219, 254 | Focus ring color |
| `--color-primary-300` | `#93C5FD` | 147, 197, 253 | Light accent borders |
| `--color-primary-400` | `#60A5FA` | 96, 165, 250 | Hover state |
| `--color-primary-500` | `#3B82F6` | 59, 130, 246 | Primary interactive (links, toggles) |
| `--color-primary-600` | `#2563EB` | 37, 99, 235 | Primary buttons, active tabs |
| `--color-primary-700` | `#1D4ED8` | 29, 78, 216 | Pressed state |
| `--color-primary-800` | `#1E40AF` | 30, 64, 175 | -- |
| `--color-primary-900` | `#1E3A8A` | 30, 58, 138 | -- |

### Neutral / Gray (Slate)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-gray-25` | `#FCFCFD` | Page background alternative |
| `--color-gray-50` | `#F8FAFC` | Page background, table header bg |
| `--color-gray-100` | `#F1F5F9` | Card background, sidebar bg, striped rows |
| `--color-gray-200` | `#E2E8F0` | Borders, dividers, input borders |
| `--color-gray-300` | `#CBD5E1` | Disabled input borders, placeholder icons |
| `--color-gray-400` | `#94A3B8` | Placeholder text, disabled text |
| `--color-gray-500` | `#64748B` | Secondary text, captions, metadata |
| `--color-gray-600` | `#475569` | Labels, table headers |
| `--color-gray-700` | `#334155` | Secondary headings |
| `--color-gray-800` | `#1E293B` | Primary text |
| `--color-gray-900` | `#0F172A` | Page titles, high-emphasis text |
| `--color-gray-950` | `#020617` | Maximum contrast text |

### Semantic / Status

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success-50` | `#F0FDF4` | Success background |
| `--color-success-500` | `#22C55E` | Success icon, badge |
| `--color-success-700` | `#15803D` | Success text |
| `--color-error-50` | `#FEF2F2` | Error background |
| `--color-error-500` | `#EF4444` | Error icon, destructive button |
| `--color-error-700` | `#B91C1C` | Error text |
| `--color-warning-50` | `#FFFBEB` | Warning background |
| `--color-warning-500` | `#F59E0B` | Warning icon, badge |
| `--color-warning-700` | `#B45309` | Warning text |
| `--color-info-50` | `#EFF6FF` | Info background |
| `--color-info-500` | `#3B82F6` | Info icon (same as primary) |
| `--color-info-700` | `#1D4ED8` | Info text |

### Surface / Layout

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-surface-page` | `#F8FAFC` | Main page background |
| `--color-surface-card` | `#FFFFFF` | Cards, panels, modals |
| `--color-surface-sidebar` | `#FFFFFF` | Sidebar background |
| `--color-surface-sidebar-active` | `#EFF6FF` | Active sidebar item |
| `--color-surface-header` | `#FFFFFF` | Top header bar |
| `--color-surface-overlay` | `rgba(15, 23, 42, 0.5)` | Modal/drawer overlay |
| `--color-border-default` | `#E2E8F0` | Default borders |
| `--color-border-subtle` | `#F1F5F9` | Subtle dividers |
| `--color-border-focus` | `#3B82F6` | Focus ring |

---

## Typography

### Font Stack

| Role | Font Family | Fallback | Usage |
|------|-------------|----------|-------|
| **UI / Body** | Inter | system-ui, -apple-system, sans-serif | All interface text |
| **Code / Mono** | JetBrains Mono | "Fira Code", monospace | Code blocks, API slugs, IDs |

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display` | 30px | 700 | 1.2 | -0.02em | Dashboard page titles |
| `--text-h1` | 24px | 600 | 1.3 | -0.01em | Section titles |
| `--text-h2` | 20px | 600 | 1.35 | -0.01em | Card headers, sub-sections |
| `--text-h3` | 16px | 600 | 1.4 | 0 | Group labels, widget titles |
| `--text-body-lg` | 16px | 400 | 1.5 | 0 | Primary body text |
| `--text-body` | 14px | 400 | 1.5 | 0 | Default UI text, table cells |
| `--text-body-medium` | 14px | 500 | 1.5 | 0 | Emphasized body, nav items |
| `--text-label` | 13px | 500 | 1.4 | 0.01em | Form labels, table headers |
| `--text-caption` | 12px | 400 | 1.4 | 0.01em | Metadata, timestamps, help text |
| `--text-overline` | 11px | 600 | 1.4 | 0.06em | Category labels, uppercase tags |
| `--text-code` | 13px | 400 | 1.5 | 0 | Code snippets (JetBrains Mono) |

---

## Spacing Scale

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | Reset |
| `--space-0.5` | 2px | Hairline gaps |
| `--space-1` | 4px | Tight inline gaps (icon-to-text) |
| `--space-1.5` | 6px | Compact list item padding |
| `--space-2` | 8px | Small gaps, icon padding |
| `--space-2.5` | 10px | Input inline padding |
| `--space-3` | 12px | Compact card padding, table cell padding |
| `--space-4` | 16px | Standard padding, form gaps |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section padding, sidebar item padding |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Page-level padding |
| `--space-12` | 48px | Section margins |
| `--space-16` | 64px | Major section separations |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Sharp edges (table cells) |
| `--radius-sm` | 4px | Badges, tags, small chips |
| `--radius-md` | 6px | Buttons, inputs, selects |
| `--radius-lg` | 8px | Cards, dropdowns, panels |
| `--radius-xl` | 12px | Modals, dialogs |
| `--radius-2xl` | 16px | Large panels, sheets |
| `--radius-full` | 9999px | Avatars, pills, toggles |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle lift (inputs, small cards) |
| `--shadow-sm` | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)` | Cards, buttons |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)` | Elevated cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | Dialogs, command palette |
| `--shadow-ring` | `0 0 0 3px rgba(59, 130, 246, 0.15)` | Focus ring for inputs/buttons |

---

## Component Specs

### Buttons

| Variant | Background | Text Color | Border | Radius | Padding | Font |
|---------|------------|------------|--------|--------|---------|------|
| **Primary** | `#2563EB` | `#FFFFFF` | none | 6px | 8px 16px | 14px/500 |
| **Secondary** | `#FFFFFF` | `#334155` | 1px `#E2E8F0` | 6px | 8px 16px | 14px/500 |
| **Ghost** | transparent | `#475569` | none | 6px | 8px 16px | 14px/500 |
| **Danger** | `#EF4444` | `#FFFFFF` | none | 6px | 8px 16px | 14px/500 |
| **Danger Outline** | transparent | `#EF4444` | 1px `#EF4444` | 6px | 8px 16px | 14px/500 |

**States:**
- Hover: darken background 8%, or light bg fill for ghost/secondary
- Active/Pressed: darken 12%
- Disabled: opacity 0.5, cursor not-allowed
- Focus: 3px ring `rgba(59, 130, 246, 0.15)`

**Sizes:**
- Small: height 32px, padding 6px 12px, font 13px
- Default: height 36px, padding 8px 16px, font 14px
- Large: height 40px, padding 10px 20px, font 14px

### Form Inputs

| Property | Value |
|----------|-------|
| Height | 36px |
| Padding | 8px 12px |
| Border | 1px solid `#E2E8F0` |
| Radius | 6px |
| Font | 14px/400 Inter |
| Background | `#FFFFFF` |
| Placeholder color | `#94A3B8` |
| Focus border | `#3B82F6` |
| Focus ring | `0 0 0 3px rgba(59, 130, 246, 0.15)` |
| Error border | `#EF4444` |
| Error ring | `0 0 0 3px rgba(239, 68, 68, 0.15)` |
| Disabled bg | `#F8FAFC` |
| Disabled opacity | 0.6 |

### Cards

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border | 1px solid `#E2E8F0` |
| Radius | 8px |
| Padding | 20px |
| Shadow | `--shadow-xs` (subtle) |
| Hover shadow | `--shadow-sm` (optional, if interactive) |

### Sidebar

| Property | Value |
|----------|-------|
| Width | 260px (expanded), 64px (collapsed) |
| Background | `#FFFFFF` |
| Border right | 1px solid `#E2E8F0` |
| Item height | 36px |
| Item padding | 8px 12px |
| Item radius | 6px |
| Active bg | `#EFF6FF` |
| Active text | `#2563EB` |
| Hover bg | `#F1F5F9` |

### Data Tables

| Property | Value |
|----------|-------|
| Header bg | `#F8FAFC` |
| Header text | 13px/500, `#475569` |
| Cell padding | 12px 16px |
| Cell text | 14px/400, `#1E293B` |
| Row border | 1px solid `#F1F5F9` |
| Hover row bg | `#F8FAFC` |
| Selected row bg | `#EFF6FF` |
| Striped row bg | `#FAFBFC` |

### Badges / Tags

| Variant | Background | Text | Radius |
|---------|------------|------|--------|
| Default | `#F1F5F9` | `#475569` | 4px |
| Primary | `#EFF6FF` | `#2563EB` | 4px |
| Success | `#F0FDF4` | `#15803D` | 4px |
| Warning | `#FFFBEB` | `#B45309` | 4px |
| Error | `#FEF2F2` | `#B91C1C` | 4px |

Font: 12px/500, padding: 2px 8px

---

## Iconography

- **Icon set:** Lucide React (consistent with CMS ecosystem)
- **Sizes:** 16px (inline), 20px (default), 24px (prominent)
- **Stroke width:** 1.5px (default), 2px (emphasized)
- **Color:** Inherits text color via `currentColor`
- **Touch target minimum:** 36px (admin desktop), 44px (mobile)

---

## Interaction

- **Transition duration:** 150ms for micro-interactions (hover, focus), 200ms for state changes, 300ms for panels/modals
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out for enters), `cubic-bezier(0.4, 0, 1, 1)` (ease-in for exits)
- **Focus visible:** Always show focus ring on keyboard navigation
- **Cursor:** `pointer` on all clickable elements
- **Disabled pattern:** opacity 0.5, pointer-events none

---

## Layout

### Page Structure
```
+--sidebar (260px)--+--main-area (fluid)--+
|                   | +--header (56px)--+ |
| Logo              | | breadcrumb, actions |
| Nav items         | +-----------------+ |
|                   | +--content--------+ |
|                   | | page content    | |
|                   | | (max 1200px)    | |
|                   | +-----------------+ |
+-------------------+---------------------+
```

### Breakpoints
| Token | Value | Usage |
|-------|-------|-------|
| `--bp-sm` | 640px | Compact mobile |
| `--bp-md` | 768px | Tablet / small desktop |
| `--bp-lg` | 1024px | Desktop (sidebar collapses below) |
| `--bp-xl` | 1280px | Wide desktop |
| `--bp-2xl` | 1440px | Full dashboard |

### Content Max Width
- Main content area: 1200px (centered)
- Full-bleed tables/editors: 100% of main area

---

## Accessibility

- **Contrast:** All text meets WCAG AA (4.5:1 normal, 3:1 large)
- **Focus rings:** 3px offset, primary-200 color
- **Touch targets:** Minimum 36px desktop, 44px mobile
- **Labels:** All form fields have visible labels (never placeholder-only)
- **Color + icon:** Status is never communicated by color alone
- **Keyboard:** Full keyboard navigation support
- **Reduced motion:** Respect `prefers-reduced-motion`

---

## Anti-Patterns (Do NOT Use)

- No emojis as icons -- use Lucide SVG icons
- No ornate/decorative styling -- this is a productivity tool
- No animations > 300ms for micro-interactions
- No hover-only interactions (must work on touch)
- No color-only status indicators
- No placeholder-only form labels
- No layout-shifting hover transforms
- No raw hex values in components -- use tokens
- No z-index spaghetti -- use defined layers (1/10/20/50/100/1000)
