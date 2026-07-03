# 05 — API Reference

## Verity — Career Intelligence Platform

**Version:** 1.0 (V1 Scope)
**Status:** Draft for Engineering Review
**Owner:** Founding Engineering Team
**Companion Documents:** `01-PRD.md`, `02-TRD.md`
**Source of truth for models/enums:** `02-TRD.md` §10 (Prisma schema). This document must never diverge from it.

---

## Table of Contents

1. Introduction
2. API Overview & Conventions
   - 2.1 Base URL
   - 2.2 Versioning strategy (implicit `v1`)
   - 2.3 Content types & encoding
   - 2.4 Identifiers, timestamps, enums
   - 2.5 Route Handlers vs Server Actions — the boundary
   - 2.6 Idempotency
   - 2.7 Request correlation (`requestId`)
   - 2.8 Standard response envelopes
3. Authentication
   - 3.1 Clerk session (browser)
   - 3.2 Programmatic access (Bearer token)
   - 3.3 `getCurrentUser()` — resolving the platform user
   - 3.4 Webhook signature authentication
4. Authorization (RBAC)
   - 4.1 Platform roles & company sub-roles
   - 4.2 Permission strings (`config/roles.ts`)
   - 4.3 `assertCan()` and the three-layer model
   - 4.4 Per-endpoint permission map
5. Full Endpoint Reference
   - 5.1 Companies
   - 5.2 Company sub-resources (members, founders, news, links, locations)
   - 5.3 Internships
   - 5.4 Bookmarks
   - 5.5 Applications
   - 5.6 Students / Profile
   - 5.7 Search & Suggest
   - 5.8 Verification (Admin)
   - 5.9 Reports & Moderation
   - 5.10 Categories (taxonomy)
   - 5.11 Technologies (taxonomy)
   - 5.12 Featured companies
   - 5.13 Admin — Users
   - 5.14 Analytics
   - 5.15 Notifications
   - 5.16 Webhooks
6. Standard Error Responses
7. Rate Limits
8. Pagination
9. Filtering & Sorting
10. Versioning Policy
11. Webhooks — payloads & verification
12. OpenAPI 3.1 fragment

---

## 1. Introduction

This document is the complete HTTP API reference for Verity V1. It expands the endpoint table in `02-TRD.md` §9.2 into an implementation-ready and OpenAPI-ready reference.

**Scope boundary.** Verity V1 is a Next.js monolith (`02-TRD.md` §2). Most user-facing mutations happen through **Server Actions** invoked by in-app React forms; the **Route Handlers** documented here exist so that (a) future non-browser clients (browser extension, mobile) have a stable contract, (b) webhooks from Clerk and Cloudinary have an entry point, and (c) this reference can be handed to a reviewer as evidence the platform is not a black box (`02-TRD.md` §9.1).

Every endpoint in this document is validated with **Zod** before any Prisma call (`02-TRD.md` §14), guarded by **`assertCan()`** RBAC checks (`02-TRD.md` §7.4), and scoped by an ownership `WHERE` clause at the query layer. No raw `request.json()` reaches the database anywhere.

**V1 constraints reflected here:** no AI, no scraping, no in-app applications (the "Apply" action deep-links to an external ATS). The API surface contains no endpoint that would require any of those.

---

## 2. API Overview & Conventions

### 2.1 Base URL

| Environment | Base URL |
|---|---|
| Production | `https://verity.app/api` |
| Preview (per-PR) | `https://<deployment>.vercel.app/api` |
| Local development | `http://localhost:3000/api` |

All paths in this document are written relative to the base URL. When a path is written as `/api/companies`, the fully-qualified production URL is `https://verity.app/api/companies`.

### 2.2 Versioning strategy (implicit `v1`)

Per `02-TRD.md` §9.1, **all V1 routes live under `/api/*` and are implicitly version 1.** The path segment `v1` is not written into V1 URLs — `/api/companies` *is* the v1 companies endpoint. This keeps V1 paths identical to the TRD §9.2 table.

The versioning contract is:

- `/api/*` is the frozen **v1 namespace**. Non-breaking, additive changes (new optional fields, new endpoints, new enum members appended at the end) may be shipped in place.
- Any **breaking change** (removing/renaming a field, changing a type, changing required-ness, changing an error contract) is introduced under a new **`/api/v2/*`** prefix. `/api/*` continues to serve v1 semantics unchanged for the deprecation window.
- The active version is echoed on every response in the `X-API-Version: 1` header, so a client can assert the contract it is talking to even though the path is unversioned.

> **Why implicit-v1 instead of `/api/v1/*` literally?** V1 has exactly one consumer surface (our own app + this doc). Writing `v1` into every path now buys nothing and would make the TRD §9.2 route table inconsistent with the code. The moment a second, externally-versioned consumer exists, `/api/v2/*` is introduced *alongside* `/api/*` — the cost of the rename is paid once, when it is actually needed. See §10 for the full policy.

### 2.3 Content types & encoding

- **Request bodies:** `application/json` (UTF-8). Route Handlers reject any other content type on mutating requests with `415`-equivalent `VALIDATION_ERROR` (see §6). The single exception is `/api/webhooks/*`, which reads the **raw request body** as text for signature verification before parsing.
- **Response bodies:** always `application/json; charset=utf-8`, except `204 No Content` responses (empty body).
- **File uploads** are never sent to this API as bytes. Clients upload directly to Cloudinary using a signed upload preset (`02-TRD.md` §14), then send the resulting Cloudinary `secure_url` / `public_id` to the relevant JSON endpoint (e.g., `logoUrl` on `PATCH /api/companies/:id`). Cloudinary notifies us out-of-band via `POST /api/webhooks/cloudinary`.

### 2.4 Identifiers, timestamps, enums

- **IDs** are Prisma `cuid()` strings, e.g. `clx7a1b2c3d4e5f6g7h8i9j0k`. They are opaque; do not parse them. In examples they are abbreviated as `clx...` for readability but are always full-length in real responses.
- **Slugs** are lowercase, hyphenated, unique, and immutable-by-default (`02-TRD.md` §10.1). Slug changes are an Admin-gated action, never part of normal profile editing.
- **Timestamps** are ISO 8601 with a `Z` (UTC) suffix, e.g. `2026-07-03T14:22:10.512Z`.
- **Enums** are UPPER_SNAKE_CASE and match the Prisma schema exactly. The full set:

| Enum | Members |
|---|---|
| `PlatformRole` | `STUDENT`, `COMPANY`, `ADMIN` |
| `CompanyMemberRole` | `OWNER`, `RECRUITER` |
| `VerificationStatus` | `UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED` |
| `FundingStage` | `BOOTSTRAPPED`, `PRE_SEED`, `SEED`, `SERIES_A`, `SERIES_B`, `SERIES_C_PLUS`, `PUBLIC` |
| `RemotePolicy` | `REMOTE`, `HYBRID`, `ONSITE` |
| `InternshipStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `ApplicationStatus` | `SAVED`, `APPLIED`, `OA`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN` |
| `BookmarkTargetType` | `COMPANY`, `INTERNSHIP` |
| `Report.status` | `OPEN`, `RESOLVED`, `DISMISSED` (stored as `String` in schema) |

> **Note on `CompanyMemberRole`.** The Prisma schema (`02-TRD.md` §10.2) defines exactly two company sub-roles: `OWNER` and `RECRUITER`. The PRD's broader four-role vision (Owner/Admin/Recruiter/Viewer, PRD FR-04) is a forward-looking product goal; V1 ships the two-role enum, and this API reflects that enum. Additional sub-roles would be appended additively per §2.2.

Shared enum definitions used throughout the Zod blocks below:

```ts
// features/_shared/enums.ts — mirrors prisma enums 1:1
import { z } from "zod";

export const PlatformRole      = z.enum(["STUDENT", "COMPANY", "ADMIN"]);
export const CompanyMemberRole = z.enum(["OWNER", "RECRUITER"]);
export const VerificationStatus= z.enum(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"]);
export const FundingStage      = z.enum([
  "BOOTSTRAPPED", "PRE_SEED", "SEED", "SERIES_A", "SERIES_B", "SERIES_C_PLUS", "PUBLIC",
]);
export const RemotePolicy      = z.enum(["REMOTE", "HYBRID", "ONSITE"]);
export const InternshipStatus  = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const ApplicationStatus = z.enum([
  "SAVED", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN",
]);
export const BookmarkTargetType= z.enum(["COMPANY", "INTERNSHIP"]);
```

### 2.5 Route Handlers vs Server Actions — the boundary

Verity has two server-side mutation surfaces. The decision of which to use is deterministic:

| Concern | Use a **Server Action** | Use a **Route Handler** |
|---|---|---|
| Caller | In-app React form (browser, same origin) | Non-browser client, webhook, or programmatic caller |
| Example | Bookmark toggle, profile edit form, publish-internship button | Clerk/Cloudinary webhooks, future browser extension, future mobile app |
| Auth | Clerk session via RSC context (`auth()`), CSRF handled by Next.js origin-check for free | Clerk session cookie *or* `Authorization: Bearer` token; explicit `Origin` allowlist check on browser mutations |
| Input validation | Zod `parse(formData)` in `features/*/actions.ts` | Zod `parse(await req.json())` in `app/api/**/route.ts` |
| Return shape | Discriminated union `{ success: true, data } \| { success: false, error }` (`02-TRD.md` §21) | HTTP status + JSON envelope (§2.8) |
| Revalidation | `revalidatePath` / `revalidateTag` then redirect | Caller re-fetches; server fires `revalidateTag` for cached public pages |

**The rule (`02-TRD.md` §9.1):** *Route Handlers are for external/programmatic access; Server Actions are for in-app forms.* Every mutation documented in this reference has a Route Handler because a stable external contract is the whole point of the REST layer — but in the running V1 app the same mutation is usually reached through the equivalent Server Action. Both paths converge on the **same** `features/*/actions.ts` function, the **same** Zod schema, and the **same** `assertCan()` guard, so the two surfaces can never drift in authorization or validation behavior.

```ts
// Illustration: one action, two callers.

// features/bookmarks/actions.ts  (the single source of mutation truth)
export async function createBookmark(input: unknown, ctx: AuthContext) {
  const data = createBookmarkSchema.parse(input);          // Zod
  assertCan(ctx, "bookmark:create");                        // RBAC (layer 2)
  return prisma.bookmark.create({
    data: { userId: ctx.userId, ...toBookmarkFields(data) }, // ownership-scoped (layer 3)
  });
}

// app/api/bookmarks/route.ts  (Route Handler caller — external clients)
export const POST = withErrorHandling(async (req) => {
  const ctx = await requireAuth(req);
  const bookmark = await createBookmark(await req.json(), ctx);
  return Response.json(bookmark, { status: 201 });
});

// features/bookmarks/components/BookmarkButton form → server action caller (in-app)
"use server";
export async function bookmarkAction(formData: FormData) {
  const ctx = await requireAuth();
  try {
    const b = await createBookmark(Object.fromEntries(formData), ctx);
    revalidatePath("/bookmarks");
    return { success: true, data: b };
  } catch (e) {
    return toActionError(e); // maps AppError → { success:false, error }
  }
}
```

### 2.6 Idempotency

- **Natural idempotency via unique constraints.** Several creates are idempotent by schema design: `Bookmark` has `@@unique([userId, companyId, internshipId])` and `Application` has `@@unique([userId, internshipId])`. A duplicate create returns `409 CONFLICT` rather than silently creating a second row (see the per-endpoint sections).
- **`Idempotency-Key` header (programmatic clients).** Mutating Route Handlers (`POST`, `PATCH`) accept an optional `Idempotency-Key: <uuid>` request header. When present, the server records the key + request fingerprint + response for 24h. A retry with the same key returns the **stored response** (same status, same body) without re-executing the mutation. Reusing a key with a *different* body returns `409 CONFLICT` with message `Idempotency key reused with a different payload.` This makes network-retry-safe POSTs possible for the future mobile/extension clients.
- **`GET`, `DELETE`, `PATCH` action routes** (`/publish`, `/archive`, `/verify`) are idempotent by state-machine design: re-publishing an already-`PUBLISHED` internship is a no-op that returns `200` with the current representation, not an error.

### 2.7 Request correlation (`requestId`)

Every response — success or error — carries an `X-Request-Id` header, e.g. `req_9f2c8a71b4e0`. On error responses the same value appears inside the envelope as `error.requestId` (`02-TRD.md` §9.3). It is logged with every Server Action / Route Handler outcome (`02-TRD.md` §16) and forwarded to Sentry (`02-TRD.md` §17), so a user-reported failure can be traced from a single ID. Clients may also *send* `X-Request-Id`; if present and well-formed it is adopted, otherwise the server generates one.

### 2.8 Standard response envelopes

**Single resource** — returned bare (no wrapper):

```json
{
  "id": "clx7a1b2c3d4e5f6g7h8i9j0k",
  "slug": "sarvam-ai",
  "name": "Sarvam AI"
}
```

**Collection** — always wrapped in `{ data, meta }` (§8):

```json
{
  "data": [ { "id": "clx..." } ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 187, "totalPages": 10 }
}
```

**Error** — always the fixed envelope (§6):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to edit this company.",
    "requestId": "req_9f2c8a71b4e0"
  }
}
```

No endpoint returns a bare top-level array. This is enforced at the API-contract level (`02-TRD.md` §9.1, §15) — every list is paginated.

---

## 3. Authentication

**Provider:** Clerk (`02-TRD.md` §6). Verity never stores passwords; all credential handling is delegated to Clerk.

### 3.1 Clerk session (browser)

The primary caller is the Verity web app on the same origin. Clerk issues an `httpOnly` session cookie (`__session`) on sign-in. For same-origin requests the cookie is sent automatically; middleware (`02-TRD.md` §8) verifies the session JWT at the Vercel Edge before the request reaches any Route Handler or React Server Component.

The verified JWT carries a custom claim `publicMetadata.role` (`02-TRD.md` §6) — a performance cache of `User.role` refreshed on every `user.updated` webhook and on Admin-triggered role changes. Middleware uses this claim for **coarse** route gating without a database round-trip; fine-grained checks still hit the DB (§4.3).

### 3.2 Programmatic access (Bearer token)

For non-browser clients (the PRD-listed future browser extension and mobile app), the API accepts a Clerk-issued JWT in the standard header:

```
Authorization: Bearer <clerk_jwt>
```

`requireAuth()` accepts **either** the session cookie or the Bearer token, resolving both to the same `AuthContext`. Cross-origin browser mutations additionally pass an `Origin` allowlist check (`02-TRD.md` §14) before the handler runs.

```ts
// lib/auth.ts
import { auth } from "@clerk/nextjs/server";

export interface AuthContext {
  userId: string;        // Verity User.id (NOT the Clerk id)
  clerkId: string;
  role: "STUDENT" | "COMPANY" | "ADMIN";
  companyMemberships: { companyId: string; role: "OWNER" | "RECRUITER" }[];
}

export async function requireAuth(): Promise<AuthContext> {
  const { userId: clerkId, sessionClaims } = await auth();
  if (!clerkId) throw new UnauthenticatedError();
  return resolveContext(clerkId, sessionClaims);
}
```

Requests with no valid session or token receive `401 UNAUTHENTICATED` (§6). Public endpoints (`GET /api/companies`, `GET /api/search`, etc.) skip this check entirely — the middleware allowlist (`02-TRD.md` §8) lets them through unauthenticated.

### 3.3 `getCurrentUser()` — resolving the platform user

Clerk identifies a user by `clerkId`; Verity's own tables key on `User.id`. `getCurrentUser()` maps between them (the `User.clerkId` column is `@unique`):

```ts
// lib/auth.ts
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return prisma.user.findUnique({
    where: { clerkId, deletedAt: null },
    include: { companyMemberships: true, studentProfile: true },
  });
}
```

A signed-in Clerk user whose `User` row does not yet exist (webhook race on first sign-up) is treated as `401 UNAUTHENTICATED` on protected endpoints until the `user.created` webhook (§5.16) has upserted the row.

### 3.4 Webhook signature authentication

`/api/webhooks/*` routes are exempt from session auth and are instead authenticated by **HMAC signature verification** against the provider's signing secret (`02-TRD.md` §8, §14). An unverified webhook is rejected with `401 UNAUTHENTICATED` before any business logic runs. Full verification code is in §11.

- **Clerk** → Svix signature headers (`svix-id`, `svix-timestamp`, `svix-signature`) verified with `CLERK_WEBHOOK_SECRET`.
- **Cloudinary** → `X-Cld-Signature` + `X-Cld-Timestamp` verified as `sha1(body + timestamp + CLOUDINARY_API_SECRET)`.

---

## 4. Authorization (RBAC)

### 4.1 Platform roles & company sub-roles

Two tiers (`02-TRD.md` §7.1–7.2):

| Platform role | Meaning |
|---|---|
| `STUDENT` | Default on sign-up. Read public data; write own bookmarks/applications/profile. |
| `COMPANY` | Any user tied to a `Company` via `CompanyMember`. Effective permissions further scoped by `CompanyMember.role`. |
| `ADMIN` | Full platform access. Seeded or promoted only; never self-service. |

| Company sub-role | Edit profile | Publish internships | Manage team | View analytics |
|---|---|---|---|---|
| `OWNER` | ✅ | ✅ | ✅ | ✅ |
| `RECRUITER` | ❌ | ✅ | ❌ | ✅ |

### 4.2 Permission strings (`config/roles.ts`)

Every protected endpoint below cites the exact permission string it requires. These are the canonical strings from `02-TRD.md` §7.3:

```ts
// config/roles.ts
export const PERMISSIONS = {
  STUDENT: [
    "bookmark:create", "bookmark:delete",
    "application:create", "application:update:own",
    "profile:update:own",
  ],
  COMPANY_OWNER: [
    "company:update:own", "company:team:manage",
    "internship:create", "internship:update:own", "internship:archive:own",
    "analytics:view:own",
  ],
  COMPANY_RECRUITER: [
    "internship:create", "internship:update:own", "internship:archive:own",
    "analytics:view:own",
  ],
  ADMIN: [
    "user:manage", "company:verify", "company:moderate",
    "internship:moderate", "category:manage", "technology:manage",
    "featured:manage", "report:handle", "analytics:view:all",
  ],
} as const;
```

> Report **filing** (any authenticated user, PRD FR-52) and **reading own notifications/profile** are baseline capabilities of any authenticated user and are not enumerated as permission strings — they are gated by authentication + ownership scoping only. Report *handling* (`report:handle`) is Admin-only.

### 4.3 `assertCan()` and the three-layer model

Defense in depth, applied to every mutation (`02-TRD.md` §7.4):

1. **Middleware (route-level gate):** blocks a `STUDENT` from ever reaching `/company/*` or `/admin/*` at the edge.
2. **`assertCan(ctx, permission, resourceId?)`:** fine-grained — checks the specific permission against the specific resource (e.g., can *this* user archive *this* internship, which requires loading the internship's `companyId` and checking membership). Throws `ForbiddenError` on failure.
3. **Prisma `WHERE` scope:** every mutation query includes an explicit ownership filter (`WHERE companyId = ctx.companyId`), so even a Layer-2 bug returns zero rows affected instead of leaking a cross-tenant write.

```ts
// lib/rbac.ts
export function assertCan(ctx: AuthContext, permission: Permission, resourceId?: string) {
  if (!can(ctx, permission, resourceId)) throw new ForbiddenError(permission);
}

// Resource-aware example: internship:archive:own
export async function canArchiveInternship(ctx: AuthContext, internshipId: string) {
  const it = await prisma.internship.findFirst({
    where: { id: internshipId, deletedAt: null },
    select: { companyId: true },
  });
  if (!it) return false;
  return ctx.companyMemberships.some(m => m.companyId === it.companyId);
}
```

### 4.4 Per-endpoint permission map

Compact index; full detail per endpoint in §5.

| Method & path | Auth | Permission string |
|---|---|---|
| `GET /api/companies` | Public | — |
| `GET /api/companies/:slug` | Public | — |
| `POST /api/companies` | Authenticated | (elevates to `COMPANY`; see §5.1) |
| `PATCH /api/companies/:id` | `COMPANY` (owner) / `ADMIN` | `company:update:own` / `company:moderate` |
| `DELETE /api/companies/:id` | `ADMIN` | `company:moderate` |
| `POST /api/companies/:id/verify` | `ADMIN` | `company:verify` |
| `GET/POST/PATCH/DELETE /api/companies/:id/members` | `COMPANY` (owner) | `company:team:manage` |
| `POST/PATCH/DELETE /api/companies/:id/founders` | `COMPANY` (owner) | `company:update:own` |
| `POST/PATCH/DELETE /api/companies/:id/news` | `COMPANY` (owner) | `company:update:own` |
| `GET /api/internships` | Public | — |
| `GET /api/internships/:id` | Public | — |
| `POST /api/internships` | `COMPANY` (member) | `internship:create` |
| `PATCH /api/internships/:id` | `COMPANY` (own) | `internship:update:own` |
| `POST /api/internships/:id/publish` | `COMPANY` (own) | `internship:update:own` |
| `POST /api/internships/:id/archive` | `COMPANY` (own) | `internship:archive:own` |
| `DELETE /api/internships/:id` | `ADMIN` | `internship:moderate` |
| `GET /api/bookmarks` | Authenticated | — (own) |
| `POST /api/bookmarks` | `STUDENT` | `bookmark:create` |
| `DELETE /api/bookmarks/:id` | `STUDENT` | `bookmark:delete` |
| `GET /api/applications` | `STUDENT` | — (own) |
| `POST /api/applications` | `STUDENT` | `application:create` |
| `PATCH /api/applications/:id` | `STUDENT` | `application:update:own` |
| `DELETE /api/applications/:id` | `STUDENT` | `application:update:own` |
| `GET /api/profile` | Authenticated | — (own) |
| `PATCH /api/profile` | `STUDENT` | `profile:update:own` |
| `GET /api/search` | Public | — |
| `GET /api/search/suggest` | Public | — |
| `GET /api/admin/verification-queue` | `ADMIN` | `company:verify` |
| `POST /api/reports` | Authenticated | — |
| `GET /api/admin/reports` | `ADMIN` | `report:handle` |
| `PATCH /api/admin/reports/:id` | `ADMIN` | `report:handle` |
| `GET /api/categories` | Public | — |
| `POST/PATCH/DELETE /api/categories/*` | `ADMIN` | `category:manage` |
| `GET /api/technologies` | Public | — |
| `POST/PATCH/DELETE /api/technologies/*` | `ADMIN` | `technology:manage` |
| `GET /api/featured` | Public | — |
| `POST/DELETE /api/admin/featured/*` | `ADMIN` | `featured:manage` |
| `GET /api/admin/users` | `ADMIN` | `user:manage` |
| `POST /api/admin/users/:id/role` | `ADMIN` | `user:manage` |
| `POST /api/admin/users/:id/suspend` | `ADMIN` | `user:manage` |
| `GET /api/companies/:id/analytics` | `COMPANY` (own) | `analytics:view:own` |
| `GET /api/admin/analytics` | `ADMIN` | `analytics:view:all` |
| `GET /api/notifications` | Authenticated | — (own) |
| `PATCH /api/notifications/:id/read` | Authenticated | — (own) |
| `POST /api/webhooks/clerk` | Signature | — |
| `POST /api/webhooks/cloudinary` | Signature | — |

---

## 5. Full Endpoint Reference

Conventions used in every block below: **Auth** names the platform role and (in parentheses) the ownership constraint; **Permission** is the `config/roles.ts` string; **Errors** lists the codes reachable *in addition to* the universal `401` (when auth required), `429 RATE_LIMITED`, and `500 INTERNAL_ERROR` (§6).

---

### 5.1 Companies

Model: `Company` (`02-TRD.md` §10.2). Soft-deleted rows (`deletedAt != null`) are invisible to all non-Admin reads. A company is invisible to Students until `verificationStatus = VERIFIED` (PRD FR-12).

#### `GET /api/companies` — List / search companies

- **Auth:** Public.
- **Description:** Paginated, filterable, sortable list of **verified** companies. Full filter/sort spec in §9.
- **Query params:** `q`, `category`, `technology`, `fundingStage`, `remotePolicy`, `visaSponsorship`, `employeeCount`, `location`, `sort`, `page`, `pageSize` (see §9 for exact grammar and defaults).
- **Query Zod:**

```ts
// features/companies/schema.ts
export const listCompaniesQuery = z.object({
  q:               z.string().trim().min(1).max(120).optional(),
  category:        z.string().trim().optional(),      // category slug
  technology:      z.string().trim().optional(),      // technology slug
  fundingStage:    FundingStage.optional(),
  remotePolicy:    RemotePolicy.optional(),
  visaSponsorship: z.coerce.boolean().optional(),
  employeeCount:   z.enum(["1-10","11-50","51-200","201-500","500+"]).optional(),
  location:        z.string().trim().max(120).optional(),
  sort:            z.enum(["trending", "recent", "name"]).default("recent"),
  page:            z.coerce.number().int().min(1).default(1),
  pageSize:        z.coerce.number().int().min(1).max(50).default(20),
});
```

- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clx7a1b2c3d4e5f6g7h8i9j0k",
      "slug": "sarvam-ai",
      "name": "Sarvam AI",
      "tagline": "Building AI for India",
      "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png",
      "fundingStage": "SERIES_A",
      "remotePolicy": "REMOTE",
      "visaSponsorship": false,
      "employeeCountRange": "51-200",
      "verified": true,
      "isFeatured": true,
      "categories": ["ai-ml", "developer-tools"],
      "openInternshipCount": 3,
      "createdAt": "2026-05-14T09:12:44.001Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 187, "totalPages": 10 }
}
```

- **Errors:** `400 VALIDATION_ERROR` (bad enum/param).

#### `GET /api/companies/:slug` — Full company profile

- **Auth:** Public.
- **Path params:** `slug` — the company slug (e.g. `sarvam-ai`).
- **Description:** Full public profile with all modules from PRD §17 (hero, about, products, news, funding, hiring timeline, internships, tech stack, founders, links, locations). Only returns `VERIFIED`, non-deleted companies to the public; an Admin session additionally sees `UNVERIFIED`/`PENDING`/`REJECTED` companies.
- **Success `200`:**

```json
{
  "id": "clx7a1b2c3d4e5f6g7h8i9j0k",
  "slug": "sarvam-ai",
  "name": "Sarvam AI",
  "tagline": "Building AI for India",
  "about": "Sarvam AI builds full-stack generative AI systems...",
  "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png",
  "bannerUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/banner.png",
  "websiteUrl": "https://www.sarvam.ai",
  "fundingStage": "SERIES_A",
  "remotePolicy": "REMOTE",
  "visaSponsorship": false,
  "employeeCountRange": "51-200",
  "verificationStatus": "VERIFIED",
  "isFeatured": true,
  "founders": [
    {
      "id": "clxfnd1...",
      "name": "Vivek Raghavan",
      "title": "Co-founder",
      "linkedinUrl": "https://linkedin.com/in/example",
      "photoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/founders/vivek.png",
      "isHiringManager": true
    }
  ],
  "technologies": [ { "slug": "python", "name": "Python" }, { "slug": "pytorch", "name": "PyTorch" } ],
  "categories": [ { "slug": "ai-ml", "name": "AI / ML" } ],
  "locations": [ { "id": "clxloc1...", "city": "Bengaluru", "country": "India", "isHQ": true } ],
  "links": [ { "type": "linkedin", "url": "https://linkedin.com/company/sarvam-ai" } ],
  "news": [
    { "id": "clxnews1...", "title": "Sarvam raises Series A", "url": "https://...", "publishedAt": "2026-04-02T00:00:00.000Z" }
  ],
  "openInternships": [
    { "id": "clxint1...", "slug": "frontend-intern-summer-2027", "title": "Frontend Engineering Intern — Summer 2027", "remotePolicy": "REMOTE", "location": "Remote", "publishedAt": "2026-06-20T10:00:00.000Z" }
  ],
  "createdAt": "2026-05-14T09:12:44.001Z",
  "updatedAt": "2026-06-28T18:03:11.220Z"
}
```

- **Errors:** `404 NOT_FOUND` (no such slug, soft-deleted, or not visible to caller's role).

#### `POST /api/companies` — Register a company

- **Auth:** Authenticated (any role, typically a `STUDENT` self-registering their company). On success the caller is elevated to platform role `COMPANY` and made `OWNER` of the new `Company` — role change + `Company` + `CompanyMember(OWNER)` are wrapped in **one Prisma transaction** (`02-TRD.md` §6), and Clerk `publicMetadata.role` is updated in the same unit of work so no `COMPANY`-role user ever exists without a `Company`.
- **Permission:** none required to call (this is the elevation path); a user who is already an `OWNER`/`RECRUITER` of a company may still register additional companies.
- **Description:** Creates the company in `verificationStatus = UNVERIFIED`, `status`-equivalent draft. The company is **not** publicly visible until an Admin verifies it (PRD FR-12). Required fields mirror PRD §17 (Req.) minimum to *create*; the full (Req.) set is only enforced at the `submit-for-verification` step.
- **Request body Zod:**

```ts
export const createCompanySchema = z.object({
  name:          z.string().trim().min(2).max(120),
  slug:          z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase-hyphenated").max(120),
  websiteUrl:    z.string().url(),                 // domain used for duplicate detection (FR-15)
  tagline:       z.string().trim().max(160).optional(),
  about:         z.string().trim().max(5000).optional(),
  logoUrl:       z.string().url().optional(),      // Cloudinary secure_url
  fundingStage:  FundingStage.optional(),
  remotePolicy:  RemotePolicy.optional(),
  visaSponsorship: z.boolean().default(false),
  employeeCountRange: z.enum(["1-10","11-50","51-200","201-500","500+"]).optional(),
  categorySlugs: z.array(z.string()).max(5).optional(),
});
```

- **Success `201`:**

```json
{
  "id": "clxnewco...",
  "slug": "acme-labs",
  "name": "Acme Labs",
  "verificationStatus": "UNVERIFIED",
  "isFeatured": false,
  "membership": { "userId": "clxuser...", "role": "OWNER" },
  "createdAt": "2026-07-03T14:22:10.512Z"
}
```

- **Errors:**
  - `400 VALIDATION_ERROR` — missing/invalid fields.
  - `409 CONFLICT` — `slug` already taken, **or** a company with the same registered domain already exists (duplicate detection, FR-15). Message distinguishes the two: `"Slug already taken."` vs `"A company for this domain already exists and is pending review."`

#### `PATCH /api/companies/:id` — Update profile fields

- **Auth:** `COMPANY` **OWNER** of the company (`RECRUITER` cannot edit the profile — PRD §7.2), **or** `ADMIN` (seed/moderation path, FR-14).
- **Permission:** `company:update:own` (owner) or `company:moderate` (admin).
- **Path params:** `id` — company `cuid`.
- **Description:** Partial update of profile fields. **`slug` is not editable here** (immutable-by-default, Admin-only action). Editing the **registered domain (`websiteUrl`)** is a re-verification-sensitive change: it reverts `verificationStatus` to `PENDING` and re-queues the company for Admin review (PRD §14.2, edge case §23). Editing a verified company's non-sensitive fields does **not** trigger re-verification (FR-13). Successful edits fire `revalidateTag('company:{slug}')` (`02-TRD.md` §13).
- **Request body Zod:** (all optional; at least one required)

```ts
export const updateCompanySchema = z.object({
  name:          z.string().trim().min(2).max(120).optional(),
  tagline:       z.string().trim().max(160).nullable().optional(),
  about:         z.string().trim().max(5000).nullable().optional(),
  logoUrl:       z.string().url().nullable().optional(),
  bannerUrl:     z.string().url().nullable().optional(),
  websiteUrl:    z.string().url().optional(),         // re-verification-sensitive
  fundingStage:  FundingStage.nullable().optional(),
  remotePolicy:  RemotePolicy.nullable().optional(),
  visaSponsorship: z.boolean().optional(),
  employeeCountRange: z.enum(["1-10","11-50","51-200","201-500","500+"]).nullable().optional(),
  categorySlugs: z.array(z.string()).max(5).optional(),
  technologySlugs: z.array(z.string()).max(30).optional(),
}).refine(o => Object.keys(o).length > 0, { message: "At least one field required." });
```

- **Success `200`:** the updated company representation (same shape as `GET /:slug`, possibly with `verificationStatus: "PENDING"` if the domain changed).
- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN` (not owner/admin, or a `RECRUITER` attempting profile edit), `404 NOT_FOUND`, `409 CONFLICT` (new domain collides with another company).

#### `DELETE /api/companies/:id` — Soft-delete / unpublish (Admin moderation)

- **Auth:** `ADMIN`.
- **Permission:** `company:moderate`.
- **Description:** Sets `deletedAt` (soft delete, `02-TRD.md` §10.1) — removes the company from all public surfaces while retaining it for audit/restore. Reversible by a subsequent Admin restore action. Not a hard delete.
- **Success `204`:** empty body.
- **Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`.

#### `POST /api/companies/:id/verify` — Verification decision (Admin)

Documented in full under **§5.8 Verification**. Summary: `ADMIN`, `company:verify`, body carries the decision.

---

### 5.2 Company sub-resources

All sub-resource writes require `COMPANY` **OWNER** of the parent company (`company:update:own`), except team management which requires `company:team:manage` (also OWNER-only). Reads of these sub-resources are folded into `GET /api/companies/:slug`; the dedicated collection endpoints below exist for the editor UI and programmatic clients.

#### Team members — `/api/companies/:id/members`

| Method | Description |
|---|---|
| `GET` | List members `{ userId, email, role, createdAt }`. |
| `POST` | Invite a member by email with a sub-role. |
| `PATCH /:memberId` | Change a member's sub-role. |
| `DELETE /:memberId` | Revoke a member. |

- **Auth:** `COMPANY` OWNER. **Permission:** `company:team:manage`.
- **`POST` body Zod:**

```ts
export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role:  CompanyMemberRole.default("RECRUITER"),   // OWNER | RECRUITER
});
```

- **`POST` success `201`:**

```json
{ "id": "clxmbr...", "companyId": "clx7a1...", "email": "recruiter@acme.dev", "role": "RECRUITER", "status": "INVITED", "createdAt": "2026-07-03T14:30:00.000Z" }
```

- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN` (not OWNER), `404 NOT_FOUND` (company), `409 CONFLICT` (`@@unique([companyId, userId])` — user already a member). Transferring ownership (making another member `OWNER`) is an OWNER-only `PATCH` that requires confirmation and demotes the acting owner per PRD §14.2; attempting to remove the **last** `OWNER` returns `409 CONFLICT` (`"A company must retain at least one owner."`).

#### Founders — `/api/companies/:id/founders`

- **Auth:** `COMPANY` OWNER. **Permission:** `company:update:own`. Model: `Founder` (`02-TRD.md` §10.2). Founders, Co-founders, and Hiring Managers are the same underlying entity distinguished by fields (PRD §17).

```ts
export const founderSchema = z.object({
  name:            z.string().trim().min(1).max(120),
  title:           z.string().trim().max(120).optional(),   // "Co-founder & CEO"
  linkedinUrl:     z.string().url().optional(),
  twitterUrl:      z.string().url().optional(),
  photoUrl:        z.string().url().optional(),
  isHiringManager: z.boolean().default(false),
});
```

- `POST` → `201` founder; `PATCH /:founderId` → `200`; `DELETE /:founderId` → `204`.
- **Errors:** `400`, `403`, `404`.

#### Company news — `/api/companies/:id/news`

- **Auth:** `COMPANY` OWNER. **Permission:** `company:update:own`. Model: `CompanyNews`. Public profile shows the most recent posts (PRD §14.2 soft cap ~10).

```ts
export const companyNewsSchema = z.object({
  title:       z.string().trim().min(2).max(160),
  url:         z.string().url().optional(),
  publishedAt: z.coerce.date(),
});
```

- `POST` → `201`; `PATCH /:newsId` → `200`; `DELETE /:newsId` → `204`. **Errors:** `400`, `403`, `404`.

#### Links & locations

Managed as arrays through `PATCH /api/companies/:id` (`links`, `locations` write via nested-write helpers) for the common case; dedicated `/links` and `/locations` collection endpoints follow the same OWNER-only, `company:update:own` pattern and Zod shapes:

```ts
export const companyLinkSchema = z.object({
  type: z.enum(["twitter","linkedin","github","crunchbase","website","blog","careers","docs","instagram","youtube"]),
  url:  z.string().url(),
});
export const companyLocationSchema = z.object({
  city:    z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  isHQ:    z.boolean().default(false),
});
```

---

### 5.3 Internships

Model: `Internship` (`02-TRD.md` §10.2). Lifecycle: `DRAFT → PUBLISHED → ARCHIVED`. Only a `VERIFIED` company may transition an internship to `PUBLISHED` (PRD FR-22). Public reads return only `PUBLISHED`, non-deleted internships.

#### `GET /api/internships` — List / search internships

- **Auth:** Public.
- **Query params:** `q`, `category`, `technology`, `remotePolicy`, `location`, `companySlug`, `sort` (`recent`|`name`), `page`, `pageSize`. Grammar in §9.
- **Query Zod:**

```ts
export const listInternshipsQuery = z.object({
  q:            z.string().trim().min(1).max(120).optional(),
  category:     z.string().trim().optional(),
  technology:   z.string().trim().optional(),
  remotePolicy: RemotePolicy.optional(),
  location:     z.string().trim().max(120).optional(),
  companySlug:  z.string().trim().optional(),
  sort:         z.enum(["recent", "name"]).default("recent"),
  page:         z.coerce.number().int().min(1).default(1),
  pageSize:     z.coerce.number().int().min(1).max(50).default(20),
});
```

- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clxint1...",
      "slug": "frontend-intern-summer-2027",
      "title": "Frontend Engineering Intern — Summer 2027",
      "company": { "slug": "sarvam-ai", "name": "Sarvam AI", "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png", "verified": true },
      "location": "Remote",
      "remotePolicy": "REMOTE",
      "stipend": "₹60,000 / month",
      "duration": "12 weeks",
      "status": "PUBLISHED",
      "publishedAt": "2026-06-20T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 42, "totalPages": 3 }
}
```

- **Errors:** `400 VALIDATION_ERROR`.

#### `GET /api/internships/:id` — Internship detail

- **Auth:** Public. **Path params:** `id` — internship `cuid` (the slug is also accepted for SEO URLs).
- **Success `200`:**

```json
{
  "id": "clxint1...",
  "slug": "frontend-intern-summer-2027",
  "title": "Frontend Engineering Intern — Summer 2027",
  "description": "You'll work with our web team on the design-system and app shell...",
  "company": { "id": "clx7a1...", "slug": "sarvam-ai", "name": "Sarvam AI", "verified": true },
  "location": "Remote",
  "remotePolicy": "REMOTE",
  "stipend": "₹60,000 / month",
  "duration": "12 weeks",
  "applyUrl": "https://jobs.sarvam.ai/apply/frontend-intern",
  "status": "PUBLISHED",
  "publishedAt": "2026-06-20T10:00:00.000Z",
  "createdAt": "2026-06-18T08:00:00.000Z",
  "updatedAt": "2026-06-20T10:00:00.000Z"
}
```

- **Errors:** `404 NOT_FOUND` (no such internship, soft-deleted, or `DRAFT`/`ARCHIVED` requested by a non-owner). A student who bookmarked an internship that was later archived receives the full record with `status: "ARCHIVED"` **only via** their bookmarks view (PRD edge case §23 — "no longer open" state); the public detail endpoint returns `404` for archived listings.

#### `POST /api/internships` — Create (defaults to `DRAFT`)

- **Auth:** `COMPANY` member (OWNER or RECRUITER) of the target company.
- **Permission:** `internship:create`.
- **Description:** Creates a `DRAFT` internship. Does not require the company to be verified to *create* a draft; verification is only checked at `publish`.
- **Request body Zod:**

```ts
export const createInternshipSchema = z.object({
  companyId:    z.string().cuid(),
  title:        z.string().trim().min(4).max(160),
  slug:         z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  description:  z.string().trim().min(20).max(20000),   // sanitized rich text
  location:     z.string().trim().max(120).optional(),
  remotePolicy: RemotePolicy.optional(),
  stipend:      z.string().trim().max(120).optional(),
  duration:     z.string().trim().max(120).optional(),
  applyUrl:     z.string().url(),                        // external ATS deep-link (FR-25)
  categorySlug: z.string().trim().optional(),
});
```

- **Success `201`:**

```json
{ "id": "clxint2...", "slug": "backend-intern-fall-2027", "title": "Backend Intern — Fall 2027", "status": "DRAFT", "companyId": "clx7a1...", "publishedAt": null, "createdAt": "2026-07-03T14:40:00.000Z" }
```

- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN` (not a member of `companyId`), `404 NOT_FOUND` (company), `409 CONFLICT` (slug taken).

#### `PATCH /api/internships/:id` — Update

- **Auth:** `COMPANY` (own — member of the internship's company). **Permission:** `internship:update:own`.
- **Body Zod:** all fields from `createInternshipSchema` except `companyId` and `slug`, all optional, `.refine` non-empty.
- **Success `200`:** updated internship. Editing an internship resets its staleness clock (FR-24) — `updatedAt` bumps.
- **Errors:** `400`, `403`, `404`.

#### `POST /api/internships/:id/publish` — `DRAFT`/`ARCHIVED` → `PUBLISHED`

- **Auth:** `COMPANY` (own). **Permission:** `internship:update:own`.
- **Description:** Transitions to `PUBLISHED` and sets `publishedAt` (first publish only). **Server-side gate:** the parent company's `verificationStatus` must be `VERIFIED` (PRD FR-22) — else `403 FORBIDDEN` with a message pointing to verification. Idempotent: publishing an already-`PUBLISHED` internship returns `200` with the current record (§2.6). Fires `revalidateTag('company:{slug}')` and enqueues the "bookmarked company posted a new internship" notification (PRD FR-61, batched digest).
- **Request body:** none.
- **Success `200`:**

```json
{ "id": "clxint2...", "status": "PUBLISHED", "publishedAt": "2026-07-03T14:45:12.000Z" }
```

- **Errors:**
  - `403 FORBIDDEN` — not an owner/member **or** `{ "code": "FORBIDDEN", "message": "Company must be verified before publishing an internship." }` when the company is not `VERIFIED`.
  - `404 NOT_FOUND` — no such internship.

#### `POST /api/internships/:id/archive` — → `ARCHIVED`

- **Auth:** `COMPANY` (own). **Permission:** `internship:archive:own`.
- **Description:** Transitions to `ARCHIVED`, removing the listing from all Student-facing search/browse while retaining it for analytics (PRD FR-23). Idempotent. Existing student bookmarks/tracker entries are preserved (privacy — student data is theirs, PRD §13.6).
- **Success `200`:**

```json
{ "id": "clxint2...", "status": "ARCHIVED", "updatedAt": "2026-07-03T14:50:00.000Z" }
```

- **Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`.

#### `DELETE /api/internships/:id` — Unpublish (Admin moderation)

- **Auth:** `ADMIN`. **Permission:** `internship:moderate`. Soft-delete (sets `deletedAt`). `204` on success; `403`/`404` otherwise.

---

### 5.4 Bookmarks

Model: `Bookmark` — polymorphic via `targetType` + nullable `companyId`/`internshipId` (`02-TRD.md` §10.3). Student-scoped; every bookmark belongs to the acting user.

#### `GET /api/bookmarks` — List own bookmarks

- **Auth:** Authenticated (student). Returns only the caller's bookmarks.
- **Query params:** `targetType` (`COMPANY`|`INTERNSHIP`, optional filter — powers the two dashboard tabs), `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clxbm1...",
      "targetType": "COMPANY",
      "company": { "slug": "sarvam-ai", "name": "Sarvam AI", "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png", "verified": true },
      "internship": null,
      "createdAt": "2026-07-01T11:00:00.000Z"
    },
    {
      "id": "clxbm2...",
      "targetType": "INTERNSHIP",
      "company": null,
      "internship": { "id": "clxint1...", "slug": "frontend-intern-summer-2027", "title": "Frontend Engineering Intern — Summer 2027", "status": "PUBLISHED" },
      "createdAt": "2026-07-02T09:30:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 2, "totalPages": 1 }
}
```

#### `POST /api/bookmarks` — Create bookmark

- **Auth:** `STUDENT`. **Permission:** `bookmark:create`.
- **Request body Zod:**

```ts
export const createBookmarkSchema = z.discriminatedUnion("targetType", [
  z.object({ targetType: z.literal("COMPANY"),    targetId: z.string().cuid() }),
  z.object({ targetType: z.literal("INTERNSHIP"), targetId: z.string().cuid() }),
]);
```

The handler maps `targetId` onto the correct FK column (`companyId` or `internshipId`) based on `targetType`.

- **Success `201`:**

```json
{ "id": "clxbm3...", "targetType": "COMPANY", "companyId": "clx7a1...", "internshipId": null, "createdAt": "2026-07-03T14:55:00.000Z" }
```

- **Errors:**
  - `400 VALIDATION_ERROR` — invalid discriminator/id.
  - `404 NOT_FOUND` — target company/internship does not exist or is not visible.
  - `409 CONFLICT` — already bookmarked (`@@unique([userId, companyId, internshipId])`).

#### `DELETE /api/bookmarks/:id` — Remove bookmark

- **Auth:** `STUDENT`. **Permission:** `bookmark:delete`. Ownership-scoped: `WHERE id = :id AND userId = ctx.userId`.
- **Success `204`:** empty body.
- **Errors:** `403 FORBIDDEN` (bookmark belongs to another user), `404 NOT_FOUND`.

---

### 5.5 Applications

Model: `Application` — a **private, per-student manual tracker** (`02-TRD.md` §10.3), never visible to Companies or Admins (PRD §13.6, FR-44). Decoupled from real application submission — Verity has no ATS in V1.

#### `GET /api/applications` — List own tracked applications

- **Auth:** `STUDENT`. Returns only the caller's entries. Powers the Kanban board (PRD §14.1).
- **Query params:** `status` (`ApplicationStatus`, optional), `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clxapp1...",
      "internship": { "id": "clxint1...", "slug": "frontend-intern-summer-2027", "title": "Frontend Engineering Intern — Summer 2027", "status": "PUBLISHED", "company": { "slug": "sarvam-ai", "name": "Sarvam AI" } },
      "status": "APPLIED",
      "notes": "Referred by campus ambassador. Follow up in 1 week.",
      "appliedAt": "2026-06-25T00:00:00.000Z",
      "createdAt": "2026-06-24T18:00:00.000Z",
      "updatedAt": "2026-06-25T08:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 1, "totalPages": 1 }
}
```

#### `POST /api/applications` — Create a tracked application

- **Auth:** `STUDENT`. **Permission:** `application:create`.
- **Request body Zod:**

```ts
export const createApplicationSchema = z.object({
  internshipId: z.string().cuid(),
  status:       ApplicationStatus.default("SAVED"),
  notes:        z.string().trim().max(4000).optional(),
  appliedAt:    z.coerce.date().optional(),      // required-ish when status >= APPLIED (see refine)
}).refine(
  o => !["APPLIED","OA","INTERVIEW","OFFER","REJECTED","WITHDRAWN"].includes(o.status) || !!o.appliedAt,
  { path: ["appliedAt"], message: "appliedAt is required once status is APPLIED or later." },
);
```

- **Success `201`:**

```json
{ "id": "clxapp2...", "internshipId": "clxint2...", "status": "SAVED", "notes": null, "appliedAt": null, "createdAt": "2026-07-03T15:00:00.000Z" }
```

- **Errors:** `400 VALIDATION_ERROR`, `404 NOT_FOUND` (internship), `409 CONFLICT` (`@@unique([userId, internshipId])` — already tracking this internship).

#### `PATCH /api/applications/:id` — Update status / notes

- **Auth:** `STUDENT`. **Permission:** `application:update:own`. Ownership-scoped.
- **Description:** Update `status` (drag-to-update on the board), `notes`, or `appliedAt`. The state machine is *advisory*, not strictly enforced — students may correct mistakes freely (e.g., move `INTERVIEW` back to `APPLIED`); only enum validity is enforced.
- **Body Zod:**

```ts
export const updateApplicationSchema = z.object({
  status:    ApplicationStatus.optional(),
  notes:     z.string().trim().max(4000).nullable().optional(),
  appliedAt: z.coerce.date().nullable().optional(),
}).refine(o => Object.keys(o).length > 0, { message: "At least one field required." });
```

- **Success `200`:** updated application.
- **Errors:** `400`, `403` (not owner), `404`.

#### `DELETE /api/applications/:id` — Remove tracker entry

- **Auth:** `STUDENT`. **Permission:** `application:update:own`. `204` / `403` / `404`.

---

### 5.6 Students / Profile

Model: `StudentProfile` (`02-TRD.md` §10.2). `resumeUrl` exists as a forward-compatible placeholder (PRD §21) — the upload UI is deferred, but the field and endpoint accept it now so V2 needs no migration.

#### `GET /api/profile` — Get own profile

- **Auth:** Authenticated. Returns the caller's `User` + `StudentProfile`.
- **Success `200`:**

```json
{
  "user": { "id": "clxuser...", "email": "priya@example.edu", "name": "Priya S.", "avatarUrl": "https://img.clerk.com/...", "role": "STUDENT" },
  "profile": {
    "college": "State University",
    "gradYear": 2028,
    "bio": "CS sophomore interested in AI infra and fintech.",
    "interests": ["ai-ml", "fintech"],
    "resumeUrl": null
  }
}
```

- **Errors:** `401` if unauthenticated.

#### `PATCH /api/profile` — Update own profile

- **Auth:** `STUDENT`. **Permission:** `profile:update:own`.
- **Body Zod:**

```ts
export const updateProfileSchema = z.object({
  name:      z.string().trim().min(1).max(120).optional(),
  college:   z.string().trim().max(160).nullable().optional(),
  gradYear:  z.coerce.number().int().min(2000).max(2100).nullable().optional(),
  bio:       z.string().trim().max(2000).nullable().optional(),
  interests: z.array(z.string()).max(10).optional(),   // category slugs → drives rules-based recs
  resumeUrl: z.string().url().nullable().optional(),   // Cloudinary secure_url (future use)
}).refine(o => Object.keys(o).length > 0, { message: "At least one field required." });
```

- **Success `200`:** updated `{ user, profile }`.
- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN` (a `COMPANY`/`ADMIN` has no student profile to edit here).

#### `GET /api/admin/users/:id` — Read a student (Admin support)

Covered under §5.13. Company accounts never see individual student data (PRD §13.6, §14 Security).

---

### 5.7 Search & Suggest

`GET /api/search` and `/api/search/suggest` are public and on the middleware allowlist (`02-TRD.md` §8). Backed by Postgres FTS (`02-TRD.md` §12), `websearch_to_tsquery` — quoted phrases and `-exclude` terms are supported for free.

#### `GET /api/search` — Full search across companies (+ internships)

- **Auth:** Public.
- **Query params:** identical filter grammar to `GET /api/companies` (§9), plus `type` to scope the entity set.
- **Query Zod:**

```ts
export const searchQuery = listCompaniesQuery.extend({
  type: z.enum(["companies", "internships", "all"]).default("companies"),
});
```

- **Description:** Relevance-ranked (`ts_rank`, weighted A>B>C per `02-TRD.md` §10.4), tie-broken by `isFeatured DESC`. When `q` is empty, `sort` defaults to `recent` (PRD §16). Only `VERIFIED` companies / `PUBLISHED` internships are returned.
- **Success `200`:**

```json
{
  "data": [
    { "type": "company", "id": "clx7a1...", "slug": "sarvam-ai", "name": "Sarvam AI", "tagline": "Building AI for India", "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png", "verified": true, "rank": 0.6234 }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 12, "totalPages": 1 },
  "query": { "q": "ai india", "appliedFilters": { "category": "ai-ml" } }
}
```

- **Zero-result state (PRD §16):** returns `200` with `data: []` and a `suggestions` block so the UI never dead-ends:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 0, "totalPages": 0 },
  "query": { "q": "nonexistentco" },
  "suggestions": { "browseCategories": ["ai-ml", "fintech", "developer-tools"], "suggestACompanyUrl": "/suggest-company" }
}
```

Zero-result queries are logged (aggregate) as a catalog-gap signal (PRD §19.2, §24).

- **Errors:** `400 VALIDATION_ERROR`.

#### `GET /api/search/suggest` — Typeahead

- **Auth:** Public.
- **Query params:** `q` (required, min 1 char). Returns up to **8** company-name matches (PRD §16), optimized for the debounced (250ms) in-nav search bar.
- **Query Zod:**

```ts
export const suggestQuery = z.object({ q: z.string().trim().min(1).max(80) });
```

- **Success `200`:**

```json
{
  "data": [
    { "slug": "sarvam-ai", "name": "Sarvam AI", "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png" },
    { "slug": "sarvam-labs", "name": "Sarvam Labs", "logoUrl": null }
  ]
}
```

> Note: `suggest` returns a **capped, non-paginated** `{ data }` (max 8) — it is the single documented exception to the "everything paginated" rule because it is a latency-critical typeahead, not a browsable list. It still never returns a bare array.

- **Errors:** `400 VALIDATION_ERROR` (empty `q`).

---

### 5.8 Verification (Admin)

Model: `Company.verificationStatus` (`VerificationStatus` enum). Implements the Admin verification workflow (PRD §14.3, FR-50/51).

#### `GET /api/admin/verification-queue` — Pending companies

- **Auth:** `ADMIN`. **Permission:** `company:verify`.
- **Description:** Companies in `verificationStatus = PENDING`, sorted **oldest-first** (PRD §14.3), with the submitted fields + quick-review links for manual cross-checking.
- **Query params:** `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clxpend1...",
      "slug": "acme-labs",
      "name": "Acme Labs",
      "websiteUrl": "https://acmelabs.dev",
      "verificationStatus": "PENDING",
      "submittedAt": "2026-07-02T10:00:00.000Z",
      "submittedBy": { "userId": "clxuser...", "email": "founder@acmelabs.dev" },
      "reviewLinks": { "domain": "https://acmelabs.dev", "linkedin": "https://linkedin.com/company/acme-labs" },
      "priorRejectionReason": null
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 4, "totalPages": 1 }
}
```

- **Errors:** `403 FORBIDDEN`.

#### `POST /api/companies/:id/verify` — Verification decision

- **Auth:** `ADMIN`. **Permission:** `company:verify`.
- **Description:** Single action endpoint carrying the decision (`APPROVE` | `REJECT` | `REQUEST_CHANGES`). Consolidates PRD FR-51's three actions into one route (matching TRD §9.2's single `/verify` path). On `APPROVE`, sets `verificationStatus = VERIFIED`, makes the company publicly visible, and dispatches the verification-approved notification (PRD FR-60, in-app + email). `REJECT`/`REQUEST_CHANGES` require a `reason` and dispatch the corresponding notification. A resubmission after rejection creates a new `PENDING` cycle that carries the prior reason forward (edge case, PRD §23).
- **Request body Zod:**

```ts
export const verifyDecisionSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("APPROVE") }),
  z.object({ decision: z.literal("REJECT"),          reason: z.string().trim().min(4).max(1000) }),
  z.object({ decision: z.literal("REQUEST_CHANGES"), reason: z.string().trim().min(4).max(1000) }),
]);
```

- **Success `200`:**

```json
{ "id": "clxpend1...", "verificationStatus": "VERIFIED", "verifiedAt": "2026-07-03T15:10:00.000Z", "decidedBy": "clxadmin..." }
```

For a rejection:

```json
{ "id": "clxpend1...", "verificationStatus": "REJECTED", "reason": "Domain does not resolve to the named company.", "decidedBy": "clxadmin..." }
```

- **Errors:**
  - `400 VALIDATION_ERROR` — missing `reason` on `REJECT`/`REQUEST_CHANGES`.
  - `403 FORBIDDEN` — not an Admin.
  - `404 NOT_FOUND` — no such company.
  - `409 CONFLICT` — company is not in a decidable state (e.g., already `VERIFIED` and not resubmitted): `{ "code": "CONFLICT", "message": "Company is not pending verification." }`

---

### 5.9 Reports & Moderation

Model: `Report` (`02-TRD.md` §10.2), `status` ∈ `OPEN | RESOLVED | DISMISSED`. Any authenticated user may file (PRD FR-52); only Admins handle (`report:handle`, FR-53).

#### `POST /api/reports` — File a report

- **Auth:** Authenticated (Student or Company). No special permission — filing is a baseline capability.
- **Request body Zod:**

```ts
export const createReportSchema = z.object({
  targetCompanyId: z.string().cuid().optional(),
  targetInternshipId: z.string().cuid().optional(),
  reason: z.string().trim().min(4).max(1000),
}).refine(o => !!o.targetCompanyId !== !!o.targetInternshipId, {
  message: "Exactly one of targetCompanyId or targetInternshipId is required.",
});
```

- **Success `201`:**

```json
{ "id": "clxrep1...", "status": "OPEN", "reason": "Listing appears fraudulent — company domain parked.", "createdAt": "2026-07-03T15:15:00.000Z" }
```

- **Errors:** `400 VALIDATION_ERROR`, `404 NOT_FOUND` (target).

#### `GET /api/admin/reports` — List reports

- **Auth:** `ADMIN`. **Permission:** `report:handle`.
- **Query params:** `status` (`OPEN`|`RESOLVED`|`DISMISSED`, default `OPEN`), `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    {
      "id": "clxrep1...",
      "status": "OPEN",
      "reason": "Listing appears fraudulent — company domain parked.",
      "reportedBy": { "userId": "clxuser...", "email": "priya@example.edu" },
      "targetCompany": { "id": "clx7a1...", "slug": "acme-labs", "name": "Acme Labs" },
      "createdAt": "2026-07-03T15:15:00.000Z",
      "resolvedAt": null
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 1, "totalPages": 1 }
}
```

- **Errors:** `403 FORBIDDEN`.

#### `PATCH /api/admin/reports/:id` — Resolve a report

- **Auth:** `ADMIN`. **Permission:** `report:handle`.
- **Description:** Resolve or dismiss, optionally taking a moderation action against the target in the same call (`dismiss`, `warn`, `suspend`, `remove` — PRD FR-53). `suspend`/`remove` soft-delete the target company/internship. Dispatches the "report resolved" notification to the reporter (PRD §20).
- **Body Zod:**

```ts
export const resolveReportSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
  action: z.enum(["NONE", "WARN", "SUSPEND", "REMOVE"]).default("NONE"),
  note:   z.string().trim().max(1000).optional(),
});
```

- **Success `200`:**

```json
{ "id": "clxrep1...", "status": "RESOLVED", "action": "SUSPEND", "resolvedAt": "2026-07-03T15:20:00.000Z", "resolvedBy": "clxadmin..." }
```

- **Errors:** `400`, `403`, `404`.

---

### 5.10 Categories (taxonomy)

Model: `Category` (`02-TRD.md` §10.2). Canonical, Admin-managed vocabulary (PRD FR-54). Filters depend on it, so no freeform sprawl.

| Method | Path | Auth | Permission |
|---|---|---|---|
| `GET` | `/api/categories` | Public | — |
| `POST` | `/api/categories` | `ADMIN` | `category:manage` |
| `PATCH` | `/api/categories/:id` | `ADMIN` | `category:manage` |
| `DELETE` | `/api/categories/:id` | `ADMIN` | `category:manage` |
| `POST` | `/api/categories/merge` | `ADMIN` | `category:manage` |

- **`GET` success `200`:**

```json
{
  "data": [
    { "id": "clxcat1...", "slug": "ai-ml", "name": "AI / ML", "companyCount": 34 },
    { "id": "clxcat2...", "slug": "fintech", "name": "Fintech", "companyCount": 21 }
  ],
  "meta": { "page": 1, "pageSize": 50, "totalCount": 18, "totalPages": 1 }
}
```

- **`POST` / `PATCH` body Zod:**

```ts
export const categorySchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(60),
  name: z.string().trim().min(1).max(80),
});
```

- **`POST /api/categories/merge`** — the rename/dedup tool (PRD §14.3, "merge React.js into React"):

```ts
export const mergeTaxonomySchema = z.object({
  sourceId: z.string().cuid(),   // taxonomy row to retire
  targetId: z.string().cuid(),   // survivor; all associations re-pointed
});
```

Re-points every `CompanyCategory` association from `sourceId` to `targetId` (deduping the composite PK) in one transaction, then deletes the source. `200` with `{ merged: N }` count.

- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT` (slug taken; or `DELETE` of a category still referenced by companies — returns `{ "code":"CONFLICT", "message":"Category is in use; merge or reassign first." }`).

---

### 5.11 Technologies (taxonomy)

Model: `Technology`. Identical shape and rules to Categories; permission is `technology:manage`.

| Method | Path | Auth | Permission |
|---|---|---|---|
| `GET` | `/api/technologies` | Public | — |
| `POST` | `/api/technologies` | `ADMIN` | `technology:manage` |
| `PATCH` | `/api/technologies/:id` | `ADMIN` | `technology:manage` |
| `DELETE` | `/api/technologies/:id` | `ADMIN` | `technology:manage` |
| `POST` | `/api/technologies/merge` | `ADMIN` | `technology:manage` |

- **`GET` success `200`:**

```json
{
  "data": [
    { "id": "clxtec1...", "slug": "react", "name": "React", "companyCount": 52 },
    { "id": "clxtec2...", "slug": "python", "name": "Python", "companyCount": 48 }
  ],
  "meta": { "page": 1, "pageSize": 50, "totalCount": 60, "totalPages": 2 }
}
```

- **Body Zod:** same `categorySchema` shape (`slug`, `name`); `merge` uses `mergeTaxonomySchema` re-pointing `CompanyTechnology`.
- **Errors:** `400`, `403`, `404`, `409`.

---

### 5.12 Featured companies

Model: `Company.isFeatured` (+ a featuring window). Editorial surfacing on the Student dashboard (PRD FR-55, §14.3). Feature windows are checked **server-side on every dashboard render** (PRD edge case §23) — an expired window is respected immediately, never cached client-side.

#### `GET /api/featured` — Currently featured companies (public)

- **Auth:** Public. Returns companies whose feature window is active *now*.
- **Success `200`:**

```json
{
  "data": [
    { "id": "clx7a1...", "slug": "sarvam-ai", "name": "Sarvam AI", "logoUrl": "https://res.cloudinary.com/verity/image/upload/f_auto,q_auto/companies/sarvam-ai/logo.png", "tagline": "Building AI for India", "featuredUntil": "2026-07-31T00:00:00.000Z" }
  ],
  "meta": { "page": 1, "pageSize": 10, "totalCount": 1, "totalPages": 1 }
}
```

#### `POST /api/admin/featured` — Feature a company

- **Auth:** `ADMIN`. **Permission:** `featured:manage`.
- **Body Zod:**

```ts
export const featureCompanySchema = z.object({
  companyId: z.string().cuid(),
  startsAt:  z.coerce.date(),
  endsAt:    z.coerce.date(),
}).refine(o => o.endsAt > o.startsAt, { path: ["endsAt"], message: "endsAt must be after startsAt." });
```

- **Description:** Only a `VERIFIED` company may be featured (`409 CONFLICT` otherwise). Sets `isFeatured` and records the window.
- **Success `201`:**

```json
{ "id": "clxfeat1...", "companyId": "clx7a1...", "startsAt": "2026-07-03T00:00:00.000Z", "endsAt": "2026-07-31T00:00:00.000Z" }
```

- **Errors:** `400`, `403`, `404`, `409` (company not verified).

#### `DELETE /api/admin/featured/:id` — Remove featuring

- **Auth:** `ADMIN`. **Permission:** `featured:manage`. `204` / `403` / `404`.

---

### 5.13 Admin — Users

Model: `User`. Admin user management (PRD FR-05, §14.3, FR-01/07). Company accounts never reach these endpoints (`user:manage` is Admin-only).

#### `GET /api/admin/users` — List / search users

- **Auth:** `ADMIN`. **Permission:** `user:manage`.
- **Query params:** `q` (email/name substring), `role` (`PlatformRole`), `status` (`ACTIVE`|`SUSPENDED`), `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    { "id": "clxuser...", "email": "priya@example.edu", "name": "Priya S.", "role": "STUDENT", "status": "ACTIVE", "createdAt": "2026-06-01T00:00:00.000Z" }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 1042, "totalPages": 53 }
}
```

#### `GET /api/admin/users/:id` — User detail

- **Auth:** `ADMIN`. **Permission:** `user:manage`. Returns account metadata for support (no raw auth/password data — that lives in Clerk, PRD §14.3), including company memberships. `404` if not found.

#### `POST /api/admin/users/:id/role` — Change platform role

- **Auth:** `ADMIN`. **Permission:** `user:manage`.
- **Description:** Changes `User.role` and mirrors the change to Clerk `publicMetadata.role` in the **same transaction** (`02-TRD.md` §6) so the JWT claim stays consistent. Promoting to `ADMIN` is how the only-Admin-creates-Admin rule (PRD FR-05) is honored.
- **Body Zod:**

```ts
export const changeRoleSchema = z.object({ role: PlatformRole });  // STUDENT | COMPANY | ADMIN
```

- **Success `200`:**

```json
{ "id": "clxuser...", "role": "ADMIN", "updatedAt": "2026-07-03T15:30:00.000Z" }
```

- **Errors:** `400 VALIDATION_ERROR`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT` (demoting the last `OWNER` of a company below `COMPANY` without reassignment).

#### `POST /api/admin/users/:id/suspend` & `.../reinstate` — Account moderation

- **Auth:** `ADMIN`. **Permission:** `user:manage`.
- **Description:** Suspension (PRD FR-07) blocks sign-in via a Clerk ban + sets an internal `status`; reinstate reverses it. Body optional `{ reason }`. `200` with `{ id, status }`; `403`/`404` otherwise.

---

### 5.14 Analytics

Aggregate, anonymized (PRD §13.6). No endpoint ever returns which individual student viewed/bookmarked anything.

#### `GET /api/companies/:id/analytics` — Company-facing analytics

- **Auth:** `COMPANY` member (own company). **Permission:** `analytics:view:own`.
- **Query params:** `range` (`30d`|`90d`, default `30d`).
- **Success `200`:**

```json
{
  "range": "30d",
  "profileViews": { "total": 1420, "trend": [ { "date": "2026-06-04", "value": 33 }, { "date": "2026-06-05", "value": 41 } ] },
  "bookmarkCount": { "total": 187, "trend": [ { "date": "2026-06-04", "value": 5 } ] },
  "internshipViews": [
    { "internshipId": "clxint1...", "title": "Frontend Engineering Intern — Summer 2027", "views": 640 }
  ],
  "profileCompleteness": 0.86
}
```

- **Errors:** `403 FORBIDDEN` (not a member of this company), `404 NOT_FOUND`.

#### `GET /api/admin/analytics` — Platform-wide analytics

- **Auth:** `ADMIN`. **Permission:** `analytics:view:all`.
- **Query params:** `range` (`7d`|`30d`|`90d`, default `30d`).
- **Success `200`:**

```json
{
  "range": "30d",
  "users": { "STUDENT": 1042, "COMPANY": 63, "ADMIN": 3, "newSignups": [ { "date": "2026-06-04", "STUDENT": 22, "COMPANY": 1 } ] },
  "companies": { "UNVERIFIED": 8, "PENDING": 4, "VERIFIED": 101, "REJECTED": 2 },
  "internships": { "DRAFT": 30, "PUBLISHED": 142, "ARCHIVED": 55 },
  "verificationQueue": { "backlog": 4, "medianTimeToDecisionMinutes": 8 },
  "topSearchTerms": [ { "term": "fintech intern", "count": 214 }, { "term": "remote ml", "count": 176 } ],
  "reports": { "open": 1, "medianResolutionHours": 6 }
}
```

- **Errors:** `403 FORBIDDEN`.

---

### 5.15 Notifications

Model: `Notification` (in-app; `02-TRD.md` §25). V1: in-app + transactional email, no push/SMS (PRD §20).

#### `GET /api/notifications` — List own notifications

- **Auth:** Authenticated. Returns only the caller's notifications.
- **Query params:** `unreadOnly` (boolean), `page`, `pageSize`.
- **Success `200`:**

```json
{
  "data": [
    { "id": "clxnot1...", "type": "COMPANY_VERIFIED", "title": "Acme Labs is now verified", "body": "Your company profile is live.", "readAt": null, "createdAt": "2026-07-03T15:10:00.000Z" },
    { "id": "clxnot2...", "type": "NEW_INTERNSHIP_BOOKMARKED_COMPANY", "title": "Sarvam AI posted a new internship", "body": "Backend Intern — Fall 2027", "readAt": "2026-07-02T09:00:00.000Z", "createdAt": "2026-07-02T08:00:00.000Z" }
  ],
  "meta": { "page": 1, "pageSize": 20, "totalCount": 2, "totalPages": 1 }
}
```

Notification `type` values map 1:1 to PRD §20 triggers: `COMPANY_VERIFIED`, `COMPANY_CHANGES_REQUESTED`, `COMPANY_REJECTED`, `TEAM_INVITE_ACCEPTED`, `NEW_INTERNSHIP_BOOKMARKED_COMPANY`, `REPORT_FILED_AGAINST_COMPANY`, `REPORT_RESOLVED`.

#### `PATCH /api/notifications/:id/read` — Mark one read

- **Auth:** Authenticated (own). Sets `readAt`. Idempotent. `200` with the updated notification; `403`/`404` otherwise.

#### `POST /api/notifications/read-all` — Mark all read

- **Auth:** Authenticated (own). Sets `readAt` on all of the caller's unread notifications. `200` with `{ updated: N }`.

---

### 5.16 Webhooks

Signature-authenticated (§3.4, §11). No session. Return `200` quickly to acknowledge; the provider retries on non-2xx.

#### `POST /api/webhooks/clerk` — Clerk user sync

- **Auth:** Svix signature (`CLERK_WEBHOOK_SECRET`).
- **Handled events:** `user.created` (upsert `User { clerkId, email, name, avatarUrl, role: STUDENT }`), `user.updated` (sync email/name/avatar; refresh the `publicMetadata.role` cache), `user.deleted` (soft-delete `User`, set `deletedAt`).
- **Success `200`:** `{ "received": true }`.
- **Errors:** `401 UNAUTHENTICATED` (bad/missing signature), `400 VALIDATION_ERROR` (unparseable payload). Unknown event types return `200 { "received": true, "ignored": true }` so Clerk stops retrying.

#### `POST /api/webhooks/cloudinary` — Upload notifications

- **Auth:** Cloudinary signature (`sha1(body + timestamp + CLOUDINARY_API_SECRET)`, header `X-Cld-Signature`).
- **Handled notifications:** `upload` (persist the resulting `secure_url`/`public_id` against the pending owning entity, e.g. a company logo), `delete`. Enforces the signed-preset constraints server-side as a second line of defense (allowed MIME: `image/png`, `image/jpeg`, `image/webp`, `application/pdf`; max size — `02-TRD.md` §14).
- **Success `200`:** `{ "received": true }`.
- **Errors:** `401 UNAUTHENTICATED`, `400 VALIDATION_ERROR`.

Full payload shapes and verification code are in §11.

---

## 6. Standard Error Responses

Every error, from every endpoint, uses the fixed envelope (`02-TRD.md` §9.3):

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to edit this company.",
    "requestId": "req_9f2c8a71b4e0"
  }
}
```

- `code` is a stable, machine-readable string (switch on this, never on `message`).
- `message` is human-readable and may change; safe to surface to end users (never contains secrets or stack traces).
- `requestId` matches the `X-Request-Id` response header for log/Sentry correlation (§2.7).

### 6.1 Status ↔ code ↔ meaning

| HTTP | `code` | Meaning | Typical trigger |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | Zod parse failure; includes `fieldErrors` | Bad body, bad query enum, missing required field |
| 401 | `UNAUTHENTICATED` | No valid session/token | Missing/expired Clerk session; bad webhook signature |
| 403 | `FORBIDDEN` | Authenticated but lacks permission | `assertCan` fail; RECRUITER editing profile; publishing before verified |
| 404 | `NOT_FOUND` | Resource doesn't exist, is soft-deleted, or not visible to caller | Unknown id/slug; draft/archived requested publicly |
| 409 | `CONFLICT` | State/uniqueness conflict | Slug taken; duplicate domain; already bookmarked; not-pending verify |
| 429 | `RATE_LIMITED` | Too many requests | Rate-limit window exceeded (§7) |
| 500 | `INTERNAL_ERROR` | Unhandled server error, logged with `requestId` | Unexpected exception (reported to Sentry) |

These map to the `AppError` subclasses thrown by handlers and translated by the shared `withErrorHandling` wrapper (`02-TRD.md` §21):

```ts
// lib/errors.ts
export class AppError extends Error {
  constructor(public code: string, public status: number, message: string) { super(message); }
}
export class ValidationError   extends AppError { constructor(m = "Validation failed", public fieldErrors?: Record<string,string[]>) { super("VALIDATION_ERROR", 400, m); } }
export class UnauthenticatedError extends AppError { constructor(m = "Authentication required")     { super("UNAUTHENTICATED", 401, m); } }
export class ForbiddenError    extends AppError { constructor(m = "Forbidden")                       { super("FORBIDDEN", 403, m); } }
export class NotFoundError     extends AppError { constructor(m = "Not found")                       { super("NOT_FOUND", 404, m); } }
export class ConflictError     extends AppError { constructor(m = "Conflict")                        { super("CONFLICT", 409, m); } }
export class RateLimitedError  extends AppError { constructor(m = "Too many requests")               { super("RATE_LIMITED", 429, m); } }
```

```ts
// lib/with-error-handling.ts
export function withErrorHandling(handler: Handler): Handler {
  return async (req, ctx) => {
    const requestId = req.headers.get("x-request-id") ?? genRequestId();
    try {
      const res = await handler(req, ctx);
      res.headers.set("X-Request-Id", requestId);
      res.headers.set("X-API-Version", "1");
      return res;
    } catch (e) {
      if (e instanceof z.ZodError) return errorResponse(new ValidationError("Validation failed", e.flatten().fieldErrors), requestId);
      if (e instanceof AppError)   return errorResponse(e, requestId);
      log("error", "unhandled", { requestId, err: String(e) });     // → Sentry (§17 TRD)
      return errorResponse(new AppError("INTERNAL_ERROR", 500, "Something went wrong."), requestId);
    }
  };
}
```

### 6.2 `VALIDATION_ERROR` with `fieldErrors`

`400` responses from a Zod failure additionally carry `fieldErrors` (from `ZodError.flatten().fieldErrors`), so a form can highlight the exact fields:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "requestId": "req_1a2b3c4d5e6f",
    "fieldErrors": {
      "name": ["String must contain at least 2 character(s)"],
      "websiteUrl": ["Invalid url"],
      "fundingStage": ["Invalid enum value. Expected 'BOOTSTRAPPED' | 'PRE_SEED' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C_PLUS' | 'PUBLIC', received 'SERIES_Z'"]
    }
  }
}
```

The Server Action equivalent returns the same shape inside the discriminated union (`02-TRD.md` §21): `{ success: false, error: { code: "VALIDATION_ERROR", message, fieldErrors } }`, so the same UI error component renders both surfaces.

### 6.3 Example error bodies per status

```json
// 401
{ "error": { "code": "UNAUTHENTICATED", "message": "Authentication required.", "requestId": "req_401aa" } }
```
```json
// 403 (RECRUITER editing profile)
{ "error": { "code": "FORBIDDEN", "message": "Recruiters cannot edit the company profile. Ask an owner.", "requestId": "req_403bb" } }
```
```json
// 404
{ "error": { "code": "NOT_FOUND", "message": "Company not found.", "requestId": "req_404cc" } }
```
```json
// 409 (duplicate domain, FR-15)
{ "error": { "code": "CONFLICT", "message": "A company for this domain already exists and is pending review.", "requestId": "req_409dd" } }
```
```json
// 429
{ "error": { "code": "RATE_LIMITED", "message": "Rate limit exceeded. Retry after 42s.", "requestId": "req_429ee" } }
```
```json
// 500
{ "error": { "code": "INTERNAL_ERROR", "message": "Something went wrong.", "requestId": "req_500ff" } }
```

---

## 7. Rate Limits

Enforced in middleware + `lib/rate-limit.ts` via a sliding-window counter (`02-TRD.md` §8, §15). Limits by scope (`02-TRD.md` §9.4):

| Scope | Limit | Key |
|---|---|---|
| Public unauthenticated (`/api/companies`, `/api/internships`, `/api/search`, `/api/search/suggest`, `/api/categories`, `/api/technologies`, `/api/featured`) | **60 req / min** | per client IP |
| Authenticated read (any `GET` on a protected resource) | **300 req / min** | per `userId` |
| Authenticated write (`POST`/`PATCH`/`DELETE`) | **30 req / min** | per `userId` |
| Admin | **Unthrottled** (trusted, small set) | per `userId` (role `ADMIN`) |
| Webhooks (`/api/webhooks/*`) | Not rate-limited (signature-gated; providers self-throttle) | — |

### 7.1 Rate-limit headers

Every rate-limited response (success *and* `429`) returns:

| Header | Meaning |
|---|---|
| `X-RateLimit-Limit` | Max requests in the current window for this scope |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix epoch seconds when the window resets |
| `Retry-After` | (on `429` only) seconds to wait before retrying |

Example response headers on a throttled request:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1751556300
Retry-After: 42
X-Request-Id: req_429ee
Content-Type: application/json; charset=utf-8
```

```ts
// lib/rate-limit.ts (sliding window; scope resolved from auth + path)
export async function enforceRateLimit(scope: RateScope, key: string) {
  const { limit, remaining, reset } = await slidingWindow(scope, key);
  const headers = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset": String(reset),
  };
  if (remaining < 0) throw new RateLimitedError(`Rate limit exceeded. Retry after ${reset - now()}s.`);
  return headers; // merged into the response by withErrorHandling
}
```

---

## 8. Pagination

### 8.1 Decision: offset pagination in V1 (with a documented cursor upgrade path)

Verity V1 uses **offset/page pagination** — the `{ data, meta: { page, pageSize, totalCount, totalPages } }` envelope from `02-TRD.md` §9.2.

**Rationale.** Offset pagination is chosen deliberately for V1:

1. **The UI needs `totalCount` / `totalPages`.** The Student directory, Admin queues, and analytics tables all render numbered pagination and "187 results" counts (PRD §14, §15). Cursor pagination cannot cheaply produce a total.
2. **Data volume is small.** The V1 quality bar is ~100 verified companies (PRD G2), thousands of internships at most. Deep-offset performance cliffs (`OFFSET 100000`) simply do not occur at this scale, so offset's main weakness is irrelevant.
3. **It maps directly to Postgres FTS.** The search query already uses `LIMIT ... OFFSET ...` (`02-TRD.md` §12), so offset pagination is a zero-friction fit.
4. **Simplicity.** Offset is trivially resumable, shareable (`?page=3`), and cache-friendly for public GETs.

**Upgrade path.** When any list outgrows offset (the `02-TRD.md` §26 scalability signal — search read volume growth), individual high-volume endpoints can add **opt-in cursor pagination** additively (per §2.2) via a `cursor` query param and a `meta.nextCursor` field, without breaking the offset contract. Cursor becomes the default only if/when deep offset becomes a measured bottleneck.

### 8.2 Request params & response `meta`

| Param | Type | Default | Bounds |
|---|---|---|---|
| `page` | integer | `1` | ≥ 1 |
| `pageSize` | integer | `20` | 1–50 |

```ts
// features/_shared/pagination.ts
export const paginationQuery = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export function toMeta(page: number, pageSize: number, totalCount: number) {
  return { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) };
}
```

### 8.3 Example

Request:

```
GET /api/companies?category=fintech&sort=recent&page=2&pageSize=20
```

Response `meta`:

```json
{ "meta": { "page": 2, "pageSize": 20, "totalCount": 47, "totalPages": 3 } }
```

Requesting a `page` beyond `totalPages` returns `200` with `data: []` and the correct `meta` (not a `404`).

---

## 9. Filtering & Sorting

Applies to `GET /api/companies`, `GET /api/internships`, and `GET /api/search`. Unknown query params are ignored (forward-compatible); malformed known params (bad enum) return `400 VALIDATION_ERROR`.

### 9.1 Filter parameters

| Param | Applies to | Type / values | Semantics |
|---|---|---|---|
| `q` | companies, internships, search | string (1–120) | Full-text query (`websearch_to_tsquery`) over the weighted `searchVector`. Supports quoted phrases and `-exclude`. |
| `category` | companies, internships, search | category **slug** | Company/internship belongs to this category. |
| `technology` | companies, search | technology **slug** | Company uses this technology. |
| `fundingStage` | companies, search | `FundingStage` enum | Exact match on `Company.fundingStage`. |
| `remotePolicy` | companies, internships, search | `RemotePolicy` enum | Exact match. |
| `visaSponsorship` | companies, search | `true` \| `false` | Match on `Company.visaSponsorship`. |
| `employeeCount` | companies, search | `1-10`\|`11-50`\|`51-200`\|`201-500`\|`500+` | Match on `Company.employeeCountRange`. |
| `location` | companies, internships, search | string (city/region) | Company has a `CompanyLocation`, or internship `location`, matching. |
| `companySlug` | internships | slug | Internships belonging to a company. |
| `type` | search | `companies`\|`internships`\|`all` | Entity scope for `/api/search`. |

All filters are **AND-combined**. Multi-value (e.g., multiple categories) is expressed by repeating the param: `?category=fintech&category=ai-ml` (parsed as an array by Zod `z.array` coercion).

### 9.2 Sort parameter

| `sort` value | Applies to | Order |
|---|---|---|
| `trending` | companies, search | Bookmark/view velocity over a rolling 7-day window (PRD §15.1), computed from the `TrendingSnapshot` table (`02-TRD.md` §13), tie-broken by `isFeatured DESC`. |
| `recent` | companies, internships, search | `createdAt DESC` (companies) / `publishedAt DESC` (internships). **Default when no `q`.** |
| `name` | companies, internships, search | Alphabetical `name ASC` (companies) / `title ASC` (internships). |

When `q` is present, results are always ordered by **relevance** (`ts_rank DESC`, then `isFeatured DESC`) regardless of `sort`, unless `sort` is explicitly one of the above — an explicit `sort` overrides relevance (documented so clients can force alphabetical even within a search).

### 9.3 Examples

```
# Fintech companies that sponsor visas, remote-friendly, most recently added
GET /api/companies?category=fintech&visaSponsorship=true&remotePolicy=REMOTE&sort=recent

# Full-text "ml infra", exclude the word "sales", Series A only, trending order
GET /api/companies?q=ml%20infra%20-sales&fundingStage=SERIES_A&sort=trending

# Frontend internships, remote, in a specific company
GET /api/internships?q=frontend&remotePolicy=REMOTE&companySlug=sarvam-ai

# Multi-select categories (repeated param)
GET /api/companies?category=fintech&category=ai-ml&sort=name

# Unified search across both entity types
GET /api/search?q=%22developer%20tools%22&type=all&page=1&pageSize=20
```

Response envelope is the standard `{ data, meta }` (§8) with `query` echo for search (§5.7).

---

## 10. Versioning Policy

Restating and formalizing `02-TRD.md` §9.1:

1. **V1 is `/api/*`, implicitly version 1.** No `v1` segment appears in V1 paths. The `X-API-Version: 1` response header names the active version explicitly.
2. **Additive changes ship in place** on `/api/*` and are *not* breaking:
   - New optional request fields.
   - New response fields.
   - New endpoints.
   - New enum members **appended at the end** of an enum (clients must treat unknown enum values defensively).
   - New optional query params.
3. **Breaking changes require `/api/v2/*`:**
   - Removing or renaming a field.
   - Changing a field's type or making an optional field required.
   - Removing an endpoint or changing its semantics.
   - Changing the error contract (envelope shape, code meaning).
   - Reordering/removing enum members.
4. **Deprecation window.** When `/api/v2/*` launches, `/api/*` (v1) continues serving unchanged for a documented window. Deprecated v1 endpoints add a `Deprecation: true` header and a `Sunset: <http-date>` header.
5. **No silent breaking mutation of v1 ever.** This is the core guarantee to the future extension/mobile clients that the REST surface exists for (`02-TRD.md` §9.1).

---

## 11. Webhooks — payloads & verification

Both webhook routes read the **raw** request body (not `req.json()`), verify the signature against the raw bytes, and only then parse. Return `2xx` fast; providers retry on non-2xx with backoff.

### 11.1 Clerk — `POST /api/webhooks/clerk`

**Purpose:** keep the `User` table (and the `publicMetadata.role` JWT cache) in sync with Clerk identity (`02-TRD.md` §6).

**Headers:** `svix-id`, `svix-timestamp`, `svix-signature`. **Secret:** `CLERK_WEBHOOK_SECRET`.

**`user.created` payload (abridged):**

```json
{
  "type": "user.created",
  "data": {
    "id": "user_2abc...",
    "email_addresses": [ { "id": "idn_1...", "email_address": "priya@example.edu" } ],
    "primary_email_address_id": "idn_1...",
    "first_name": "Priya",
    "last_name": "S.",
    "image_url": "https://img.clerk.com/..."
  }
}
```

**Verification + handler:**

```ts
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";

export async function POST(req: Request) {
  const body = await req.text();                        // RAW body — required for HMAC
  const headers = {
    "svix-id":        req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  let evt: ClerkEvent;
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    evt = wh.verify(body, headers) as ClerkEvent;       // throws on bad signature
  } catch {
    return errorResponse(new UnauthenticatedError("Invalid webhook signature"), genRequestId());
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const email = primaryEmail(evt.data);
      await prisma.user.upsert({
        where:  { clerkId: evt.data.id },
        create: { clerkId: evt.data.id, email, name: fullName(evt.data), avatarUrl: evt.data.image_url, role: "STUDENT" },
        update: { email, name: fullName(evt.data), avatarUrl: evt.data.image_url },
      });
      break;
    }
    case "user.deleted":
      await prisma.user.update({ where: { clerkId: evt.data.id }, data: { deletedAt: new Date() } });
      break;
    default:
      return Response.json({ received: true, ignored: true });
  }
  return Response.json({ received: true });
}
```

Responses: `200 { received: true }`; `401` on bad signature; `400` on unparseable payload.

### 11.2 Cloudinary — `POST /api/webhooks/cloudinary`

**Purpose:** persist upload results (`secure_url`, `public_id`) and re-assert upload-preset constraints server-side (`02-TRD.md` §14).

**Headers:** `X-Cld-Signature`, `X-Cld-Timestamp`. **Secret:** `CLOUDINARY_API_SECRET`. **Scheme:** `sha1(body + timestamp + api_secret)`.

**`upload` notification payload (abridged):**

```json
{
  "notification_type": "upload",
  "public_id": "companies/acme-labs/logo",
  "secure_url": "https://res.cloudinary.com/verity/image/upload/v1751556300/companies/acme-labs/logo.png",
  "resource_type": "image",
  "format": "png",
  "bytes": 84213,
  "context": { "custom": { "entity": "company", "entityId": "clxnewco...", "field": "logoUrl" } }
}
```

**Verification + handler:**

```ts
// app/api/webhooks/cloudinary/route.ts
import { createHash } from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const ts   = req.headers.get("x-cld-timestamp") ?? "";
  const given = req.headers.get("x-cld-signature") ?? "";
  const expected = createHash("sha1")
    .update(body + ts + process.env.CLOUDINARY_API_SECRET!)
    .digest("hex");

  if (!timingSafeEqualHex(given, expected)) {
    return errorResponse(new UnauthenticatedError("Invalid Cloudinary signature"), genRequestId());
  }

  const evt = cloudinaryEventSchema.parse(JSON.parse(body));   // Zod — also re-checks format/bytes
  if (evt.notification_type === "upload") {
    const { entity, entityId, field } = evt.context.custom;
    assertAllowedUpload(evt);                                   // MIME + size guard (defense-in-depth)
    await applyUploadedAsset(entity, entityId, field, evt.secure_url, evt.public_id);
  }
  return Response.json({ received: true });
}
```

Responses: `200 { received: true }`; `401` on bad signature; `400` on constraint violation (disallowed MIME/oversize) or unparseable payload.

---

## 12. OpenAPI 3.1 fragment

Representative, extensible OpenAPI 3.1 covering the core **Companies + Internships + Bookmarks** endpoints, shared `components/schemas`, the error envelope, pagination, and `securitySchemes`. Structured so the remaining resources slot in by copying a path block and reusing the shared components. Enum values, field names, and error codes match §2.4 and §6 exactly.

```yaml
openapi: 3.1.0
info:
  title: Verity API
  version: "1.0"
  description: >
    Career Intelligence Platform API (V1). All routes live under /api and are
    implicitly version 1; breaking changes are introduced under /api/v2.
  contact:
    name: Verity Engineering
servers:
  - url: https://verity.app/api
    description: Production
  - url: http://localhost:3000/api
    description: Local development

tags:
  - name: Companies
  - name: Internships
  - name: Bookmarks

security:
  - clerkSession: []

paths:
  /companies:
    get:
      tags: [Companies]
      summary: List / search companies
      operationId: listCompanies
      security: []              # public
      parameters:
        - { $ref: '#/components/parameters/Q' }
        - { $ref: '#/components/parameters/CategorySlug' }
        - { $ref: '#/components/parameters/TechnologySlug' }
        - name: fundingStage
          in: query
          schema: { $ref: '#/components/schemas/FundingStage' }
        - name: remotePolicy
          in: query
          schema: { $ref: '#/components/schemas/RemotePolicy' }
        - name: visaSponsorship
          in: query
          schema: { type: boolean }
        - name: employeeCount
          in: query
          schema: { type: string, enum: ["1-10","11-50","51-200","201-500","500+"] }
        - name: location
          in: query
          schema: { type: string }
        - name: sort
          in: query
          schema: { type: string, enum: [trending, recent, name], default: recent }
        - { $ref: '#/components/parameters/Page' }
        - { $ref: '#/components/parameters/PageSize' }
      responses:
        '200':
          description: Paginated company list
          headers:
            X-RateLimit-Limit:     { $ref: '#/components/headers/RateLimitLimit' }
            X-RateLimit-Remaining: { $ref: '#/components/headers/RateLimitRemaining' }
            X-Request-Id:          { $ref: '#/components/headers/RequestId' }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/CompanyListResponse' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '429': { $ref: '#/components/responses/RateLimited' }
    post:
      tags: [Companies]
      summary: Register a company (elevates caller to COMPANY/OWNER)
      operationId: createCompany
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateCompany' }
      responses:
        '201':
          description: Company created (UNVERIFIED)
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Company' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '401': { $ref: '#/components/responses/Unauthenticated' }
        '409': { $ref: '#/components/responses/Conflict' }

  /companies/{slug}:
    get:
      tags: [Companies]
      summary: Full company profile
      operationId: getCompany
      security: []
      parameters:
        - name: slug
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Company profile
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Company' }
        '404': { $ref: '#/components/responses/NotFound' }

  /companies/{id}:
    patch:
      tags: [Companies]
      summary: Update company profile
      operationId: updateCompany
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateCompany' }
      responses:
        '200':
          description: Updated company
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Company' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }

  /companies/{id}/verify:
    post:
      tags: [Companies]
      summary: Verification decision (Admin)
      operationId: verifyCompany
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/VerifyDecision' }
      responses:
        '200':
          description: Decision applied
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Company' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }

  /internships:
    get:
      tags: [Internships]
      summary: List / search internships
      operationId: listInternships
      security: []
      parameters:
        - { $ref: '#/components/parameters/Q' }
        - { $ref: '#/components/parameters/CategorySlug' }
        - { $ref: '#/components/parameters/TechnologySlug' }
        - name: remotePolicy
          in: query
          schema: { $ref: '#/components/schemas/RemotePolicy' }
        - name: location
          in: query
          schema: { type: string }
        - name: companySlug
          in: query
          schema: { type: string }
        - name: sort
          in: query
          schema: { type: string, enum: [recent, name], default: recent }
        - { $ref: '#/components/parameters/Page' }
        - { $ref: '#/components/parameters/PageSize' }
      responses:
        '200':
          description: Paginated internship list
          content:
            application/json:
              schema: { $ref: '#/components/schemas/InternshipListResponse' }
        '400': { $ref: '#/components/responses/ValidationError' }
    post:
      tags: [Internships]
      summary: Create internship (DRAFT)
      operationId: createInternship
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateInternship' }
      responses:
        '201':
          description: Draft internship created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Internship' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }

  /internships/{id}:
    get:
      tags: [Internships]
      summary: Internship detail
      operationId: getInternship
      security: []
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Internship detail
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Internship' }
        '404': { $ref: '#/components/responses/NotFound' }
    patch:
      tags: [Internships]
      summary: Update internship
      operationId: updateInternship
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/UpdateInternship' }
      responses:
        '200':
          description: Updated internship
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Internship' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }

  /internships/{id}/publish:
    post:
      tags: [Internships]
      summary: Publish (DRAFT/ARCHIVED → PUBLISHED). Requires verified company.
      operationId: publishInternship
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Published
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Internship' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }

  /internships/{id}/archive:
    post:
      tags: [Internships]
      summary: Archive (→ ARCHIVED)
      operationId: archiveInternship
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Archived
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Internship' }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }

  /bookmarks:
    get:
      tags: [Bookmarks]
      summary: List own bookmarks
      operationId: listBookmarks
      parameters:
        - name: targetType
          in: query
          schema: { $ref: '#/components/schemas/BookmarkTargetType' }
        - { $ref: '#/components/parameters/Page' }
        - { $ref: '#/components/parameters/PageSize' }
      responses:
        '200':
          description: Paginated bookmark list
          content:
            application/json:
              schema: { $ref: '#/components/schemas/BookmarkListResponse' }
        '401': { $ref: '#/components/responses/Unauthenticated' }
    post:
      tags: [Bookmarks]
      summary: Create bookmark
      operationId: createBookmark
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateBookmark' }
      responses:
        '201':
          description: Bookmark created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Bookmark' }
        '400': { $ref: '#/components/responses/ValidationError' }
        '401': { $ref: '#/components/responses/Unauthenticated' }
        '404': { $ref: '#/components/responses/NotFound' }
        '409': { $ref: '#/components/responses/Conflict' }

  /bookmarks/{id}:
    delete:
      tags: [Bookmarks]
      summary: Remove bookmark
      operationId: deleteBookmark
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '204': { description: Deleted }
        '403': { $ref: '#/components/responses/Forbidden' }
        '404': { $ref: '#/components/responses/NotFound' }

components:
  securitySchemes:
    clerkSession:
      type: apiKey
      in: cookie
      name: __session
      description: Clerk session cookie (browser, same-origin).
    clerkBearer:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Clerk-issued JWT for programmatic clients (extension/mobile).

  parameters:
    Q:
      name: q
      in: query
      schema: { type: string, minLength: 1, maxLength: 120 }
      description: Full-text query (websearch_to_tsquery grammar).
    CategorySlug:
      name: category
      in: query
      schema: { type: string }
    TechnologySlug:
      name: technology
      in: query
      schema: { type: string }
    Page:
      name: page
      in: query
      schema: { type: integer, minimum: 1, default: 1 }
    PageSize:
      name: pageSize
      in: query
      schema: { type: integer, minimum: 1, maximum: 50, default: 20 }

  headers:
    RequestId:
      schema: { type: string }
      description: Correlates with error.requestId.
    RateLimitLimit:
      schema: { type: integer }
    RateLimitRemaining:
      schema: { type: integer }

  schemas:
    FundingStage:
      type: string
      enum: [BOOTSTRAPPED, PRE_SEED, SEED, SERIES_A, SERIES_B, SERIES_C_PLUS, PUBLIC]
    RemotePolicy:
      type: string
      enum: [REMOTE, HYBRID, ONSITE]
    InternshipStatus:
      type: string
      enum: [DRAFT, PUBLISHED, ARCHIVED]
    VerificationStatus:
      type: string
      enum: [UNVERIFIED, PENDING, VERIFIED, REJECTED]
    BookmarkTargetType:
      type: string
      enum: [COMPANY, INTERNSHIP]

    PaginationMeta:
      type: object
      required: [page, pageSize, totalCount, totalPages]
      properties:
        page:       { type: integer, example: 1 }
        pageSize:   { type: integer, example: 20 }
        totalCount: { type: integer, example: 187 }
        totalPages: { type: integer, example: 10 }

    Error:
      type: object
      required: [error]
      properties:
        error:
          type: object
          required: [code, message, requestId]
          properties:
            code:      { type: string, example: FORBIDDEN }
            message:   { type: string, example: "You do not have permission to edit this company." }
            requestId: { type: string, example: req_9f2c8a71b4e0 }
            fieldErrors:
              type: object
              additionalProperties:
                type: array
                items: { type: string }
              description: Present only on VALIDATION_ERROR (400).

    Company:
      type: object
      required: [id, slug, name, verificationStatus]
      properties:
        id:                 { type: string, example: clx7a1b2c3d4e5f6g7h8i9j0k }
        slug:               { type: string, example: sarvam-ai }
        name:               { type: string, example: Sarvam AI }
        tagline:            { type: string, nullable: true }
        about:              { type: string, nullable: true }
        logoUrl:            { type: string, format: uri, nullable: true }
        bannerUrl:          { type: string, format: uri, nullable: true }
        websiteUrl:         { type: string, format: uri, nullable: true }
        fundingStage:       { $ref: '#/components/schemas/FundingStage' }
        remotePolicy:       { $ref: '#/components/schemas/RemotePolicy' }
        visaSponsorship:    { type: boolean }
        employeeCountRange: { type: string, nullable: true, example: "51-200" }
        verificationStatus: { $ref: '#/components/schemas/VerificationStatus' }
        isFeatured:         { type: boolean }
        openInternshipCount:{ type: integer, example: 3 }
        createdAt:          { type: string, format: date-time }
        updatedAt:          { type: string, format: date-time }

    CreateCompany:
      type: object
      required: [name, slug, websiteUrl]
      properties:
        name:            { type: string, minLength: 2, maxLength: 120 }
        slug:            { type: string, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 120 }
        websiteUrl:      { type: string, format: uri }
        tagline:         { type: string, maxLength: 160 }
        about:           { type: string, maxLength: 5000 }
        logoUrl:         { type: string, format: uri }
        fundingStage:    { $ref: '#/components/schemas/FundingStage' }
        remotePolicy:    { $ref: '#/components/schemas/RemotePolicy' }
        visaSponsorship: { type: boolean, default: false }
        employeeCountRange: { type: string, enum: ["1-10","11-50","51-200","201-500","500+"] }
        categorySlugs:   { type: array, items: { type: string }, maxItems: 5 }

    UpdateCompany:
      type: object
      minProperties: 1
      properties:
        name:            { type: string, minLength: 2, maxLength: 120 }
        tagline:         { type: string, maxLength: 160, nullable: true }
        about:           { type: string, maxLength: 5000, nullable: true }
        logoUrl:         { type: string, format: uri, nullable: true }
        bannerUrl:       { type: string, format: uri, nullable: true }
        websiteUrl:      { type: string, format: uri }
        fundingStage:    { $ref: '#/components/schemas/FundingStage' }
        remotePolicy:    { $ref: '#/components/schemas/RemotePolicy' }
        visaSponsorship: { type: boolean }
        employeeCountRange: { type: string, enum: ["1-10","11-50","51-200","201-500","500+"], nullable: true }
        categorySlugs:   { type: array, items: { type: string }, maxItems: 5 }
        technologySlugs: { type: array, items: { type: string }, maxItems: 30 }

    VerifyDecision:
      oneOf:
        - type: object
          required: [decision]
          properties:
            decision: { type: string, enum: [APPROVE] }
        - type: object
          required: [decision, reason]
          properties:
            decision: { type: string, enum: [REJECT, REQUEST_CHANGES] }
            reason:   { type: string, minLength: 4, maxLength: 1000 }

    Internship:
      type: object
      required: [id, slug, title, status]
      properties:
        id:           { type: string }
        slug:         { type: string }
        title:        { type: string }
        description:  { type: string }
        companyId:    { type: string }
        location:     { type: string, nullable: true }
        remotePolicy: { $ref: '#/components/schemas/RemotePolicy' }
        stipend:      { type: string, nullable: true }
        duration:     { type: string, nullable: true }
        applyUrl:     { type: string, format: uri }
        status:       { $ref: '#/components/schemas/InternshipStatus' }
        publishedAt:  { type: string, format: date-time, nullable: true }
        createdAt:    { type: string, format: date-time }
        updatedAt:    { type: string, format: date-time }

    CreateInternship:
      type: object
      required: [companyId, title, slug, description, applyUrl]
      properties:
        companyId:    { type: string }
        title:        { type: string, minLength: 4, maxLength: 160 }
        slug:         { type: string, pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 160 }
        description:  { type: string, minLength: 20, maxLength: 20000 }
        location:     { type: string, maxLength: 120 }
        remotePolicy: { $ref: '#/components/schemas/RemotePolicy' }
        stipend:      { type: string, maxLength: 120 }
        duration:     { type: string, maxLength: 120 }
        applyUrl:     { type: string, format: uri }
        categorySlug: { type: string }

    UpdateInternship:
      type: object
      minProperties: 1
      properties:
        title:        { type: string, minLength: 4, maxLength: 160 }
        description:  { type: string, minLength: 20, maxLength: 20000 }
        location:     { type: string, maxLength: 120 }
        remotePolicy: { $ref: '#/components/schemas/RemotePolicy' }
        stipend:      { type: string, maxLength: 120 }
        duration:     { type: string, maxLength: 120 }
        applyUrl:     { type: string, format: uri }
        categorySlug: { type: string }

    Bookmark:
      type: object
      required: [id, targetType, createdAt]
      properties:
        id:           { type: string }
        targetType:   { $ref: '#/components/schemas/BookmarkTargetType' }
        companyId:    { type: string, nullable: true }
        internshipId: { type: string, nullable: true }
        createdAt:    { type: string, format: date-time }

    CreateBookmark:
      type: object
      required: [targetType, targetId]
      properties:
        targetType: { $ref: '#/components/schemas/BookmarkTargetType' }
        targetId:   { type: string }

    CompanyListResponse:
      type: object
      required: [data, meta]
      properties:
        data: { type: array, items: { $ref: '#/components/schemas/Company' } }
        meta: { $ref: '#/components/schemas/PaginationMeta' }

    InternshipListResponse:
      type: object
      required: [data, meta]
      properties:
        data: { type: array, items: { $ref: '#/components/schemas/Internship' } }
        meta: { $ref: '#/components/schemas/PaginationMeta' }

    BookmarkListResponse:
      type: object
      required: [data, meta]
      properties:
        data: { type: array, items: { $ref: '#/components/schemas/Bookmark' } }
        meta: { $ref: '#/components/schemas/PaginationMeta' }

  responses:
    ValidationError:
      description: Zod validation failure (includes fieldErrors)
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    Unauthenticated:
      description: No valid session/token
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    Forbidden:
      description: Authenticated but lacks permission
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    NotFound:
      description: Resource not found or not visible
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    Conflict:
      description: State/uniqueness conflict
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After:        { schema: { type: integer } }
        X-RateLimit-Reset:  { schema: { type: integer } }
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
```

**How to extend to the full spec:** every remaining resource (Applications, Profile, Search, Verification queue, Reports, Categories, Technologies, Featured, Admin users, Analytics, Notifications, Webhooks) follows the identical pattern — add a `paths` block, reference the shared `parameters` (`Page`, `PageSize`, `Q`), reuse the shared `responses` (`ValidationError`, `Forbidden`, …), and add resource `schemas` + a `XListResponse` wrapper mirroring the three list responses above. The `securitySchemes`, `Error`, `PaginationMeta`, and enum schemas are shared verbatim across the whole spec, so consistency with §2.4 and §6 is structural, not manual.

---

*End of 05-api.md. Consistent with 01-PRD.md and 02-TRD.md §7, §9, §10, §14. Awaiting review before generating the next document in the suite.*
