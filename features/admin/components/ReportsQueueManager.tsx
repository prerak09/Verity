"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Flag } from "lucide-react";

import { resolveReport, type ResolveAction } from "@/features/admin/reports";
import type { ReportDTO } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_VARIANT: Record<ReportDTO["status"], "destructive" | "outline" | "secondary"> = {
  OPEN: "destructive",
  RESOLVED: "outline",
  DISMISSED: "secondary",
};

const ACTION_LABEL: Record<ResolveAction, string> = {
  dismiss: "Dismiss (no action)",
  warn: "Warn (close, keep note)",
  suspend: "Suspend company",
  remove: "Remove company",
};

function ResolveDialog({
  report,
  onResolved,
}: {
  report: ReportDTO;
  onResolved: (reportId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ResolveAction>("dismiss");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    const result = await resolveReport(report.id, action, note || undefined);
    setPending(false);
    if (result.success) {
      toast.success(`Report resolved (${ACTION_LABEL[action].toLowerCase()}).`);
      onResolved(report.id);
      setOpen(false);
    } else {
      toast.error(result.error.message);
    }
  }

  const destructive = action === "suspend" || action === "remove";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setAction("dismiss");
          setNote("");
        }
      }}
    >
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>
        Resolve
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve report</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label htmlFor="resolve-action" className="text-body-sm font-medium text-foreground">
              Action
            </label>
            <div className="mt-1.5">
              <Select value={action} onValueChange={(v) => setAction(v as ResolveAction)}>
                <SelectTrigger id="resolve-action" className="w-full">
                  <SelectValue>{(v: ResolveAction) => ACTION_LABEL[v]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTION_LABEL) as ResolveAction[]).map((a) => (
                    <SelectItem key={a} value={a}>
                      {ACTION_LABEL[a]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label htmlFor="resolve-note" className="text-body-sm font-medium text-foreground">
              Audit note (optional)
            </label>
            <div className="mt-1.5">
              <Textarea id="resolve-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReportsQueueManager({ initialReports }: { initialReports: ReportDTO[] }) {
  const [reports, setReports] = useState(initialReports);

  function handleResolved(reportId: string) {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "RESOLVED", resolvedAt: new Date().toISOString() } : r)),
    );
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Flag}
        title="No reports"
        description="Nothing has been reported yet."
        compact
      />
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="rounded-xl border-2 border-border bg-card p-4 shadow-brutal-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
                {report.targetCompany && (
                  <Link
                    href={`/companies/${report.targetCompany.slug}`}
                    target="_blank"
                    className="text-body-sm font-medium text-foreground hover:underline"
                  >
                    {report.targetCompany.name}
                  </Link>
                )}
              </div>
              <p className="mt-1.5 text-body-sm text-foreground">{report.reason}</p>
              <p className="mt-1 text-caption text-muted-foreground">
                Reported by {report.reportedByEmail} ·{" "}
                {new Date(report.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            {report.status === "OPEN" && (
              <ResolveDialog report={report} onResolved={handleResolved} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
