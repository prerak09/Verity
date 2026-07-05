import type { Metadata } from "next";

import { InternshipManager } from "@/features/internships/components/InternshipManager";
import {
  MOCK_CURRENT_COMPANY_OWNER,
  MOCK_COMPANY_DETAILS,
  MOCK_INTERNSHIPS,
  MOCK_INTERNSHIP_DETAILS,
} from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Internships",
};

export default function CompanyInternshipsPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];

  const internships = MOCK_INTERNSHIPS.filter((i) => i.companyId === company.id).map(
    (i) => MOCK_INTERNSHIP_DETAILS[i.slug],
  );

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Internships</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Manage your listings — draft, publish, and close roles.
      </p>
      <div className="mt-6">
        <InternshipManager
          companyId={company.id}
          companyVerificationStatus={company.verificationStatus}
          initialInternships={internships}
        />
      </div>
    </div>
  );
}
