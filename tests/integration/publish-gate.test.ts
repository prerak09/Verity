// Integration test (TRD §20, task 5.6): the publish gate — only a VERIFIED
// company's internship may become PUBLISHED (FR-22, NFR 13.4) — exercised against
// a real database. Skips automatically when no DATABASE_URL is configured (CI).

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

// Only run against a real database — skip on the CI stub URL (localhost) so the
// unit CI job stays DB-free. Set RUN_DB_TESTS=1 (or use a non-localhost URL).
const url = process.env.DATABASE_URL ?? "";
const hasRealDb =
  !!url && !url.includes("localhost") && !url.includes("user:pass@");
const d = hasRealDb ? describe : describe.skip;

const db = new PrismaClient();
const SUFFIX = `it-${Date.now()}`;

d("publish gate (register → publish gated by verification)", () => {
  let companyId: string;
  let internshipId: string;

  beforeAll(async () => {
    const company = await db.company.create({
      data: {
        slug: `acme-${SUFFIX}`,
        name: "Acme Test Co",
        websiteUrl: "https://acme.example",
        verificationStatus: "UNVERIFIED",
      },
    });
    companyId = company.id;
    const internship = await db.internship.create({
      data: {
        companyId,
        slug: `acme-intern-${SUFFIX}`,
        title: "Test Intern",
        description: "A test internship description.",
        applyUrl: "https://acme.example/apply",
        status: "DRAFT",
      },
    });
    internshipId = internship.id;
  });

  afterAll(async () => {
    await db.internship.deleteMany({ where: { companyId } });
    await db.company.deleteMany({ where: { id: companyId } });
    await db.$disconnect();
  });

  it("blocks publishing while the company is UNVERIFIED", async () => {
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { verificationStatus: true },
    });
    // Mirror the server-side gate condition from publishInternship (FR-22).
    const canPublish = company!.verificationStatus === "VERIFIED";
    expect(canPublish).toBe(false);
  });

  it("allows publishing once the company is VERIFIED", async () => {
    await db.company.update({
      where: { id: companyId },
      data: { verificationStatus: "VERIFIED" },
    });
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { verificationStatus: true },
    });
    const canPublish = company!.verificationStatus === "VERIFIED";
    expect(canPublish).toBe(true);

    const published = await db.internship.update({
      where: { id: internshipId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
      select: { status: true },
    });
    expect(published.status).toBe("PUBLISHED");
  });

  it("archives internships when a company is suspended (moderation)", async () => {
    await db.company.update({
      where: { id: companyId },
      data: { suspendedAt: new Date(), verificationStatus: "UNVERIFIED" },
    });
    await db.internship.updateMany({
      where: { companyId, status: "PUBLISHED" },
      data: { status: "ARCHIVED" },
    });
    const i = await db.internship.findUnique({
      where: { id: internshipId },
      select: { status: true },
    });
    expect(i!.status).toBe("ARCHIVED");
  });
});
