# Verity V1 — Master Checklist (shared source of truth)

Single tracker for **both** devs. Tags: `[BE]` = Dev A (data & logic), `[FE]` = Dev B (UI). **Whoever finishes a task ticks it here in the same PR** — so `main` always shows live progress from both at once. Detail: `DEV-A-todo.md`, `DEV-B-todo.md`. Rules: `00-work-division.md`.

Progress: **6 / 84 complete** — BE 6/40 · FE 0/44

---

## Phase 0 — Foundation & contracts (finish before deep feature work)
> A does 0.1 first → pushes `main` → both run in parallel. A ships `types/index.ts` early so B never blocks.
- [x] `[BE]` create-next-app → push `main`
- [x] `[BE]` Prisma schema (TRD §10.2) + migrate + shared dev DB
- [ ] `[BE]` FTS tsvector + GIN SQL migration
- [x] `[BE]` `lib/db.ts`
- [x] `[BE]` **`types/index.ts`** — envelope + all DTOs + fn signatures (contract #1)
- [ ] `[BE]` Clerk + `lib/auth.ts`
- [ ] `[BE]` Clerk webhook (svix)
- [ ] `[BE]` `middleware.ts` role gating + `/unauthorized`
- [x] `[BE]` `lib/rbac.ts` + `config/roles.ts` (freeze strings — contract #2)
- [x] `[BE]` `lib/logger.ts` + `lib/rate-limit.ts` + `lib/cloudinary.ts` + `lib/search.ts` skeleton
- [ ] `[BE]` `prisma/seed.ts` + seed Admin
- [ ] `[BE]` GitHub Actions CI + Vitest + branch protection
- [ ] `[FE]` shadcn/ui init + `components/ui/*`
- [ ] `[FE]` design tokens + Tailwind theme + `globals.css` (WCAG AA)
- [ ] `[FE]` `components/shared/*` (Navbar, Sidebar, EmptyState, Pagination, Skeleton)
- [ ] `[FE]` root layout + per-group `error.tsx` / `loading.tsx`
- [ ] `[FE]` four route-group layout shells + nav
- [ ] `[FE]` sign-in / sign-up (Clerk) + `/unauthorized` page
- [ ] `[FE]` mock-data fixtures matching `types/index.ts`

## Phase 1 — Companies & internships
- [ ] `[BE]` companies `schema.ts` (Zod, §17)
- [ ] `[BE]` companies `queries.ts` (getCompanyBySlug, listCompanies, getOpenInternships) — ship early
- [ ] `[BE]` register-company action (txn + role elevation)
- [ ] `[BE]` company update actions (all §17, domain re-verify)
- [ ] `[BE]` founders/links/locations/news/tech actions
- [ ] `[BE]` domain duplicate detection
- [ ] `[BE]` internships schema/queries/actions (create/publish/archive)
- [ ] `[BE]` publish gate — VERIFIED only, server-side (FR-22)
- [ ] `[BE]` staleness flag (45d)
- [ ] `[BE]` `/api/companies` + `/api/internships` handlers
- [ ] `[FE]` landing page
- [ ] `[FE]` public company directory (grid+cards)
- [ ] `[FE]` public company profile (§17 read-only, LCP<2s)
- [ ] `[FE]` public internship list + detail (external Apply CTA)
- [ ] `[FE]` card components + verified badge + chips

## Phase 2 — Student data · Search UI
- [ ] `[BE]` students schema/queries/actions (+ resume placeholder)
- [ ] `[BE]` bookmarks schema/queries/actions (polymorphic, unique)
- [ ] `[BE]` applications schema/queries/actions (status + notes)
- [ ] `[BE]` tracker privacy (excluded from company/admin)
- [ ] `[BE]` `/api/bookmarks` + `/api/applications`
- [ ] `[BE]` `lib/search.ts` FTS builder
- [ ] `[BE]` `/api/search` + `/api/search/suggest`
- [ ] `[BE]` search-query logging (FR-33)
- [ ] `[FE]` global search bar + typeahead (250ms)
- [ ] `[FE]` search results + filter sidebar (all facets)
- [ ] `[FE]` sort controls
- [ ] `[FE]` zero-result state + suggest-a-company form
- [ ] `[FE]` category browse grid

## Phase 3 — Discovery/analytics data · Student portal UI
- [ ] `[BE]` recommended-companies query (rules-based)
- [ ] `[BE]` TrendingSnapshot + cron aggregation
- [ ] `[BE]` analytics queries (aggregate/anon)
- [ ] `[BE]` AnalyticsEvent + recordView() helper
- [ ] `[FE]` Student Dashboard — all §15.1 modules
- [ ] `[FE]` student profile settings form
- [ ] `[FE]` bookmark toggle button (company + internship)
- [ ] `[FE]` Bookmarks page (2 tabs)
- [ ] `[FE]` Application Tracker Kanban + list toggle + notes
- [ ] `[FE]` archived-internship "no longer open" state

## Phase 4 — Verification/admin data · Company portal UI
- [ ] `[BE]` verification queue query + approve/request/reject + notify
- [ ] `[BE]` resubmission references prior reason
- [ ] `[BE]` admin company CRUD + suspend/unpublish
- [ ] `[BE]` categories & technologies CRUD + merge
- [ ] `[BE]` reports create/queue/resolve + audit
- [ ] `[BE]` feature-management actions (windowed, server-checked)
- [ ] `[BE]` admin user management actions
- [ ] `[BE]` platform analytics queries
- [ ] `[BE]` `/api/admin/**` handlers
- [ ] `[FE]` company onboarding multi-step form
- [ ] `[FE]` Company Dashboard modules
- [ ] `[FE]` Company Profile Editor (autosave + last-saved)
- [ ] `[FE]` logo/media upload widget
- [ ] `[FE]` founders/team repeatable editors
- [ ] `[FE]` Internship Manager UI
- [ ] `[FE]` Team Members UI (invite/roles/revoke/transfer)
- [ ] `[FE]` Company News CMS UI
- [ ] `[FE]` Company Analytics UI (charts)
- [ ] `[FE]` verification banner + "what to fix" checklist

## Phase 5 — Notifications/hardening · Admin portal UI & QA
- [ ] `[BE]` `notify.ts` (in-app + Resend)
- [ ] `[BE]` notification queries (list/unread/mark-read)
- [ ] `[BE]` daily digest (bookmarked-company new internship)
- [ ] `[BE]` XSS sanitize descriptions & news
- [ ] `[BE]` structural ESLint rule (actions must import rbac)
- [ ] `[BE]` integration tests (register→publish gated)
- [ ] `[BE]` seed 100-company demo catalog (G2)
- [ ] `[FE]` Admin Dashboard modules
- [ ] `[FE]` Verification Queue UI + action buttons
- [ ] `[FE]` Admin company/internship management tables
- [ ] `[FE]` categories & technologies management UI
- [ ] `[FE]` reports queue UI
- [ ] `[FE]` feature management UI
- [ ] `[FE]` user management UI
- [ ] `[FE]` platform analytics dashboard (KPI cards + charts)
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
