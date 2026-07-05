import type { Metadata } from "next";

import { ProfileEditor } from "@/features/companies/components/ProfileEditor";
import {
  MOCK_CURRENT_COMPANY_OWNER,
  MOCK_COMPANY_DETAILS,
  MOCK_CATEGORIES,
  MOCK_TECHNOLOGIES,
} from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Company Profile",
};

export default function CompanyProfileEditorPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Company Profile</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Changes save automatically as you type.
      </p>
      <div className="mt-6 max-w-2xl">
        <ProfileEditor
          company={company}
          categories={MOCK_CATEGORIES}
          technologies={MOCK_TECHNOLOGIES}
        />
      </div>
    </div>
  );
}
