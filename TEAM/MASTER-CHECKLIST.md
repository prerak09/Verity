# Verity V1 — Master Checklist (shared source of truth)

Single tracker for **both** devs. Tags: `[BE]` = Dev A (data & logic), `[FE]` = Dev B (UI). **Whoever finishes a task ticks it here in the same PR** — so `main` always shows live progress from both at once. Detail: `DEV-A-todo.md`, `DEV-B-todo.md`. Rules: `00-work-division.md`.

Progress: **86 / 94 complete** — BE 50/50 ✅ · FE 36/44

---

## Phase 0 — Foundation & contracts (finish before deep feature work)
> A does 0.1 first → pushes `main` → both run in parallel. A ships `types/index.ts` early so B never blocks.
- [x] `[BE]` create-next-app → push `main`
- [x] `[BE]` Prisma schema (TRD §10.2) + migrate + shared dev DB
- [x] `[BE]` FTS tsvector + GIN SQL migration
- [x] `[BE]` `lib/db.ts`
- [x] `[BE]` **`types/index.ts`** — envelope + all DTOs + fn signatures (contract #1)
- [x] `[BE]` Clerk + `lib/auth.ts`
- [x] `[BE]` Clerk webhook (svix)
- [x] `[BE]` `middleware.ts` role gating + `/unauthorized`
- [x] `[BE]` `lib/rbac.ts` + `config/roles.ts` (freeze strings — contract #2)
- [x] `[BE]` `lib/logger.ts` + `lib/rate-limit.ts` + `lib/cloudinary.ts` + `lib/search.ts` skeleton
- [x] `[BE]` `prisma/seed.ts` + seed Admin
- [x] `[BE]` GitHub Actions CI + Vitest + branch protection
- [x] `[FE]` shadcn/ui init + `components/ui/*`
- [x] `[FE]` design tokens + Tailwind theme + `globals.css` (WCAG AA)
- [x] `[FE]` `components/shared/*` (Navbar, Sidebar, EmptyState, Pagination, Skeleton)
- [x] `[FE]` root layout + per-group `error.tsx` / `loading.tsx`
- [x] `[FE]` four route-group layout shells + nav
- [x] `[FE]` sign-in / sign-up (Clerk) + `/unauthorized` page
- [x] `[FE]` mock-data fixtures matching `types/index.ts`

## Phase 1 — Companies & internships
- [x] `[BE]` companies `schema.ts` (Zod, §17)
- [x] `[BE]` companies `queries.ts` (getCompanyBySlug, listCompanies, getOpenInternships) — ship early
- [x] `[BE]` register-company action (txn + role elevation)
- [x] `[BE]` company update actions (all §17, domain re-verify)
- [x] `[BE]` founders/links/locations/news/tech actions
- [x] `[BE]` domain duplicate detection
- [x] `[BE]` internships schema/queries/actions (create/publish/archive)
- [x] `[BE]` publish gate — VERIFIED only, server-side (FR-22)
- [x] `[BE]` staleness flag (45d)
- [x] `[BE]` `/api/companies` + `/api/internships` handlers
- [x] `[FE]` landing page
- [x] `[FE]` public company directory (grid+cards)
- [x] `[FE]` public company profile (§17 read-only, LCP<2s)
- [x] `[FE]` public internship list + detail (external Apply CTA)
- [x] `[FE]` card components + verified badge + chips

## Phase 2 — Student data · Search UI
- [x] `[BE]` students schema/queries/actions (+ resume placeholder)
- [x] `[BE]` bookmarks schema/queries/actions (polymorphic, unique)
- [x] `[BE]` applications schema/queries/actions (status + notes)
- [x] `[BE]` tracker privacy (excluded from company/admin)
- [x] `[BE]` `/api/bookmarks` + `/api/applications`
- [x] `[BE]` `lib/search.ts` FTS builder
- [x] `[BE]` `/api/search` + `/api/search/suggest`
- [x] `[BE]` search-query logging (FR-33)
- [x] `[FE]` global search bar + typeahead (250ms)
- [x] `[FE]` search results + filter sidebar (all facets)
- [x] `[FE]` sort controls
- [x] `[FE]` zero-result state + suggest-a-company form
- [x] `[FE]` category browse grid

## Phase 3 — Discovery/analytics data · Student portal UI
- [x] `[BE]` recommended-companies query (rules-based)
- [x] `[BE]` TrendingSnapshot + cron aggregation
- [x] `[BE]` analytics queries (aggregate/anon)
- [x] `[BE]` AnalyticsEvent + recordView() helper
- [x] `[FE]` Student Dashboard — all §15.1 modules
- [x] `[FE]` student profile settings form
- [x] `[FE]` bookmark toggle button (company + internship)
- [x] `[FE]` Bookmarks page (2 tabs)
- [x] `[FE]` Application Tracker Kanban + list toggle + notes
- [x] `[FE]` archived-internship "no longer open" state

## Phase 4 — Verification/admin data · Company portal UI
- [x] `[BE]` verification queue query + approve/request/reject + notify
- [x] `[BE]` resubmission references prior reason
- [x] `[BE]` admin company CRUD + suspend/unpublish
- [x] `[BE]` categories & technologies CRUD + merge
- [x] `[BE]` reports create/queue/resolve + audit
- [x] `[BE]` feature-management actions (windowed, server-checked)
- [x] `[BE]` admin user management actions
- [x] `[BE]` platform analytics queries
- [x] `[BE]` `/api/admin/**` handlers
- [x] `[FE]` company onboarding multi-step form
- [x] `[FE]` Company Dashboard modules
- [x] `[FE]` Company Profile Editor (autosave + last-saved)
- [x] `[FE]` logo/media upload widget
- [x] `[FE]` founders/team repeatable editors
- [x] `[FE]` Internship Manager UI
- [x] `[FE]` Team Members UI (invite/roles/revoke/transfer)
- [x] `[FE]` Company News CMS UI
- [x] `[FE]` Company Analytics UI (charts)
- [x] `[FE]` verification banner + "what to fix" checklist

## Phase 5 — Notifications/hardening · Admin portal UI & QA
- [x] `[BE]` `notify.ts` (in-app + Resend)
- [x] `[BE]` notification queries (list/unread/mark-read)
- [x] `[BE]` daily digest (bookmarked-company new internship)
- [x] `[BE]` XSS sanitize descriptions & news
- [x] `[BE]` structural ESLint rule (actions must import rbac)
- [x] `[BE]` integration tests (register→publish gated)
- [x] `[BE]` seed 100-company demo catalog (G2)
- [ ] `[FE]` Admin Dashboard modules
- [x] `[FE]` Verification Queue UI + action buttons
- [ ] `[FE]` Admin company/internship management tables
- [ ] `[FE]` categories & technologies management UI
- [x] `[FE]` reports queue UI
- [ ] `[FE]` feature management UI
- [ ] `[FE]` user management UI
- [x] `[FE]` platform analytics dashboard (KPI cards + charts)
- [ ] `[FE]` notification center UI + bell badge
- [ ] `[FE]` accessibility pass (student-facing)
- [ ] `[FE]` E2E happy-path (Playwright)

---

## Acceptance gate (PRD §25) — tick when V1 is launch-ready
- [ ] Three portals deployed, role routing enforced server-side
- [ ] Company lifecycle unassisted (signup→verify→edit→publish→invite→analytics)
- [ ] Student lifecycle unassisted (signup→profile→search→view→bookmark→track)
- [ ] Admin lifecycle unassisted (queue→decision→taxonomy→report→feature→analytics)
- [ ] All Must (M) FRs implemented & testable
- [ ] All NFRs have a documented verification method
- [ ] 100+ verified companies seeded (G2)
- [ ] Zero scraping/AI dependency — full manual walkthrough possible
