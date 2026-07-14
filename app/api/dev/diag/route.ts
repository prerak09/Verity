// TEMPORARY — diagnosing the internship/job detail page 500 in production.
// Not gated on NODE_ENV since we need it to run in the broken deployment
// itself. Delete once the root cause is found.

import { NextResponse } from "next/server";

export async function GET() {
  const steps: Record<string, string> = {};

  try {
    const { excerpt } = await import("@/lib/sanitize");
    steps.excerpt = excerpt("<p>hello <strong>world</strong></p>", 50);
  } catch (e) {
    steps.excerptError = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
  }

  try {
    const { getInternshipBySlug } = await import("@/features/internships/queries");
    const internship = await getInternshipBySlug("payu-fpa-intern");
    steps.query = internship ? "found" : "not found";
  } catch (e) {
    steps.queryError = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
  }

  return NextResponse.json(steps);
}
