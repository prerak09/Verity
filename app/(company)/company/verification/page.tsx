import type { Metadata } from "next";

import { VerificationStatusDetail } from "@/features/companies/components/VerificationStatusDetail";
import { MOCK_CURRENT_COMPANY_OWNER, MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Verification Status",
};

export default function CompanyVerificationPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Verification Status</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Verified profiles show a badge and rank higher in student search.
      </p>
      <div className="mt-6 max-w-2xl">
        <VerificationStatusDetail company={company} />
      </div>
    </div>
  );
}
