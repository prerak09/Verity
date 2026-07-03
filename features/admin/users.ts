"use server";

// features/admin/users.ts — admin user management (FR-05, A5).
// Admin-only (user:manage). Disable/reinstate + role change. Role changes sync
// to Clerk publicMetadata so middleware (Layer 1) sees the new role (TRD §6).

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { z } from "zod";
import { ConflictError, NotFoundError, type PlatformRole, type Result } from "@/types";

const roleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["STUDENT", "COMPANY", "ADMIN"]),
});

/** FR-05 / A5 — change a user's platform role (also the only Admin-promotion path). */
export async function changeUserRole(input: {
  userId: string;
  role: PlatformRole;
}): Promise<Result<null>> {
  return handleAction(async () => {
    const actor = await requireUser();
    assertCan(actor, "user:manage");
    const { userId, role } = parseInput(roleSchema, input);

    const target = await db.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { clerkId: true },
    });
    if (!target) throw new NotFoundError("User not found.");

    await db.user.update({ where: { id: userId }, data: { role } });
    // Sync claim to Clerk so route gating reflects the new role immediately.
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(target.clerkId, {
        publicMetadata: { role },
      });
    } catch {
      // DB remains source of truth; claim refreshes on next user.updated webhook.
    }
    return null;
  });
}

/** A5 — disable (soft-delete) a user account. */
export async function disableUser(userId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const actor = await requireUser();
    assertCan(actor, "user:manage");
    if (actor.id === userId) throw new ConflictError("You cannot disable yourself.");
    await db.user.updateMany({
      where: { id: userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return null;
  });
}

/** A5 — reinstate a disabled user. */
export async function reinstateUser(userId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const actor = await requireUser();
    assertCan(actor, "user:manage");
    await db.user.updateMany({
      where: { id: userId },
      data: { deletedAt: null },
    });
    return null;
  });
}
