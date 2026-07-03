// features/internships/queries.ts — internship reads (TRD §9.2, PRD §18).

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
export async function listInternships(
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
