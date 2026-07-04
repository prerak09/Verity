# CONTRACTS.md — cross-lane requests & contract change log

Living doc. **Dev A** (backend) records anything the **Dev B** (frontend) lane must
do to make backend code work, plus any non-additive change to a frozen contract
(`types/index.ts`, `config/roles.ts` strings, action/query signatures, result
envelope). Nothing here changes without being written here first.

---

## Cross-lane requests (Dev A → Dev B)

### CR-1 — Wrap the app in `<ClerkProvider>` (needed by BE 0.7–0.9)
- **File (Dev B lane):** `app/layout.tsx`
- Import `ClerkProvider` from `@clerk/nextjs` and wrap `<body>`'s children.
- Middleware + `lib/auth.ts` are live; they need the provider mounted to resolve sessions.

### CR-2 — `/unauthorized` page
- **File (Dev B lane):** `app/unauthorized/page.tsx`
- `middleware.ts` redirects role-gated misses here (TRD §8). Render a friendly
  "wrong portal" message with links back to `/`, `/dashboard`, `/company`, `/admin`.
- Route is on the public allowlist in `middleware.ts`.

### CR-3 — Clerk sign-in / sign-up pages
- **Files (Dev B lane):** `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`
- Use Clerk `<SignIn/>` / `<SignUp/>`. Env keys documented in `.env.example`
  (`NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`, `..._SIGN_UP_URL` = `/sign-up`).

### CR-4 — Import shared types & permissions from these paths
- Types/DTOs/envelope: `import { ... } from "@/types"` (never `@prisma/client`).
- Permission strings: `import { PERMISSIONS, type Permission } from "@/config/roles"`.
- Path alias `@/*` maps to the **repo root** (no `src/` dir).

---

## Additive contract notes (new exports Dev B can use)

- **`toggleBookmark(input)`** (features/bookmarks/actions) → `Result<{ bookmarked, id }>`.
  Convenience for the bookmark button; signature type `ToggleBookmark` in `@/types`.
- **`deleteApplication(id)`** (features/applications/actions) → `Result<null>`.
  Signature type `DeleteApplication` in `@/types`.
- **`getBookmarkedIds(userId, targetType)`** → `Set<string>` for toggling UI state.

### Team Members (PRD §14.2, FR-62) — for Dev B's Phase 4.7 UI
Backend added in `features/team/` (gap surfaced by Dev B). Import:
- `listTeamMembers(companyId)` (queries) → `TeamMemberDTO[]`
- `inviteMember({ companyId, email, role? })` → `Result<{ memberId }>`
- `updateMemberRole({ companyId, memberId, role })` → `Result<{ role }>`
- `revokeMember({ companyId, memberId })` → `Result<null>`
- `transferOwnership({ companyId, toMemberId })` → `Result<null>`
Types `TeamMemberDTO`, `InviteMemberInput`, `UpdateMemberRoleInput`,
`TransferOwnershipInput` + signatures are in `@/types`. All owner-gated
(`company:team:manage`); last-owner is protected (use transferOwnership to change owner).
V1 invite = add an existing Verity user by email (no invite-token table).

## Contract change log (non-additive changes to frozen contracts)

_None yet. Any rename/removal in `types/index.ts` or `config/roles.ts` gets an
entry here (date + what changed + why) before the commit that makes it._
