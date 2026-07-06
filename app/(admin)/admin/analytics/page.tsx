import type { Metadata } from "next";

import { PlatformAnalyticsCharts } from "@/features/admin/components/PlatformAnalyticsCharts";
import { getPlatformAnalytics } from "@/features/admin/analytics";
import { MOCK_PLATFORM_ANALYTICS } from "@/components/lib/mocks";
import type { PlatformAnalytics } from "@/types";

export const metadata: Metadata = {
  title: "Platform Analytics",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let analytics: PlatformAnalytics = MOCK_PLATFORM_ANALYTICS;
  try {
    analytics = await getPlatformAnalytics();
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Platform Analytics</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Point-in-time snapshot across the whole platform.
      </p>
      <div className="mt-6">
        <PlatformAnalyticsCharts analytics={analytics} />
      </div>
    </div>
  );
}
