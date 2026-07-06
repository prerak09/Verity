import type { CurrentUser } from "@/types";

export const MOCK_CURRENT_STUDENT: CurrentUser = {
  id: "user_student_1",
  clerkId: "user_mock_student_1",
  email: "jordan.ames@example.edu",
  name: "Jordan Ames",
  avatarUrl: null,
  role: "STUDENT",
  emailNotificationsEnabled: true,
  memberships: [],
};

// Meridian Health (PENDING, sparser profile) rather than the fully-verified
// Ledgerly — the company portal needs to demonstrate the verification
// banner and "incomplete profile" nudges throughout Phase 4, which a
// fully-verified company would never show.
export const MOCK_CURRENT_COMPANY_OWNER: CurrentUser = {
  id: "user_company_1",
  clerkId: "user_mock_company_1",
  email: "sam@meridianhealth.example.com",
  name: "Dr. Sam Okafor",
  avatarUrl: null,
  role: "COMPANY",
  emailNotificationsEnabled: true,
  memberships: [
    {
      companyId: "co_meridian",
      companySlug: "meridian-health",
      companyName: "Meridian Health",
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
  emailNotificationsEnabled: true,
  memberships: [],
};
