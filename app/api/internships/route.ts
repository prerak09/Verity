// GET /api/internships — public, paginated, filtered (TRD §9.2).

import { NextResponse } from "next/server";
import { listInternships } from "@/features/internships/queries";
import { searchInternships } from "@/lib/search";
import { enforceRateLimit, handleRouteError, pageParams } from "@/lib/api";
import type { InternshipFilters, RemotePolicy } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const url = new URL(req.url);
    const { page, pageSize } = pageParams(url);
    const q = url.searchParams.get("q")?.trim();

    if (q) {
      const internships = await searchInternships(q, pageSize, (page - 1) * pageSize);
      return NextResponse.json({
        data: internships,
        meta: { page, pageSize, totalCount: internships.length, totalPages: 1 },
      });
    }

    const filters: InternshipFilters = {
      page,
      pageSize,
      remotePolicy: (url.searchParams.get("remotePolicy") as RemotePolicy) ?? undefined,
      companySlug: url.searchParams.get("companySlug") ?? undefined,
      sort: (url.searchParams.get("sort") as InternshipFilters["sort"]) ?? undefined,
    };
    const result = await listInternships(filters);
    return NextResponse.json(result);
  } catch (e) {
    return handleRouteError(e);
  }
}
