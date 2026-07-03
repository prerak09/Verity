"use server";

// features/verification/actions.ts — admin verification decisions (FR-51/60).
// Admin-only (Layer 2: company:verify). Each decision notifies the company.

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { notifyCompany } from "@/features/notifications/notify";
import { z } from "zod";
import { ConflictError, NotFoundError, type Result, type VerificationDecisionInput } from "@/types";

const decisionSchema = z.object({
  companyId: z.string().cuid(),
  reason: z.string().trim().min(4).max(2_000).optional(),
});
const reasonRequiredSchema = decisionSchema.extend({
  reason: z.string().trim().min(4, "A reason is required.").max(2_000),
});

async function loadPending(companyId: string) {
  const company = await db.company.findFirst({
    where: { id: companyId, deletedAt: null },
    select: { id: true, slug: true, verificationStatus: true },
  });
  if (!company) throw new NotFoundError("Company not found.");
  return company;
}

/** FR-51 — Approve: PENDING → VERIFIED, clear prior reason, notify. */
export async function approveVerification(
  input: VerificationDecisionInput,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:verify");
    const { companyId } = parseInput(decisionSchema, input);
    const company = await loadPending(companyId);
    if (company.verificationStatus !== "PENDING") {
      throw new ConflictError("Only pending companies can be approved.");
    }

    await db.company.update({
      where: { id: companyId },
      data: { verificationStatus: "VERIFIED", rejectionReason: null },
    });
    revalidateTag(`company:${company.slug}`, "max");
    await notifyCompany(companyId, {
      type: "VERIFICATION_APPROVED",
      title: "Your company is verified 🎉",
      body: "Your profile is now live and you can publish internships.",
      url: `/company/${company.slug}`,
    });
    return null;
  });
}

/** FR-51 — Reject (reason required): PENDING → REJECTED, store reason, notify. */
export async function rejectVerification(
  input: VerificationDecisionInput,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:verify");
    const { companyId, reason } = parseInput(reasonRequiredSchema, input);
    const company = await loadPending(companyId);

    await db.company.update({
      where: { id: companyId },
      data: { verificationStatus: "REJECTED", rejectionReason: reason },
    });
    await notifyCompany(companyId, {
      type: "VERIFICATION_REJECTED",
      title: "Verification rejected",
      body: `Reason: ${reason}`,
      url: `/company/${company.slug}/edit`,
    });
    return null;
  });
}

/**
 * FR-51 — Request Changes (reason required): back to UNVERIFIED with the reason
 * stored, so the resubmission cycle can reference it (PRD §23, task 4.2).
 */
export async function requestVerificationChanges(
  input: VerificationDecisionInput,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "company:verify");
    const { companyId, reason } = parseInput(reasonRequiredSchema, input);
    const company = await loadPending(companyId);

    await db.company.update({
      where: { id: companyId },
      data: { verificationStatus: "UNVERIFIED", rejectionReason: reason },
    });
    await notifyCompany(companyId, {
      type: "VERIFICATION_CHANGES_REQUESTED",
      title: "Changes requested",
      body: `Please update your profile: ${reason}`,
      url: `/company/${company.slug}/edit`,
    });
    return null;
  });
}
