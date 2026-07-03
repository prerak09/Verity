// lib/rbac.ts — Layer 2 of the three-layer RBAC (TRD §7.4).
//
// Every actions.ts that imports `db` MUST import from here and call assertCan()
// before any mutation (enforced by the structural ESLint rule in task 5.5).
// Layer 1 = middleware route gate; Layer 3 = Prisma WHERE ownership filter.

import { PERMISSIONS, type Permission, type PermissionScope } from "@/config/roles";
import { ForbiddenError, type CurrentUser } from "@/types";

/**
 * Resolve which permission scopes a user has.
 * - ADMIN → ["ADMIN"]
 * - STUDENT → ["STUDENT"]
 * - COMPANY → one scope per membership role (OWNER/RECRUITER). When a companyId
 *   is supplied, only that company's membership is considered (resource-scoped).
 */
export function scopesFor(
  user: Pick<CurrentUser, "role" | "memberships">,
  companyId?: string,
): PermissionScope[] {
  if (user.role === "ADMIN") return ["ADMIN"];
  if (user.role === "STUDENT") return ["STUDENT"];

  // COMPANY: derive scopes from CompanyMember sub-roles.
  const memberships = companyId
    ? user.memberships.filter((m) => m.companyId === companyId)
    : user.memberships;

  const scopes = new Set<PermissionScope>();
  for (const m of memberships) {
    scopes.add(m.role === "OWNER" ? "COMPANY_OWNER" : "COMPANY_RECRUITER");
  }
  return Array.from(scopes);
}

/** Non-throwing permission check. `companyId` scopes company permissions to one company. */
export function can(
  user: Pick<CurrentUser, "role" | "memberships"> | null,
  permission: Permission,
  companyId?: string,
): boolean {
  if (!user) return false;
  for (const scope of scopesFor(user, companyId)) {
    if ((PERMISSIONS[scope] as readonly Permission[]).includes(permission)) {
      return true;
    }
  }
  return false;
}

/**
 * Throwing guard for the top of every mutation (TRD §7.4 Layer 2).
 * Throws ForbiddenError — caught at the action/route boundary and mapped to the
 * `{ success:false, error:{ code:"FORBIDDEN" } }` envelope.
 */
export function assertCan(
  user: Pick<CurrentUser, "role" | "memberships"> | null,
  permission: Permission,
  companyId?: string,
): void {
  if (!can(user, permission, companyId)) {
    throw new ForbiddenError(
      `Missing permission: ${permission}${companyId ? ` (company ${companyId})` : ""}.`,
    );
  }
}

/** True if the user is an active member of the given company (any sub-role). */
export function isCompanyMember(
  user: Pick<CurrentUser, "memberships"> | null,
  companyId: string,
): boolean {
  return !!user?.memberships.some((m) => m.companyId === companyId);
}

/** True if the user is the OWNER of the given company. */
export function isCompanyOwner(
  user: Pick<CurrentUser, "memberships"> | null,
  companyId: string,
): boolean {
  return !!user?.memberships.some(
    (m) => m.companyId === companyId && m.role === "OWNER",
  );
}
