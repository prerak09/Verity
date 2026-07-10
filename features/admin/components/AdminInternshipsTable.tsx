"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { adminUnpublishInternship } from "@/features/admin/companies";
import type { InternshipCard } from "@/types";
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

/**
 * Cross-company overview of every listing created through the company-first
 * flow. Read/moderation only — each row links back to its company's Manage page
 * where the listing is actually edited.
 */
export function AdminInternshipsTable({
  initialInternships,
  kind = "internship",
}: {
  initialInternships: InternshipCard[];
  kind?: "internship" | "job";
}) {
  const [internships, setInternships] = useState(initialInternships);
  const noun = kind === "job" ? "jobs" : "internships";

  function handleUnpublished(id: string) {
    setInternships((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "ARCHIVED" } : i)),
    );
  }

  if (internships.length === 0) {
    return (
      <div className="rounded-[4px] border-[3px] border-dashed border-neutral-400 p-8 text-center">
        <p className="font-mono text-sm text-neutral-600">
          No {noun} yet. Add them from a company&apos;s Manage page.
        </p>
        <Button className="mt-4" variant="secondary" size="sm" render={<Link href="/admin/companies" />}>
          Go to companies
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card shadow-brutal-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {internships.map((i) => (
            <Row key={i.id} internship={i} onUnpublished={handleUnpublished} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Row({
  internship,
  onUnpublished,
}: {
  internship: InternshipCard;
  onUnpublished: (id: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleUnpublish() {
    setPending(true);
    const result = await adminUnpublishInternship(internship.id);
    setPending(false);
    if (result.success) {
      toast.success(`${internship.title} unpublished.`);
      onUnpublished(internship.id);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        <Link
          href={`/internships/${internship.slug}`}
          target="_blank"
          className="hover:underline"
        >
          {internship.title}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/admin/companies/${internship.companyId}`}
          className="text-foreground hover:underline"
        >
          {internship.companyName}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant={internship.status === "PUBLISHED" ? "success" : "outline"}>
          {internship.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            render={<Link href={`/admin/companies/${internship.companyId}`} />}
          >
            Manage
          </Button>
          {internship.status === "PUBLISHED" && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={handleUnpublish}
            >
              Unpublish
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
