import type { TeamMemberDTO } from "@/types";

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString();

/** Rosters keyed by companyId. Matches MOCK_CURRENT_COMPANY_OWNER (co_meridian). */
export const MOCK_TEAM_MEMBERS: Record<string, TeamMemberDTO[]> = {
  co_meridian: [
    {
      id: "mem_meridian_1",
      userId: "user_company_1",
      name: "Dr. Sam Okafor",
      email: "sam@meridianhealth.example.com",
      avatarUrl: null,
      role: "OWNER",
      joinedAt: daysAgo(180),
    },
    {
      id: "mem_meridian_2",
      userId: "user_company_2",
      name: "Alicia Chen",
      email: "alicia@meridianhealth.example.com",
      avatarUrl: null,
      role: "RECRUITER",
      joinedAt: daysAgo(45),
    },
  ],
};

export function getMockTeamMembers(companyId: string): TeamMemberDTO[] {
  return MOCK_TEAM_MEMBERS[companyId] ?? [];
}
