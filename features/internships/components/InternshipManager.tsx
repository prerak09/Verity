"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { archiveInternship, publishInternship } from "@/features/internships/actions";
import type { InternshipDetail, InternshipInput, VerificationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InternshipFormDialog } from "@/features/internships/components/InternshipFormDialog";

const STATUS_LABEL: Record<InternshipDetail["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Open",
  ARCHIVED: "Closed",
};

const STATUS_VARIANT: Record<InternshipDetail["status"], "outline" | "secondary" | "ghost"> = {
  DRAFT: "outline",
  PUBLISHED: "secondary",
  ARCHIVED: "ghost",
};

function StatusToggle({
  internship,
  companyVerified,
  onChange,
}: {
  internship: InternshipDetail;
  companyVerified: boolean;
  onChange: (status: InternshipDetail["status"]) => void;
}) {
  const [pending, setPending] = useState(false);

  if (internship.status === "ARCHIVED") {
    return <Badge variant={STATUS_VARIANT.ARCHIVED}>{STATUS_LABEL.ARCHIVED}</Badge>;
  }

  async function handlePublish() {
    setPending(true);
    const result = await publishInternship(internship.id);
    setPending(false);
    if (result.success) {
      onChange(result.data.status);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleArchive() {
    setPending(true);
    const result = await archiveInternship(internship.id);
    setPending(false);
    if (result.success) {
      onChange(result.data.status);
    } else {
      toast.error(result.error.message);
    }
  }

  if (internship.status === "DRAFT") {
    return (
      <div className="flex items-center gap-1.5">
        <Badge variant={STATUS_VARIANT.DRAFT}>{STATUS_LABEL.DRAFT}</Badge>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || !companyVerified}
          title={companyVerified ? undefined : "Only verified companies can publish listings."}
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={STATUS_VARIANT.PUBLISHED}>{STATUS_LABEL.PUBLISHED}</Badge>
      <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleArchive}>
        Close
      </Button>
    </div>
  );
}

export function InternshipManager({
  companyId,
  companyVerificationStatus,
  initialInternships,
}: {
  companyId: string;
  companyVerificationStatus: VerificationStatus;
  initialInternships: InternshipDetail[];
}) {
  const [internships, setInternships] = useState(initialInternships);
  const companyVerified = companyVerificationStatus === "VERIFIED";

  function handleCreated(input: InternshipInput, result: { id: string; slug: string }) {
    const now = new Date().toISOString();
    setInternships((prev) => [
      {
        id: result.id,
        slug: result.slug,
        title: input.title,
        companyId,
        companySlug: prev[0]?.companySlug ?? "",
        companyName: prev[0]?.companyName ?? "",
        companyLogoUrl: prev[0]?.companyLogoUrl ?? null,
        location: input.location ?? null,
        department: input.department ?? null,
        jobType: input.jobType ?? null,
        forWomen: false,
        season: input.season ?? null,
        remotePolicy: input.remotePolicy ?? null,
        stipend: input.stipend ?? null,
        status: "DRAFT",
        publishedAt: null,
        isStale: false,
        description: input.description,
        duration: input.duration ?? null,
        applyUrl: input.applyUrl,
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ]);
  }

  function handleUpdated(updated: InternshipDetail) {
    setInternships((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleStatusChange(id: string, status: InternshipDetail["status"]) {
    setInternships((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-muted-foreground">
          {internships.length} listing{internships.length === 1 ? "" : "s"}
        </p>
        <InternshipFormDialog companyId={companyId} onCreated={handleCreated} />
      </div>

      {!companyVerified && (
        <p className="rounded-lg border-[3px] border-neutral-950-subtle bg-muted p-3 text-caption text-muted-foreground">
          Publishing is disabled until your company is verified.
        </p>
      )}

      {internships.length === 0 ? (
        <div className="rounded-[4px] border-2 border-dashed border-border-subtle p-8 text-center text-body-sm text-muted-foreground">
          No internships yet. Create your first listing to get started.
        </div>
      ) : (
        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card shadow-brutal-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stipend</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="max-w-64 truncate font-medium text-foreground">
                    {internship.status === "PUBLISHED" ? (
                      <Link
                        href={`/internships/${internship.slug}`}
                        className="hover:underline"
                      >
                        {internship.title}
                      </Link>
                    ) : (
                      internship.title
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusToggle
                      internship={internship}
                      companyVerified={companyVerified}
                      onChange={(status) => handleStatusChange(internship.id, status)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {internship.location ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {internship.stipend ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <InternshipFormDialog
                      companyId={companyId}
                      internship={internship}
                      onUpdated={handleUpdated}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
