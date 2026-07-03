"use server";

// features/bookmarks/actions.ts — bookmark mutations (FR-40/41).
// Polymorphic: one row per (userId, companyId|internshipId). Unique constraint
// @@unique([userId, companyId, internshipId]) prevents duplicates.

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { createBookmarkSchema } from "./schema";
import { ConflictError, NotFoundError, type CreateBookmarkInput, type Result } from "@/types";

export async function createBookmark(
  input: CreateBookmarkInput,
): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "bookmark:create");
    const { targetType, targetId } = parseInput(createBookmarkSchema, input);

    // Verify the target exists (and is visible) before bookmarking.
    if (targetType === "COMPANY") {
      const exists = await db.company.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!exists) throw new NotFoundError("Company not found.");
    } else {
      const exists = await db.internship.findFirst({
        where: { id: targetId, deletedAt: null },
        select: { id: true },
      });
      if (!exists) throw new NotFoundError("Internship not found.");
    }

    try {
      const bookmark = await db.bookmark.create({
        data: {
          userId: user.id,
          targetType,
          companyId: targetType === "COMPANY" ? targetId : null,
          internshipId: targetType === "INTERNSHIP" ? targetId : null,
        },
        select: { id: true },
      });
      return bookmark;
    } catch (e) {
      // Unique constraint → already bookmarked.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictError("Already bookmarked.");
      }
      throw e;
    }
  });
}

export async function deleteBookmark(bookmarkId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "bookmark:delete");
    // Layer 3: delete scoped to the owner — a user can only remove their own.
    await db.bookmark.deleteMany({ where: { id: bookmarkId, userId: user.id } });
    return null;
  });
}

/** Toggle by target (used by the bookmark button). Returns the new state. */
export async function toggleBookmark(
  input: CreateBookmarkInput,
): Promise<Result<{ bookmarked: boolean; id: string | null }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "bookmark:create");
    const { targetType, targetId } = parseInput(createBookmarkSchema, input);

    const existing = await db.bookmark.findFirst({
      where: {
        userId: user.id,
        ...(targetType === "COMPANY"
          ? { companyId: targetId }
          : { internshipId: targetId }),
      },
      select: { id: true },
    });

    if (existing) {
      await db.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false, id: null };
    }

    const created = await db.bookmark.create({
      data: {
        userId: user.id,
        targetType,
        companyId: targetType === "COMPANY" ? targetId : null,
        internshipId: targetType === "INTERNSHIP" ? targetId : null,
      },
      select: { id: true },
    });
    return { bookmarked: true, id: created.id };
  });
}
