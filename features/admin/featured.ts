"use server";

// features/admin/featured.ts — windowed Featured management (FR-55, PRD §23).
// Admin-only (featured:manage). Expiry is server-checked: a company is "featured"
// only while featuredUntil is in the future.

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { z } from "zod";
import { ConflictError, NotFoundError, type Result } from "@/types";

const featureSchema = z.object({
  companyId: z.string().cuid(),
  days: z.number().int().min(1).max(365),
});

/** Feature a VERIFIED company for a window of N days (FR-55). */
export async function featureCompany(input: {
  companyId: string;
  days: number;
}): Promise<Result<{ featuredUntil: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "featured:manage");
    const { companyId, days } = parseInput(featureSchema, input);

    const company = await db.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: { verificationStatus: true },
    });
    if (!company) throw new NotFoundError("Company not found.");
    if (company.verificationStatus !== "VERIFIED") {
      throw new ConflictError("Only verified companies can be featured.");
    }

    const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await db.company.update({
      where: { id: companyId },
      data: { isFeatured: true, featuredUntil },
    });
    return { featuredUntil: featuredUntil.toISOString() };
  });
}

/** Remove Featured immediately. */
export async function unfeatureCompany(companyId: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "featured:manage");
    await db.company.updateMany({
      where: { id: companyId },
      data: { isFeatured: false, featuredUntil: null },
    });
    return null;
  });
}

/**
 * Server-checked expiry sweep (FR-55): clears isFeatured for any company whose
 * window has passed. Safe to call from the trending cron or on read.
 */
export async function expireFeatured(): Promise<number> {
  const result = await db.company.updateMany({
    where: { isFeatured: true, featuredUntil: { lt: new Date() } },
    data: { isFeatured: false },
  });
  return result.count;
}
