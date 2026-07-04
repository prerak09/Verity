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

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { PlatformRole } from "@prisma/client";

// Public routes — no auth required (TRD §8 step 2).
const isPublicRoute = createRouteMatcher([
  "/",
  "/companies(.*)",
  "/internships(.*)",
  "/categories(.*)",
  "/search(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
  "/api/companies(.*)",
  "/api/internships(.*)",
  "/api/search(.*)",
  "/api/webhooks(.*)", // signature-verified instead of session (TRD §8)
  "/api/cron(.*)", // Bearer CRON_SECRET instead of session (TRD §13)
  // Auth'd JSON APIs self-guard via requireUser() → 401 JSON (not an HTML
  // redirect), so we bypass the middleware route-gate for them.
  "/api/bookmarks(.*)",
  "/api/applications(.*)",
  "/api/students(.*)",
  "/api/admin(.*)", // self-guards via assertCan → 403 JSON (not an HTML redirect)
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
const MOCK_AUTH =
  process.env.MOCK_AUTH === "true" && process.env.NODE_ENV !== "production";

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Not signed in → Clerk sign-in.
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const role = roleFromClaims(sessionClaims);
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
  ],
};
