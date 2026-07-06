"use server";

// features/admin/companies.ts — admin company moderation (FR-14/53).
// Admin-only (company:moderate). Includes the seed/manual-create path (FR-14).

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { registerCompanySchema } from "@/features/companies/schema";
import { toInternshipCard } from "@/features/internships/map";
import { normalizeDomain } from "@/lib/slug";
import {
  ConflictError,
  NotFoundError,
  type CompanyDetail,
  type RegisterCompanyInput,
  type Result,
  type TaxonomyRef,
} from "@/types";

/** Every company regardless of status, for admin moderation (CONTRACTS.md
 * CR-14) — the public getCompanyBySlug is hard-scoped to VERIFIED only, so
 * PENDING/UNVERIFIED/REJECTED companies need this separate admin read. */
export async function getAdminCompanies(): Promise<CompanyDetail[]> {
  const companies = await db.company.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    include: {
      categories: { include: { category: true } },
      technologies: { include: { technology: true } },
      founders: true,
      news: { orderBy: { publishedAt: "desc" } },
      links: true,
      locations: true,
      internships: { where: { deletedAt: null }, orderBy: { updatedAt: "desc" } },
    },
  });

  const toRef = (x: { id: string; slug: string; name: string }): TaxonomyRef => ({
    id: x.id,
    slug: x.slug,
    name: x.name,
  });

  return companies.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    about: c.about,
    logoUrl: c.logoUrl,
    bannerUrl: c.bannerUrl,
    websiteUrl: c.websiteUrl,
    fundingStage: c.fundingStage,
    remotePolicy: c.remotePolicy,
    visaSponsorship: c.visaSponsorship,
    employeeCountRange: c.employeeCountRange,
    verified: c.verificationStatus === "VERIFIED",
    verificationStatus: c.verificationStatus,
    isFeatured: c.isFeatured,
    categories: c.categories.map((cc) => toRef(cc.category)),
    technologies: c.technologies.map((ct) => toRef(ct.technology)),
    founders: c.founders.map((f) => ({
      id: f.id,
      name: f.name,
      title: f.title,
      linkedinUrl: f.linkedinUrl,
      twitterUrl: f.twitterUrl,
      photoUrl: f.photoUrl,
      isHiringManager: f.isHiringManager,
    })),
    news: c.news.map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      publishedAt: n.publishedAt.toISOString(),
    })),
    links: c.links.map((l) => ({ id: l.id, type: l.type, url: l.url })),
    locations: c.locations.map((l) => ({
      id: l.id,
      city: l.city,
      country: l.country,
      isHQ: l.isHQ,
    })),
    openInternships: c.internships.map((i) =>
      toInternshipCard(i, { id: c.id, slug: c.slug, name: c.name, logoUrl: c.logoUrl }),
    ),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

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
