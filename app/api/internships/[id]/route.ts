// GET /api/internships/:id — public internship detail (TRD §9.2).
// Accepts either the internship slug or id (both are stable public handles).

import { db } from "@/lib/db";
import { getInternshipBySlug } from "@/features/internships/queries";
import { toInternshipDetail } from "@/features/internships/map";
import { enforceRateLimit, handleRouteError, jsonOk, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const { id } = await params;

    // Try slug first (public URLs use slug).
    const bySlug = await getInternshipBySlug(id);
    if (bySlug) return jsonOk(bySlug);

    // Fall back to id lookup.
    const i = await db.internship.findFirst({
      where: { id, status: "PUBLISHED", deletedAt: null },
      include: {
        company: { select: { id: true, slug: true, name: true, logoUrl: true } },
      },
    });
    if (!i) return jsonError("NOT_FOUND", "Internship not found.");
    return jsonOk(toInternshipDetail(i, i.company));
  } catch (e) {
    return handleRouteError(e);
  }
}
