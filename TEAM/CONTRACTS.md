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

## Cross-lane requests (Dev B → Dev A)

### CR-5 — `CompanyFilters` is missing two FR-31 facets
- **FR-31** lists filters: category, technology, funding stage, remote policy,
  visa sponsorship, **employee count range**, **location**. `CompanyFilters`
  in `@/types` has the first five but not the last two.
- `CompanyCard` also doesn't carry `visaSponsorship` or `employeeCountRange`
  (only `CompanyDetail` does), so even server-filtered-then-returned cards
  couldn't display those facets as result metadata today.
- **Requesting (additive, non-breaking):** `employeeCountRange?: string` and
  `location?: string` added to `CompanyFilters`; `visaSponsorship` and
  `employeeCountRange` added to `CompanyCard`.
- Until then, `(marketing)/search` (2.2) filters against the fuller
  `MOCK_COMPANY_DETAILS` records directly rather than the truncated
  `CompanyCard` shape, so the UI is fully functional against mock data — the
  gap only matters once this swaps to a real, network-paginated query.

### CR-6 — `StudentProfileDTO`/`StudentProfileInput` missing PRD §14.1 fields
- PRD §14.1 lists the student profile form as: school, **major**,
  grad year, **interests**, **notification preferences**, resume placeholder.
  `StudentProfileDTO`/`StudentProfileInput` in `@/types` only have
  `name`, `college`, `gradYear`, `resumeUrl`, `bio` — no `major`, no
  `interests` (array, presumably taxonomy-linked), no notification-prefs
  shape at all.
- **Requesting (additive):** `major?: string`, `interests?: string[]`
  (category slugs?) on both types; a `notificationPrefs` shape TBD once
  the notification system (Phase 5) settles.
- Task 3.2 builds the form against the real fields only — no invented
  inputs for data the contract can't accept yet.

## Additive contract notes (new exports Dev B can use)

- **`toggleBookmark(input)`** (features/bookmarks/actions) → `Result<{ bookmarked, id }>`.
  Convenience for the bookmark button; signature type `ToggleBookmark` in `@/types`.
- **`deleteApplication(id)`** (features/applications/actions) → `Result<null>`.
  Signature type `DeleteApplication` in `@/types`.
- **`getBookmarkedIds(userId, targetType)`** → `Set<string>` for toggling UI state.

## Contract change log (non-additive changes to frozen contracts)

_None yet. Any rename/removal in `types/index.ts` or `config/roles.ts` gets an
entry here (date + what changed + why) before the commit that makes it._
