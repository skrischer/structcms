# examples/test-app — Code Review

**Date:** 2026-02-07  
**Reviewer:** Cascade (AI pair programmer)  
**Scope:** Full review of test-app implementation (Setup, Lib, Route Handlers, Admin Pages, E2E Tests)  
**Status:** All tasks bis auf Documentation abgeschlossen

---

## Summary

Die test-app ist solide aufgebaut. Setup, Lib-Layer und Route Handlers sind sauber implementiert. Bei den Admin Pages und E2E Tests haben sich durch die Nachtschicht einige Flüchtigkeitsfehler eingeschlichen — **2 Bugs** und **5 Unsauberkeiten**.

---

## Bugs

### 🔴 1. Edit Page: Save-Button sendet immer initiale Sections

**File:** `app/(admin)/pages/[slug]/page.tsx:128`

```typescript
onClick={() => handleSave(page.sections)}
```

Der externe "Save Page"-Button ruft `handleSave(page.sections)` auf — das sind die **beim Laden geladenen** Sections. Wenn der User über den `PageEditor` Sections bearbeitet, verwaltet dieser seinen eigenen internen State (Stale-State-Pattern). Der externe Button hat keinen Zugriff auf die bearbeiteten Daten.

Zusätzlich rendert der `PageEditor` selbst einen "Save Page"-Button, der korrekt funktioniert. Es gibt also **zwei Save-Buttons** — einer korrekt (intern), einer fehlerhaft (extern, sendet stale data).

**Impact:** Datenverlust — User-Änderungen an Sections gehen verloren wenn der externe Button genutzt wird.

**Fix:** Den externen Save-Button und die zugehörige Button-Leiste (Zeile 120-133) entfernen. Der `PageEditor` bringt seinen eigenen Save-Button mit.

### 🔴 2. Create Page: Gleicher doppelter Save-Button

**File:** `app/(admin)/pages/new/page.tsx:112`

```typescript
onClick={() => handleSave(sections)}
```

Gleiches Problem: `sections` ist der lokale State, der beim Initialisieren leer ist und nie aktualisiert wird wenn der User im `PageEditor` Sections hinzufügt oder bearbeitet. Der `PageEditor` verwaltet seinen eigenen internen State.

**Impact:** Erstellt immer eine Page ohne Sections, unabhängig davon was der User im Editor eingegeben hat.

**Fix:** Den externen Save-Button und die Button-Leiste (Zeile 104-117) entfernen. Der `PageEditor` bringt seinen eigenen Save-Button mit.

---

## Unsauberkeiten

### ⚠️ 3. Tailwind Styles für Admin-Komponenten fehlen

**File:** `app/globals.css`

Die `@structcms/admin`-Komponenten nutzen Tailwind-Klassen (`bg-muted`, `text-destructive`, `border-input`, etc.). Tailwind v4 mit `@tailwindcss/postcss` scannt automatisch lokale Dateien, aber **nicht** `node_modules`. Die Admin-Komponenten werden ohne Styles gerendert.

**Fix:** `@source` Directive in `globals.css` hinzufügen:

```css
@import "tailwindcss";
@source "../../node_modules/@structcms/admin/dist/**/*.js";
```

### ⚠️ 4. Navigation Page: Import aus falschem Package

**File:** `app/(admin)/navigation/page.tsx:5`

```typescript
import type { NavigationItem } from '@structcms/api';
```

Die `NavigationEditor`-Komponente erwartet `NavigationItem` aus `@structcms/core`. Beide Typen sind strukturell identisch (`label`, `href`, `children?`), daher kein Runtime-Bug. Aber es ist eine unnötige Cross-Package-Dependency und inkonsistent mit dem Rest der Codebase.

**Fix:** Import ändern zu `import type { NavigationItem } from '@structcms/core';`

### ⚠️ 5. Upload Media E2E: `waitForTimeout` statt Event-basiertem Warten

**File:** `e2e/upload-media.spec.ts:19`

```typescript
await page.waitForTimeout(2000);
```

Hardcoded 2s Timeout ist ein Anti-Pattern in Playwright. Kann zu Flaky Tests führen (zu langsam auf CI, zu schnell bei großen Dateien).

**Fix:** Event-basiert warten:

```typescript
await expect(page.locator('[data-testid="media-grid"]')).toBeVisible();
```

### ⚠️ 6. Edit Section E2E: Fragiler Selektor

**File:** `e2e/edit-section.spec.ts:12-14`

```typescript
await page.waitForSelector('input[value="Welcome to StructCMS"]');
await page.fill('input[value="Welcome to StructCMS"]', 'Updated Hero Title');
```

Selektor basiert auf dem Feldwert statt auf einem stabilen Identifier. Funktioniert, ist aber fragil — bricht wenn sich der Seed-Text ändert.

**Fix:** `data-testid`-Selektor verwenden, z.B. über den Feldnamen des FormGenerators.

### ⚠️ 7. Tailwind v4 Konfigurationsreste

**Files:** `tailwind.config.ts`, `package.json:27`

- `tailwind.config.ts` mit `content`-Array ist ein v3-Pattern. Tailwind v4 mit `@tailwindcss/postcss` nutzt automatische Content-Detection. Die Config wird ignoriert — toter Code.
- `autoprefixer` in devDependencies ist überflüssig — Tailwind v4 bringt Autoprefixing mit. Wird in `postcss.config.mjs` auch nicht referenziert.

**Fix:** `tailwind.config.ts` entfernen, `autoprefixer` aus devDependencies entfernen.

---

## Korrekt umgesetzt ✅

### Setup & Config
- `package.json` — Workspace-Referenzen, `private: true`, Scripts
- `tsconfig.json` — Extends base, `@/*` Path-Alias, Next.js Plugin
- `next.config.ts` — `transpilePackages` für alle `@structcms/*` Packages
- `postcss.config.mjs` — Tailwind v4 via `@tailwindcss/postcss`

### Lib
- `lib/adapters.ts` — Env-Validation, korrekte Adapter-Erstellung
- `lib/registry.ts` — HeroSection, ContentSection, LandingPage, BlogPage
- `lib/seed.ts` — 3 Pages, 1 Navigation mit Children, korrekte Typen
- `lib/seed-runner.ts` — Error-Handling pro Item, `SeedResult` Interface

### Route Handlers
- `pages/route.ts` — GET/POST korrekt
- `pages/[slug]/route.ts` — GET/PUT/DELETE mit Slug-Lookup, Next.js 15 `params` als Promise
- `navigation/[name]/route.ts` — GET/PUT korrekt
- `media/route.ts` — GET/POST mit FormData-Handling
- `media/[id]/route.ts` — DELETE korrekt
- `__test__/reset/route.ts` — Löscht Pages, Navigations, Media
- `__test__/seed/route.ts` — Ruft `runSeed()` auf

### Admin Pages
- `(admin)/layout.tsx` — `AdminProvider` + `AdminLayout` mit `useRouter`
- `(admin)/pages/page.tsx` — `PageList` mit korrekten Callbacks
- `(admin)/media/page.tsx` — `MediaBrowser` minimal und korrekt

### E2E
- `playwright.config.ts` — `webServer`, `reuseExistingServer`, Chromium-only
- `e2e/helpers.ts` — `resetOnly()`, `seedOnly()`, `resetAndSeed()` mit Error-Handling
- `e2e/page-list.spec.ts` — Seed → Verify → Search → Row-Click
- `e2e/navigation.spec.ts` — Seed → Verify Items → Save → API-Verify
- `e2e/create-page.spec.ts` — Reset → Create → Verify in List + API

---

## Recommendations (Priorität)

1. 🔴 **Doppelte Save-Buttons entfernen** in Create/Edit Page — Datenverlust
2. 🔴 **Tailwind `@source`** für Admin-Komponenten — UI ohne Styles
3. ⚠️ **NavigationItem Import** korrigieren (`@structcms/core`)
4. ⚠️ **Upload-Test** `waitForTimeout` → Event-basiert
5. ⚠️ **Edit-Section-Test** Selektor robuster machen
6. ⚠️ **Tailwind v4 Cleanup** — Config + autoprefixer entfernen

---
