// prisma/seed/catalog.ts — 100-company demo catalog (G2, task 5.7).
//
// Generates 100 verified companies with internships, spread across the taxonomy,
// so the platform meets the G2 launch bar (PRD §4/§24). Idempotent via slug
// upsert. Run standalone: `npm run db:seed:catalog`.

import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy";
import { slugify } from "../../lib/slug";

const db = new PrismaClient();

const CATEGORY_SLUGS = ["fintech", "ai-ml", "devtools", "healthtech", "saas", "consumer"];
const TECH_SLUGS = ["react", "typescript", "python", "postgres", "nextjs", "go", "rust", "pytorch"];
const FUNDING = ["BOOTSTRAPPED", "PRE_SEED", "SEED", "SERIES_A", "SERIES_B", "SERIES_C_PLUS"] as const;
const REMOTE = ["REMOTE", "HYBRID", "ONSITE"] as const;
const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500-1000", "1000+"];
const CITIES = [
  { city: "Bengaluru", country: "India" },
  { city: "San Francisco", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Berlin", country: "Germany" },
  { city: "Singapore", country: "Singapore" },
  { city: "Toronto", country: "Canada" },
];

const NAME_PREFIXES = [
  "Nova", "Quant", "Hyper", "Bright", "Cloud", "Data", "Flux", "Ada", "Vega", "Orbit",
  "Pulse", "Delta", "Lumen", "Cobalt", "Ember", "Sift", "Neon", "Atlas", "Cipher", "Vertex",
];
const NAME_SUFFIXES = ["Labs", "AI", "HQ", "Works", "Systems", "Tech", "io", "Cloud", "Stack", "Base"];

/** Deterministic pseudo-random so runs are stable. */
function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

export async function seedCatalog(count = 100) {
  const taxonomy = await seedTaxonomy(db);
  let created = 0;

  for (let i = 0; i < count; i++) {
    const name = `${pick(NAME_PREFIXES, i)}${pick(NAME_SUFFIXES, i * 3 + 1)} ${i + 1}`;
    const slug = slugify(name);
    const category = pick(CATEGORY_SLUGS, i);
    const tech1 = pick(TECH_SLUGS, i);
    const tech2 = pick(TECH_SLUGS, i * 2 + 3);
    const loc = pick(CITIES, i);
    const remotePolicy = pick(REMOTE, i);

    const company = await db.company.upsert({
      where: { slug },
      update: { verificationStatus: "VERIFIED" },
      create: {
        slug,
        name,
        tagline: `${pick(["Building", "Reinventing", "Powering", "Scaling"], i)} ${pick(["fintech", "AI", "developer tools", "healthcare", "commerce"], i)} for the next decade`,
        about: `${name} is a ${pick(FUNDING, i).toLowerCase().replace("_", "-")} stage company working on ${category} products. This is demo catalog data for the Verity platform (G2 seed).`,
        websiteUrl: `https://${slug}.example.com`,
        fundingStage: pick(FUNDING, i),
        remotePolicy,
        visaSponsorship: i % 3 === 0,
        employeeCountRange: pick(EMPLOYEE_RANGES, i),
        verificationStatus: "VERIFIED",
        isFeatured: i % 17 === 0,
      },
    });

    // Category + up to 2 technologies.
    const categoryId = taxonomy.categories[category];
    if (categoryId) {
      await db.companyCategory.upsert({
        where: { companyId_categoryId: { companyId: company.id, categoryId } },
        update: {},
        create: { companyId: company.id, categoryId },
      });
    }
    for (const t of [tech1, tech2]) {
      const technologyId = taxonomy.technologies[t];
      if (technologyId) {
        await db.companyTechnology.upsert({
          where: { companyId_technologyId: { companyId: company.id, technologyId } },
          update: {},
          create: { companyId: company.id, technologyId },
        });
      }
    }

    // One location.
    if ((await db.companyLocation.count({ where: { companyId: company.id } })) === 0) {
      await db.companyLocation.create({
        data: { companyId: company.id, city: loc.city, country: loc.country, isHQ: true },
      });
    }

    // 1–2 published internships.
    const internCount = (i % 2) + 1;
    for (let j = 0; j < internCount; j++) {
      const iSlug = `${slug}-intern-${j + 1}`;
      await db.internship.upsert({
        where: { slug: iSlug },
        update: { status: "PUBLISHED" },
        create: {
          companyId: company.id,
          slug: iSlug,
          title: `${pick(["Software", "Frontend", "Backend", "ML", "Data", "Platform"], i + j)} Engineering Intern`,
          description: `Join ${name} as an intern and work on ${category} products with ${tech1} and ${tech2}. Demo listing for the Verity catalog.`,
          location: remotePolicy === "REMOTE" ? "Remote" : loc.city,
          remotePolicy,
          stipend: pick(["₹50,000/mo", "₹80,000/mo", "$4,000/mo", "Competitive"], i + j),
          duration: pick(["3 months", "6 months", "3–6 months"], i + j),
          applyUrl: `https://${slug}.example.com/careers`,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
    }
    created++;
  }

  console.log(`  ✓ catalog: ${created} verified companies seeded (G2)`);
  return created;
}

// Allow standalone execution.
if (process.argv[1] && process.argv[1].endsWith("catalog.ts")) {
  seedCatalog()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
