import type { CurrentUser } from "@/types";

export const MOCK_CURRENT_STUDENT: CurrentUser = {
  id: "user_student_1",
  clerkId: "user_mock_student_1",
  email: "jordan.ames@example.edu",
  name: "Jordan Ames",
  avatarUrl: null,
  role: "STUDENT",
  memberships: [],
};

export const MOCK_CURRENT_COMPANY_OWNER: CurrentUser = {
  id: "user_company_1",
  clerkId: "user_mock_company_1",
  email: "priya@ledgerly.example.com",
  name: "Priya Raman",
  avatarUrl: null,
  role: "COMPANY",
  memberships: [
    {
      companyId: "co_ledgerly",
      companySlug: "ledgerly",
      companyName: "Ledgerly",
      role: "OWNER",
    },
  ],
};

export const MOCK_CURRENT_ADMIN: CurrentUser = {
  id: "user_admin_1",
  clerkId: "user_mock_admin_1",
  email: "admin@verity.example.com",
  name: "Verity Admin",
  avatarUrl: null,
  role: "ADMIN",
  memberships: [],
};
