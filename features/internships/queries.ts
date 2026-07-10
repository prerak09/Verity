// features/internships/queries.ts — internship reads (TRD §9.2, PRD §18).

import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { toInternshipCard, toInternshipDetail } from "./map";
import type {
  InternshipCard,
  InternshipDetail,
  InternshipFilters,
  Paginated,
} from "@/types";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

/** Public internship detail by slug — only PUBLISHED, non-deleted. */
export async function getInternshipBySlug(
  slug: string,
): Promise<InternshipDetail | null> {
  const i = await db.internship.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      company: { select: { id: true, slug: true, name: true, logoUrl: true } },
    },
  });
  if (!i) return null;
  return toInternshipDetail(i, i.company);
}

/** Paginated, filtered internship list (published only). */
export function listInternships(
  filters: InternshipFilters,
): Promise<Paginated<InternshipCard>> {
  return unstable_cache(
    () => listInternshipsUncached(filters),
    ["internships-list", JSON.stringify(filters)],
    { tags: ["internships:list"], revalidate: 60 },
  )();
}

async function listInternshipsUncached(
  filters: InternshipFilters,
): Promise<Paginated<InternshipCard>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE),
  );
  const skip = (page - 1) * pageSize;

  const where: Prisma.InternshipWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    company: { deletedAt: null, verificationStatus: "VERIFIED" },
    ...(filters.remotePolicy ? { remotePolicy: filters.remotePolicy } : {}),
    ...(filters.companySlug ? { company: { slug: filters.companySlug } } : {}),
    ...(filters.location
      ? { location: { contains: filters.location, mode: "insensitive" } }
      : {}),
    ...(filters.department
      ? { department: { contains: filters.department, mode: "insensitive" } }
      : {}),
    ...(filters.jobType ? { jobType: filters.jobType } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" } },
            { description: { contains: filters.q, mode: "insensitive" } },
            { company: { name: { contains: filters.q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.InternshipOrderByWithRelationInput =
    filters.sort === "title" ? { title: "asc" } : { publishedAt: "desc" };

  const [rows, totalCount] = await Promise.all([
    db.internship.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        company: { select: { id: true, slug: true, name: true, logoUrl: true } },
      },
    }),
    db.internship.count({ where }),
  ]);

  return {
    data: rows.map((i) => toInternshipCard(i, i.company)),
    meta: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    },
  };
}

const LISTED_WHERE: Prisma.InternshipWhereInput = {
  status: "PUBLISHED",
  deletedAt: null,
  company: { deletedAt: null, verificationStatus: "VERIFIED" },
};

/** Distinct locations across open listings, for the jobs-page filter dropdown. */
export async function listInternshipLocations(): Promise<string[]> {
  const rows = await db.internship.findMany({
    where: { ...LISTED_WHERE, location: { not: null } },
    select: { location: true },
    distinct: ["location"],
    orderBy: { location: "asc" },
  });
  return rows.map((r) => r.location).filter((l): l is string => Boolean(l));
}

/** Distinct departments across open listings, for the jobs-page filter dropdown. */
export async function listInternshipDepartments(): Promise<string[]> {
  const rows = await db.internship.findMany({
    where: { ...LISTED_WHERE, department: { not: null } },
    select: { department: true },
    distinct: ["department"],
    orderBy: { department: "asc" },
  });
  return rows.map((r) => r.department).filter((d): d is string => Boolean(d));
}

/** Every internship regardless of status/company, for the admin moderation table. */
export async function listAllInternshipsForAdmin(): Promise<InternshipCard[]> {
  const internships = await db.internship.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 300,
    include: {
      company: { select: { id: true, slug: true, name: true, logoUrl: true } },
    },
  });
  return internships.map((i) => toInternshipCard(i, i.company));
}
