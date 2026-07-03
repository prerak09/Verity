# Dev B — FRONTEND (UI & presentation)

**Owns:** `components/**`, `app/globals.css`, every `app/**/layout.tsx` + `page.tsx`, every `features/*/components/**`, the design system.
**Never touch:** `prisma/**`, `lib/**`, `middleware.ts`, `features/*/{schema,queries,actions}.ts`, `app/api/**`. That's Dev A.
**Contract-first rule:** build every screen against `types/index.ts` with **mock data**, then swap mock → real import when Dev A pushes the function. Never wait.
Branch prefix: `feat/fe-…`. After each task: **tick this file + `MASTER-CHECKLIST.md`, commit, push, update PR.**

---

## Phase 0 — Design system & shells (start after Dev A pushes 0.1 to `main`)
- [ ] 0.1 `shadcn/ui` init + core primitives in `components/ui/` (button, input, card, dialog, tabs, badge, select, toast, table)
- [ ] 0.2 Design tokens + Tailwind theme + `globals.css` — WCAG AA contrast (NFR 13.5)
- [ ] 0.3 `components/shared/` — Navbar, Sidebar, EmptyState, Pagination, Logo, Skeleton
- [ ] 0.4 Root `layout.tsx` + portal-specific `error.tsx` + `loading.tsx` per group (TRD §21)
- [ ] 0.5 Four route-group `layout.tsx` shells + nav: `(marketing)`, `(student)`, `(company)`, `(admin)`
- [ ] 0.6 Sign-in / sign-up pages (Clerk `<SignIn/>`/`<SignUp/>`) + `/unauthorized` page
- [ ] 0.7 Mock-data fixtures matching `types/index.ts` (so screens render before real data lands)

## Phase 1 — Public / marketing pages
- [ ] 1.1 Landing page `(marketing)/page.tsx` (PRD §11)
- [ ] 1.2 Public company directory `(marketing)/companies/page.tsx` (grid + cards)
- [ ] 1.3 Public company profile `[slug]/page.tsx` — RSC, all §17 modules read-only, LCP<2s (NFR 13.1)
- [ ] 1.4 Public internship list + `[slug]` detail — external "Apply on company site" CTA (FR-25)
- [ ] 1.5 Company/internship card components, verified badge, funding/remote chips

## Phase 2 — Search & discovery UI
- [ ] 2.1 Global search bar + typeahead client component (debounced 250ms) (PRD §16)
- [ ] 2.2 Search results page + filter sidebar (category/tech/funding/remote/visa/employees/location) (FR-31)
- [ ] 2.3 Sort controls (relevance/recent/alpha) (FR-32)
- [ ] 2.4 Zero-result state → "browse by category" + "suggest a company" form (PRD §16)
- [ ] 2.5 Category browse grid (PRD §14.1)

## Phase 3 — Student portal UI
- [ ] 3.1 Student Dashboard — all modules (categories, trending, recommended, recently-added, latest internships, bookmarks preview, tracker preview, recent activity) (PRD §15.1)
- [ ] 3.2 Student profile settings form (school, major, grad year, interests, notif prefs, resume placeholder) (PRD §14.1)
- [ ] 3.3 Bookmark toggle button (client) on company + internship (calls Dev A action) (FR-40/41)
- [ ] 3.4 Bookmarks page — Companies / Internships tabs, quick remove/navigate (PRD §14.1)
- [ ] 3.5 Application Tracker — Kanban (Saved→Applied→Interviewing→Offer/Rejected/Withdrawn) drag-to-update + list-view toggle for a11y + notes field (FR-42/43)
- [ ] 3.6 Archived-internship bookmark shows "no longer open" state (PRD §23)

## Phase 4 — Company portal UI
- [ ] 4.1 Company onboarding multi-step form → "Submitted for Verification" (PRD §14.2)
- [ ] 4.2 Company Dashboard modules (verification banner, analytics cards, completeness %, internship counts) (PRD §15.2)
- [ ] 4.3 Company Profile Editor forms — all §17 modules, autosave + "last saved" indicator (FR-11)
- [ ] 4.4 Logo/media upload widget (Cloudinary signed preset from Dev A) (FR-16)
- [ ] 4.5 Founders/co-founders/hiring-managers/recruiters repeatable editors (PRD §17)
- [ ] 4.6 Internship Manager UI — table, inline status toggle, create/edit/archive forms (PRD §14.2)
- [ ] 4.7 Team Members UI — invite, roles OWNER/RECRUITER, revoke, transfer ownership (FR-04)
- [ ] 4.8 Company News CMS UI (last-10) (C6)
- [ ] 4.9 Company Analytics UI — trend charts (PRD §14.2)
- [ ] 4.10 Verification status banner + "what to fix" checklist (C8)

## Phase 5 — Admin portal UI, notifications UI & QA
- [ ] 5.1 Admin Dashboard modules (PRD §15.3)
- [ ] 5.2 Verification Queue UI — oldest-first, side-by-side fields + external links + action buttons (FR-50/51)
- [ ] 5.3 Admin Company + Internship management tables + moderation (PRD §14.3)
- [ ] 5.4 Categories & Technologies management UI (CRUD + merge) (FR-54)
- [ ] 5.5 Reports queue UI + resolution actions (FR-53)
- [ ] 5.6 Feature Management UI (windowed) (FR-55)
- [ ] 5.7 User Management UI (disable/reinstate/role) (A5)
- [ ] 5.8 Platform Analytics dashboard — KPI cards + trend charts (FR-72)
- [ ] 5.9 Notification center UI + unread bell badge (PRD §20)
- [ ] 5.10 Accessibility pass on all student-facing pages — keyboard nav, contrast (NFR 13.5)
- [ ] 5.11 E2E (Playwright): sign-up → search → view profile → bookmark → add to tracker → update status (TRD §20)
