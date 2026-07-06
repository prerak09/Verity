import type { Metadata } from "next";

import { ReportsQueueManager } from "@/features/admin/components/ReportsQueueManager";
import { getReportsQueue } from "@/features/admin/reports";
import { MOCK_REPORTS } from "@/components/lib/mocks";
import type { ReportDTO } from "@/types";

export const metadata: Metadata = {
  title: "Reports",
};

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  let reports: ReportDTO[] = MOCK_REPORTS;
  try {
    reports = await getReportsQueue();
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Reports</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Open reports first, most recent on top.
      </p>
      <div className="mt-6 max-w-2xl">
        <ReportsQueueManager initialReports={reports} />
      </div>
    </div>
  );
}
