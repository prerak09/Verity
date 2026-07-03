# Verity — Frontend / Backend Work Division & Git Workflow

**Source docs:** `01-PRD.md`, `02-TRD.md`
**Goal:** Two devs vibe-code V1 **simultaneously** with near-zero merge conflicts. The split is by **file type / layer** — one owns all data & logic (`.ts`), the other owns all UI (`.tsx`) — so they almost never touch the same file.

---

## 1. The two roles

| | **Dev A — BACKEND** (data & logic) | **Dev B — FRONTEND** (UI & presentation) |
|---|---|---|
| **Owns** | Everything that isn't a page/component | Everything the user sees |
| **File types** | `.ts` — schema, queries, actions, api, lib, middleware | `.tsx` — pages, layouts, components, styles |
| **Folders** | `prisma/**`, `lib/**`, `config/**`, `types/**`, `middleware.ts`, `features/*/{schema,queries,actions}.ts`, `app/api/**` | `components/**`, `app/globals.css`, all `app/**/layout.tsx`, all `app/**/page.tsx`, `features/*/components/**` |
| **Responsibility** | Prisma schema, migrations, seed, Clerk auth, RBAC, Zod validation, Prisma reads (`queries.ts`), Server Actions (`actions.ts`), REST route handlers, search/FTS, Cloudinary, notifications, rate-limit, logging, analytics aggregation | shadcn/ui kit, design tokens, all four portal shells + nav, every page, all client components (forms, toggles, kanban, search UI, charts), accessibility |
| **PRD FRs** | data/rules behind FR-01→72 | the screens for every FR + PRD §14–20 UI |

**Why this never conflicts:** every file Dev A creates ends in `.ts` (or lives in `prisma/`, `lib/`, `app/api/`). Every file Dev B creates ends in `.tsx` (or is `globals.css` / `components/`). A page (`page.tsx`, Dev B) *imports* a query (`queries.ts`, Dev A) — importing across files never causes a git conflict. The only shared file is `types/index.ts` (single-owner: Dev A) and `package.json` (rebase resolves).

---

## 2. Contract-first: how they stay unblocked

The one risk in an FE/BE split is Frontend waiting on Backend. We kill it with **contract-first stubs**:

**Dev A ships `types/index.ts` FIRST (Phase 0)** containing:
- every TS type/interface the UI needs (`CompanyCard`, `InternshipDetail`, `StudentProfileInput`, the result envelope `{ success, data } | { success, error }`, etc.)
- the **signatures** of every `queries.ts` and `actions.ts` function, even before their bodies exist.

**Dev B builds every screen against those types with mock data**, then swaps mock → real import the moment Dev A pushes the real function. Neither ever waits. If Dev B needs a query that doesn't exist yet, they add its signature to a shared `CONTRACTS.md` request list and keep building on mocks.

```
Phase 0: A publishes types/index.ts (all shapes + fn signatures)
              │
   ┌──────────┴───────────┐
   ▼                      ▼
A implements queries/     B builds pages/components
actions/api bodies        against types + mock data
   │                      │
   └──────► B swaps mock → real import (no blocking) ◄──────┘
```

---

## 3. The 4 frozen contracts (agree in Phase 0, don't change unilaterally)

1. **`types/index.ts`** — Dev A owns. All shared types + function signatures. Additive changes only after Phase 0; announce before editing.
2. **`config/roles.ts` permission strings** (TRD §7.3) — Dev A owns. Dev B's UI shows/hides on these exact strings.
3. **Server Action & query names/signatures** — the names Dev B imports must match what Dev A exports. Both agree the list in Phase 0.
4. **Result envelope** (TRD §9.3 / §21) — `{ success, data } | { success, error: { code, message, fieldErrors? } }`. Every form (B) and every action (A) speak this shape.

---

## 4. Git workflow (push simultaneously, read each other live)

- **`main`** protected; merge only via PR after CI green.
- **Branches:** `feat/be-<thing>` (Dev A), `feat/fe-<thing>` (Dev B). Small, one task-group each.
- **Push after every completed task** — not at end of day. Open a **Draft PR** as soon as the branch exists so the other can pull and read immediately.
- **Tick the checklist in the same commit that ships the work** → `main` always shows true, live progress from both devs at once.
- **Stay in your lane:** Dev A never edits a `.tsx` page/component; Dev B never edits `schema/queries/actions/api/lib`. Need something in the other's lane? Request it in `CONTRACTS.md` or a PR comment.
- **`git pull --rebase origin main` before every merge** — because lanes are disjoint, the only possible conflict is `types/index.ts` (A-owned) or `package.json` (rebase).

---

## 5. Definition of Done (every task)
Typecheck ▸ Lint ▸ (A: unit test for Zod/RBAC; B: renders without error) ▸ server-side RBAC on every mutation (NFR 13.4) ▸ committed with the checklist box ticked ▸ pushed ▸ PR updated.

## 6. The Master Checklist
`MASTER-CHECKLIST.md` is the shared source of truth. Every line is tagged `[BE]` or `[FE]`. **Whoever finishes a task ticks it there in the same PR.** Both `DEV-A-todo.md` (Backend) and `DEV-B-todo.md` (Frontend) feed into it.
