// GET /api/companies — public, paginated, filtered (TRD §9.2).

import { NextResponse } from "next/server";
import { listCompanies } from "@/features/companies/queries";
import { searchCompanies } from "@/lib/search";
import { enforceRateLimit, handleRouteError, pageParams } from "@/lib/api";
import type { CompanyFilters, FundingStage, RemotePolicy } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const url = new URL(req.url);
    const { page, pageSize } = pageParams(url);
    const q = url.searchParams.get("q")?.trim();

    // Full-text search path (lib/search) vs. filtered list path.
    if (q) {
      const companies = await searchCompanies(q, pageSize, (page - 1) * pageSize);
      return NextResponse.json({
        data: companies,
        meta: { page, pageSize, totalCount: companies.length, totalPages: 1 },
      });
    }

    const filters: CompanyFilters = {
      page,
      pageSize,
      category: url.searchParams.get("category") ?? undefined,
      technology: url.searchParams.get("technology") ?? undefined,
      fundingStage: (url.searchParams.get("fundingStage") as FundingStage) ?? undefined,
      remotePolicy: (url.searchParams.get("remotePolicy") as RemotePolicy) ?? undefined,
      visaSponsorship: url.searchParams.has("visaSponsorship")
        ? url.searchParams.get("visaSponsorship") === "true"
        : undefined,
      sort: (url.searchParams.get("sort") as CompanyFilters["sort"]) ?? undefined,
    };
    const result = await listCompanies(filters);
    return NextResponse.json(result);
  } catch (e) {
    return handleRouteError(e);
  }
}
