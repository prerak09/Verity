import { describe, it, expect } from "vitest";
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  transferOwnershipSchema,
} from "./schema";

const cuid = "clx0000000000000000000000";

describe("inviteMemberSchema", () => {
  it("accepts a valid invite and defaults role to RECRUITER", () => {
    const r = inviteMemberSchema.safeParse({ companyId: cuid, email: "a@b.com" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.role).toBe("RECRUITER");
  });
  it("lowercases the email", () => {
    const r = inviteMemberSchema.safeParse({ companyId: cuid, email: "A@B.COM" });
    expect(r.success && r.data.email).toBe("a@b.com");
  });
  it("rejects a bad email", () => {
    expect(inviteMemberSchema.safeParse({ companyId: cuid, email: "nope" }).success).toBe(false);
  });
  it("rejects an invalid role", () => {
    expect(
      inviteMemberSchema.safeParse({ companyId: cuid, email: "a@b.com", role: "ADMIN" }).success,
    ).toBe(false);
  });
});

describe("updateMemberRoleSchema", () => {
  it("requires companyId, memberId, role", () => {
    expect(
      updateMemberRoleSchema.safeParse({ companyId: cuid, memberId: cuid, role: "OWNER" }).success,
    ).toBe(true);
    expect(updateMemberRoleSchema.safeParse({ companyId: cuid, role: "OWNER" }).success).toBe(false);
  });
});

describe("transferOwnershipSchema", () => {
  it("requires companyId + toMemberId", () => {
    expect(transferOwnershipSchema.safeParse({ companyId: cuid, toMemberId: cuid }).success).toBe(true);
    expect(transferOwnershipSchema.safeParse({ companyId: cuid }).success).toBe(false);
  });
});
