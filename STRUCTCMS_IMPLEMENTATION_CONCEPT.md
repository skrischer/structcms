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
**(E) CLI `structcms init` Scaffolding**  
- Framework detection + prompt/flags
- Vorteilhaft, aber nicht notwendig, wenn Presets+Factories existieren

**(F) Weitere Framework Presets**
- Next Pages Router
- Express/Hono/Fastify

**(G) Registry Auto-Discovery / Codegen**
- `import.meta.glob` / CLI codegen
- Nice-to-have, aber zusätzliche Komplexität

**(H) “Export/Backup” Convenience / Ops Extras**
- Export endpoints, backup tooling

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
**Option 1: Statische Preset-Exports** (max DX, weniger flexibel)
```ts
// app/api/cms/pages/route.ts
export { GET, POST } from '@structcms/api/next/pages';
```

**Option 2: Factory Preset** (flexibler)
```ts
import { createNextPagesRoute } from '@structcms/api/next';
import { adapters } from '@/lib/structcms';

export const { GET, POST } = createNextPagesRoute(adapters);
```

**Empfehlung P1:** Option 2 als Basis; Option 1 ggf. nur, wenn Konfiguration komplett über ENV/Convention lösbar ist.

#### 4.2.3 Preset-Routen (P1)
- Pages collection:
  - `GET /api/cms/pages`
  - `POST /api/cms/pages`
- Page by slug:
  - `GET /api/cms/pages/[slug]`
  - `PUT /api/cms/pages/[slug]` (oder id-basiert, je nach API)
  - `DELETE ...` (optional P1, falls Admin schon delete braucht)
- Media:
  - `GET /api/cms/media`
  - `POST /api/cms/media` (upload)
  - `DELETE /api/cms/media/[id]` (optional P1)
- Navigation:
  - optional P1 nur wenn UI es already uses; sonst P2

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
  key: process.env.SUPABASE_SERVICE_ROLE_KEY!, // oder anon + RLS
  storage: { bucket: 'cms' },
});
```

#### 4.3.3 Konventionen (P1)
- Unterstütze ENV Defaults:
  - `STRUCTCMS_SUPABASE_URL`
  - `STRUCTCMS_SUPABASE_KEY`
  - optional `STRUCTCMS_STORAGE_BUCKET`

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

#### 4.4.3 Enthaltene Routes (P1)
- Dashboard (Default)
- Pages list
- Page editor
- Media
- Navigation (nur falls wirklich genutzt; sonst P2)

#### 4.4.4 Dashboard
Siehe PRD: KPI cards + recent pages + quick actions. (Minimal)

---

## 5. Dokumentation / Example Strategie

### 5.1 examples/test-app Rollen
- **E2E Integration Test** (Playwright)
- **Referenzimplementierung** für Doku

### 5.2 Doku-Pfade
- **Quickstart (P1):** Presets + factory + admin app shell
- **Advanced:** Handler direct wiring (für enterprise/edge/custom)

### 5.3 Keep Documentation Honest
Wenn Quickstart existiert, muss test-app ihn auch nutzen, sonst driftet es auseinander.

---

## 6. Umsetzungsschritte (Roadmap)

### 6.1 Phase P1 — Reihenfolge (empfohlen)
1. Supabase Adapter Factory
2. Next Preset Factory (Pages + Media minimal)
3. Admin App Shell Export + Dashboard
4. test-app refactor to Quickstart integration
5. Docs update (root README + package READMEs)

### 6.2 Phase P2
6. CLI `structcms init` (detection + presets)
7. Next Pages Router preset
8. Express/Hono presets
9. Registry auto-discovery / codegen

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

## 8. Definition of Done (P1)

- `createSupabaseAdapters()` verfügbar und dokumentiert
- `@structcms/api/next` Preset Factory verfügbar (Pages + Media)
- `StructCMSAdminApp` mountbar als 1-Komponenten-Integration
- Dashboard vorhanden (KPI + recent pages + quick actions)
- examples/test-app nutzt den Quickstart-Pfad
- Doku beschreibt beide Integrationswege (Quickstart + Advanced)

---
