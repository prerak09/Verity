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

### CR-7 — No `removeCompanyLink`/`removeCompanyLocation` actions
- `features/companies/actions.ts` has `addCompanyLink`/`addCompanyLocation`
  but no corresponding remove — only `addFounder`/`removeFounder` has both.
- 4.3's Profile Editor can add links/locations but can't offer a remove
  button for either, since no action exists to call. Not a blocker (adding
  wrong data is rare and support/Admin can fix it), but worth the same
  add/remove symmetry founders already has.
- **Requesting (additive):** `removeCompanyLink(companyId, linkId)` and
  `removeCompanyLocation(companyId, locationId)`, same
  `Promise<Result<null>>` shape as `removeFounder`.

### CR-8 — `createSignedUpload` has no Server Action wrapper
- `lib/cloudinary.ts` exports `createSignedUpload(folder)`, but it's a plain
  function in a non-`"use server"` file — nothing calls it, and there's no
  way for client code to request a signature. Confirmed via grep: zero
  callers anywhere in `features/**` or `app/**`.
- 4.4's upload widget needs a client-callable action returning `SignedUpload`
  (timestamp/signature/apiKey/cloudName/folder/allowedFormats) so the
  browser can POST directly to Cloudinary per the file's own doc comment
  ("client never receives the API secret... requests a signature from a
  server action/route").
- **Requesting (additive):** something like
  `getSignedUpload(folder: UploadFolder): Promise<Result<SignedUpload>>`
  in `features/companies/actions.ts` (or a shared `features/uploads/`
  module if other upload folders — resumes — need it too).
- Until then, 4.4 mocks only the signing+upload round-trip (a local
  simulated delay returning a fake URL) — everything downstream of that,
  i.e. actually persisting the resulting `logoUrl`/`bannerUrl` via
  `updateCompany`, uses the real action.

### CR-9 — `CompanyNews` has no `body` column and no remove action
- PRD §14.2 describes the Company News Manager as posting "title, **body**,
  optional link", but `prisma/schema.prisma`'s `CompanyNews` model only has
  `title` / `url` / `publishedAt` — no body/description column at all, and
  `companyNewsSchema`/`CompanyNewsInput`/`CompanyNewsDTO` in `@/types` match
  that (no `body` field anywhere in the contract). This is a real gap, not
  just a label mismatch — same category as CR-6, but confirmed missing at
  the DB layer too, so it needs a migration, not just an additive type.
- Also no `removeCompanyNews(companyId, newsId)` — same asymmetry as CR-7.
- **Requesting:** add `body: String` (or similar) to the `CompanyNews`
  model + migration, thread through `companyNewsSchema`/`CompanyNewsInput`/
  `CompanyNewsDTO` (additive), and add `removeCompanyNews` matching
  `removeFounder`'s shape.
- 4.8's Company News Manager posts title + optional link + published date
  only (no body field, no remove button) — same "build against what the
  contract actually has" approach as CR-6/CR-7.

### CR-10 — `CompanyAnalytics` has no real time-series field
- PRD §14.2/§19 describes the Company Analytics UI as showing "profile
  views **over time**," but `CompanyAnalytics` in `@/types` only has
  cumulative snapshots — `profileViews: { total, last30d, last90d }` and
  `bookmarkCount: { total, last30d }` — no `{ date, count }[]` series to
  actually plot a trend line from.
- **Requesting (additive):** something like
  `profileViewsTrend: { date: string; views: number }[]` (daily or weekly
  buckets) so a real line chart is possible.
- 4.9's Analytics page renders the two windows it does have (last 30 days
  vs. the 60 days before that) as a bar comparison rather than fabricating
  daily points, plus a real bar chart of `perInternshipViews` (which is
  already a proper per-item breakdown, no gap there).

### CR-11 — `CompanyDetail` doesn't expose `rejectionReason`
- `Company.rejectionReason` exists in the DB and is already threaded into
  the Admin-facing verification queue DTO (`features/verification/queries.ts`
  → `priorRejectionReason`), but `CompanyDetail` in `@/types` (the
  company-facing contract) has no equivalent field. The PRD's "what to fix"
  checklist (§14.2) calls for showing the Admin's reason text on the
  company side, which is currently unreachable from `CompanyDetail`.
- **Requesting (additive):** `rejectionReason: string | null` on
  `CompanyDetail`, threaded through `getCompanyBySlug`/whatever query backs
  the company portal's own-profile read.
- 4.10's Verification Status page computes its "what to fix" checklist
  client-side from `REQUIRED_FOR_VERIFICATION` + the `CompanyDetail` fields
  already available (mirrors `getProfileCompleteness`'s logic exactly, no
  DB call needed), but falls back to a generic message instead of the real
  Admin reason text until this ships.

### CR-12 — `PlatformAnalytics` has no time-series field, and two stats are permanent V1 stubs
- Same class of gap as CR-10, but for the Admin-facing DTO: `PlatformAnalytics`
  is a point-in-time snapshot (`Promise.all` of aggregate/groupBy queries),
  no `{ date, count }[]` series exists for any metric, so "trend charts"
  (PRD §15.3/§19) render as current-state bar breakdowns instead.
- Separately (not really a gap, just calling it out): `queueThroughput.
  avgTimeToDecisionHours` and `reportVolume.avgResolutionHours` are
  hardcoded `0` in `getPlatformAnalytics()` per its own code comment — V1
  doesn't store decision timestamps, so these are permanent stubs, not
  loading/mock artifacts. `MOCK_PLATFORM_ANALYTICS` shows realistic non-zero
  numbers (19.5h / 30.2h) for demo purposes, which will visually regress to
  "Not tracked in V1" the moment this swaps to the real query — expected,
  not a regression, but flagging so it isn't mistaken for one.
- **Requesting (additive, optional):** a real time-series field per metric
  if trend charts become a priority; decision-timestamp tracking if avg
  time-to-decision/resolution should ever be real numbers.
- 5.8's Platform Analytics page renders `companyCounts`/`internshipCounts`
  as status-colored bars (verified=success, pending=warning, rejected=
  error, matching the existing design-token status colors), `topSearchTerms`
  as a magnitude bar list, and the two stub fields as "Not tracked in V1"
  rather than a misleading "0h avg".

### CR-13 — No list query for Categories/Technologies, and `renameTechnology` is missing
- `features/admin/taxonomy.ts` has `createCategory`/`renameCategory`/
  `mergeCategories` and `createTechnology`/`mergeTechnologies`, but no
  `listCategories()`/`listTechnologies()` anywhere in the repo — confirmed
  via grep for `category.findMany`/`technology.findMany` (zero results
  outside this file's own merge logic). The admin CRUD page has no real way
  to load the existing taxonomy to manage.
- Also asymmetric: `renameCategory(id, name)` exists but there's no
  `renameTechnology(id, name)` — Technologies can only be created or merged,
  never renamed.
- Neither `TaxonomyRef` nor any other DTO carries a company-usage count
  (e.g. "Fintech — 14 companies"), which would make the merge picker much
  safer to use blind.
- **Requesting (additive):** `listCategories(): Promise<TaxonomyRef[]>` /
  `listTechnologies(): Promise<TaxonomyRef[]>` (ideally
  `{ ...TaxonomyRef, companyCount: number }` for the merge UX), and
  `renameTechnology(id, name)` matching `renameCategory`'s shape.
- 5.4's Taxonomy Manager lists `MOCK_CATEGORIES`/`MOCK_TECHNOLOGIES`,
  wires create/rename/merge to the real actions, and omits the rename
  control entirely for Technologies (no action to call yet) rather than
  faking one.

### CR-14 — No admin company list query, and `suspendedAt` isn't on any DTO
- `features/admin/companies.ts` has `adminCreateCompany`/`suspendCompany`/
  `reinstateCompany`/`adminUnpublishInternship`, but no list/read query for
  admin use. The public `listCompanies` (`features/companies/queries.ts`)
  is hard-scoped to `verificationStatus: "VERIFIED"`, so it can never
  surface PENDING/UNVERIFIED/REJECTED or suspended companies for moderation.
- `Company.suspendedAt` exists in Prisma but isn't exposed on `CompanyDetail`,
  `CompanyCard`, or anywhere else — there's no typed way to know a company
  is suspended from the client side today.
- Same gap for `Company.featuredUntil` (used by 5.6's Featured page) — the
  column exists but isn't on any DTO either, so "featured until" expiry is
  also local-only state (a synthetic date for already-featured mock rows,
  the real value from `featureCompany`'s `Result` once freshly featured).
- **Requesting (additive):** an admin-facing query (e.g.
  `getAdminCompanies(): Promise<AdminCompanyDTO[]>`) returning all
  companies regardless of status, including `suspendedAt` and
  `featuredUntil`.
- 5.3's Companies/Internships page lists every `MOCK_COMPANY_DETAILS`
  entry (already includes non-VERIFIED rows) and tracks "suspended" as
  local-only UI state (a `Set<companyId>` toggled optimistically on
  success) rather than inventing a field on the shared `CompanyDetail`
  type. Wired to the real `adminCreateCompany`/`suspendCompany`/
  `reinstateCompany`/`adminUnpublishInternship` actions. 5.6's Featured
  page does the same for `isFeatured`/`featuredUntil`, wired to
  `featureCompany`/`unfeatureCompany`.

### CR-15 — No admin user list query, no `AdminUserDTO`, and no mock at all
- `features/admin/users.ts` has `changeUserRole`/`disableUser`/
  `reinstateUser`, but there is no list-users query anywhere in the repo
  (confirmed via grep) and no admin-facing user DTO in `@/types` — unlike
  every other admin area, there wasn't even an existing mock fixture to
  build against. This is the largest gap of the 8 admin pages.
- **Requesting (additive):** `listUsers(filters?): Promise<AdminUserDTO[]>`
  (or paginated) returning `{ id, name, email, role, createdAt, disabledAt,
  companyMemberships? }`.
- 5.7's User Management page defines a local `AdminUserRow` type and
  `MOCK_ADMIN_USERS` fixture in `features/admin/mock-users.ts` (kept out of
  `components/lib/mocks/` since it doesn't match a real shared contract),
  wired to the real `changeUserRole`/`disableUser`/`reinstateUser` actions.
  Swap to `listUsers()` + `AdminUserDTO` the moment they ship.

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
