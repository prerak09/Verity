// config/roles.ts — Permission matrix (TRD §7.3). CONTRACT #2 — FROZEN.
//
// These permission strings are imported by Dev B's UI to show/hide actions and
// by `lib/rbac.ts` for server-side enforcement. Do NOT rename or remove a string
// after Phase 0 without announcing it in TEAM/CONTRACTS.md — the frontend binds
// to these exact literals.

export const PERMISSIONS = {
  STUDENT: [
    "bookmark:create",
    "bookmark:delete",
    "application:create",
    "application:update:own",
    "profile:update:own",
    "settings:update:own",
  ],
  COMPANY_OWNER: [
    "company:update:own",
    "company:team:manage",
    "internship:create",
    "internship:update:own",
    "internship:archive:own",
    "analytics:view:own",
    "settings:update:own",
  ],
  COMPANY_RECRUITER: [
    "internship:create",
    "internship:update:own",
    "internship:archive:own",
    "analytics:view:own",
    "settings:update:own",
  ],
  ADMIN: [
    "user:manage",
    "company:verify",
    "company:moderate",
    "internship:moderate",
    "category:manage",
    "technology:manage",
    "featured:manage",
    "report:handle",
    "analytics:view:all",
    "settings:update:own",
  ],
} as const;

/** The four permission scopes keyed above (platform role + company sub-role). */
export type PermissionScope = keyof typeof PERMISSIONS;

/** Union of every permission string across all scopes. */
export type Permission =
  (typeof PERMISSIONS)[PermissionScope][number];

/** Flat, de-duplicated list of every permission (useful for admin tooling/tests). */
export const ALL_PERMISSIONS: readonly Permission[] = Array.from(
  new Set(Object.values(PERMISSIONS).flat()),
) as Permission[];
