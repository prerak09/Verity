import type { Metadata } from "next";

import { AdminDashboardModules } from "@/features/admin/components/AdminDashboardModules";
import {
  MOCK_VERIFICATION_QUEUE,
  MOCK_REPORTS,
  MOCK_PLATFORM_ANALYTICS,
  MOCK_CATEGORIES,
  MOCK_TECHNOLOGIES,
  MOCK_COMPANY_DETAILS,
} from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  const featuredCount = Object.values(MOCK_COMPANY_DETAILS).filter((c) => c.isFeatured).length;

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Platform-wide status at a glance.
      </p>
      <div className="mt-6">
        <AdminDashboardModules
          verificationQueue={MOCK_VERIFICATION_QUEUE}
          reports={MOCK_REPORTS}
          analytics={MOCK_PLATFORM_ANALYTICS}
          categoryCount={MOCK_CATEGORIES.length}
          technologyCount={MOCK_TECHNOLOGIES.length}
          featuredCount={featuredCount}
        />
      </div>
    </div>
  );
}
