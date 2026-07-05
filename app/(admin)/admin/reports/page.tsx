import type { Metadata } from "next";

import { ReportsQueueManager } from "@/features/admin/components/ReportsQueueManager";
import { MOCK_REPORTS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Reports",
};

export default function AdminReportsPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Reports</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Open reports first, most recent on top.
      </p>
      <div className="mt-6 max-w-2xl">
        <ReportsQueueManager initialReports={MOCK_REPORTS} />
      </div>
    </div>
  );
}
