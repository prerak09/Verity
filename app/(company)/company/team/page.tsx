import type { Metadata } from "next";

import { TeamMembersManager } from "@/features/team/components/TeamMembersManager";
import {
  MOCK_CURRENT_COMPANY_OWNER,
  MOCK_COMPANY_DETAILS,
  getMockTeamMembers,
} from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Team",
};

export default function CompanyTeamPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];
  const members = getMockTeamMembers(company.id);

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Team</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Invite teammates, manage roles, and transfer ownership.
      </p>
      <div className="mt-6">
        <TeamMembersManager
          companyId={company.id}
          currentUserId={MOCK_CURRENT_COMPANY_OWNER.id}
          initialMembers={members}
        />
      </div>
    </div>
  );
}
