import type { Metadata } from "next";

import { CompanyNewsManager } from "@/features/companies/components/CompanyNewsManager";
import { MOCK_CURRENT_COMPANY_OWNER, MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Company News",
};

export default function CompanyNewsPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Company News</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Short updates shown on your public profile, newest first.
      </p>
      <div className="mt-6 max-w-2xl">
        <CompanyNewsManager companyId={company.id} initialNews={company.news} />
      </div>
    </div>
  );
}
