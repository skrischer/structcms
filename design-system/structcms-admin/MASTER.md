# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** StructCMS Admin
**Generated:** 2026-03-16 11:24:31
**Category:** CMS Admin Dashboard

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#2563EB` | `--color-primary` |
| Secondary | `#F1F5F9` | `--color-secondary` |
| Background | `#F8FAFC` | `--color-background` |
| Text | `#1E293B` | `--color-text` |

**Color Notes:** Primary Blue `#2563EB` is the sole accent color. No separate CTA/accent -- all interactive highlights use the primary blue scale.

### Typography

- **UI / Body Font:** Inter
- **Code / Mono Font:** JetBrains Mono
- **Mood:** clean, professional, content-focused, productive
- **Google Fonts:** [Inter + JetBrains Mono](https://fonts.google.com/share?selection.family=Inter:wght@400;500;600;700|JetBrains+Mono:wght@400;500;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Major section separations |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Subtle lift (inputs, small cards) |
| `--shadow-sm` | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Elevated cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)` | Dialogs, command palette |
| `--shadow-ring` | `0 0 0 3px rgba(59, 130, 246, 0.15)` | Focus ring for inputs/buttons |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1D4ED8;
}

/* Secondary Button */
.btn-secondary {
  background: #FFFFFF;
  color: #334155;
  border: 1px solid #E2E8F0;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #475569;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}

/* Danger Button */
.btn-danger {
  background: #EF4444;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 150ms ease;
  cursor: pointer;
}
```

**States:**
- Hover: darken background 8%, or light bg fill for ghost/secondary
- Active/Pressed: darken 12%
- Disabled: opacity 0.5, cursor not-allowed
- Focus: 3px ring `rgba(59, 130, 246, 0.15)`

**Sizes:**
- Small: height 32px, padding 6px 12px, font 13px
- Default: height 36px, padding 8px 16px, font 14px
- Large: height 40px, padding 10px 20px, font 14px

### Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-xs);
}

.card:hover {
  box-shadow: var(--shadow-sm);
}
```

### Inputs

```css
.input {
  height: 36px;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  transition: border-color 150ms ease;
}

.input:focus {
  border-color: #3B82F6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input.error {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(15, 23, 42, 0.5);
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** CMS Admin Dashboard

**Keywords:** Content management, page editing, section-based editing, navigation management, media library, form-driven workflows, clean layout, productivity-focused

**Best For:** Headless CMS administration, content editing interfaces, structured content management

**Key Effects:** Row highlighting on hover, smooth filter animations, data loading states, toast notifications

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

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from Lucide React icon set
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
