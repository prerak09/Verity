"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Link2 } from "lucide-react";

import {
  approveVerification,
  rejectVerification,
  requestVerificationChanges,
} from "@/features/verification/actions";
import type { CompanyDetail, VerificationQueueItem } from "@/types";
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

function ReasonDialog({
  trigger,
  title,
  onSubmit,
}: {
  trigger: React.ReactNode;
  title: string;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (reason.trim().length < 4) return;
    setPending(true);
    await onSubmit(reason);
    setPending(false);
    setReason("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <label htmlFor="reason" className="text-body-sm font-medium text-foreground">
            Reason (shown to the company)
          </label>
          <div className="mt-1.5">
            <Textarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Be specific about what needs to change…"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={pending || reason.trim().length < 4}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QueueCard({
  item,
  detail,
  onDecided,
}: {
  item: VerificationQueueItem;
  detail: CompanyDetail | undefined;
  onDecided: (companyId: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleApprove() {
    setPending(true);
    const result = await approveVerification({ companyId: item.companyId });
    setPending(false);
    if (result.success) {
      toast.success(`${item.companyName} approved.`);
      onDecided(item.companyId);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleReject(reason: string) {
    const result = await rejectVerification({ companyId: item.companyId, reason });
    if (result.success) {
      toast.success(`${item.companyName} rejected.`);
      onDecided(item.companyId);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleRequestChanges(reason: string) {
    const result = await requestVerificationChanges({ companyId: item.companyId, reason });
    if (result.success) {
      toast.success(`Changes requested for ${item.companyName}.`);
      onDecided(item.companyId);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-muted text-body font-semibold text-muted-foreground"
          >
            {item.companyName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{item.companyName}</p>
            <p className="text-caption text-muted-foreground">
              Submitted {new Date(item.submittedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReasonDialog
            trigger={
              <Button type="button" size="sm" variant="outline">
                Request changes
              </Button>
            }
            title={`Request changes from ${item.companyName}`}
            onSubmit={handleRequestChanges}
          />
          <ReasonDialog
            trigger={
              <Button type="button" size="sm" variant="destructive">
                Reject
              </Button>
            }
            title={`Reject ${item.companyName}`}
            onSubmit={handleReject}
          />
          <Button type="button" size="sm" disabled={pending} onClick={handleApprove}>
            Approve
          </Button>
        </div>
      </div>

      {item.priorRejectionReason && (
        <p className="mt-3 rounded-lg border border-warning-border bg-warning-bg p-3 text-body-sm text-warning-fg">
          <span className="font-medium">Resubmission</span> — prior reason: {item.priorRejectionReason}
        </p>
      )}

      <div className="mt-4 border-t border-border-subtle pt-4">
        {detail ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 text-body-sm">
              <div>
                <p className="text-caption text-muted-foreground">Tagline</p>
                <p className="text-foreground">{detail.tagline ?? "—"}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">About</p>
                <p
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: detail.about ?? "—" }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detail.categories.map((c) => (
                  <Badge key={c.id} variant="outline">
                    {c.name}
                  </Badge>
                ))}
                {detail.technologies.map((t) => (
                  <Badge key={t.id} variant="secondary">
                    {t.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3 text-body-sm">
              <div>
                <p className="text-caption text-muted-foreground">Website</p>
                {detail.websiteUrl ? (
                  <a
                    href={detail.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-foreground hover:underline"
                  >
                    {detail.websiteUrl}
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <p className="text-foreground">—</p>
                )}
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Founders</p>
                <ul className="mt-1 space-y-1">
                  {detail.founders.map((f) => (
                    <li key={f.id} className="flex items-center gap-1.5">
                      <span className="text-foreground">{f.name}</span>
                      {f.title && <span className="text-muted-foreground">— {f.title}</span>}
                      {f.linkedinUrl && (
                        <a
                          href={f.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${f.name} on LinkedIn`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Link2 className="size-3.5" aria-hidden />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Locations</p>
                <p className="text-foreground">
                  {detail.locations.map((l) => `${l.city}, ${l.country}`).join(" · ") || "—"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-muted-foreground">
            Full profile preview unavailable for this row in the current data set.
          </p>
        )}
      </div>
    </div>
  );
}

export function VerificationQueueManager({
  initialQueue,
  companyDetails,
}: {
  initialQueue: VerificationQueueItem[];
  companyDetails: Record<string, CompanyDetail>;
}) {
  const [queue, setQueue] = useState(initialQueue);

  function handleDecided(companyId: string) {
    setQueue((prev) => prev.filter((i) => i.companyId !== companyId));
  }

  if (queue.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border-subtle p-8 text-center text-body-sm text-muted-foreground">
        Queue is empty — nothing pending review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {queue.map((item) => (
        <QueueCard
          key={item.companyId}
          item={item}
          detail={companyDetails[item.companySlug]}
          onDecided={handleDecided}
        />
      ))}
    </div>
  );
}
