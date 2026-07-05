import type { PlatformRole } from "@/types";

/**
 * No `AdminUserDTO` or `listUsers` query exists anywhere in the backend yet
 * (confirmed: no list-users function, no admin-facing user type in
 * `@/types`) — this is the one admin area with nothing to build against,
 * not even a mock. Kept local to `features/admin/` rather than in
 * `components/lib/mocks/` since it doesn't match a real shared contract.
 * Logged as CONTRACTS.md CR-15.
 */
export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  role: PlatformRole;
  createdAt: string;
  disabledAt: string | null;
}

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString();

export const MOCK_ADMIN_USERS: AdminUserRow[] = [
  {
    id: "user_student_1",
    name: "Jordan Ames",
    email: "jordan.ames@example.edu",
    role: "STUDENT",
    createdAt: daysAgo(120),
    disabledAt: null,
  },
  {
    id: "user_company_1",
    name: "Dr. Sam Okafor",
    email: "sam@meridianhealth.example.com",
    role: "COMPANY",
    createdAt: daysAgo(60),
    disabledAt: null,
  },
  {
    id: "user_company_2",
    name: "Alicia Chen",
    email: "alicia@meridianhealth.example.com",
    role: "COMPANY",
    createdAt: daysAgo(45),
    disabledAt: null,
  },
  {
    id: "user_admin_1",
    name: "Verity Admin",
    email: "admin@verity.example.com",
    role: "ADMIN",
    createdAt: daysAgo(300),
    disabledAt: null,
  },
  {
    id: "user_student_2",
    name: "Priya Nandan",
    email: "priya.nandan@example.edu",
    role: "STUDENT",
    createdAt: daysAgo(200),
    disabledAt: daysAgo(10),
  },
];
