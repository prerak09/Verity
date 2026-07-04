// features/team/queries.ts — company team roster (PRD §14.2).

import { db } from "@/lib/db";
import type { TeamMemberDTO } from "@/types";

/** All members of a company (owners first), for the Team Members UI. */
export async function listTeamMembers(companyId: string): Promise<TeamMemberDTO[]> {
  const members = await db.companyMember.findMany({
    where: { companyId },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });
  return members.map((m) => ({
    id: m.id,
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
    joinedAt: m.createdAt.toISOString(),
  }));
}
