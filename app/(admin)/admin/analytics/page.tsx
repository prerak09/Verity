import type { Metadata } from "next";

import { PlatformAnalyticsCharts } from "@/features/admin/components/PlatformAnalyticsCharts";
import { MOCK_PLATFORM_ANALYTICS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Platform Analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Platform Analytics</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Point-in-time snapshot across the whole platform.
      </p>
      <div className="mt-6">
        <PlatformAnalyticsCharts analytics={MOCK_PLATFORM_ANALYTICS} />
      </div>
    </div>
  );
}
