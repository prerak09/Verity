# Dev A — BACKEND (data & logic)

**Owns:** `prisma/**`, `lib/**`, `config/**`, `types/**`, `middleware.ts`, every `features/*/schema.ts` + `queries.ts` + `actions.ts`, all `app/api/**`.
**Never touch:** `.tsx` pages/components, `globals.css`, `components/**`. That's Dev B.
**Contract-first rule:** publish `types/index.ts` (all shapes + function signatures) in Phase 0 so Dev B is never blocked.
Branch prefix: `feat/be-…`. After each task: **tick this file + `MASTER-CHECKLIST.md`, commit, push, update PR.**

---

## Phase 0 — Foundation & contracts (do first; unblocks everyone)
- [x] 0.1 `create-next-app` (TS, App Router, Tailwind, ESLint) → push `main` immediately (unblocks Dev B)
- [x] 0.2 Prisma install + full `schema.prisma` (all models + enums, TRD §10.2)
- [x] 0.3 Initial migrate + provision shared dev Postgres (Neon/Supabase); share `DATABASE_URL`
- [x] 0.4 Raw SQL migration: `tsvector` generated columns + GIN indexes (TRD §10.4)
- [x] 0.5 `lib/db.ts` Prisma singleton
- [x] 0.6 **`types/index.ts`** — result envelope, `AppError` subclasses, **all shared DTOs + every query/action signature** (contract #1 — ship early)
- [x] 0.7 Clerk install + `lib/auth.ts` (`getCurrentUser`)
- [x] 0.8 `/api/webhooks/clerk` — svix-verified user upsert, default STUDENT (TRD §6)
- [x] 0.9 `middleware.ts` — session verify + route-group role gating + `/unauthorized` (TRD §8)
- [x] 0.10 `lib/rbac.ts` + `config/roles.ts` permission matrix — **freeze strings** (contract #2)
- [x] 0.11 `lib/logger.ts`, `lib/rate-limit.ts`, `lib/cloudinary.ts` (signed upload), `lib/search.ts` (skeleton)
- [x] 0.12 `prisma/seed.ts` orchestrator + seed 1 Admin (FR-05)
- [x] 0.13 GitHub Actions CI (lint/typecheck/unit/build) + Vitest config; branch protection

## Phase 1 — Companies & Internships data
- [x] 1.1 `features/companies/schema.ts` — Zod, required fields (PRD §17)
- [x] 1.2 `features/companies/queries.ts` — `getCompanyBySlug`, `listCompanies(filters)`, `getOpenInternships` (ship early for Dev B)
- [x] 1.3 `features/companies/actions.ts` — register (Company+CompanyMember(OWNER)+role elevation, 1 txn) (FR-10)
- [x] 1.4 Company profile update actions — all §17 modules; domain-change → re-verify (FR-11/13)
- [x] 1.5 Founders/links/locations/news/tech-stack/funding actions (FR-11)
- [x] 1.6 Domain duplicate detection at submit (FR-15)
- [x] 1.7 `features/internships/{schema,queries,actions}.ts` — create(DRAFT)/update/publish/archive (FR-20/21/23)
- [x] 1.8 Publish gate: only VERIFIED company → PUBLISHED, **server-side** (FR-22, NFR 13.4)
- [x] 1.9 Staleness flag logic: Open + untouched 45d (FR-24)
- [x] 1.10 `app/api/companies` + `app/api/internships` route handlers (paginated, envelope) (TRD §9)

## Phase 2 — Student, bookmarks, applications data
- [x] 2.1 `features/students/{schema,queries,actions}.ts` — profile + resume-url placeholder (PRD §14.1, §21)
- [x] 2.2 `features/bookmarks/{schema,queries,actions}.ts` — polymorphic, unique constraint (FR-40/41, TRD §10.3)
- [x] 2.3 `features/applications/{schema,queries,actions}.ts` — tracker status + private notes (FR-42/43)
- [x] 2.4 Tracker privacy: never exposed to company/admin (FR-44, NFR 13.6)
- [x] 2.5 `app/api/bookmarks` + `app/api/applications` route handlers

## Phase 3 — Search, discovery & analytics data
- [ ] 3.1 `lib/search.ts` — Postgres FTS, `websearch_to_tsquery`, weighted rank (TRD §12)
- [ ] 3.2 `app/api/search` + `/api/search/suggest` typeahead (≤8) (PRD §16)
- [ ] 3.3 Search-query logging for admin analytics (FR-33)
- [ ] 3.4 Recommended-companies query — rules-based (interest/major ↔ category/tech) (PRD §14.1)
- [ ] 3.5 `TrendingSnapshot` model + Vercel Cron aggregation (TRD §13)
- [ ] 3.6 `features/analytics/queries.ts` — aggregate/anon company views & bookmarks (FR-70/71, NFR 13.6)
- [ ] 3.7 `AnalyticsEvent` model + `recordView()` write helper (PRD §19.3)

## Phase 4 — Verification, admin & platform-analytics data
- [ ] 4.1 `features/verification` — queue query + approve/request-changes/reject actions → `notify()` (FR-50/51/60)
- [ ] 4.2 Resubmission cycle references prior rejection reason (PRD §23)
- [ ] 4.3 Admin company CRUD + suspend/unpublish (seed path) (FR-14)
- [ ] 4.4 Categories & Technologies CRUD + merge/rename (FR-54)
- [ ] 4.5 Reports create + queue + resolve (dismiss/warn/suspend/remove) + audit (FR-52/53)
- [ ] 4.6 Feature Management actions — windowed, server-checked expiry (FR-55, PRD §23)
- [ ] 4.7 Admin user management actions — disable/reinstate/role change (FR-05, A5)
- [ ] 4.8 Platform analytics queries — counts by status, queue throughput, top terms (FR-72, §19.2)
- [ ] 4.9 `app/api/admin/**` route handlers

## Phase 5 — Notifications & hardening
- [ ] 5.1 `features/notifications/notify.ts` — in-app row + Resend email for email-worthy events (TRD §25, FR-60/63)
- [ ] 5.2 Notification queries (list, unread, mark-read) for Dev B's UI
- [ ] 5.3 Daily digest job: bookmarked-company new internship (FR-61)
- [ ] 5.4 XSS sanitize company descriptions & news before store/return (NFR 13.4)
- [ ] 5.5 Structural ESLint rule: `actions.ts` importing prisma must import rbac (TRD §20)
- [ ] 5.6 Integration tests: register→publish gated by verification (RBAC+Prisma) (TRD §20)
- [ ] 5.7 Seed 100-company demo catalog (G2)
