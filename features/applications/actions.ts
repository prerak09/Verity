"use server";

// features/applications/actions.ts — tracker mutations (FR-42/43).
// Every entry is owned by the creating student (Layer 2 application:*:own,
// Layer 3 userId-scoped writes). Notes are private (FR-44).

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { createApplicationSchema, updateApplicationSchema } from "./schema";
import { toInternshipCard } from "@/features/internships/map";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  type ApplicationDTO,
  type CreateApplicationInput,
  type UpdateApplicationInput,
  type Result,
} from "@/types";

function toDTO(a: {
  id: string;
  status: ApplicationDTO["status"];
  notes: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  internship: Parameters<typeof toInternshipCard>[0] & {
    company: Parameters<typeof toInternshipCard>[1];
  };
}): ApplicationDTO {
  return {
    id: a.id,
    internship: toInternshipCard(a.internship, a.internship.company),
    status: a.status,
    notes: a.notes,
    appliedAt: a.appliedAt ? a.appliedAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

/** FR-42 — add an internship to the tracker (one entry per user+internship). */
export async function createApplication(
  input: CreateApplicationInput,
): Promise<Result<ApplicationDTO>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "application:create");
    const data = parseInput(createApplicationSchema, input);

    const internship = await db.internship.findFirst({
      where: { id: data.internshipId, deletedAt: null },
      select: { id: true },
    });
    if (!internship) throw new NotFoundError("Internship not found.");

    const status = data.status ?? "SAVED";
    try {
      const created = await db.application.create({
        data: {
          userId: user.id,
          internshipId: data.internshipId,
          status,
          notes: data.notes ?? null,
          appliedAt: status === "APPLIED" ? new Date() : null,
        },
        include: {
          internship: {
            include: {
              company: { select: { id: true, slug: true, name: true, logoUrl: true } },
            },
          },
        },
      });
      return toDTO(created);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictError("This internship is already in your tracker.");
      }
      throw e;
    }
  });
}

/** FR-43 — update status / private notes. Owner only. */
export async function updateApplication(
  applicationId: string,
  input: UpdateApplicationInput,
): Promise<Result<ApplicationDTO>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "application:update:own");
    const data = parseInput(updateApplicationSchema, input);

    const existing = await db.application.findUnique({
      where: { id: applicationId },
      select: { userId: true, appliedAt: true },
    });
    if (!existing) throw new NotFoundError("Application not found.");
    if (existing.userId !== user.id) {
      throw new ForbiddenError("You can only edit your own tracker.");
    }

    // Stamp appliedAt the first time it moves to APPLIED.
    const setAppliedAt =
      data.status === "APPLIED" && !existing.appliedAt ? new Date() : undefined;

    const updated = await db.application.update({
      where: { id: applicationId }, // Layer 3: ownership already asserted above
      data: {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(setAppliedAt ? { appliedAt: setAppliedAt } : {}),
      },
      include: {
        internship: {
          include: {
            company: { select: { id: true, slug: true, name: true, logoUrl: true } },
          },
        },
      },
    });
    return toDTO(updated);
  });
}

/** Remove a tracker entry. Owner only. */
export async function deleteApplication(
  applicationId: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "application:update:own");
    await db.application.deleteMany({
      where: { id: applicationId, userId: user.id },
    });
    return null;
  });
}
