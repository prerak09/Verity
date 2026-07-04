// features/team/schema.ts — Zod for team management (PRD §14.2, FR-62).

import { z } from "zod";

export const inviteMemberSchema = z.object({
  companyId: z.string().cuid(),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role: z.enum(["OWNER", "RECRUITER"]).default("RECRUITER"),
});
export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
  companyId: z.string().cuid(),
  memberId: z.string().cuid(),
  role: z.enum(["OWNER", "RECRUITER"]),
});
export type UpdateMemberRoleSchema = z.infer<typeof updateMemberRoleSchema>;

export const transferOwnershipSchema = z.object({
  companyId: z.string().cuid(),
  toMemberId: z.string().cuid(),
});
export type TransferOwnershipSchema = z.infer<typeof transferOwnershipSchema>;
