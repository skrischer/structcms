# StructCMS — Umsetzungskonzept (DX + Integration + Presets + CLI)

Stand: 2026-02-09  
Ziel: Integrationsaufwand im Host-Projekt reduzieren, ohne den framework-agnostischen Core zu verlieren.

---

## 1. Ausgangslage

### 1.1 Problem
Der aktuelle Integrations- und Dokumentationsaufwand ist hoch, weil Host-Projekte mehrere Ebenen selbst verdrahten müssen:

- Supabase Client + Adapter Instanziierung
- API-Route-Boilerplate (GET/POST/PUT/DELETE Files)
- Admin Provider + Routing + Layout
- Registry Wiring an mehreren Stellen (Admin/Validation/Rendering)

Das erschwert:
- Adoption (Time-to-first-page)
- Example/Test-App als Doku (zu viele Schritte)
- Wartbarkeit bei Breaking Changes

### 1.2 Leitprinzip
**Core bleibt framework-agnostisch (Handler + Adapter Injection).**  
**Framework-spezifische Presets werden opt-in angeboten.**  
**CLI scaffolding bootstrapped, Presets reduzieren dauerhaft Boilerplate.**

---

## 2. Zielzustand (DX-Ziele)

### 2.1 DX-Metriken (v1)
- Install + First working CMS page: **< 15 Minuten**
- Anzahl Host-Dateien bis “läuft”: **≤ 5**
- Env Vars: **≤ 3** (URL/Key + optional baseUrl)
- 0–minimal Boilerplate pro Route (Preset-Exports)

### 2.2 Integrations-Level
- **Level A (Quickstart):** Presets + minimal config
- **Level B (Advanced):** Preset Factory (hooks/injection)
- **Level C (Full Control):** Core Handler direkt nutzen

---

## 3. Scope Definition (P1 vs P2)

### 3.1 P1 (MVP-Implementierung)
**(A) Next.js Presets (App Router)**  
- `@structcms/api/next` (oder Subpath in `@structcms/api`)
- Export fertiger Next Route Handler als opt-in Convenience
- Muss Handler-Core unangetastet lassen

**(B) Supabase Adapter Factory**  
- `createSupabaseAdapters({ url, key, options? })`
- Liefert `storageAdapter`, `mediaAdapter`, optional `authAdapter`
- Zentralisiert Env/Client-Bootstrapping

**(C) Admin App Shell Export**  
- `StructCMSAdminApp` (Routing + Layout + Nav + Pages/Media/Nav Views)
- `AdminProvider` bleibt, aber host muss nicht mehr alles selbst bauen
- Dashboard Route als Default Entry (bereits als PRD spezifiziert)

**(D) Minimal Usage Doc / Example Alignment**
- `examples/test-app` als E2E + Referenz
- Dokumentation basiert auf “Quickstart (P1)” Pfad

### 3.2 P2 (verschieben)
P2 ist **explizit von diesem Dokument abgegrenzt** und wird nicht im P1-Umfang umgesetzt.

Alle P2-Themen wurden in ein separates Dokument ausgelagert:
- `STRUCTCMS_P2_THEMENKATALOG.md`

Dieses Dokument bleibt damit ein **P1-Umsetzungskonzept** mit 1.0-DX-Fokus.

---

## 4. Bausteine im Detail (P1)

### 4.1 Core bleibt unverändert
- `@structcms/api` exportiert weiterhin Handler Functions:
  - `handleListPages(adapter)`
  - `handleGetPageBySlug(adapter, slug)`
  - `handleCreatePage(adapter, data)` etc.

**Nicht anfassen:** Handler Signaturen & Adapter Interfaces (Semver Stabilität).

---

### 4.2 Next Presets (App Router)

#### 4.2.1 Ziel
Host kann Route Files auf 1 Zeile reduzieren.

#### 4.2.2 API-Optionen

**Factory Preset** (flexibler)
```ts
import { createNextPagesRoute } from '@structcms/api/next';
import { adapters } from '@/lib/structcms';

export const { GET, POST } = createNextPagesRoute(adapters);
```

#### 4.2.3 Preset-Routen
- Pages collection:
  - `GET /api/cms/pages`
  - `POST /api/cms/pages`
- Page read by slug:
  - `GET /api/cms/pages/[slug]`
- Page write/delete by id (kanonischer Write-Contract):
  - `PUT /api/cms/pages/[id]`
  - `DELETE /api/cms/pages/[id]`
- Media:
  - `GET /api/cms/media`
  - `POST /api/cms/media` (upload)
  - `DELETE /api/cms/media/[id]`
- Navigation:
  - `GET /api/cms/navigation`
  - `POST /api/cms/navigation`
  - `DELETE /api/cms/navigation/[id]`

Kanonische Router-Strategie:
- Delivery/Public Read: slug-basiert
- Admin/Write/Delete: id-basiert

#### 4.2.4 Middleware / Auth Handling
Preset liefert nur Handler.
Host kann weiterhin Next middleware nutzen:
- Route segment protection
- Auth wrapper
- Rate limiting
- caching

Preset darf keine Opinionation erzwingen, sondern nur Abkürzung bieten.

---

### 4.3 Supabase Adapter Factory

#### 4.3.1 Ziel
Host muss keinen Supabase Client und keine Adapter Klassen selbst zusammenbauen.

#### 4.3.2 API
```ts
import { createSupabaseAdapters } from '@structcms/api/supabase';

export const adapters = createSupabaseAdapters({
  url: process.env.SUPABASE_URL!,
  key: process.env.SUPABASE_SECRET_KEY!,
  storage: { bucket: process.env.SUPABASE_STORAGE_BUCKET! },
});
```

#### 4.3.3 Konventionen
- Unterstütze ENV Defaults:
  - `SUPABASE_URL`
  - `SUPABASE_SECRET_KEY`
  - `SUPABASE_STORAGE_BUCKET`

Factory darf ENV lesen, aber **muss** auch explizite Werte akzeptieren.

---

### 4.4 Admin App Shell Export

#### 4.4.1 Ziel
Host soll Admin nicht als “UI Baukasten” verdrahten müssen.

#### 4.4.2 API
```tsx
import { StructCMSAdminApp } from '@structcms/admin';

export default function AdminPage() {
  return (
    <StructCMSAdminApp
      registry={registry}
      apiBaseUrl="/api/cms"
    />
  );
}
```

#### 4.4.3 Enthaltene Routes
- Dashboard (Default)
- Pages list
- Page editor
- Media
- Navigation

---

## 5. Dokumentation / Example Strategie

### 5.1 examples/test-app Rollen
- **E2E Integration Test** (Playwright)
- **Referenzimplementierung** für Doku

### 5.2 Doku-Pfade
- **Quickstart:** Presets + factory + admin app shell

### 5.3 Keep Documentation Honest
Wenn Quickstart existiert, muss test-app ihn auch nutzen, sonst driftet es auseinander.

---

## 6. Umsetzungsschritte (Roadmap)

### 6.1 Phase — Reihenfolge (empfohlen)
1. Supabase Adapter Factory
2. Next Preset Factory (Pages + Media minimal)
3. Admin App Shell Export + Dashboard
4. test-app refactor to Quickstart integration
5. Docs update (root README + package READMEs)


---

## 7. Risiken & Guardrails

### 7.1 Risiko: “Opinionated” Presets
**Guardrail:** Presets sind opt-in; Core Handler bleiben first-class.

### 7.2 Risiko: Breaking Changes durch Adapter Interface Wachstum
**Guardrail:** Adapter Interfaces jetzt so designen, dass spätere Features (drafts/transactions/batch) ohne harte Breaks ergänzt werden können.

### 7.3 Risiko: Admin Shell zu starr
**Guardrail:** Shell muss “escape hatches” haben:
- custom sidebar items
- route override
- component injection (später P2)

---

## 8. Definition of Done

- `createSupabaseAdapters()` verfügbar und dokumentiert
- `@structcms/api/next` Preset Factory verfügbar
- `StructCMSAdminApp` mountbar als 1-Komponenten-Integration
- Dashboard vorhanden (KPI + recent pages + quick actions)
- examples/test-app nutzt den Quickstart-Pfad
- Doku beschreibt Integrationsweg (Quickstart)

---















API-Basis zuerst
Supabase Adapter Factory
@packages/api/prd.json#544-555
danach Next.js Preset Factories (App Router)
@packages/api/prd.json#556-568
Warum: test-app und Admin-Quickstart hängen von diesen APIs ab.
__________________________________________

test-app auf Quickstart umstellen (API-Seite)
Adopt Supabase Adapter Factory in test-app
@examples/test-app/prd.json#598-608
Migrate CMS API Routes to Next Preset Factories
@examples/test-app/prd.json#610-621
Warum: Damit wird die Referenz-App früh „ehrlich“ zum neuen Integrationspfad.


Admin-Shell produktisieren
StructCMSAdminApp Export
@packages/admin/prd.json#496-507
Admin Shell Navigation and Route Overrides
@packages/admin/prd.json#509-520
Warum: Erst wenn API + test-app-Basis stabil ist, lohnt sich die Shell-Finalisierung inkl. Escape-Hatches.


test-app Admin-Integration nachziehen
Mount StructCMSAdminApp as Default Admin Integration
@examples/test-app/prd.json#623-633
Warum: Validiert die 1-Komponenten-Integration direkt im E2E-Referenzprojekt.


Dokumentation zum Schluss, aber gebündelt
API-Doku: Quickstart Documentation (API)
@packages/api/prd.json#581-592

Admin-Doku: Quickstart Documentation (Admin)
@packages/admin/prd.json#522-532

test-app Doku-Alignment
@examples/test-app/prd.json#635-645
Warum: Doku erst finalisieren, wenn Implementierung wirklich steht (kein Drift).