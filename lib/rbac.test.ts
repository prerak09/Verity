import { describe, it, expect } from "vitest";
import { can, assertCan, scopesFor, isCompanyOwner, isCompanyMember } from "./rbac";
import { ForbiddenError, type CurrentUser } from "@/types";

function user(overrides: Partial<CurrentUser>): CurrentUser {
  return {
    id: "u1",
    clerkId: "clerk_1",
    email: "u@example.com",
    name: null,
    avatarUrl: null,
    role: "STUDENT",
    emailNotificationsEnabled: true,
    memberships: [],
    ...overrides,
  };
}

const owner = user({
  role: "COMPANY",
  memberships: [
    { companyId: "c1", companySlug: "c1", companyName: "C1", role: "OWNER" },
  ],
});
const recruiter = user({
  role: "COMPANY",
  memberships: [
    { companyId: "c1", companySlug: "c1", companyName: "C1", role: "RECRUITER" },
  ],
});
const admin = user({ role: "ADMIN" });
const student = user({ role: "STUDENT" });

describe("scopesFor", () => {
  it("maps platform roles to scopes", () => {
    expect(scopesFor(admin)).toEqual(["ADMIN"]);
    expect(scopesFor(student)).toEqual(["STUDENT"]);
    expect(scopesFor(owner)).toEqual(["COMPANY_OWNER"]);
    expect(scopesFor(recruiter)).toEqual(["COMPANY_RECRUITER"]);
  });

  it("scopes company membership to the requested companyId", () => {
    expect(scopesFor(owner, "c1")).toEqual(["COMPANY_OWNER"]);
    expect(scopesFor(owner, "other")).toEqual([]);
  });
});

describe("can", () => {
  it("grants student their own permissions", () => {
    expect(can(student, "bookmark:create")).toBe(true);
    expect(can(student, "profile:update:own")).toBe(true);
  });

  it("denies student company/admin permissions", () => {
    expect(can(student, "company:update:own")).toBe(false);
    expect(can(student, "company:verify")).toBe(false);
  });

  it("owner can update company + manage team; recruiter cannot", () => {
    expect(can(owner, "company:update:own", "c1")).toBe(true);
    expect(can(owner, "company:team:manage", "c1")).toBe(true);
    expect(can(recruiter, "company:update:own", "c1")).toBe(false);
    expect(can(recruiter, "company:team:manage", "c1")).toBe(false);
  });

  it("both owner and recruiter can create/archive internships", () => {
    expect(can(owner, "internship:create", "c1")).toBe(true);
    expect(can(recruiter, "internship:create", "c1")).toBe(true);
    expect(can(recruiter, "internship:archive:own", "c1")).toBe(true);
  });

  it("does not grant company permission for a different company", () => {
    expect(can(owner, "company:update:own", "other")).toBe(false);
  });

  it("admin holds all admin permissions", () => {
    expect(can(admin, "company:verify")).toBe(true);
    expect(can(admin, "report:handle")).toBe(true);
    expect(can(admin, "analytics:view:all")).toBe(true);
  });

  it("null user is always denied", () => {
    expect(can(null, "bookmark:create")).toBe(false);
  });
});

describe("assertCan", () => {
  it("throws ForbiddenError when denied", () => {
    expect(() => assertCan(student, "company:verify")).toThrow(ForbiddenError);
  });
  it("does not throw when allowed", () => {
    expect(() => assertCan(admin, "company:verify")).not.toThrow();
  });
});

describe("ownership helpers", () => {
  it("isCompanyOwner / isCompanyMember", () => {
    expect(isCompanyOwner(owner, "c1")).toBe(true);
    expect(isCompanyOwner(recruiter, "c1")).toBe(false);
    expect(isCompanyMember(recruiter, "c1")).toBe(true);
    expect(isCompanyMember(recruiter, "other")).toBe(false);
  });
});
