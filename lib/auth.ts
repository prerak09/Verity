// lib/auth.ts — session → internal user resolution (TRD §6).
//
// Clerk owns the session; our Postgres `User` is the source of truth for role and
// company memberships. getCurrentUser() bridges the two into the CurrentUser DTO
// that lib/rbac.ts and every action consumes.

import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  UnauthenticatedError,
  type CurrentUser,
  type PlatformRole,
} from "@/types";

/** Prisma P2022: the column exists in the generated client but not yet in the
 * database — i.e. a migration (like 20260706120000_add_user_email_notifications)
 * hasn't been deployed to this environment yet. */
function isMissingColumnError(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2022";
}

// Dev-only bypass paired with middleware.ts's MOCK_AUTH — lets local dev
// preview all three portals without a real Clerk project. Gated on NODE_ENV
// so it can never activate in a deployed environment. MOCK_AUTH_ROLE picks
// which portal's session to simulate.
const MOCK_AUTH =
  (process.env.MOCK_AUTH === "true" && process.env.NODE_ENV !== "production") ||
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const MOCK_ROLE: PlatformRole =
  (process.env.MOCK_AUTH_ROLE as PlatformRole | undefined) ?? "STUDENT";
const MOCK_CURRENT_USER: CurrentUser = {
  id: "mock_user_1",
  clerkId: "mock_clerk_1",
  email: "mock@example.com",
  name: "Mock User",
  avatarUrl: null,
  role: MOCK_ROLE,
  emailNotificationsEnabled: true,
  memberships:
    MOCK_ROLE === "COMPANY"
      ? [
          // Kept in sync with components/lib/mocks/auth.ts's
          // MOCK_CURRENT_COMPANY_OWNER — both need to point at the same
          // company or assertCan()'s ownership check fails with a real
          // (correct) FORBIDDEN, not a bug, just a mismatch between the
          // two mock "current user" sources.
          {
            companyId: "co_meridian",
            companySlug: "meridian-health",
            companyName: "Meridian Health",
            role: "OWNER",
          },
        ]
      : [],
};

/**
 * Resolve the current authenticated user (with company memberships) from the
 * Clerk session. Returns null when unauthenticated — callers that require a user
 * should use requireUser() instead.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (MOCK_AUTH) return MOCK_CURRENT_USER;

  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const membershipsInclude = {
    companyMemberships: {
      include: { company: { select: { slug: true, name: true } } },
    },
  } as const;

  let user;
  let emailNotificationsEnabled = true;
  try {
    user = await db.user.findFirst({
      where: { clerkId, deletedAt: null },
      include: membershipsInclude,
    });
    if (user) emailNotificationsEnabled = user.emailNotificationsEnabled;
  } catch (e) {
    if (!isMissingColumnError(e)) throw e;
    // Migration not deployed yet — degrade gracefully instead of a hard 500
    // on every authenticated page. Real value once the migration lands.
    user = await db.user.findFirst({
      where: { clerkId, deletedAt: null },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        ...membershipsInclude,
      },
    });
  }

  // Session exists but the webhook-driven upsert hasn't landed yet (rare race on
  // first sign-up). Fall back to a lazy upsert from the Clerk profile so the app
  // never shows a signed-in user with no DB row.
  if (!user) {
    return lazyUpsertFromClerk(clerkId);
  }

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailNotificationsEnabled,
    memberships: user.companyMemberships.map((m) => ({
      companyId: m.companyId,
      companySlug: m.company.slug,
      companyName: m.company.name,
      role: m.role,
    })),
  };
}

/** Like getCurrentUser but throws UnauthenticatedError when there's no session. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthenticatedError();
  return user;
}

/** The internal User.id for the current session, or throw. */
export async function requireUserId(): Promise<string> {
  return (await requireUser()).id;
}

async function lazyUpsertFromClerk(clerkId: string): Promise<CurrentUser | null> {
  const profile = await clerkCurrentUser();
  if (!profile) return null;
  const email =
    profile.primaryEmailAddress?.emailAddress ??
    profile.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const upsertArgs = {
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email,
      name:
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: profile.imageUrl ?? null,
      // role defaults to STUDENT per schema (TRD §6).
    },
  } as const;

  let user;
  let emailNotificationsEnabled = true;
  try {
    user = await db.user.upsert(upsertArgs);
    emailNotificationsEnabled = user.emailNotificationsEnabled;
  } catch (e) {
    if (!isMissingColumnError(e)) throw e;
    // Migration not deployed yet — see isMissingColumnError above.
    user = await db.user.upsert({
      ...upsertArgs,
      select: { id: true, clerkId: true, email: true, name: true, avatarUrl: true, role: true },
    });
  }

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailNotificationsEnabled,
    memberships: [],
  };
}
