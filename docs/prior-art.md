# Prior Art

> Descriptive, living document. Indexed BY CONCERN, not by project.

## Code-first content modeling
### payloadcms/payload
- Path: packages/payload/src/collections
- License: MIT
- Verdict: reference-only — config-as-code modeling is close to our goal, but coupled to its own server/runtime; we stay framework-agnostic via adapters.
- Date: 2026-06-15

### keystonejs/keystone
- Path: packages/core/src/lib/schema
- License: MIT
- Verdict: reference-only — schema-defined lists + access control; GraphQL-first, which we explicitly exclude.
- Date: 2026-06-15

## Dynamic forms from schema
### react-hook-form/react-hook-form + @hookform/resolvers (zod)
- Path: resolvers/zod
- License: MIT
- Verdict: reuse — already our admin form engine; zod schema drives validation + form state.
- Date: 2026-06-15

## Git/embedded CMS positioning
### tinacms/tinacms
- Path: packages/tinacms
- License: Apache-2.0
- Verdict: reference-only — validates the "CMS lives in the repo" thesis; we persist to Postgres, not git.
- Date: 2026-06-15
