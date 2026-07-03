"use server";

// features/admin/companies.ts — admin company moderation (FR-14/53).
// Admin-only (company:moderate). Includes the seed/manual-create path (FR-14).

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { registerCompanySchema } from "@/features/companies/schema";
import { normalizeDomain } from "@/lib/slug";
import { ConflictError, NotFoundError, type RegisterCompanyInput, type Result } from "@/types";

/** FR-14 — Admin creates a company on behalf of a company (seed path). */
export async function adminCreateCompany(
  input: RegisterCompanyInput,
): Promise<Result<{ id: string; slug: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:moderate");
    const data = parseInput(registerCompanySchema, input);

    const domain = normalizeDomain(data.websiteUrl);
    const [slugTaken, domainTaken] = await Promise.all([
      db.company.findFirst({ where: { slug: data.slug }, select: { id: true } }),
      domain
        ? db.company.findFirst({
            where: { websiteUrl: { contains: domain }, deletedAt: null },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);
    if (slugTaken) throw new ConflictError("Slug already taken.");
    if (domainTaken) throw new ConflictError("A company with this domain exists.");

    const company = await db.company.create({
      data: {
        slug: data.slug,
        name: data.name,
        tagline: data.tagline,
        websiteUrl: data.websiteUrl,
        verificationStatus: "VERIFIED", // admin-created companies are trusted (FR-14)
      },
      select: { id: true, slug: true },
    });
    return company;
  });
}

/** FR-53 — Suspend a company: hide it + unpublish its internships. Reversible. */
export async function suspendCompany(companyId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:moderate");
    const company = await db.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: { slug: true },
    });
    if (!company) throw new NotFoundError("Company not found.");

    await db.$transaction([
      db.company.update({
        where: { id: companyId },
        data: { suspendedAt: new Date(), verificationStatus: "UNVERIFIED" },
      }),
      db.internship.updateMany({
        where: { companyId, status: "PUBLISHED" },
        data: { status: "ARCHIVED" },
      }),
    ]);
    revalidateTag(`company:${company.slug}`, "max");
    return null;
  });
}

/** Reinstate a suspended company (back to PENDING for re-review). */
export async function reinstateCompany(companyId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:moderate");
    await db.company.updateMany({
      where: { id: companyId, deletedAt: null },
      data: { suspendedAt: null, verificationStatus: "PENDING" },
    });
    return null;
  });
}

/** FR-53 — Unpublish a single internship (moderation). */
export async function adminUnpublishInternship(internshipId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "internship:moderate");
    await db.internship.updateMany({
      where: { id: internshipId, deletedAt: null },
      data: { status: "ARCHIVED" },
    });
    return null;
  });
}
