// GET /api/companies/:slug — public full profile (TRD §9.2).

import { getCompanyBySlug } from "@/features/companies/queries";
import { enforceRateLimit, handleRouteError, jsonOk, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const { slug } = await params;
    const company = await getCompanyBySlug(slug);
    if (!company) return jsonError("NOT_FOUND", "Company not found.");
    return jsonOk(company);
  } catch (e) {
    return handleRouteError(e);
  }
}
