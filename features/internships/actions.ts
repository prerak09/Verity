"use server";

// features/internships/actions.ts — internship mutations (FR-20/21/22/23).
// requireUser → assertCan (Layer 2) → ownership-scoped Prisma (Layer 3).

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan, isCompanyMember } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { slugify } from "@/lib/slug";
import { sanitizeHtml } from "@/lib/sanitize";
import { createInternshipSchema, updateInternshipSchema } from "./schema";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  type Result,
  type InternshipInput,
  type InternshipDetail,
  type InternshipStatus,
} from "@/types";
import { toInternshipDetail } from "./map";

/** Load an internship + its company, or throw NOT_FOUND. */
async function loadOwned(internshipId: string) {
  const internship = await db.internship.findFirst({
    where: { id: internshipId, deletedAt: null },
    include: {
      company: { select: { id: true, slug: true, name: true, logoUrl: true, verificationStatus: true } },
    },
  });
  if (!internship) throw new NotFoundError("Internship not found.");
  return internship;
}

/** FR-20 — create a listing (defaults to DRAFT). Any company member may create. */
export async function createInternship(
  companyId: string,
  input: InternshipInput,
): Promise<Result<{ id: string; slug: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "internship:create", companyId);
    if (!isCompanyMember(user, companyId)) {
      throw new ForbiddenError("You are not a member of this company.");
    }

    const data = parseInput(createInternshipSchema, input);
    // categoryIds linking is wired with the taxonomy join in a later task.
    const { categoryIds, ...fields } = data;
    void categoryIds;

    // Unique slug from title (+ short suffix on collision).
    const base = slugify(fields.title) || "internship";
    let slug = base;
    for (let n = 2; ; n++) {
      const exists = await db.internship.findUnique({ where: { slug }, select: { id: true } });
      if (!exists) break;
      slug = `${base}-${n}`;
    }

    const created = await db.internship.create({
      data: {
        companyId, // Layer 3: bound to the company we authorized against
        slug,
        title: fields.title,
        description: sanitizeHtml(fields.description), // NFR 13.4
        location: fields.location,
        department: fields.department,
        jobType: fields.jobType, // routes the listing to internships vs jobs
        remotePolicy: fields.remotePolicy,
        stipend: fields.stipend,
        duration: fields.duration,
        applyUrl: fields.applyUrl,
        status: "DRAFT",
      },
      select: { id: true, slug: true },
    });
    return created;
  });
}

/** FR-21 — update a listing. Editing touches updatedAt (resets staleness clock). */
export async function updateInternship(
  internshipId: string,
  input: Partial<InternshipInput>,
): Promise<Result<InternshipDetail>> {
  return handleAction(async () => {
    const user = await requireUser();
    const internship = await loadOwned(internshipId);
    assertCan(user, "internship:update:own", internship.companyId);
    if (!isCompanyMember(user, internship.companyId)) {
      throw new ForbiddenError("You are not a member of this company.");
    }

    const data = parseInput(updateInternshipSchema, input);
    const { categoryIds, ...fields } = data;
    void categoryIds;
    if (fields.description !== undefined) {
      fields.description = sanitizeHtml(fields.description); // NFR 13.4
    }

    const updated = await db.internship.update({
      where: { id: internshipId },
      data: fields,
      include: {
        company: { select: { id: true, slug: true, name: true, logoUrl: true } },
      },
    });
    revalidateTag(`internship:${updated.slug}`, "max");
    return toInternshipDetail(updated, updated.company);
  });
}

/**
 * FR-22 (critical, NFR 13.4) — publish gate. DRAFT → PUBLISHED is allowed ONLY
 * when the owning company is VERIFIED. Enforced here server-side; the UI hint is
 * advisory only.
 */
export async function publishInternship(
  internshipId: string,
): Promise<Result<{ status: InternshipStatus }>> {
  return handleAction(async () => {
    const user = await requireUser();
    const internship = await loadOwned(internshipId);
    assertCan(user, "internship:update:own", internship.companyId);
    if (!isCompanyMember(user, internship.companyId)) {
      throw new ForbiddenError("You are not a member of this company.");
    }

    if (internship.company.verificationStatus !== "VERIFIED") {
      throw new ConflictError(
        "Only verified companies can publish internships. Complete verification first.",
      );
    }
    if (internship.status === "ARCHIVED") {
      throw new ConflictError("Archived listings cannot be republished directly.");
    }

    const updated = await db.internship.update({
      where: { id: internshipId },
      data: {
        status: "PUBLISHED",
        publishedAt: internship.publishedAt ?? new Date(),
      },
      select: { status: true, slug: true },
    });
    revalidateTag(`internship:${updated.slug}`, "max");
    return { status: updated.status };
  });
}

/** FR-23 — archive: removes from student-facing surfaces, retained for analytics. */
export async function archiveInternship(
  internshipId: string,
): Promise<Result<{ status: InternshipStatus }>> {
  return handleAction(async () => {
    const user = await requireUser();
    const internship = await loadOwned(internshipId);
    assertCan(user, "internship:archive:own", internship.companyId);
    if (!isCompanyMember(user, internship.companyId)) {
      throw new ForbiddenError("You are not a member of this company.");
    }

    const updated = await db.internship.update({
      where: { id: internshipId },
      data: { status: "ARCHIVED" },
      select: { status: true, slug: true },
    });
    revalidateTag(`internship:${updated.slug}`, "max");
    return { status: updated.status };
  });
}
