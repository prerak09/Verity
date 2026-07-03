// prisma/seed.ts — seed orchestrator (FR-05; roadmap P0: 3–5 companies + 1 admin).
//
// Idempotent: safe to re-run. Uses upserts keyed on unique fields so `db:seed`
// converges rather than duplicating. The 100-company catalog (task 5.7 / G2) is
// layered on top of this baseline separately.
//
// Admin note (TRD §6): Admin is never self-service — it is seeded directly here.
// SEED_ADMIN_EMAIL / SEED_ADMIN_CLERK_ID can override the defaults via env.

import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./seed/taxonomy";
import { seedCompanies } from "./seed/companies";

const db = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@verity.dev";
const ADMIN_CLERK_ID = process.env.SEED_ADMIN_CLERK_ID ?? "seed_admin_clerk_id";

async function seedAdmin() {
  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: {
      clerkId: ADMIN_CLERK_ID,
      email: ADMIN_EMAIL,
      name: "Verity Admin",
      role: "ADMIN",
    },
  });
  console.log(`  ✓ admin: ${admin.email}`);
  return admin;
}

async function main() {
  console.log("Seeding Verity…");
  await seedAdmin();
  const taxonomy = await seedTaxonomy(db);
  await seedCompanies(db, taxonomy);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
