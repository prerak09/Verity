"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { toast } from "sonner";

import { updateApplication } from "@/features/applications/actions";
import type { ApplicationDTO, ApplicationStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/lib/utils";

const STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "OA",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  OA: "OA",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

// Column accent per status (doc §3.8) — reuses semantic border tokens.
const STATUS_BORDER: Record<ApplicationStatus, string> = {
  SAVED: "border-t-neutral-400",
  APPLIED: "border-t-info-border",
  OA: "border-t-brand-600",
  INTERVIEW: "border-t-warning-border",
  OFFER: "border-t-success-border",
  REJECTED: "border-t-error-border",
  WITHDRAWN: "border-t-neutral-400",
};

function StatusSelect({
  value,
  onChange,
}: {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ApplicationStatus)}>
      <SelectTrigger aria-label="Application status" className="h-8 w-full">
        <SelectValue>
          {(v: ApplicationStatus) => STATUS_LABEL[v]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ApplicationCard({
  app,
  onStatusChange,
  onNotesChange,
}: {
  app: ApplicationDTO;
  onStatusChange: (status: ApplicationStatus) => void;
  onNotesChange: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");

  return (
    <div className="rounded-lg border-2 border-border bg-card p-3 shadow-brutal-xs">
      <Link
        href={`/internships/${app.internship.slug}`}
        className="text-body-sm font-semibold text-foreground hover:underline"
      >
        {app.internship.title}
      </Link>
      <p className="mt-0.5 text-caption text-muted-foreground">
        {app.internship.companyName}
      </p>
      <div className="mt-2">
        <StatusSelect value={app.status} onChange={onStatusChange} />
      </div>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => {
          if (notes !== (app.notes ?? "")) onNotesChange(notes);
        }}
        aria-label={`Private note for ${app.internship.title} at ${app.internship.companyName}`}
        placeholder="Add a private note…"
        rows={2}
        className="mt-2 text-caption"
      />
    </div>
  );
}

export function ApplicationTracker({
  applications,
}: {
  applications: ApplicationDTO[];
}) {
  const [items, setItems] = useState(applications);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [announcement, setAnnouncement] = useState("");

  async function handleStatusChange(app: ApplicationDTO, status: ApplicationStatus) {
    const prevStatus = app.status;
    setItems((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));

    // Real Server Action — same graceful-degradation pattern as 3.2/3.3.
    const result = await updateApplication(app.id, { status });

    if (result.success) {
      setAnnouncement(`${app.internship.title} moved to ${STATUS_LABEL[status]}`);
    } else {
      setItems((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: prevStatus } : a)),
      );
      toast.error(result.error.message);
    }
  }

  async function handleNotesChange(app: ApplicationDTO, notes: string) {
    setItems((prev) => prev.map((a) => (a.id === app.id ? { ...a, notes } : a)));
    const result = await updateApplication(app.id, { notes });
    if (!result.success) toast.error(result.error.message);
  }

  return (
    <div>
      {/* Status changes are announced here for screen readers (doc §12.10) */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="flex items-center justify-end gap-1 rounded-lg border-2 border-border p-0.5 w-fit ml-auto">
        <button
          type="button"
          onClick={() => setView("kanban")}
          aria-pressed={view === "kanban"}
          aria-label="Kanban view"
          className={cn("rounded-md p-1.5", view === "kanban" && "bg-muted")}
        >
          <LayoutGrid className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
          aria-label="List view"
          className={cn("rounded-md p-1.5", view === "list" && "bg-muted")}
        >
          <ListIcon className="size-4" aria-hidden />
        </button>
      </div>

      {view === "kanban" ? (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => {
            const columnItems = items.filter((a) => a.status === status);
            return (
              <div
                key={status}
                className={cn(
                  "w-72 shrink-0 rounded-lg border-2 border-t-4 border-border bg-muted",
                  STATUS_BORDER[status],
                )}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-overline text-muted-foreground">
                    {STATUS_LABEL[status]}
                  </p>
                  <span className="tabular rounded-sm border border-border bg-card px-1.5 text-caption text-foreground">
                    {columnItems.length}
                  </span>
                </div>
                <div className="max-h-[32rem] space-y-2 overflow-y-auto px-2 pb-2">
                  {columnItems.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onStatusChange={(s) => handleStatusChange(app, s)}
                      onNotesChange={(n) => handleNotesChange(app, n)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {items.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-3 rounded-lg border-2 border-border bg-card p-3"
            >
              <Link
                href={`/internships/${app.internship.slug}`}
                className="min-w-0 flex-1 hover:underline"
              >
                <p className="truncate text-body-sm font-medium text-foreground">
                  {app.internship.title}
                </p>
                <p className="truncate text-caption text-muted-foreground">
                  {app.internship.companyName}
                </p>
              </Link>
              <div className="w-40 shrink-0">
                <StatusSelect
                  value={app.status}
                  onChange={(s) => handleStatusChange(app, s)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
