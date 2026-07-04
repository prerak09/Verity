"use server";

// features/team/actions.ts — company team management (PRD §14.2, FR-62).
// Owner-only (Layer 2: company:team:manage + isCompanyOwner). Every write is
// scoped to the target company (Layer 3). Imports lib/rbac (ESLint 5.5).
//
// V1 "invite" = add an EXISTING Verity user by email as a member (no separate
// invite/token table in V1, per the PRD's no-automation scope). transferOwnership
// is atomic: demote current owner → promote target in one transaction.

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan, isCompanyOwner } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { notify } from "@/features/notifications/notify";
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  transferOwnershipSchema,
} from "./schema";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  type CompanyMemberRole,
  type InviteMemberInput,
  type Result,
  type TransferOwnershipInput,
  type UpdateMemberRoleInput,
} from "@/types";

/** Guard: current user must be an OWNER of the target company. */
async function assertOwner(companyId: string) {
  const user = await requireUser();
  assertCan(user, "company:team:manage", companyId);
  if (!isCompanyOwner(user, companyId)) {
    throw new ForbiddenError("Only the company owner can manage the team.");
  }
  return user;
}

/**
 * FR-62 — add an existing user (by email) to the company. Notifies them.
 * The invitee must already have a Verity account in V1.
 */
export async function inviteMember(
  input: InviteMemberInput,
): Promise<Result<{ memberId: string }>> {
  return handleAction(async () => {
    await assertOwner(input.companyId);
    const { companyId, email, role } = parseInput(inviteMemberSchema, input);

    const company = await db.company.findFirst({
      where: { id: companyId, deletedAt: null },
      select: { id: true, name: true, slug: true },
    });
    if (!company) throw new NotFoundError("Company not found.");

    const invitee = await db.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, role: true },
    });
    if (!invitee) {
      throw new NotFoundError("No Verity account found for that email. Ask them to sign up first.");
    }

    const existing = await db.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId: invitee.id } },
      select: { id: true },
    });
    if (existing) throw new ConflictError("That user is already a team member.");

    const member = await db.$transaction(async (tx) => {
      const created = await tx.companyMember.create({
        data: { companyId, userId: invitee.id, role },
        select: { id: true },
      });
      // A member of a company must carry the COMPANY platform role.
      if (invitee.role === "STUDENT") {
        await tx.user.update({ where: { id: invitee.id }, data: { role: "COMPANY" } });
      }
      return created;
    });

    await notify({
      userId: invitee.id,
      type: "TEAM_INVITE",
      title: `You've been added to ${company.name}`,
      body: `You now have ${role === "OWNER" ? "owner" : "recruiter"} access on Verity.`,
      url: `/company/${company.slug}`,
    });

    return { memberId: member.id };
  });
}

/** Change a member's sub-role (OWNER/RECRUITER). Cannot demote the last owner. */
export async function updateMemberRole(
  input: UpdateMemberRoleInput,
): Promise<Result<{ role: CompanyMemberRole }>> {
  return handleAction(async () => {
    await assertOwner(input.companyId);
    const { companyId, memberId, role } = parseInput(updateMemberRoleSchema, input);

    const member = await db.companyMember.findFirst({
      where: { id: memberId, companyId },
      select: { id: true, role: true },
    });
    if (!member) throw new NotFoundError("Team member not found.");

    // Guard: don't leave the company with zero owners.
    if (member.role === "OWNER" && role === "RECRUITER") {
      const ownerCount = await db.companyMember.count({
        where: { companyId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        throw new ConflictError("A company must keep at least one owner. Transfer ownership instead.");
      }
    }

    const updated = await db.companyMember.update({
      where: { id: memberId },
      data: { role },
      select: { role: true },
    });
    return { role: updated.role };
  });
}

/** Revoke a member. Cannot revoke the last owner. */
export async function revokeMember(input: {
  companyId: string;
  memberId: string;
}): Promise<Result<null>> {
  return handleAction(async () => {
    await assertOwner(input.companyId);
    const member = await db.companyMember.findFirst({
      where: { id: input.memberId, companyId: input.companyId },
      select: { id: true, role: true },
    });
    if (!member) throw new NotFoundError("Team member not found.");

    if (member.role === "OWNER") {
      const ownerCount = await db.companyMember.count({
        where: { companyId: input.companyId, role: "OWNER" },
      });
      if (ownerCount <= 1) {
        throw new ConflictError("Cannot remove the last owner. Transfer ownership first.");
      }
    }

    // Layer 3: delete scoped to member id AND company id.
    await db.companyMember.deleteMany({
      where: { id: input.memberId, companyId: input.companyId },
    });
    return null;
  });
}

/**
 * Transfer ownership: promote `toMemberId` to OWNER and demote the acting owner
 * to RECRUITER, atomically — so there is never a moment with zero or two
 * conflicting owners mid-operation.
 */
export async function transferOwnership(
  input: TransferOwnershipInput,
): Promise<Result<null>> {
  return handleAction(async () => {
    const actor = await assertOwner(input.companyId);
    const { companyId, toMemberId } = parseInput(transferOwnershipSchema, input);

    const [target, actorMember] = await Promise.all([
      db.companyMember.findFirst({
        where: { id: toMemberId, companyId },
        select: { id: true, userId: true },
      }),
      db.companyMember.findFirst({
        where: { companyId, userId: actor.id },
        select: { id: true },
      }),
    ]);
    if (!target) throw new NotFoundError("Target team member not found.");
    if (!actorMember) throw new ForbiddenError("You are not a member of this company.");
    if (target.userId === actor.id) {
      throw new ConflictError("You already own this company.");
    }

    await db.$transaction([
      db.companyMember.update({ where: { id: target.id }, data: { role: "OWNER" } }),
      db.companyMember.update({ where: { id: actorMember.id }, data: { role: "RECRUITER" } }),
    ]);

    await notify({
      userId: target.userId,
      type: "TEAM_INVITE",
      title: "You're now the company owner",
      body: "Ownership of the company has been transferred to you.",
    });
    return null;
  });
}
