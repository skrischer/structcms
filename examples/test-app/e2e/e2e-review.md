# E2E Test Suite Review

**Analysedatum:** 2026-02-09
**Framework:** Playwright
**Umfang:** 7 Test-Dateien, 17 Test-Cases
**Admin UI:** @structcms/admin Components

---

## Zusammenfassung

| Status | Anzahl | Details |
|---|---|---|
| 🔴 **Wird fehlschlagen** | 1 | `navigation.spec.ts` — Selektor-Bug |
| ⚠️ **Fragil** | 2 | `edit-section.spec.ts` — Mehrdeutige Selektoren |
| 🟡 **Lücken** | 5 | Ganze Komponenten-Bereiche nicht getestet |
| ✅ **Korrekt** | 4 | `dashboard.spec.ts`, `create-page.spec.ts`, etc. |

---

## 🔴 KRITISCH — Tests die fehlschlagen werden

### Problem 1: `navigation.spec.ts:14-16` — Text-Selektoren matchen Input-Values nicht

**Fehler:**
```typescript
await expect(page.locator('text=Home')).toBeVisible();
await expect(page.locator('text=About')).toBeVisible();
await expect(page.locator('text=Blog')).toBeVisible();
```

**Ursache:**
- Der `NavigationEditor` (`packages/admin/src/components/content/navigation-editor.tsx:127`) rendert Navigation-Items als **Input-Elemente:**
  ```tsx
  <input
    type="text"
    value={item.label}
    data-testid={`nav-item-label-${index}`}
  />
  ```
- Playwrights `text=` Selektor matcht **nur auf Text-Content**, nicht auf `value` Attribute
- `<input value="Home">` ist nicht sichtbar als "Home" Text

**Konsequenz:** Test findet die Elemente nicht und schlägt fehl
**Severity:** 🔴 KRITISCH

**Fix:**
```typescript
// FALSCH:
await expect(page.locator('text=Home')).toBeVisible();

// RICHTIG:
await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');
await expect(page.locator('[data-testid="nav-item-label-1"]')).toHaveValue('About');
await expect(page.locator('[data-testid="nav-item-label-2"]')).toHaveValue('Blog');
```

---

## ⚠️ WARNUNG — Fragile Selektoren

### Problem 2: `edit-section.spec.ts:12` — Mehrdeutige Input-Selektion

**Code:**
```typescript
const titleInput = page.locator('input[name="title"]').first();
```

**Situation:**
Die Seite `/admin/pages/[slug]` hat zwei Input-Felder mit "title":

1. **Page-Level Title** (`[slug]/page.tsx:93`)
   ```tsx
   <input id="title" type="text" value={title} />
   // Kein "name" Attribut!
   ```

2. **Hero Section Title** (über FormGenerator via react-hook-form)
   ```tsx
   <input name="title" />  // Vom register('title') erzeugt
   ```

**Status:** Funktioniert aktuell, weil nur das Hero-Input `name="title"` hat — aber ist fragil

**Gefahr:** Wenn künftig der Page-Level-Input auch `name="title"` bekommt, wird dieser zuerst gefunden und der Test schlägt fehl

**Severity:** ⚠️ WARNUNG

**Fix:**
```typescript
// Spezifischer: Nur im Section-Editor-Kontext suchen
const titleInput = page.locator('[data-testid="section-editor"] input[name="title"]').first();
```

---

### Problem 3: `edit-section.spec.ts:17` — Text-Selektor statt data-testid

**Code:**
```typescript
await page.click('text=Save Page');
```

**Issue:**
- Der Button hat bereits `data-testid="save-page"` (`page-editor.tsx:188`)
- `create-page.spec.ts:25` nutzt **korrekt** `[data-testid="save-page"]`
- **Inkonsistent** zwischen Tests

**Severity:** ⚠️ WARNUNG (funktioniert aber)

**Fix:**
```typescript
await page.locator('[data-testid="save-page"]').click();
```

---

### Problem 4: `navigation.spec.ts:18` — Button-Ambiguität

**Code:**
```typescript
await page.click('text=Save Navigation');
```

**Issue:**
Es gibt **zwei** "Save Navigation" Buttons:

1. **Im NavigationEditor** (`navigation-editor.tsx:234`)
   ```tsx
   <Button data-testid="nav-save">Save Navigation</Button>
   ```

2. **In der NavigationPage** selbst (`app/admin/navigation/page.tsx:81-86`)
   ```tsx
   <Button onClick={() => handleSave(navigation.items)}>
     {saving ? 'Saving...' : 'Save Navigation'}
   </Button>
   ```

Der Text-Selektor matcht beide — Playwright wählt den ersten, was hier zufällig korrekt ist.

**Severity:** ⚠️ WARNUNG (fragil bei UI-Änderungen)

**Fix:**
```typescript
// Spezifisch: Nur der Editor-Button
await page.locator('[data-testid="nav-save"]').click();
```

---

## 🟡 LÜCKENHAFTE ABDECKUNG

### Komponente: PageList (`/admin/pages`)

**Getestete User Flows:**
- ✅ Alle Seiten anzeigen
- ✅ Search/Filter nach Titel

**Nicht getestete Features:**
- ❌ Page Type Filter (`data-testid="page-type-filter"`)
  - Filter nach `landing` vs `blog` Page Type
  - Assertion: Nur matching Pages werden angezeigt

- ❌ Error State (`data-testid="error"`)
  - Wenn API fehlschlägt (zB Auth-Fehler)
  - Assertion: Error-Message wird angezeigt

- ❌ Empty State (`data-testid="empty-state"`)
  - Wenn keine Pages existieren
  - Assertion: "No pages yet" Message

**Empfohlene Tests:**
```typescript
test('should filter pages by type', async ({ page }) => {
  await page.selectOption('[data-testid="page-type-filter"]', 'landing');
  // Verify: Nur Landing Pages sichtbar (Home, About Us, Our Team, Contact)
  // Verify: Blog Page nicht sichtbar
});

test('should show empty state when no pages exist', async ({ page }) => {
  await resetOnly();  // Keine Seed
  await page.goto('/admin/pages');
  await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
});
```

---

### Komponente: PageEditor (Section Management)

**Aktuell getestet:**
- ✅ Title bearbeiten (`edit-section.spec.ts`)
- ✅ Änderungen speichern

**Nicht getestete Features:**
- ❌ Add Section (`data-testid="add-section"`)
  - Neue Section zu Seite hinzufügen
  - Assertion: Neue Section-Editor wird angezeigt

- ❌ Remove Section
  - Section löschen
  - Assertion: Zahl der Sections nimmt ab

- ❌ Move Section Up/Down
  - Section-Reihenfolge ändern
  - Assertion: Reihenfolge ändert sich in API

- ❌ Section Type auswählen
  - Bei Add Section: zwischen `hero`, `content` wählen
  - Assertion: Richtige Form für Section Type wird angezeigt

**Empfohlene Tests:**
```typescript
test('should add a new section to a page', async ({ page }) => {
  await page.goto('/admin/pages/home');

  // Hero ist bereits vorhanden, Add Content Section
  const sectionTypeSelect = page.locator('[data-testid="page-editor"] select').first();
  await sectionTypeSelect.selectOption('content');

  await page.locator('[data-testid="add-section"]').click();

  // Verify: Neue Section-Editor für Content sichtbar
  await expect(page.locator('[data-testid="section-editor"]')).toHaveCount(2);
});
```

---

### Komponente: NavigationEditor (Item Management)

**Aktuell getestet:**
- ✅ Navigation anzeigen
- ✅ Save Navigation

**Nicht getestete Features:**
- ❌ Add Navigation Item (`data-testid="nav-add-item"`)
  - Neues Top-Level Item hinzufügen
  - Assertion: Neuer Input-Row erscheint

- ❌ Remove Navigation Item (`data-testid="nav-item-remove-*"`)
  - Item löschen
  - Assertion: Row verschwindet

- ❌ Add Child Item (`data-testid="nav-add-child-*"`)
  - Nested Navigation hinzufügen
  - Assertion: Child-Input-Row unter Parent

- ❌ Edit Item Label/Href
  - Text in `nav-item-label-*` oder `nav-item-href-*` ändern
  - Assertion: Änderung wird im Save mit Assertion überprüft

**Empfohlene Tests:**
```typescript
test('should add and remove navigation items', async ({ page }) => {
  await page.goto('/admin/navigation');

  const addItemBtn = page.locator('[data-testid="nav-add-item"]');
  await addItemBtn.click();

  // Verify: Neuer Input-Row für Item (sollte Index 3 sein, nach Home/About/Blog)
  const newLabelInput = page.locator('[data-testid="nav-item-label-3"]');
  await expect(newLabelInput).toBeVisible();

  // Fill und Save
  await newLabelInput.fill('Docs');
  await page.locator('[data-testid="nav-item-href-3"]').fill('/docs');
  await page.locator('[data-testid="nav-save"]').click();

  // Verify: API hat 4 Items
  const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
  const data = await response.json();
  expect(data.items).toHaveLength(4);
});
```

---

### Komponente: MediaBrowser (`/admin/media`)

**Aktuell getestet:**
- ✅ File Upload
- ✅ Upload erscheint in API-Response

**Nicht getestete Features:**
- ❌ Media Grid Anzeige
  - Nach Upload: Bild im Grid sichtbar
  - Assertion: Thumbnail wird angezeigt

- ❌ Media Delete
  - Delete-Button klicken
  - Assertion: Medium verschwindet aus Grid und API

- ❌ Media Selection (onSelect Callback)
  - Media im Modal selektieren
  - Assertion: Callback wird aufgerufen (bei Integration mit PageEditor)

- ❌ Pagination / Load More
  - Mit vielen Media Files (>20)
  - Assertion: Load More Button funktioniert

**Empfohlene Tests:**
```typescript
test('should upload and display media in grid', async ({ page }) => {
  await page.goto('/admin/media');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(testImagePath);

  // Verify: Thumbnail im Grid sichtbar
  await expect(page.locator('img[src*="test-image"]')).toBeVisible({ timeout: 5000 });
});

test('should delete media', async ({ page }) => {
  // Setup: Upload first
  await page.goto('/admin/media');
  // ... upload code ...

  // Delete
  const deleteBtn = page.locator('button[aria-label="Delete"]').first();
  await deleteBtn.click();

  // Verify: Media ist weg
  const response = await fetch(`${BASE_URL}/api/cms/media`);
  const media = await response.json();
  expect(media.find((m: any) => m.filename.includes('test-image'))).toBeUndefined();
});
```

---

### Komponente: AdminLayout (Navigation)

**Nicht getestet:**
- ❌ Sidebar Navigation zwischen Admin-Seiten
  - Klick auf "Pages" → `/admin/pages`
  - Klick auf "Navigation" → `/admin/navigation`
  - Klick auf "Media" → `/admin/media`
  - Klick auf "Dashboard" → `/admin`

- ❌ Active Link Highlighting
  - Aktuell angeklickte Nav-Item ist highlighted
  - Assertion: `.active` oder `aria-current="page"`

**Empfohlene Tests:**
```typescript
test('should navigate via sidebar', async ({ page }) => {
  await page.goto('/admin');

  await page.locator('a:has-text("Pages")').click();
  await expect(page).toHaveURL('/admin/pages');

  await page.locator('a:has-text("Navigation")').click();
  await expect(page).toHaveURL('/admin/navigation');
});

test('should highlight active nav item', async ({ page }) => {
  await page.goto('/admin/pages');

  const pagesNavLink = page.locator('a[href="/admin/pages"]');
  await expect(pagesNavLink).toHaveAttribute('aria-current', 'page');
});
```

---

## ✅ KORREKT — Diese Tests sind gut

### Dashboard (`dashboard.spec.ts`)

**Strengths:**
- ✅ Alle `data-testid` Selektoren existieren im Code
- ✅ KPI-Werte flexibel mit `>= 5` statt hardcoded (robust gegen parallele Tests)
- ✅ Sections-Count `2` korrekt überprüft (Registry hat `hero` + `content`)
- ✅ Navigation-Flows zu `/admin/pages/new` und `/admin/media` korrekt
- ✅ Serial-Mode mit `beforeAll` für Seed — gutes Pattern
- ✅ Loading-Skeletons mit `waitUntil: 'commit'` getestet
- ✅ Recent Pages-Limit auf max 10 Items überprüft

**Coverage:** 10 Test Cases, alle bestanden

---

### Create Page (`create-page.spec.ts`)

**Strengths:**
- ✅ Input-Selektoren korrekt: `#title`, `#slug`, `#pageType` matchen die HTML `id`-Attribute
- ✅ PageType-Selektion über `<select>` mit `selectOption()`
- ✅ PageEditor wird korrekt angezeigt nach PageType-Wahl
- ✅ Save-Button hat `data-testid="save-page"` — korrekt
- ✅ API-Verification nach Create (Slug-basierter Fetch)
- ✅ Redirect zu `/admin/pages` nach Save überprüft

**Coverage:** 1 Test Case, bestanden

---

### Page List (`page-list.spec.ts`)

**Strengths:**
- ✅ `text=Home`, `text=About`, `text=Blog` funktioniert hier, weil PageList Titel als `<p>` Text rendert (nicht als Input-Value)
- ✅ Search-Selektor korrekt: `input[placeholder*="Search"]`
- ✅ Navigation nach Row-Klick zu `/admin/pages/[slug]` korrekt

**Coverage:** 3 Test Cases, bestanden

---

### Upload Media (`upload-media.spec.ts`)

**Strengths:**
- ✅ File Input Selektor korrekt: `input[type="file"]`
- ✅ Fixture-Path relativ zu `__dirname` korrekt
- ✅ `.toPass()` Retry-Pattern für async Upload-Verarbeitung robust
- ✅ API-Verification mit `.find()` auf Filename

**Coverage:** 1 Test Case, bestanden

---

## 📊 Seed Data Alignment

**Alle Assertions stimmen mit `lib/seed.ts` überein:**

| Resource | Seed-Daten | Test-Assertions |
|---|---|---|
| Pages | 5 Seiten (home, about, blog, about/team, about/contact) | ✅ `>= 5` |
| Navigation | 1 Navigation Set (main) | ✅ `>= 1` |
| Sections | 2 Types (hero, content) | ✅ `== 2` |
| Media | Keine Standard-Seeded | ✅ Tests seeded separat |

**Navigation Items (mainNavigationItems):**
```
Home → /
About → /about (+ children: Our Team, Contact)
Blog → /blog
```

Test-Assertions für `text=Home`, `text=About`, `text=Blog` sind **semantisch korrekt** — aber **Selektor-technisch falsch** (weil Input-Values, nicht Text-Content).

---

## 🔗 Next.js App Router URL Patterns — Alle korrekt

| Route | Pattern | Test | Status |
|---|---|---|---|
| Dashboard | `/admin` | Exakt | ✅ |
| Pages List | `/admin/pages` | Exakt | ✅ |
| Create Page | `/admin/pages/new` | Exakt | ✅ |
| Edit Page | `/admin/pages/[slug]` | Regex `/\/admin\/pages\/[^/]+/` | ✅ |
| Navigation | `/admin/navigation` | Exakt | ✅ |
| Media | `/admin/media` | Exakt | ✅ |

---

## 📋 Recommended Fixes (Priorität)

### P0 — KRITISCH (Sofort beheben)

- [ ] **`navigation.spec.ts:14-16`** — Selektor-Fix
  ```typescript
  // Vom:
  await expect(page.locator('text=Home')).toBeVisible();

  // Zum:
  await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');
  await expect(page.locator('[data-testid="nav-item-label-1"]')).toHaveValue('About');
  await expect(page.locator('[data-testid="nav-item-label-2"]')).toHaveValue('Blog');
  ```

### P1 — WARNUNG (Nächste Iteration)

- [ ] **`edit-section.spec.ts:12`** — Spezifischer Selektor
  ```typescript
  const titleInput = page.locator('[data-testid="section-editor"] input[name="title"]').first();
  ```

- [ ] **`edit-section.spec.ts:17`** — Konsistenz mit `create-page.spec.ts`
  ```typescript
  // Von: await page.click('text=Save Page');
  // Zu:
  await page.locator('[data-testid="save-page"]').click();
  ```

- [ ] **`navigation.spec.ts:18`** — Spezifischer Button-Selektor
  ```typescript
  // Von: await page.click('text=Save Navigation');
  // Zu:
  await page.locator('[data-testid="nav-save"]').click();
  ```

### P2 — COVERAGE (Weitere Tests hinzufügen)

- [ ] PageList: Page Type Filter Test
- [ ] PageList: Error/Empty State Tests
- [ ] PageEditor: Add/Remove/Move Section Tests
- [ ] NavigationEditor: Item Management Tests (Add/Remove/Edit)
- [ ] MediaBrowser: Grid Display & Delete Tests
- [ ] AdminLayout: Sidebar Navigation Tests

---

## 🎯 Fazit

**Status:** 71% funktionsfähig, 1 kritischer Fehler, 2 fragile Stellen, 5 Abdeckungs-Lücken

**Nächste Schritte:**
1. P0-Fix umgehend durchführen (15 Min)
2. P1-Fixes in nächster Iteration (30 Min)
3. P2-Coverage iterativ ausbauen (2-3 Stunden für alle neuen Tests)

**Test-Ausführung:**
```bash
# Aktuell:
pnpm --filter test-app test:e2e

# Nach P0-Fixes sollten alle bestehen
```
