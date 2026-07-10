// features/companies/queries.ts — company reads (TRD §9.2, PRD §17).
// Shipped early so Dev B can swap mock → real. Implements the signatures in
// types/index.ts: getCompanyBySlug, listCompanies, getOpenInternships,
// getProfileCompleteness.

import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { REQUIRED_FOR_VERIFICATION } from "./schema";
import { toInternshipCard } from "@/features/internships/map";
import type {
  CompanyCard,
  CompanyDetail,
  CompanyFilters,
  FundingStage,
  InternshipCard,
  Paginated,
  ProfileCompleteness,
  TaxonomyRef,
} from "@/types";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function clampPage(filters: CompanyFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE),
  );
  return { page, pageSize, skip: (page - 1) * pageSize };
}

/** Full public company profile by slug (only VERIFIED, non-deleted).
 *  Cached per-slug (tag `company:{slug}`) — profile edits already call
 *  revalidateTag('company:{slug}'), so the cache stays correct while repeat
 *  views skip the DB entirely. 5-min safety TTL. */
export function getCompanyBySlug(slug: string): Promise<CompanyDetail | null> {
  return unstable_cache(
    () => getCompanyBySlugUncached(slug),
    ["company-by-slug", slug],
    { tags: [`company:${slug}`], revalidate: 300 },
  )();
}

async function getCompanyBySlugUncached(
  slug: string,
): Promise<CompanyDetail | null> {
  const c = await db.company.findFirst({
    where: { slug, deletedAt: null, verificationStatus: "VERIFIED" },
    include: {
      categories: { include: { category: true } },
      technologies: { include: { technology: true } },
      founders: true,
      news: { orderBy: { publishedAt: "desc" } },
      links: true,
      locations: true,
      internships: {
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
  if (!c) return null;

  const toRef = (x: { id: string; slug: string; name: string }): TaxonomyRef => ({
    id: x.id,
    slug: x.slug,
    name: x.name,
  });

  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    about: c.about,
    logoUrl: c.logoUrl,
    bannerUrl: c.bannerUrl,
    websiteUrl: c.websiteUrl,
    fundingStage: c.fundingStage,
    remotePolicy: c.remotePolicy,
    visaSponsorship: c.visaSponsorship,
    employeeCountRange: c.employeeCountRange,
    verified: c.verificationStatus === "VERIFIED",
    verificationStatus: c.verificationStatus,
    isFeatured: c.isFeatured,
    categories: c.categories.map((cc) => toRef(cc.category)),
    technologies: c.technologies.map((ct) => toRef(ct.technology)),
    founders: c.founders.map((f) => ({
      id: f.id,
      name: f.name,
      title: f.title,
      linkedinUrl: f.linkedinUrl,
      twitterUrl: f.twitterUrl,
      photoUrl: f.photoUrl,
      isHiringManager: f.isHiringManager,
    })),
    news: c.news.map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      publishedAt: n.publishedAt.toISOString(),
    })),
    links: c.links.map((l) => ({ id: l.id, type: l.type, url: l.url })),
    locations: c.locations.map((l) => ({
      id: l.id,
      city: l.city,
      country: l.country,
      isHQ: l.isHQ,
    })),
    openInternships: c.internships.map((i) =>
      toInternshipCard(i, {
        id: c.id,
        slug: c.slug,
        name: c.name,
        logoUrl: c.logoUrl,
      }),
    ),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

const EARLY_STAGES: FundingStage[] = ["BOOTSTRAPPED", "PRE_SEED", "SEED"];
const WELL_FUNDED_STAGES: FundingStage[] = ["SERIES_B", "SERIES_C_PLUS", "PUBLIC"];

function resolveFundingStageWhere(
  stage: CompanyFilters["fundingStage"],
): Prisma.CompanyWhereInput["fundingStage"] | undefined {
  if (!stage) return undefined;
  if (stage === "EARLY_STAGE") return { in: EARLY_STAGES };
  if (stage === "WELL_FUNDED") return { in: WELL_FUNDED_STAGES };
  return stage;
}

/** Paginated, filtered directory list (TRD §9.2). `q` is a simple contains
 *  match here; ranked full-text search for the dedicated search page goes
 *  through lib/search.ts. */
export function listCompanies(
  filters: CompanyFilters,
): Promise<Paginated<CompanyCard>> {
  // Cache keyed on the exact filter set (tag `companies:list` for bulk
  // invalidation on catalog changes). 60s revalidate keeps the directory fresh
  // enough while making the common page-1 view instant on repeat loads.
  return unstable_cache(
    () => listCompaniesUncached(filters),
    ["companies-list", JSON.stringify(filters)],
    { tags: ["companies:list"], revalidate: 60 },
  )();
}

async function listCompaniesUncached(
  filters: CompanyFilters,
): Promise<Paginated<CompanyCard>> {
  const { page, pageSize, skip } = clampPage(filters);

  const where: Prisma.CompanyWhereInput = {
    deletedAt: null,
    verificationStatus: "VERIFIED",
    ...(filters.fundingStage
      ? { fundingStage: resolveFundingStageWhere(filters.fundingStage) }
      : {}),
    ...(filters.remotePolicy ? { remotePolicy: filters.remotePolicy } : {}),
    ...(filters.visaSponsorship !== undefined
      ? { visaSponsorship: filters.visaSponsorship }
      : {}),
    ...(filters.category
      ? { categories: { some: { category: { slug: filters.category } } } }
      : {}),
    ...(filters.technology
      ? { technologies: { some: { technology: { slug: filters.technology } } } }
      : {}),
    ...(filters.location
      ? {
          locations: {
            some: {
              OR: [
                { city: { contains: filters.location, mode: "insensitive" } },
                { country: { contains: filters.location, mode: "insensitive" } },
              ],
            },
          },
        }
      : {}),
    ...(filters.hiringNow
      ? { internships: { some: { status: "PUBLISHED", deletedAt: null } } }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" } },
            { tagline: { contains: filters.q, mode: "insensitive" } },
            { categories: { some: { category: { name: { contains: filters.q, mode: "insensitive" } } } } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.CompanyOrderByWithRelationInput =
    filters.sort === "name"
      ? { name: "asc" }
      : filters.sort === "trending"
        ? { isFeatured: "desc" }
        : { createdAt: "desc" };

  const [rows, totalCount] = await Promise.all([
    db.company.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        categories: { include: { category: true } },
        locations: { where: { isHQ: true }, take: 1 },
        _count: {
          select: {
            internships: { where: { status: "PUBLISHED", deletedAt: null } },
          },
        },
      },
    }),
    db.company.count({ where }),
  ]);

  const data: CompanyCard[] = rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    logoUrl: c.logoUrl,
    fundingStage: c.fundingStage,
    remotePolicy: c.remotePolicy,
    verified: c.verificationStatus === "VERIFIED",
    categories: c.categories.map((cc) => ({
      id: cc.category.id,
      slug: cc.category.slug,
      name: cc.category.name,
    })),
    openInternshipCount: c._count.internships,
    location: c.locations[0] ? `${c.locations[0].city}, ${c.locations[0].country}` : null,
  }));

  return {
    data,
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    },
  };
}

/** Open (published) internships for a company, as cards (PRD §17 Internships module). */
export async function getOpenInternships(
  companyId: string,
): Promise<InternshipCard[]> {
  const company = await db.company.findUnique({
    where: { id: companyId },
    select: { id: true, slug: true, name: true, logoUrl: true },
  });
  if (!company) return [];

  const internships = await db.internship.findMany({
    where: { companyId, status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
  });
  return internships.map((i) => toInternshipCard(i, company));
}

/** Profile completeness + verification eligibility (PRD §17). */
export async function getProfileCompleteness(
  companyId: string,
): Promise<ProfileCompleteness> {
  const c = await db.company.findUnique({
    where: { id: companyId },
    include: { locations: { take: 1 } },
  });
  if (!c) {
    return { score: 0, missingRequiredFields: [...REQUIRED_FOR_VERIFICATION], canSubmitForVerification: false };
  }

  const values: Record<string, unknown> = {
    name: c.name,
    tagline: c.tagline,
    about: c.about,
    logoUrl: c.logoUrl,
    websiteUrl: c.websiteUrl,
    remotePolicy: c.remotePolicy,
    employeeCountRange: c.employeeCountRange,
  };
  const missing: string[] = REQUIRED_FOR_VERIFICATION.filter((f) => {
    const v = values[f];
    return v === null || v === undefined || v === "";
  });
  // At least one location is also required (PRD §17 Locations "Req.").
  if (c.locations.length === 0) missing.push("locations");

  const total = REQUIRED_FOR_VERIFICATION.length + 1; // + locations
  const filled = total - missing.length;
  return {
    score: Math.round((filled / total) * 100),
    missingRequiredFields: missing,
    canSubmitForVerification: missing.length === 0,
  };
}

/** Distinct countries across verified companies, for the directory's location filter. */
export async function listCompanyLocations(): Promise<string[]> {
  const rows = await db.companyLocation.findMany({
    where: { company: { deletedAt: null, verificationStatus: "VERIFIED" } },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  return rows.map((r) => r.country);
}

/** Full category taxonomy, for the directory's industry filter. */
export async function listCategories(): Promise<TaxonomyRef[]> {
  const rows = await db.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
}
