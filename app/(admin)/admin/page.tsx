import type { Metadata } from "next";

import { AdminDashboardModules } from "@/features/admin/components/AdminDashboardModules";
import { getPlatformAnalytics, getDashboardCounts } from "@/features/admin/analytics";
import { getVerificationQueue } from "@/features/verification/queries";
import { getReportsQueue } from "@/features/admin/reports";
import {
  MOCK_VERIFICATION_QUEUE,
  MOCK_REPORTS,
  MOCK_PLATFORM_ANALYTICS,
  MOCK_CATEGORIES,
  MOCK_TECHNOLOGIES,
  MOCK_COMPANY_DETAILS,
} from "@/components/lib/mocks";
import type { VerificationQueueItem, ReportDTO, PlatformAnalytics } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let verificationQueue: VerificationQueueItem[] = MOCK_VERIFICATION_QUEUE;
  let reports: ReportDTO[] = MOCK_REPORTS;
  let analytics: PlatformAnalytics = MOCK_PLATFORM_ANALYTICS;
  let categoryCount = MOCK_CATEGORIES.length;
  let technologyCount = MOCK_TECHNOLOGIES.length;
  let featuredCount = Object.values(MOCK_COMPANY_DETAILS).filter((c) => c.isFeatured).length;

  try {
    const [queue, reportsQueue, platformAnalytics, dashboardCounts] = await Promise.all([
      getVerificationQueue(),
      getReportsQueue(),
      getPlatformAnalytics(),
      getDashboardCounts(),
    ]);
    verificationQueue = queue;
    reports = reportsQueue;
    analytics = platformAnalytics;
    categoryCount = dashboardCounts.categoryCount;
    technologyCount = dashboardCounts.technologyCount;
    featuredCount = dashboardCounts.featuredCount;
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Admin Dashboard</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Platform-wide status at a glance.
      </p>
      <div className="mt-6">
        <AdminDashboardModules
          verificationQueue={verificationQueue}
          reports={reports}
          analytics={analytics}
          categoryCount={categoryCount}
          technologyCount={technologyCount}
          featuredCount={featuredCount}
        />
      </div>
    </div>
  );
}
