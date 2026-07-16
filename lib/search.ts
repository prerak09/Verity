// lib/search.ts — Postgres full-text search (TRD §12).
//
// Uses the `searchVector` generated tsvector columns (created by the raw SQL
// migration in task 0.4) with `websearch_to_tsquery` so user-typed operators
// (quoted phrases, -exclude) work without a custom parser. ts_rank orders by
// relevance, then featured companies.
//
// NOTE: fully functional only after the 0.4 FTS migration has run. Until then
// these queries error at runtime (the columns don't exist yet) — call sites in
// Phase 3 wire the /api/search routes.

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type {
  SearchResults,
  SearchSuggestion,
  CompanyCard,
  InternshipCard,
  PaginationParams,
} from "@/types";

const SUGGEST_LIMIT = 8; // PRD §16: typeahead ≤ 8

interface CompanySearchRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  fundingStage: CompanyCard["fundingStage"];
  remotePolicy: CompanyCard["remotePolicy"];
  verified: boolean;
}

interface InternshipSearchRow {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  department: string | null;
  jobType: InternshipCard["jobType"];
  forWomen: boolean;
  season: InternshipCard["season"];
  remotePolicy: InternshipCard["remotePolicy"];
  stipend: string | null;
  status: InternshipCard["status"];
  publishedAt: Date | null;
  companyId: string;
  companySlug: string;
  companyName: string;
  companyLogoUrl: string | null;
}

/** Raw FTS over companies. Featured companies break relevance ties. */
export async function searchCompanies(
  query: string,
  limit = 20,
  offset = 0,
): Promise<CompanyCard[]> {
  const rows = await db.$queryRaw<CompanySearchRow[]>`
    SELECT
      c."id", c."slug", c."name", c."tagline", c."logoUrl",
      c."fundingStage", c."remotePolicy",
      (c."verificationStatus" = 'VERIFIED') AS "verified"
    FROM "Company" c
    WHERE c."searchVector" @@ websearch_to_tsquery('english', ${query})
      AND c."deletedAt" IS NULL
      AND c."verificationStatus" = 'VERIFIED'
    ORDER BY
      ts_rank(c."searchVector", websearch_to_tsquery('english', ${query})) DESC,
      c."isFeatured" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map((r) => ({
    ...r,
    categories: [],
    openInternshipCount: 0,
  }));
}

/** Raw FTS over published internships, joined to their company. */
export async function searchInternships(
  query: string,
  limit = 20,
  offset = 0,
): Promise<InternshipCard[]> {
  const rows = await db.$queryRaw<InternshipSearchRow[]>`
    SELECT
      i."id", i."slug", i."title", i."location", i."department", i."jobType", i."forWomen", i."season", i."remotePolicy",
      i."stipend", i."status", i."publishedAt",
      c."id" AS "companyId", c."slug" AS "companySlug",
      c."name" AS "companyName", c."logoUrl" AS "companyLogoUrl"
    FROM "Internship" i
    JOIN "Company" c ON c."id" = i."companyId"
    WHERE i."searchVector" @@ websearch_to_tsquery('english', ${query})
      AND i."deletedAt" IS NULL
      AND i."status" = 'PUBLISHED'
      AND c."deletedAt" IS NULL
    ORDER BY
      ts_rank(i."searchVector", websearch_to_tsquery('english', ${query})) DESC,
      i."publishedAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    companyId: r.companyId,
    companySlug: r.companySlug,
    companyName: r.companyName,
    companyLogoUrl: r.companyLogoUrl,
    location: r.location,
    department: r.department,
    jobType: r.jobType,
    forWomen: r.forWomen,
    season: r.season,
    remotePolicy: r.remotePolicy,
    stipend: r.stipend,
    status: r.status,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    isStale: false,
  }));
}

/** Combined company + internship search for the results page. */
export async function searchAll(
  q: string,
  opts: PaginationParams = {},
): Promise<SearchResults> {
  const pageSize = opts.pageSize ?? 20;
  const offset = ((opts.page ?? 1) - 1) * pageSize;
  const query = q.trim();
  if (!query) {
    return { companies: [], internships: [], totalCompanies: 0, totalInternships: 0 };
  }
  const [companies, internships] = await Promise.all([
    searchCompanies(query, pageSize, offset),
    searchInternships(query, pageSize, offset),
  ]);
  return {
    companies,
    internships,
    totalCompanies: companies.length,
    totalInternships: internships.length,
  };
}

/** Typeahead suggestions (≤8) across companies, internships, categories (PRD §16). */
export async function suggestSearch(q: string): Promise<SearchSuggestion[]> {
  const query = q.trim();
  if (query.length < 2) return [];

  const rows = await db.$queryRaw<
    { type: SearchSuggestion["type"]; label: string; slug: string }[]
  >`
    (
      SELECT 'company'::text AS type, c."name" AS label, c."slug" AS slug
      FROM "Company" c
      WHERE c."searchVector" @@ websearch_to_tsquery('english', ${query})
        AND c."deletedAt" IS NULL AND c."verificationStatus" = 'VERIFIED'
      ORDER BY ts_rank(c."searchVector", websearch_to_tsquery('english', ${query})) DESC
      LIMIT ${SUGGEST_LIMIT}
    )
    UNION ALL
    (
      SELECT 'category'::text AS type, cat."name" AS label, cat."slug" AS slug
      FROM "Category" cat
      WHERE cat."name" ILIKE ${`%${query}%`}
      LIMIT ${SUGGEST_LIMIT}
    )
    LIMIT ${SUGGEST_LIMIT}
  `;
  return rows;
}

// Keep Prisma import referenced for future filtered-query composition (TRD §12).
export const _sql = Prisma.sql;
