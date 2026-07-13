// middleware.ts — Layer 1 of the three-layer RBAC (TRD §7.4, §8).
//
// Runs at the edge for every matched request:
//   1. Clerk session verification (clerkMiddleware).
//   2. Public-route allowlist bypass (marketing, public profiles, search, webhooks).
//   3. Coarse role gating by route-group prefix → redirect to /unauthorized.
//
// Fine-grained per-resource checks live in lib/rbac.ts (Layer 2); the Prisma
// WHERE ownership filter is Layer 3. Role is read from the JWT publicMetadata
// claim (synced by the Clerk webhook) so there's no DB round-trip here (TRD §6).

import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { PlatformRole } from "@prisma/client";

// Public routes — no auth required (TRD §8 step 2).
// Discovery is OPEN: anyone can browse companies, internships, categories, and
// search WITHOUT signing in (students discover before creating an account).
// The *actions* — apply / bookmark / add-to-tracker — prompt sign-in client-side
// instead (see components/shared/SignInGate). Only the student/company/admin
// portals are gated below.
const isPublicRoute = createRouteMatcher([
  "/", // landing page
  "/team", // about/team page
  "/companies(.*)", // directory + public company profiles
  "/internships(.*)", // internship list + detail
  "/jobs(.*)", // full-time/part-time/contract job list
  "/categories(.*)", // category browse
  "/search(.*)", // search results
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
  "/api/companies(.*)", // public read APIs
  "/api/internships(.*)",
  "/api/search(.*)",
  "/api/webhooks(.*)", // signature-verified instead of session (TRD §8)
  "/api/cron(.*)", // Bearer CRON_SECRET instead of session (TRD §13)
  // Auth'd JSON APIs self-guard via requireUser() → 401 JSON (not an HTML
  // redirect), so we bypass the middleware route-gate for them.
  "/api/bookmarks(.*)",
  "/api/applications(.*)",
  "/api/students(.*)",
  "/api/notifications(.*)",
  "/api/admin(.*)", // self-guards via assertCan → 403 JSON (not an HTML redirect)
  "/api/dev(.*)", // self-guards via NODE_ENV check; never active in production
]);

const isStudentRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/student(.*)",
  "/bookmarks(.*)",
  "/applications(.*)",
]);
const isCompanyRoute = createRouteMatcher(["/company(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

function roleFromClaims(sessionClaims: unknown): PlatformRole | null {
  const claims = sessionClaims as
    | { publicMetadata?: { role?: string }; metadata?: { role?: string } }
    | null;
  const role = claims?.publicMetadata?.role ?? claims?.metadata?.role;
  if (role === "STUDENT" || role === "COMPANY" || role === "ADMIN") return role;
  return null;
}

// Dev-only bypass: clerkMiddleware() validates the request Host header against
// a live Clerk backend instance derived from the publishable key, so a
// synthetic/placeholder key (no real Clerk project) fails on *every* request
// with a raw "host_invalid" error page — there's no way to satisfy that check
// without real Clerk credentials. MOCK_AUTH lets local dev skip Clerk
// entirely and pair with lib/auth.ts's mock CurrentUser. Gated on NODE_ENV so
// a stray env var can never disable auth in a deployed environment.
// DEMO_MODE explicitly opts a deployed *preview* into the mock bypass (no Clerk
// needed) so the retro UI is publicly browsable without credentials. It is hard
// gated against the production deployment: even if the env var is set on prod,
// VERCEL_ENV === "production" keeps real Clerk auth on. NODE_ENV alone is
// insufficient because Vercel preview builds also report NODE_ENV=production.
const IS_PROD_DEPLOY =
  process.env.VERCEL_ENV === "production" ||
  (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV);
const MOCK_AUTH =
  !IS_PROD_DEPLOY &&
  (process.env.MOCK_AUTH === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true");

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  // Only the known portal prefixes are gated. Any other unmatched path (a typo,
  // a stale link, a removed route) is NOT force-redirected to sign-in — we let
  // it fall through so Next can render the branded 404 with a proper status,
  // instead of bouncing anonymous users into an auth loop toward a page that
  // doesn't exist.
  const isProtected =
    isStudentRoute(req) || isCompanyRoute(req) || isAdminRoute(req);
  if (!isProtected) return NextResponse.next();

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Not signed in → Clerk sign-in.
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Role gating only matters for /admin and /company. Read it from the session
  // token claim first; if it's absent (the default session token doesn't carry
  // publicMetadata unless a JWT template adds it), fall back to fetching the
  // user's publicMetadata.role straight from Clerk — the DB-synced source.
  const needsRoleCheck = isAdminRoute(req) || isCompanyRoute(req);
  let role = roleFromClaims(sessionClaims);
  if (needsRoleCheck && !role) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const r = user.publicMetadata?.role;
      if (r === "STUDENT" || r === "COMPANY" || r === "ADMIN") role = r;
    } catch {
      // On lookup failure, fall through — the page-level assertCan (Layer 2)
      // is the authoritative gate and will still block a wrong role.
    }
  }

  const unauthorized = new URL("/unauthorized", req.url);

  // /admin/* → ADMIN only.
  if (isAdminRoute(req) && role !== "ADMIN") {
    return NextResponse.redirect(unauthorized);
  }

  // /company/* → COMPANY (or ADMIN, who may moderate). Active membership is
  // verified per-resource at Layer 2.
  if (isCompanyRoute(req) && role !== "COMPANY" && role !== "ADMIN") {
    return NextResponse.redirect(unauthorized);
  }

  // Student routes: any authenticated user is fine (student is the default role).
  void isStudentRoute;

  return NextResponse.next();
});

export default MOCK_AUTH
  ? function mockAuthMiddleware() {
      return NextResponse.next();
    }
  : withClerk;

export const config = {
  matcher: [
    // Skip Next internals and static files; always run on API routes.
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
