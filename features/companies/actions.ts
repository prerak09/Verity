"use server";

// features/companies/actions.ts — company mutations (FR-10/11/13/15).
// Every mutation: requireUser → assertCan (Layer 2) → Prisma with ownership
// WHERE (Layer 3) → result envelope. Imports lib/rbac (enforced by ESLint 5.5).

import { revalidateTag } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan, isCompanyOwner } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { normalizeDomain } from "@/lib/slug";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  registerCompanySchema,
  updateCompanySchema,
  founderSchema,
  companyNewsSchema,
  companyLinkSchema,
  companyLocationSchema,
} from "./schema";
import { getCompanyBySlug } from "./queries";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  type Result,
  type CompanyDetail,
  type RegisterCompanyInput,
  type UpdateCompanyInput,
  type FounderInput,
  type CompanyNewsInput,
  type CompanyLinkInput,
  type CompanyLocationInput,
  type VerificationStatus,
} from "@/types";

/**
 * FR-10 — register a company. Creates Company + CompanyMember(OWNER) and elevates
 * the user's platform role to COMPANY in a single transaction, so we never have a
 * COMPANY-role user with no company (TRD §6). FR-15 duplicate detection on domain.
 */
export async function registerCompany(
  input: RegisterCompanyInput,
): Promise<Result<{ id: string; slug: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    const data = parseInput(registerCompanySchema, input);

    // FR-15: one canonical profile per unique domain.
    const domain = normalizeDomain(data.websiteUrl);
    if (!domain) throw new ConflictError("Website URL is not a valid domain.");

    const [slugTaken, domainTaken] = await Promise.all([
      db.company.findFirst({ where: { slug: data.slug }, select: { id: true } }),
      db.company.findFirst({
        where: { websiteUrl: { contains: domain }, deletedAt: null },
        select: { id: true },
      }),
    ]);
    if (slugTaken) throw new ConflictError("That URL slug is already taken.");
    if (domainTaken) {
      throw new ConflictError(
        "A company with this domain already exists. Ask to be added as a team member.",
      );
    }

    const company = await db.$transaction(async (tx) => {
      const created = await tx.company.create({
        data: {
          slug: data.slug,
          name: data.name,
          tagline: data.tagline,
          websiteUrl: data.websiteUrl,
          verificationStatus: "UNVERIFIED",
          members: { create: { userId: user.id, role: "OWNER" } },
        },
      });
      await tx.user.update({ where: { id: user.id }, data: { role: "COMPANY" } });
      return created;
    });

    // Sync the role claim to Clerk so middleware (Layer 1) sees COMPANY (TRD §6).
    try {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(user.clerkId, {
        publicMetadata: { role: "COMPANY" },
      });
    } catch {
      // Non-fatal: getCurrentUser reads the DB as source of truth; the claim
      // refreshes on the next user.updated webhook.
    }

    return { id: company.id, slug: company.slug };
  });
}

/**
 * FR-11/13 — update profile fields. Owner only. FR-13: a domain (websiteUrl)
 * change on a Verified company flags it for re-verification.
 */
export async function updateCompany(
  companyId: string,
  input: UpdateCompanyInput,
): Promise<Result<CompanyDetail>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:update:own", companyId);

    const existing = await db.company.findFirst({
      where: { id: companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundError("Company not found.");

    const data = parseInput(updateCompanySchema, input);
    const { categoryIds, technologyIds, ...scalar } = data;
    // XSS sanitize rich-text on write (NFR 13.4).
    if (scalar.about !== undefined) scalar.about = sanitizeHtml(scalar.about);

    // FR-13: domain change on a VERIFIED company → back to PENDING re-verify.
    let verificationStatus: VerificationStatus | undefined;
    if (
      scalar.websiteUrl &&
      normalizeDomain(scalar.websiteUrl) !== normalizeDomain(existing.websiteUrl ?? "") &&
      existing.verificationStatus === "VERIFIED"
    ) {
      verificationStatus = "PENDING";
    }

    await db.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: companyId }, // Layer 3: scoped by id we already own-checked
        data: { ...scalar, ...(verificationStatus ? { verificationStatus } : {}) },
      });
      if (categoryIds) {
        await tx.companyCategory.deleteMany({ where: { companyId } });
        await tx.companyCategory.createMany({
          data: categoryIds.map((categoryId) => ({ companyId, categoryId })),
          skipDuplicates: true,
        });
      }
      if (technologyIds) {
        await tx.companyTechnology.deleteMany({ where: { companyId } });
        await tx.companyTechnology.createMany({
          data: technologyIds.map((technologyId) => ({ companyId, technologyId })),
          skipDuplicates: true,
        });
      }
    });

    revalidateTag(`company:${existing.slug}`, "max");
    const detail = await getCompanyBySlug(existing.slug);
    if (!detail) {
      // Not yet VERIFIED (getCompanyBySlug only returns verified) — re-read raw.
      throw new NotFoundError("Company saved but is not yet public.");
    }
    return detail;
  });
}

// ── FR-11 sub-entity actions (founders / news / links / locations) ────────────

async function assertOwns(companyId: string) {
  const user = await requireUser();
  assertCan(user, "company:update:own", companyId);
  if (!isCompanyOwner(user, companyId)) {
    throw new ForbiddenError("Only the company owner can edit this.");
  }
  return user;
}

export async function addFounder(
  companyId: string,
  input: FounderInput,
): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    const data = parseInput(founderSchema, input);
    const f = await db.founder.create({ data: { companyId, ...data } });
    return { id: f.id };
  });
}

export async function removeFounder(
  companyId: string,
  founderId: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    // Layer 3: delete scoped to both founder id AND companyId.
    await db.founder.deleteMany({ where: { id: founderId, companyId } });
    return null;
  });
}

export async function addCompanyNews(
  companyId: string,
  input: CompanyNewsInput,
): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    const data = parseInput(companyNewsSchema, input);
    const n = await db.companyNews.create({
      data: {
        companyId,
        ...data,
        title: sanitizeHtml(data.title), // NFR 13.4
        publishedAt: new Date(data.publishedAt),
      },
    });
    return { id: n.id };
  });
}

export async function addCompanyLink(
  companyId: string,
  input: CompanyLinkInput,
): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    const data = parseInput(companyLinkSchema, input);
    const l = await db.companyLink.create({ data: { companyId, ...data } });
    return { id: l.id };
  });
}

export async function addCompanyLocation(
  companyId: string,
  input: CompanyLocationInput,
): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    const data = parseInput(companyLocationSchema, input);
    const loc = await db.companyLocation.create({ data: { companyId, ...data } });
    return { id: loc.id };
  });
}

/**
 * FR-12/22 gate — submit for verification. Server-side re-validation that all
 * (Req.) fields are present (NFR 13.4), then UNVERIFIED/REJECTED → PENDING.
 */
export async function submitForVerification(
  companyId: string,
): Promise<Result<{ status: VerificationStatus }>> {
  return handleAction(async () => {
    await assertOwns(companyId);
    const { getProfileCompleteness } = await import("./queries");
    const completeness = await getProfileCompleteness(companyId);
    if (!completeness.canSubmitForVerification) {
      throw new ConflictError(
        `Complete required fields first: ${completeness.missingRequiredFields.join(", ")}.`,
      );
    }
    const updated = await db.company.update({
      where: { id: companyId },
      data: { verificationStatus: "PENDING" },
      select: { verificationStatus: true },
    });
    return { status: updated.verificationStatus };
  });
}
