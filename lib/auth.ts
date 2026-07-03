// lib/auth.ts — session → internal user resolution (TRD §6).
//
// Clerk owns the session; our Postgres `User` is the source of truth for role and
// company memberships. getCurrentUser() bridges the two into the CurrentUser DTO
// that lib/rbac.ts and every action consumes.

import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UnauthenticatedError, type CurrentUser } from "@/types";

/**
 * Resolve the current authenticated user (with company memberships) from the
 * Clerk session. Returns null when unauthenticated — callers that require a user
 * should use requireUser() instead.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.user.findFirst({
    where: { clerkId, deletedAt: null },
    include: {
      companyMemberships: {
        include: { company: { select: { slug: true, name: true } } },
      },
    },
  });

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

  const user = await db.user.upsert({
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
  });

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    memberships: [],
  };
}
