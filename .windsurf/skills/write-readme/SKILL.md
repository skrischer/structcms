---
name: write-readme
description: Write or update a README.md file following project conventions. Use when creating, updating, or reviewing any README in the StructCMS monorepo.
---

# README Style Guide

## Principle

READMEs describe **architecture, purpose, and how to use** a package or app. They do **not** duplicate source code. Code changes should never require a README update unless the architecture itself changes.

## Rules

### No Code Duplication

- **Never** copy full file contents into a README
- Reference source files instead: *"See `lib/adapters.ts` for the adapter configuration."*
- Exception: Short setup snippets (`.env` examples, CLI commands) that don't exist elsewhere

### What Belongs in a README

- **Description & Purpose** — What is this package/app and why does it exist?
- **Architecture Overview** — High-level diagram or bullet points (changes rarely)
- **File Structure** — Tree view with one-line comments per file (update when files are added/removed)
- **Setup Instructions** — Concrete steps to get running (`cp .env.example`, `pnpm install`, `pnpm dev`)
- **Environment Variables** — Required env vars with placeholder values
- **Key Concepts** — Short prose explaining patterns and design decisions, with file references
- **Test Overview** — One line per test file describing what it covers

### What Does NOT Belong in a README

- Full function implementations (they live in source files)
- Complete type definitions (they live in source files)
- Seed data contents (reference the seed file instead)
- Detailed test step-by-step specifications (they live in the spec files)
- Dependency version lists (they live in `package.json`)

### File Structure Section

- Must reflect the **actual** file system (keep in sync when adding/removing files)
- Use tree format with inline `#` comments
- Include all non-trivial files; skip generated files (`.next/`, `node_modules/`, `*.tsbuildinfo`)

### Referencing Code

When explaining a concept, use this pattern:

```
Section definitions are created using `defineSection` from `@structcms/core`
and registered via `createRegistry`. See `lib/registry.ts` for the full setup.
```

Do **not** paste the contents of the referenced file into the README.

### Language

- README content is written in **English**
- Keep sections concise — prefer short paragraphs and bullet points over long prose

## Steps

1. Read the existing README (if any) and the actual source files in the target directory
2. Verify the file structure section matches the real file system
3. Remove any code blocks that duplicate source files — replace with file references
4. Ensure all required sections are present (Description, File Structure, Setup, Key Concepts)
5. Verify all referenced files actually exist
