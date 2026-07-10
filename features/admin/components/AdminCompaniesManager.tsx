"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  adminCreateCompany,
  suspendCompany,
  reinstateCompany,
} from "@/features/admin/companies";
import { slugify } from "@/lib/slug";
import type { CompanyDetail, FieldErrors } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * `Company.suspendedAt` exists in Prisma but isn't exposed on any DTO
 * (CompanyDetail/CompanyCard) — tracked as local-only UI state here rather
 * than invented on the shared type. Logged as CONTRACTS.md CR-14.
 */
function CreateCompanyDialog({ onCreated }: { onCreated: (id: string, slug: string, name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    setPending(true);
    setFieldErrors({});
    const result = await adminCreateCompany({
      name,
      slug: slugify(name),
      websiteUrl,
      tagline,
    });
    setPending(false);
    if (result.success) {
      toast.success(`${name} created.`);
      onCreated(result.data.id, result.data.slug, name);
      setName("");
      setWebsiteUrl("");
      setTagline("");
      setOpen(false);
    } else {
      if (result.error.fieldErrors) setFieldErrors(result.error.fieldErrors);
      toast.error(result.error.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFieldErrors({});
      }}
    >
      <DialogTrigger render={<Button type="button" size="sm" />}>
        <Plus className="size-4" aria-hidden />
        New company
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create company</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-body-sm font-medium text-foreground">Name</label>
            <div className="mt-1.5">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {fieldErrors.name && <p className="mt-1 text-caption text-error-fg">{fieldErrors.name[0]}</p>}
          </div>
          <div>
            <label className="text-body-sm font-medium text-foreground">Website</label>
            <div className="mt-1.5">
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            {fieldErrors.websiteUrl && (
              <p className="mt-1 text-caption text-error-fg">{fieldErrors.websiteUrl[0]}</p>
            )}
          </div>
          <div>
            <label className="text-body-sm font-medium text-foreground">Tagline</label>
            <div className="mt-1.5">
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            {fieldErrors.tagline && <p className="mt-1 text-caption text-error-fg">{fieldErrors.tagline[0]}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="button" disabled={pending || !name.trim()} onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompanyRow({
  company,
  suspended,
  onToggleSuspended,
}: {
  company: CompanyDetail;
  suspended: boolean;
  onToggleSuspended: (id: string, next: boolean) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSuspend() {
    setPending(true);
    const result = await suspendCompany(company.id);
    setPending(false);
    if (result.success) {
      toast.success(`${company.name} suspended.`);
      onToggleSuspended(company.id, true);
    } else {
      toast.error(result.error.message);
    }
  }

  async function handleReinstate() {
    setPending(true);
    const result = await reinstateCompany(company.id);
    setPending(false);
    if (result.success) {
      toast.success(`${company.name} reinstated.`);
      onToggleSuspended(company.id, false);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        <Link href={`/companies/${company.slug}`} target="_blank" className="hover:underline">
          {company.name}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            company.verificationStatus === "VERIFIED"
              ? "default"
              : company.verificationStatus === "REJECTED"
                ? "destructive"
                : "outline"
          }
        >
          {company.verificationStatus}
        </Badge>
      </TableCell>
      <TableCell>
        {suspended ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            render={<Link href={`/admin/companies/${company.id}`} />}
          >
            Manage
          </Button>
          {suspended ? (
            <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleReinstate}>
              Reinstate
            </Button>
          ) : (
            <Button type="button" size="sm" variant="destructive" disabled={pending} onClick={handleSuspend}>
              Suspend
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminCompaniesManager({
  initialCompanies,
}: {
  initialCompanies: CompanyDetail[];
}) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());

  function handleCreated(id: string, slug: string, name: string) {
    setCompanies((prev) => [
      {
        id,
        slug,
        name,
        tagline: null,
        about: null,
        logoUrl: null,
        bannerUrl: null,
        websiteUrl: null,
        fundingStage: null,
        remotePolicy: null,
        visaSponsorship: false,
        employeeCountRange: null,
        verified: true,
        verificationStatus: "VERIFIED",
        isFeatured: false,
        categories: [],
        technologies: [],
        founders: [],
        news: [],
        links: [],
        locations: [],
        openInternships: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function handleToggleSuspended(id: string, next: boolean) {
    setSuspendedIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-neutral-950">Companies</h2>
          <CreateCompanyDialog onCreated={handleCreated} />
        </div>
        <p className="mt-2 font-mono text-sm text-neutral-600">
          Click <span className="font-bold">Manage</span> on a company to edit its
          profile and add internships &amp; jobs.
        </p>
        <div className="mt-3 rounded-[4px] border-[3px] border-neutral-950 bg-card shadow-brutal-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Suspended</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((c) => (
                <CompanyRow
                  key={c.id}
                  company={c}
                  suspended={suspendedIds.has(c.id)}
                  onToggleSuspended={handleToggleSuspended}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
