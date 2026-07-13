# Website Audit Report — Verity (verity-gold.vercel.app)

Audited: 2026-07-12 · Auditor: full-stack audit (code + live production)
Method: source review of all 40 routes, live HTTP probing of production,
middleware/security review, a11y/SEO/content inspection.
Legend: [VERIFIED] = reproduced against code or live site · [HYPOTHESIS] = needs manual confirmation.

## Summary

Total Issues: 46
Critical: 7
High: 12
Medium: 15
Low: 7
Enhancements: 5

Two issues found during this audit were already fixed on branch `fix/company-logo-rendering`
(PR #35, awaiting merge): the /jobs middleware regression (ISSUE-001) and logo cropping (ISSUE-011).

---

## Critical Issues

### ISSUE-001 — Public /jobs page redirects logged-out users to sign-in
Category: Navigation / Auth
Severity: Critical
Page: /jobs
Component: middleware.ts `isPublicRoute`

Problem: The new Jobs page was never added to the middleware public-route
allowlist, so every logged-out visit 307-redirects to /sign-in.
Steps: `curl -I https://verity-gold.vercel.app/jobs` → 307 to /sign-in. [VERIFIED]
Expected: Public browsing like /internships.
Actual: Sign-in wall on a page advertised in the public header with a "NEW" badge.
Root cause: feature shipped without updating `createRouteMatcher` list.
Recommendation: add `"/jobs(.*)"` to the allowlist. **FIXED in PR #35 — merge it.**
Effort: S · User impact: total loss of the feature for visitors · Business impact: high (dead flagship nav item).

### ISSUE-002 — Unknown URLs redirect to sign-in instead of 404
Category: Navigation / Error handling
Severity: Critical
Page: any unmatched route (e.g. /pricing, /nonexistent-xyz)
Component: middleware.ts

Problem: Every route not in the public allowlist is treated as "protected",
so typos and stale links 307 → /sign-in?redirect_url=… instead of a 404 page.
After signing in, the user is then redirected to a page that doesn't exist.
Steps: `curl -I https://verity-gold.vercel.app/nonexistent-xyz` → 307. [VERIFIED]
Expected: 404 with a branded not-found page.
Actual: Sign-in wall, then a broken redirect loop into nothing.
Recommendation: after auth passes (or for non-portal prefixes), let Next render
`not-found.tsx`; add a root `app/not-found.tsx` (none exists today).
Effort: M · Impact: confusing dead ends, hurts SEO (no 404 status), erodes trust.

### ISSUE-003 — Fabricated trust signals on the landing page
Category: Content / Legal / Trust
Severity: Critical
Page: /
Component: app/(marketing)/page.tsx

Problem: "12K+ Startups Tracked", "2K+ Open Internships", "85+ Countries",
"100% Verified Data", "Join 48K+ users", and a "Trusted by" strip naming
Google for Startups, Y Combinator, techstars_, ANTLER, Startmate. [VERIFIED
in source — hardcoded constants.] The real DB has ~20 companies. Claiming
partnership/endorsement by named organizations you have no relationship with
is a legal and reputational risk (and instantly detectable by any investor or
recruiter).
Recommendation: replace with real counts queried from the DB (companies,
open listings) and delete the Trusted-by strip until real logos are licensed.
Effort: S–M · Business impact: severe if seen by the named organizations.

### ISSUE-004 — NEXT_PUBLIC_DEMO_MODE can disable all auth in production
Category: Security
Severity: Critical
Component: middleware.ts `MOCK_AUTH`, lib/auth.ts

Problem: `MOCK_AUTH = (MOCK_AUTH && NODE_ENV !== "production") || NEXT_PUBLIC_DEMO_MODE === "true"`.
The second branch has NO environment guard: setting one env var on the prod
deployment silently bypasses Clerk for every request and serves a mock admin
user. It was set in the past (demo phase), so the footgun is loaded. [VERIFIED in source]
Recommendation: gate DEMO_MODE on `VERCEL_ENV !== "production"` (or delete the
bypass now that real Clerk keys exist).
Effort: S · Impact: one config mistake = full auth bypass incl. admin portal.

### ISSUE-005 — Admin portal runs on mock data (7 pages)
Category: Product / Functional
Severity: Critical
Pages: /admin (dashboard), /admin/analytics, /admin/featured, /admin/reports,
/admin/taxonomy, /admin/users, /admin/verification
Component: MOCK_* imports [VERIFIED via grep]

Problem: The moderation surfaces an admin depends on — verification queue,
reports, user management, taxonomy, featured picks, platform analytics — all
render mock fixtures. Real actions/queries exist for several (features/verification,
features/admin/users) but the pages don't call them everywhere; an admin
"approving" a company may be clicking a no-op or acting on fake rows.
Recommendation: wire each page to its real query/action; delete the mock import
from every `app/(admin)` page as the acceptance test.
Effort: L · Impact: the platform's core promise ("manually verified") cannot
actually be operated.

### ISSUE-006 — Company portal partially mock (5 pages)
Category: Product / Functional
Severity: Critical
Pages: /company (dashboard), /company/analytics, /company/news,
/company/profile, /company/team, /company/verification
Component: MOCK_* imports [VERIFIED via grep]

Problem: A signed-up company can create listings (real) but its profile
editor, team management, news, verification submission, and analytics render
mock data — so companies cannot complete the verification flow that gates
publishing (publish requires VERIFIED, ISSUE: catch-22).
Recommendation: prioritize /company/profile + /company/verification (they gate
the entire supply side), then team/news/analytics.
Effort: L · Impact: supply-side onboarding is broken end-to-end.

### ISSUE-007 — Site search returns fake results
Category: Functional
Severity: Critical
Page: /search
Component: app/(marketing)/search/page.tsx [VERIFIED — filters/results from MOCK_COMPANY_DETAILS]

Problem: The search results page filters MOCK_COMPANY_DETAILS, so searching
shows companies that don't exist and misses every real company in the DB —
while a real FTS backend (lib/search.ts + /api/search) already exists.
Recommendation: swap the page to `searchAll()`; also fixes ISSUE-014 (mock typeahead).
Effort: M · Impact: primary discovery loop returns fiction.

---

## High Issues

### ISSUE-008 — Notification bell shows fake notifications to everyone
Category: Functional / Trust
Severity: High
Component: components/shared/NotificationBell.tsx [VERIFIED — MOCK_NOTIFICATIONS, red badge "2"]
Problem: Every visitor — even logged out (visible in production screenshot) —
sees a red "2" badge and two fake notifications. NotificationDTO + queries
exist but aren't wired.
Recommendation: hide the bell when signed out; fetch real notifications when signed in.
Effort: M.

### ISSUE-009 — /categories renders mock categories and mock company counts
Category: Functional
Severity: High
Page: /categories [VERIFIED — MOCK_CATEGORIES + MOCK_COMPANY_DETAILS]
Problem: Real taxonomy rows exist (admin seeded); the public page ignores them.
Category tiles link to /search?category=… which itself is mock (ISSUE-007) —
a fully fictional funnel.
Recommendation: use `listCategories()` + real counts.
Effort: M.

### ISSUE-010 — Student dashboard "Categories" section uses mocks
Category: Functional
Severity: High
Page: /dashboard (MOCK_CATEGORIES import) [VERIFIED]
Recommendation: same fix as ISSUE-009.
Effort: S.

### ISSUE-011 — Company logos cropped to unreadable squares
Category: UI
Severity: High
Component: InternshipCard (object-cover)
Problem: Wide wordmark SVGs (Walleye→"LEY", Intuitive→"UIT", Samsung→"S",
Uber Freight→"be") were cropped; padded PNGs looked broken. All logo URLs
actually return 200 — the crop was the bug. [VERIFIED]
Recommendation: shared CompanyLogo with object-contain + onError initial-tile
fallback. **FIXED in PR #35 — merge it.**
Effort: S.

### ISSUE-012 — No robots.txt, sitemap.xml, OG images, canonical URLs, or favicon
Category: SEO
Severity: High
Pages: all [VERIFIED — /robots.txt & /sitemap.xml 404 in prod; no app/icon.*,
no opengraph-image, no metadataBase]
Problem: Zero crawl guidance, no social-share cards, no canonical tags, and the
browser tab shows the default blank icon. For a discovery product, organic
search is the cheapest channel and it's fully dark.
Recommendation: add `app/robots.ts`, `app/sitemap.ts` (companies + internships
from DB), `metadataBase` + openGraph in root layout, `app/icon.svg`.
Effort: M.

### ISSUE-013 — Missing security headers
Category: Security
Severity: High
Pages: all [VERIFIED via curl -I: only HSTS present; `x-powered-by: Next.js` leaks]
Problem: No Content-Security-Policy, X-Frame-Options/frame-ancestors,
X-Content-Type-Options, Referrer-Policy, or Permissions-Policy.
Recommendation: add a headers() block in next.config; `poweredByHeader: false`.
Effort: S–M (CSP needs testing with Clerk + Vercel scripts).

### ISSUE-014 — Nav search typeahead is mock
Category: Functional
Severity: High
Component: components/shared/NavSearch.tsx [VERIFIED — filters MOCK_SEARCH_SUGGESTIONS]
Problem: Suggestions list fake companies; real /api/search/suggest exists.
Effort: S–M.

### ISSUE-015 — Bookmark/tracker buttons always start "off"
Category: Functional / State
Severity: High
Pages: /internships/[slug], /companies/[slug]
Component: `initialBookmarked={false}`, `initialTracked={false}` [VERIFIED]
Problem: A signed-in user who bookmarked an internship sees an unbookmarked
state on revisit; clicking again may create a duplicate or error.
Recommendation: fetch the user's bookmark/application state server-side on the
detail page.
Effort: M.

### ISSUE-016 — In-memory rate limiting is ineffective on Vercel
Category: Security / Architecture
Severity: High
Component: lib/rate-limit.ts [VERIFIED — module-scope Map]
Problem: Serverless instances don't share memory; each cold start resets the
window, so the limiter provides near-zero protection at exactly the moment it
matters (burst traffic).
Recommendation: Upstash Redis / Vercel KV sliding window, or accept and document.
Effort: M.

### ISSUE-017 — Season sort exists in the API but has no UI
Category: UX / Dead code
Severity: High
Page: /internships
Problem: `sort: "season"` was implemented in queries, and the page copy says
"sortable by season", but the page hardcodes `sort: "recent"` and renders no
sort control. Users can filter by season but never sort by it. [VERIFIED]
Recommendation: add a Sort select (Recent / Title / Season) to the filter bar,
or remove the claim from the meta description.
Effort: S.

### ISSUE-018 — /team page orphaned; no About/Contact/Privacy/Terms anywhere
Category: Navigation / Legal
Severity: High
Problem: Team was removed from the nav but the page still exists unlinked.
There is no Privacy Policy, Terms of Service, or Contact page — required
before collecting real student PII (profiles now store education, links, bio).
Footer contains only a copyright line. [VERIFIED]
Recommendation: footer nav with Team/About, Privacy, Terms, Contact; draft the
legal pages before launch.
Effort: M.

### ISSUE-019 — Publish catch-22 for new companies
Category: Product flow
Severity: High
Problem: Publishing requires VERIFIED status, but the verification submission
UI (/company/verification) is mock (ISSUE-006) — so no new company can ever
publish a listing without an admin manually flipping the DB.
Recommendation: wire submitForVerification + admin queue first.
Effort: covered by ISSUE-005/006 but called out as the single most blocking flow.

---

## Medium Issues

### ISSUE-020 — Filter dropdowns leak across the internship/job split
Severity: Medium · Page: /internships, /jobs
`listInternshipLocations()`/`listInternshipDepartments()` aggregate across ALL
listings, so the internships page offers locations that only jobs have (and
picking one yields 0 results). Recommendation: accept a `kind` param. Effort: S.

### ISSUE-021 — No app/not-found.tsx or error.tsx boundaries
Severity: Medium · Pages: all
Only implicit Next defaults; DB failures are swallowed by try/catch into empty
states (good) but render errors show the unstyled default. Add branded
not-found.tsx + error.tsx (root and per group). Effort: S.

### ISSUE-022 — No skip-to-content link
Severity: Medium · A11y (WCAG 2.4.1)
Keyboard users must tab through the whole nav on every page. [VERIFIED — none in layouts]
Effort: S.

### ISSUE-023 — Heading hierarchy skips on landing page
Severity: Medium · A11y (WCAG 1.3.1)
h1 → h3 ("How it works" cards use h3 with no h2 ancestor at line ~170). [VERIFIED]
Effort: S.

### ISSUE-024 — Application tracker grid breaks on mobile
Severity: Medium · Page: /dashboard
`grid-cols-5` with no responsive variant squeezes five stat tiles into a phone
width. [VERIFIED in source] Use grid-cols-2 sm:grid-cols-5. Effort: S.

### ISSUE-025 — Horizontal scroll sections lack affordances
Severity: Medium · Page: /dashboard (HScroll)
No scroll buttons, no snap, no keyboard hint; on desktop with no trackpad the
overflow is easy to miss. Add scroll-snap + edge fade or arrows. Effort: M.

### ISSUE-026 — force-dynamic on nearly every page
Severity: Medium · Performance
Marketing pages (companies, internships, jobs, landing) are `force-dynamic`,
so every visit pays a full server render + DB round trip (mitigated by
unstable_cache but still no CDN/ISR). Landing page has zero data needs yet is
dynamic via the layout's getCurrentUser(). Recommendation: ISR (revalidate: 60)
for public lists; make the navbar auth state client-fetched so marketing pages
can be static. Effort: M–L.

### ISSUE-027 — "Get notified" CTA promises a feature that doesn't exist
Severity: Medium · Pages: /internships, /jobs empty states
"Get notified when new jobs are posted" links to /sign-up, but no notification
subscription exists (digest cron is unrelated). Either build the subscribe or
soften the copy. Effort: S.

### ISSUE-028 — SEASON_LABEL and tile-color logic duplicated 3–4×
Severity: Medium · Design system
SEASON_LABEL exists in InternshipCard, internship detail page, and the filter
bar (as SEASONS); tileColorClass exists in CompanyCard and CompanyLogo.
Single source: config/labels.ts. Effort: S.

### ISSUE-029 — Sign-up has no role selection
Severity: Medium · Product flow
Companies must sign up as students then find /company-onboarding by URL; no
"I'm hiring" path exists in nav or sign-up. Effort: M.

### ISSUE-030 — Profile form: no unsaved-changes guard or resume upload
Severity: Medium · Page: /dashboard/profile
Navigating away silently discards edits; resumeUrl is a raw URL input rather
than an upload (Cloudinary planned but unwired). Effort: M.

### ISSUE-031 — Internship detail metadata leaks HTML remnants
Severity: Medium · SEO
`description.replace(/<[^>]+>/g, "")` doesn't decode entities (&amp;, &nbsp;)
so social snippets can contain raw entities. Use a proper text extraction. Effort: S.

### ISSUE-032 — Pagination renders even when DB is down
Severity: Low–Medium
try/catch fallback sets meta.totalPages=1 — fine — but empty-state + pagination
can both render if a partial fetch succeeds. Minor guard. [HYPOTHESIS — verify
by killing DB locally.] Effort: S.

### ISSUE-033 — Dashboard fetches even when logged out is impossible but layout still forces dynamic
Severity: Medium · covered by ISSUE-026; listed for traceability.

### ISSUE-034 — No loading.tsx skeletons for list pages
Severity: Medium · UX
Skeleton component exists but no route-level loading.tsx files; slow queries
show a blank screen during navigation. [VERIFIED — no loading.tsx in app/]
Effort: S.

---

## Low Issues

### ISSUE-035 — x-powered-by header exposed (part of ISSUE-013, separable quick win). Effort: S.
### ISSUE-036 — "verity.exe" hero window is decorative but its buttons (─ □ ×) look clickable; add aria-hidden and cursor-default. Effort: S.
### ISSUE-037 — Footer tagline "Verified startups, real internships." contradicts Jobs positioning; update copy. Effort: S.
### ISSUE-038 — Mixed date copy: "yesterday"/"2d ago" in dashboard vs ISO-ish dates elsewhere; unify a formatDate util. Effort: S.
### ISSUE-039 — TagInput allows duplicate-differing-case tags ("React" + "react"). Normalize on add. Effort: S.
### ISSUE-040 — Profile completeness treats all 12 fields equally (LinkedIn = name). Weight required fields. Effort: S.
### ISSUE-041 — prisma package.json config deprecation warning on every CLI run; migrate to prisma.config.ts before Prisma 7. Effort: S.

---

## Enhancements

### ENH-01 — Saved searches / email alerts for new listings (justifies the "Get notified" CTA).
### ENH-02 — Company profile completeness meter reuses ProfileCompletionBanner pattern for the supply side.
### ENH-03 — Season quick-filter chips (Summer 2027, Fall 2026…) above the internships grid — one-tap filtering beats a dropdown for the dominant use case.
### ENH-04 — Structured data (JSON-LD JobPosting) on internship/job detail pages → Google Jobs indexing; large free-traffic win once ISSUE-012 lands.
### ENH-05 — Admin impersonation ("view as student/company") for support debugging.

---

## Top 25 Highest-Priority Fixes
1. Merge PR #35 (fixes ISSUE-001 /jobs lockout + ISSUE-011 logos) — production is broken until then
2. ISSUE-004 demo-mode auth bypass guard
3. ISSUE-003 remove fabricated stats + Trusted-by logos
4. ISSUE-019/006 verification flow (company submit + admin queue) — unblocks all publishing
5. ISSUE-007 real search results
6. ISSUE-005 admin portal on real data
7. ISSUE-002 404 handling for unknown routes
8. ISSUE-012 robots/sitemap/OG/favicon
9. ISSUE-013 security headers
10. ISSUE-008 notification bell
11. ISSUE-014 real typeahead
12. ISSUE-015 bookmark/tracker initial state
13. ISSUE-009 real categories page
14. ISSUE-018 footer + legal pages
15. ISSUE-017 season sort UI
16. ISSUE-020 kind-scoped filter options
17. ISSUE-016 durable rate limiting
18. ISSUE-034 loading.tsx skeletons
19. ISSUE-021 error/not-found boundaries
20. ISSUE-024 mobile tracker grid
21. ISSUE-029 role selection at sign-up
22. ISSUE-026 static/ISR for marketing pages
23. ISSUE-030 resume upload
24. ISSUE-027 honest empty-state CTA
25. ISSUE-028 dedupe design-system constants

## Quick wins (<30 min each)
Merge PR #35 · /jobs allowlist (done, in PR) · poweredByHeader:false ·
robots.ts · skip link · grid-cols-2 sm:grid-cols-5 · footer copy ·
season sort dropdown · SEASON_LABEL constant · favicon · h2 fix ·
"Get notified" copy · TagInput case-normalize.

## Medium effort
Real search + typeahead · categories page · notification bell · bookmark
initial state · sitemap + OG + JSON-LD · security headers with CSP ·
loading.tsx set · error boundaries · kind-scoped filters · legal pages.

## Major architectural improvements
Admin portal on real data (ISSUE-005) · company portal + verification flow
(ISSUE-006/019) · durable rate limiting (ISSUE-016) · ISR/static marketing
pages (ISSUE-026) · Cloudinary upload pipeline (logos, banners, resumes).

## Category improvement lists
- UI: 011(fixed) · 036 · 028 · consistent empty states
- UX: 017 · 025 · 027 · 029 · 030 · 034
- Security: 004 · 013 · 016 · 035
- Accessibility: 022 · 023 · 025(keyboard) · focus audit of Select/Dialog [HYPOTHESIS — test with VoiceOver]
- Performance: 026 · 034 · font subset audit [HYPOTHESIS — run Lighthouse]
- SEO: 012 · 031 · ENH-04 · 002(404 status)
- Mobile: 024 · 025 · touch-target audit of icon buttons [HYPOTHESIS]
- Navigation: 001(fixed) · 002 · 018 · 029
- Product: 003 · 005 · 006 · 007 · 019 · ENH-01..05

---

## Quality Scores (0–100)

| Area | Score | Rationale |
|---|---|---|
| UI Design | 78 | Distinctive, consistent retro system; logo fix pending merge; minor duplication |
| UX | 58 | Good flows where real; mock surfaces + missing sort/notify promises break trust |
| Navigation | 55 | /jobs lockout (fix pending) + no 404 + orphaned /team |
| Accessibility | 62 | Good aria/focus habits, reduced-motion honored; no skip link, heading skips, untested SR flows |
| Performance | 65 | sin1 + caching solid; force-dynamic everywhere leaves CDN wins on the table |
| Security | 52 | Strong 3-layer RBAC + DOMPurify; demo-mode bypass footgun, no headers, RAM rate limiter |
| Mobile Experience | 68 | Responsive overall; tracker grid + scroll affordances weak |
| Code Quality | 80 | Clean feature-module architecture, typed contracts, honest comments; mocks lingering |
| Product Maturity | 45 | Demand side real; supply side (verification→publish) and admin ops still mock |
| **Overall** | **60** | A well-built skeleton with a broken supply-side spine and fake trust signals |

Would Apple/Stripe/Linear ship this? Not yet: fake stats (003), a locked
flagship page (001), and an inoperable verification pipeline (019) are each
individually disqualifying. Fix the top 10 and this is a credible beta.
