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
  PostingOfTheDay,
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

  // Compose independent OR groups (kind split + full-text search) under AND so
  // they never clobber each other via object-spread key collisions.
  const and: Prisma.InternshipWhereInput[] = [];
  if (filters.kind === "internship") {
    and.push({ OR: [{ jobType: "INTERNSHIP" }, { jobType: null }] });
  } else if (filters.kind === "job") {
    and.push({ jobType: { in: ["FULL_TIME", "PART_TIME", "CONTRACT"] } });
  }
  if (filters.q) {
    and.push({
      OR: [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { company: { name: { contains: filters.q, mode: "insensitive" } } },
      ],
    });
  }

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
    ...(filters.forWomen ? { forWomen: true } : {}),
    ...(filters.season ? { season: filters.season } : {}),
    ...(and.length ? { AND: and } : {}),
  };

  const orderBy: Prisma.InternshipOrderByWithRelationInput =
    filters.sort === "title"
      ? { title: "asc" }
      : filters.sort === "season"
        ? { season: "asc" }
        : { publishedAt: "desc" };

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

/** The jobType predicate for a given listing kind (internship vs job). */
function kindWhere(kind?: "internship" | "job"): Prisma.InternshipWhereInput {
  if (kind === "internship") {
    return { OR: [{ jobType: "INTERNSHIP" }, { jobType: null }] };
  }
  if (kind === "job") {
    return { jobType: { in: ["FULL_TIME", "PART_TIME", "CONTRACT"] } };
  }
  return {};
}

/** Distinct locations across open listings, scoped to a kind so the /internships
 *  and /jobs filter dropdowns only offer locations that actually have results.
 *  Cached — same tag/TTL as the listings themselves. */
export function listInternshipLocations(
  kind?: "internship" | "job",
  forWomen?: boolean,
): Promise<string[]> {
  return unstable_cache(
    () => listInternshipLocationsUncached(kind, forWomen),
    ["internship-locations", kind ?? "all", String(forWomen ?? false)],
    { tags: ["internships:list"], revalidate: 60 },
  )();
}

async function listInternshipLocationsUncached(
  kind?: "internship" | "job",
  forWomen?: boolean,
): Promise<string[]> {
  const rows = await db.internship.findMany({
    where: {
      ...LISTED_WHERE,
      ...kindWhere(kind),
      ...(forWomen ? { forWomen: true } : {}),
      location: { not: null },
    },
    select: { location: true },
    distinct: ["location"],
    orderBy: { location: "asc" },
  });
  return rows.map((r) => r.location).filter((l): l is string => Boolean(l));
}

/** Distinct departments across open listings, scoped to a kind (see above).
 *  Cached — same tag/TTL as the listings themselves. */
export function listInternshipDepartments(
  kind?: "internship" | "job",
  forWomen?: boolean,
): Promise<string[]> {
  return unstable_cache(
    () => listInternshipDepartmentsUncached(kind, forWomen),
    ["internship-departments", kind ?? "all", String(forWomen ?? false)],
    { tags: ["internships:list"], revalidate: 60 },
  )();
}

async function listInternshipDepartmentsUncached(
  kind?: "internship" | "job",
  forWomen?: boolean,
): Promise<string[]> {
  const rows = await db.internship.findMany({
    where: {
      ...LISTED_WHERE,
      ...kindWhere(kind),
      ...(forWomen ? { forWomen: true } : {}),
      department: { not: null },
    },
    select: { department: true },
    distinct: ["department"],
    orderBy: { department: "asc" },
  });
  return rows.map((r) => r.department).filter((d): d is string => Boolean(d));
}

/** Every listing regardless of status/company, for the admin moderation tables.
 *  `kind` splits internships (jobType INTERNSHIP or null) from jobs (the rest),
 *  so the two dedicated admin sections stay populated by the same add-in-company
 *  flow — the jobType chosen when the listing is created routes it here. */
export async function listAllInternshipsForAdmin(
  kind?: "internship" | "job",
): Promise<InternshipCard[]> {
  const where: Prisma.InternshipWhereInput = { deletedAt: null };
  if (kind === "internship") {
    where.OR = [{ jobType: "INTERNSHIP" }, { jobType: null }];
  } else if (kind === "job") {
    where.jobType = { in: ["FULL_TIME", "PART_TIME", "CONTRACT"] };
  }
  const internships = await db.internship.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 300,
    include: {
      company: { select: { id: true, slug: true, name: true, logoUrl: true } },
    },
  });
  return internships.map((i) => toInternshipCard(i, i.company));
}

/** Landing-page "Postings of the Day" — most recent listings, one per company
 *  so the carousel shows a spread of startups rather than a bulk importer's
 *  whole batch (same over-fetch-then-dedupe shape as listInternships' callers
 *  use for the "Open right now" strip). */
export function getPostingsOfTheDay(limit = 8): Promise<PostingOfTheDay[]> {
  return unstable_cache(
    () => getPostingsOfTheDayUncached(limit),
    ["postings-of-the-day", String(limit)],
    { tags: ["internships:list"], revalidate: 60 },
  )();
}

async function getPostingsOfTheDayUncached(
  limit: number,
): Promise<PostingOfTheDay[]> {
  const rows = await db.internship.findMany({
    where: LISTED_WHERE,
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      company: { select: { id: true, slug: true, name: true, logoUrl: true } },
      _count: { select: { bookmarks: true } },
    },
  });

  const seen = new Set<string>();
  const postings: PostingOfTheDay[] = [];
  for (const i of rows) {
    if (seen.has(i.company.id)) continue;
    seen.add(i.company.id);
    postings.push({
      id: i.id,
      slug: i.slug,
      title: i.title,
      companySlug: i.company.slug,
      companyName: i.company.name,
      companyLogoUrl: i.company.logoUrl,
      location: i.location,
      remotePolicy: i.remotePolicy,
      applyUrl: i.applyUrl,
      createdAt: i.createdAt.toISOString(),
      bookmarkCount: i._count.bookmarks,
    });
    if (postings.length === limit) break;
  }
  return postings;
}
