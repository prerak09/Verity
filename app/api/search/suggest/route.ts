// GET /api/search/suggest?q=… — typeahead suggestions, ≤8 (PRD §16).

import { NextResponse } from "next/server";
import { suggestSearch } from "@/lib/search";
import { enforceRateLimit, handleRouteError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const data = await suggestSearch(q);
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}
