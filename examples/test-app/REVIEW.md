# examples/test-app — Code Review

**Date:** 2026-02-07  
**Reviewer:** Cascade (AI pair programmer)  
**Scope:** Full review of test-app implementation (Setup, Lib, Route Handlers, Admin Pages, E2E Tests)  
**Updated:** 2026-02-07 (Browser-Test mit Chrome DevTools)  
**Status:** All tasks bis auf Documentation abgeschlossen

---

## Summary

Die test-app ist solide aufgebaut. Setup, Lib-Layer und Route Handlers sind sauber implementiert. Bei den Admin Pages und E2E Tests haben sich durch die Nachtschicht einige Flüchtigkeitsfehler eingeschlichen.

Nach dem Code-Review wurde die App zusätzlich im Browser mit Chrome DevTools getestet. Dabei wurden **2 weitere kritische Bugs** gefunden, die alle E2E Tests blockieren.

**Gesamt: 4 Bugs, 5 Unsauberkeiten.**

---

## Bugs

### 🔴 1. `__test__` Routes geben 404 zurück — Seed/Reset blockiert

**Files:** `app/api/cms/__test__/reset/route.ts`, `app/api/cms/__test__/seed/route.ts`

**Gefunden durch:** Browser-Test (Chrome DevTools, `fetch('/api/cms/__test__/seed', { method: 'POST' })` → 404)

Next.js App Router behandelt Ordner mit `_`-Prefix als **Private Folders**, die nicht als Routen exponiert werden. `__test__` hat einen doppelten Underscore-Prefix und wird daher vom Router komplett ignoriert.

**Impact:** Kritisch — Seed und Reset Endpoints sind nicht erreichbar. Alle E2E Tests, die `resetAndSeed()` oder `resetOnly()` aufrufen, schlagen fehl.

**Fix:** Ordner umbenennen, z.B. `app/api/cms/testing/` oder URL-Encoding nutzen: `app/api/cms/%5F%5Ftest%5F%5F/`. Empfehlung: Einfach `testing` verwenden.

### 🔴 2. Fehlende `.env.local` — API-Endpoints crashen

**File:** `lib/adapters.ts:5`

**Gefunden durch:** Browser-Test (Startseite OK, aber `/pages` zeigt "Internal Server Error")

Die test-app hat keine `.env.local`. Die Supabase-Variablen liegen in der Root-`.env`, aber Next.js lädt nur `.env`-Dateien aus dem eigenen Projektverzeichnis. Zusätzlich heißt der Key im Root `SUPABASE_SECRET_KEY`, die test-app erwartet aber `SUPABASE_SERVICE_ROLE_KEY`.

**Impact:** Kritisch — Alle API-Endpoints crashen mit `SUPABASE_URL environment variable is required`.

**Fix:** `.env.local` in `examples/test-app/` erstellen (bereits während des Tests angelegt). Variablennamen-Mapping dokumentieren. `.env.example` für die test-app anlegen.

### 🔴 3. Edit Page: Save-Button sendete initiale Sections *(teilweise gefixt)*

**File:** `app/(admin)/pages/[slug]/page.tsx`

**Status:** Der externe Save-Button mit `page.sections` wurde entfernt. Nur noch "Cancel" ist übrig. Der `PageEditor` bringt seinen eigenen korrekten Save-Button mit. **Fix verifiziert im Browser.**

### 🔴 4. Create Page: Doppelter Save-Button *(teilweise gefixt)*

**File:** `app/(admin)/pages/new/page.tsx`

**Status:** Der externe "Create Page"-Button wurde entfernt. Nur noch "Cancel" ist übrig. **Fix verifiziert im Browser.**

---

## Unsauberkeiten

### ⚠️ 3. Tailwind Styles für Admin-Komponenten fehlen *(im Browser bestätigt)*

**File:** `app/globals.css`

**Bestätigt durch:** Browser-Test (Screenshot zeigt unstyled Buttons, Inputs, Layout)

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
- `__test__/reset/route.ts` — Löscht Pages, Navigations, Media *(Code korrekt, Route nicht erreichbar — siehe Bug #1)*
- `__test__/seed/route.ts` — Ruft `runSeed()` auf *(Code korrekt, Route nicht erreichbar — siehe Bug #1)*

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

1. 🔴 **`__test__` Ordner umbenennen** → `testing/` — Seed/Reset komplett blockiert, alle E2E Tests betroffen
2. 🔴 **`.env.local` anlegen** + `.env.example` erstellen — API crasht ohne Env-Variablen
3. 🔴 **Tailwind `@source`** für Admin-Komponenten — UI ohne Styles (im Browser bestätigt)
4. ✅ ~~Doppelte Save-Buttons~~ — bereits gefixt (im Browser verifiziert)
5. ⚠️ **NavigationItem Import** korrigieren (`@structcms/core`)
6. ⚠️ **Upload-Test** `waitForTimeout` → Event-basiert
7. ⚠️ **Edit-Section-Test** Selektor robuster machen
8. ⚠️ **Tailwind v4 Cleanup** — Config + autoprefixer entfernen

---

## Browser-Test Protokoll

**Durchgeführt:** 2026-02-07, Chrome DevTools via MCP

| Test | Ergebnis | Details |
|------|----------|---------|
| Startseite `/` | ✅ | "StructCMS Test App" sichtbar |
| API `GET /api/cms/pages` | ✅ | Gibt `[]` zurück (nach .env.local Fix) |
| API `POST /api/cms/pages` | ✅ | Page erfolgreich erstellt |
| API `DELETE /api/cms/pages/home` | ✅ | Page erfolgreich gelöscht |
| API `POST /api/cms/__test__/seed` | 🔴 404 | Private Folder Convention |
| API `POST /api/cms/__test__/reset` | 🔴 404 | Private Folder Convention |
| Admin `/pages` | ✅ | PageList zeigt Pages, Filter funktioniert |
| Admin `/pages/home` (Edit) | ✅ | Sections laden korrekt, Save-Button Fix verifiziert |
| Admin `/pages/new` (Create) | ✅ | PageType-Auswahl → PageEditor erscheint |
| Admin `/navigation` | ✅ | "No navigation found" (erwartet ohne Seed) |
| Admin `/media` | ✅ | Empty State korrekt |
| Styling | 🔴 | Kein Tailwind-Styling auf Admin-Komponenten |
| Console Errors | ✅ | Keine Errors (nach .env.local Fix) |

---
