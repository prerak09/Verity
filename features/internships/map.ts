// features/internships/map.ts — shared Internship → DTO mappers.
// Used by both companies/queries.ts and internships/queries.ts.

import type { Internship } from "@prisma/client";
import type { InternshipCard, InternshipDetail } from "@/types";

/** Staleness (FR-24): Open + untouched (no edit/status change) for 45+ days. */
export const STALE_DAYS = 45;

export function isStale(i: Pick<Internship, "status" | "updatedAt">): boolean {
  if (i.status !== "PUBLISHED") return false;
  const ageMs = Date.now() - i.updatedAt.getTime();
  return ageMs > STALE_DAYS * 24 * 60 * 60 * 1000;
}

interface CompanyRef {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
}

export function toInternshipCard(
  i: Internship,
  company: CompanyRef,
): InternshipCard {
  return {
    id: i.id,
    slug: i.slug,
    title: i.title,
    companyId: company.id,
    companySlug: company.slug,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    location: i.location,
    remotePolicy: i.remotePolicy,
    stipend: i.stipend,
    status: i.status,
    publishedAt: i.publishedAt ? i.publishedAt.toISOString() : null,
    isStale: isStale(i),
  };
}

export function toInternshipDetail(
  i: Internship,
  company: CompanyRef,
): InternshipDetail {
  return {
    ...toInternshipCard(i, company),
    description: i.description,
    duration: i.duration,
    applyUrl: i.applyUrl,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  };
}
