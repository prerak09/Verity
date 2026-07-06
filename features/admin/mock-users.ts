import type { AdminUserDTO } from "@/types";

/** Re-exported for call sites written against the old local-only name (CR-15,
 * now resolved — `listUsers()` in ./users.ts returns real `AdminUserDTO[]`). */
export type AdminUserRow = AdminUserDTO;

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
