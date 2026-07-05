import type { Metadata } from "next";

import { CompanyAnalyticsCharts } from "@/features/analytics/components/CompanyAnalyticsCharts";
import { MOCK_COMPANY_ANALYTICS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function CompanyAnalyticsPage() {
  const analytics = MOCK_COMPANY_ANALYTICS;

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Analytics</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Aggregate, anonymized activity across your profile and listings.
      </p>
      <div className="mt-6">
        <CompanyAnalyticsCharts analytics={analytics} />
      </div>
    </div>
  );
}
