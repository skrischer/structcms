# StructCMS — P2 Themenkatalog (Post-1.0 Ausbau)

Stand: 2026-02-17  
Ziel: Bündelung aller P2-Themen als eigenständiger Ausbaukatalog nach Abschluss von P1.

Bezug: Dieses Dokument ist die ausgelagerte Fortsetzung von `STRUCTCMS_IMPLEMENTATION_CONCEPT.md`.

---

## 1. Abgrenzung zu P1

P2 umfasst ausschließlich Erweiterungen, die **nicht** für den 1.0-DX-Kern notwendig sind.

P1 bleibt fokussiert auf:
- Supabase Adapter Factory
- Next App Router Preset Factory (mindestens Pages + Media)
- Admin App Shell als 1-Komponenten-Integration
- test-app Quickstart-Ausrichtung
- Dokumentation Quickstart + Advanced

---

## 2. P2-Themen

### 2.1 CLI `structcms init` Scaffolding
- Framework detection
- Prompt/Flags für Projekt-Setup
- Erzeugung eines lauffähigen Initial-Setups auf Basis der Presets

### 2.2 Weitere Framework Presets
- Next Pages Router Preset
- Express Preset
- Hono Preset
- Fastify Preset

### 2.3 Registry Auto-Discovery / Codegen
- Auto-Erkennung (z. B. `import.meta.glob`)
- CLI-gestützter Codegen
- Ziel: weniger manuelles Registry Wiring

### 2.4 Export/Backup Convenience und Ops Extras
- Convenience-Endpunkte für Exporte
- Verbesserte Backup Tooling Pfade
- Operative Zusatzfunktionen für Migration/Restore

---

## 3. Empfohlene P2-Reihenfolge

1. CLI `structcms init` (Detection + Presets)
2. Next Pages Router Preset
3. Express/Hono/Fastify Presets
4. Registry Auto-Discovery / Codegen
5. Export/Backup Convenience erweitern

---

## 4. Eintrittskriterien für P2-Start

P2 startet erst, wenn P1 abgeschlossen und stabil ist:
- P1 Definition of Done erfüllt
- test-app nutzt den Quickstart-Pfad vollständig
- README und Package-READMEs sind auf P1 finalisiert
- Keine offenen Breaking-Change-Risiken im P1-API-Surface

---

## 5. P2 Guardrails

- Core bleibt framework-agnostisch
- Presets bleiben opt-in
- Keine erzwungene Opinionation in Host-Projekten
- Erweiterungen müssen semver-fähig auf dem P1-Fundament aufbauen
