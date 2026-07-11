// app/api/dev/revalidate/route.ts — dev-only cache buster.
//
// Data imported directly into Postgres (e.g. via prisma/seed/companies.ts)
// bypasses the server actions that normally call revalidateTag, so pages can
// serve a stale unstable_cache entry for up to its TTL (5 min for company
// profiles). Hit this after a manual seed to invalidate immediately instead
// of waiting. Never active in production.

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const companies = await db.company.findMany({ select: { slug: true } });
  for (const c of companies) {
    revalidateTag(`company:${c.slug}`, "max");
  }
  revalidateTag("companies:list", "max");
  revalidateTag("internships:list", "max");

  return NextResponse.json({ revalidated: true, companies: companies.length });
}
