import type { ApplicationDTO, BookmarkDTO, StudentProfileDTO } from "@/types";

import { MOCK_COMPANIES } from "./companies";
import { MOCK_INTERNSHIPS } from "./internships";

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString();

const companyBySlug = (slug: string) =>
  MOCK_COMPANIES.find((c) => c.slug === slug)!;
const internshipBySlug = (slug: string) =>
  MOCK_INTERNSHIPS.find((i) => i.slug === slug)!;

export const MOCK_STUDENT_PROFILE: StudentProfileDTO = {
  id: "student_1",
  userId: "user_student_1",
  name: "Jordan Ames",
  email: "jordan.ames@example.edu",
  avatarUrl: null,
  college: "University of Michigan",
  gradYear: 2027,
  resumeUrl: null,
  bio: "CS junior interested in backend infra and developer tools.",
};

export const MOCK_BOOKMARKS: BookmarkDTO[] = [
  {
    id: "bm_1",
    targetType: "COMPANY",
    createdAt: daysAgo(10),
    company: companyBySlug("ledgerly"),
    internship: null,
  },
  {
    id: "bm_2",
    targetType: "COMPANY",
    createdAt: daysAgo(6),
    company: companyBySlug("arclight-ai"),
    internship: null,
  },
  {
    id: "bm_3",
    targetType: "INTERNSHIP",
    createdAt: daysAgo(2),
    company: null,
    internship: internshipBySlug("platform-engineering-intern"),
  },
  {
    id: "bm_4",
    targetType: "COMPANY",
    createdAt: daysAgo(30),
    company: companyBySlug("sentrywall"),
    internship: null,
  },
];

export const MOCK_APPLICATIONS: ApplicationDTO[] = [
  {
    id: "app_1",
    internship: internshipBySlug("backend-engineering-intern"),
    status: "INTERVIEW",
    notes: "Phone screen went well — technical round scheduled for next week.",
    appliedAt: daysAgo(9),
    createdAt: daysAgo(9),
    updatedAt: daysAgo(2),
  },
  {
    id: "app_2",
    internship: internshipBySlug("ml-research-intern"),
    status: "APPLIED",
    notes: null,
    appliedAt: daysAgo(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "app_3",
    internship: internshipBySlug("platform-engineering-intern"),
    status: "SAVED",
    notes: "Reach out to alum who interned here last summer before applying.",
    appliedAt: null,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "app_4",
    internship: internshipBySlug("product-engineering-intern"),
    status: "OFFER",
    notes: "Offer received — $34/hr, decision due in 2 weeks.",
    appliedAt: daysAgo(25),
    createdAt: daysAgo(25),
    updatedAt: daysAgo(1),
  },
  {
    id: "app_5",
    internship: internshipBySlug("frontend-engineering-intern"),
    status: "REJECTED",
    notes: null,
    appliedAt: daysAgo(55),
    createdAt: daysAgo(55),
    updatedAt: daysAgo(40),
  },
  {
    id: "app_6",
    internship: internshipBySlug("security-engineering-intern"),
    status: "OA",
    notes: "Online assessment due Friday — 2 algorithm problems, 90 min.",
    appliedAt: daysAgo(5),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4),
  },
];
