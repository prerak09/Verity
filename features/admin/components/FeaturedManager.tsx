"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Star, StarOff } from "lucide-react";

import { featureCompany, unfeatureCompany } from "@/features/admin/featured";
import type { CompanyDetail } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * `Company.featuredUntil` exists in Prisma but isn't exposed on any DTO —
 * tracked as local-only UI state (synthetic expiry for already-featured mock
 * rows, real value from the action result once a company is freshly
 * featured). Logged as CONTRACTS.md CR-14 alongside the `suspendedAt` gap.
 */
function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function FeaturedRow({
  company,
  featuredUntil,
  onUnfeatured,
}: {
  company: CompanyDetail;
  featuredUntil: string;
  onUnfeatured: (id: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleUnfeature() {
    setPending(true);
    const result = await unfeatureCompany(company.id);
    setPending(false);
    if (result.success) {
      toast.success(`${company.name} removed from Featured.`);
      onUnfeatured(company.id);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border-[3px] border-neutral-950-subtle p-3">
      <div>
        <Link href={`/companies/${company.slug}`} target="_blank" className="text-body-sm font-medium text-foreground hover:underline">
          {company.name}
        </Link>
        <p className="text-caption text-muted-foreground">
          Featured until{" "}
          {new Date(featuredUntil).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleUnfeature}>
        <StarOff className="size-4" aria-hidden />
        Remove
      </Button>
    </li>
  );
}

export function FeaturedManager({ companies }: { companies: CompanyDetail[] }) {
  const [featuredUntil, setFeaturedUntil] = useState<Record<string, string>>(() =>
    Object.fromEntries(companies.filter((c) => c.isFeatured).map((c) => [c.id, daysFromNow(14)])),
  );
  const [pickerId, setPickerId] = useState<string | undefined>();
  const [days, setDays] = useState("30");
  const [pending, setPending] = useState(false);

  const featuredCompanies = companies.filter((c) => c.id in featuredUntil);
  const eligible = companies.filter((c) => c.verificationStatus === "VERIFIED" && !(c.id in featuredUntil));

  async function handleFeature() {
    if (!pickerId) return;
    const daysNum = Number(days);
    if (!Number.isInteger(daysNum) || daysNum < 1) return;
    setPending(true);
    const result = await featureCompany({ companyId: pickerId, days: daysNum });
    setPending(false);
    if (result.success) {
      const company = companies.find((c) => c.id === pickerId);
      toast.success(`${company?.name ?? "Company"} featured.`);
      setFeaturedUntil((prev) => ({ ...prev, [pickerId]: result.data.featuredUntil }));
      setPickerId(undefined);
    } else {
      toast.error(result.error.message);
    }
  }

  function handleUnfeatured(id: string) {
    setFeaturedUntil((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id)),
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
        <h2 className="text-h4 text-foreground">Feature a company</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-64">
            <label className="text-body-sm font-medium text-foreground">Company</label>
            <div className="mt-1.5">
              <Select value={pickerId} onValueChange={(v) => setPickerId(v ?? undefined)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {() => eligible.find((c) => c.id === pickerId)?.name ?? "Select a verified company…"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {eligible.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-body-sm font-medium text-foreground">Days</label>
            <div className="mt-1.5">
              <Input
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
          <Button type="button" disabled={pending || !pickerId} onClick={handleFeature}>
            <Star className="size-4" aria-hidden />
            Feature
          </Button>
        </div>
      </div>

      <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
        <h2 className="text-h4 text-foreground">Currently featured</h2>
        {featuredCompanies.length === 0 ? (
          <p className="mt-3 text-body-sm text-muted-foreground">No companies are currently featured.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {featuredCompanies.map((c) => (
              <FeaturedRow
                key={c.id}
                company={c}
                featuredUntil={featuredUntil[c.id]}
                onUnfeatured={handleUnfeatured}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
