// prisma/seed/companies.ts — 5 demo companies (VERIFIED) with internships.
// Roadmap P0: "a seeded company renders on a hard-coded page". The 100-company
// catalog (task 5.7, G2) extends this baseline.

import type { PrismaClient } from "@prisma/client";
import type { SeededTaxonomy } from "./types";

interface DemoCompany {
  slug: string;
  name: string;
  tagline: string;
  about: string;
  fundingStage: "SEED" | "SERIES_A" | "SERIES_B";
  remotePolicy: "REMOTE" | "HYBRID" | "ONSITE";
  visaSponsorship: boolean;
  employeeCountRange: string;
  websiteUrl: string;
  categories: string[]; // slugs
  technologies: string[]; // slugs
  location: { city: string; country: string };
  founders: { name: string; title: string }[];
  internships: {
    slug: string;
    title: string;
    description: string;
    location: string;
    remotePolicy: "REMOTE" | "HYBRID" | "ONSITE";
    stipend: string;
    duration: string;
    applyUrl: string;
  }[];
}

const COMPANIES: DemoCompany[] = [
  {
    slug: "sarvam-ai",
    name: "Sarvam AI",
    tagline: "Building foundational AI for India",
    about:
      "Sarvam AI builds full-stack generative AI systems and voice-first models tuned for Indian languages and use cases.",
    fundingStage: "SERIES_A",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "51-200",
    websiteUrl: "https://sarvam.ai",
    categories: ["ai-ml"],
    technologies: ["python", "pytorch", "postgres"],
    location: { city: "Bengaluru", country: "India" },
    founders: [{ name: "Vivek Raghavan", title: "Co-founder" }],
    internships: [
      {
        slug: "sarvam-ai-ml-research-intern",
        title: "ML Research Intern — Summer 2027",
        description:
          "Work alongside the research team on multilingual model training, evaluation, and inference optimization.",
        location: "Bengaluru",
        remotePolicy: "HYBRID",
        stipend: "₹80,000/mo",
        duration: "3–6 months",
        applyUrl: "https://sarvam.ai/careers",
      },
    ],
  },
  {
    slug: "hasura",
    name: "Hasura",
    tagline: "Instant GraphQL & API platform",
    about:
      "Hasura gives teams instant, realtime GraphQL and REST APIs over their databases with fine-grained authorization built in.",
    fundingStage: "SERIES_B",
    remotePolicy: "REMOTE",
    visaSponsorship: true,
    employeeCountRange: "201-500",
    websiteUrl: "https://hasura.io",
    categories: ["devtools", "saas"],
    technologies: ["typescript", "go", "postgres"],
    location: { city: "San Francisco", country: "USA" },
    founders: [{ name: "Tanmai Gopal", title: "Co-founder & CEO" }],
    internships: [
      {
        slug: "hasura-backend-engineering-intern",
        title: "Backend Engineering Intern",
        description:
          "Contribute to the core GraphQL engine and metadata APIs. Strong Go/Haskell interest a plus.",
        location: "Remote",
        remotePolicy: "REMOTE",
        stipend: "Competitive",
        duration: "6 months",
        applyUrl: "https://hasura.io/careers",
      },
    ],
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    tagline: "Payments and banking for businesses",
    about:
      "Razorpay is a full-stack financial services company powering payments, payouts, and banking for millions of businesses.",
    fundingStage: "SERIES_B",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://razorpay.com",
    categories: ["fintech", "saas"],
    technologies: ["react", "typescript", "go"],
    location: { city: "Bengaluru", country: "India" },
    founders: [{ name: "Harshil Mathur", title: "Co-founder & CEO" }],
    internships: [
      {
        slug: "razorpay-frontend-intern",
        title: "Frontend Engineering Intern — Summer 2027",
        description:
          "Build merchant-facing dashboards in React/TypeScript with a focus on performance and accessibility.",
        location: "Bengaluru",
        remotePolicy: "ONSITE",
        stipend: "₹1,00,000/mo",
        duration: "6 months",
        applyUrl: "https://razorpay.com/jobs",
      },
    ],
  },
  {
    slug: "postman",
    name: "Postman",
    tagline: "The API platform for building and using APIs",
    about:
      "Postman is an API platform used by millions of developers and thousands of companies to design, test, and ship APIs.",
    fundingStage: "SERIES_B",
    remotePolicy: "HYBRID",
    visaSponsorship: true,
    employeeCountRange: "500-1000",
    websiteUrl: "https://postman.com",
    categories: ["devtools", "saas"],
    technologies: ["react", "typescript", "nextjs"],
    location: { city: "Bengaluru", country: "India" },
    founders: [{ name: "Abhinav Asthana", title: "Co-founder & CEO" }],
    internships: [
      {
        slug: "postman-fullstack-intern",
        title: "Full-Stack Engineering Intern",
        description:
          "Ship features across the Postman web app and platform services. React + Node experience preferred.",
        location: "Bengaluru / Remote",
        remotePolicy: "HYBRID",
        stipend: "₹90,000/mo",
        duration: "6 months",
        applyUrl: "https://postman.com/company/careers",
      },
    ],
  },
  {
    slug: "zerodha",
    name: "Zerodha",
    tagline: "India's largest stock broker",
    about:
      "Zerodha is a bootstrapped fintech that pioneered discount broking in India and builds a suite of trading and investing products.",
    fundingStage: "SEED",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://zerodha.com",
    categories: ["fintech"],
    technologies: ["go", "postgres", "typescript"],
    location: { city: "Bengaluru", country: "India" },
    founders: [{ name: "Nithin Kamath", title: "Founder & CEO" }],
    internships: [
      {
        slug: "zerodha-platform-intern",
        title: "Platform Engineering Intern",
        description:
          "Work on high-throughput trading infrastructure and internal tools. Systems-level curiosity valued.",
        location: "Bengaluru",
        remotePolicy: "ONSITE",
        stipend: "₹75,000/mo",
        duration: "3–6 months",
        applyUrl: "https://zerodha.com/careers",
      },
    ],
  },
];

export async function seedCompanies(db: PrismaClient, taxonomy: SeededTaxonomy) {
  for (const c of COMPANIES) {
    const company = await db.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        tagline: c.tagline,
        about: c.about,
        fundingStage: c.fundingStage,
        remotePolicy: c.remotePolicy,
        visaSponsorship: c.visaSponsorship,
        employeeCountRange: c.employeeCountRange,
        websiteUrl: c.websiteUrl,
        verificationStatus: "VERIFIED",
      },
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        about: c.about,
        fundingStage: c.fundingStage,
        remotePolicy: c.remotePolicy,
        visaSponsorship: c.visaSponsorship,
        employeeCountRange: c.employeeCountRange,
        websiteUrl: c.websiteUrl,
        verificationStatus: "VERIFIED",
      },
    });

    // Categories / technologies (join rows; skip duplicates on re-run).
    for (const slug of c.categories) {
      const categoryId = taxonomy.categories[slug];
      if (!categoryId) continue;
      await db.companyCategory.upsert({
        where: { companyId_categoryId: { companyId: company.id, categoryId } },
        update: {},
        create: { companyId: company.id, categoryId },
      });
    }
    for (const slug of c.technologies) {
      const technologyId = taxonomy.technologies[slug];
      if (!technologyId) continue;
      await db.companyTechnology.upsert({
        where: {
          companyId_technologyId: { companyId: company.id, technologyId },
        },
        update: {},
        create: { companyId: company.id, technologyId },
      });
    }

    // Location + founders (only add if none exist yet, to stay idempotent).
    const existingLocations = await db.companyLocation.count({
      where: { companyId: company.id },
    });
    if (existingLocations === 0) {
      await db.companyLocation.create({
        data: {
          companyId: company.id,
          city: c.location.city,
          country: c.location.country,
          isHQ: true,
        },
      });
    }
    const existingFounders = await db.founder.count({
      where: { companyId: company.id },
    });
    if (existingFounders === 0) {
      await db.founder.createMany({
        data: c.founders.map((f) => ({
          companyId: company.id,
          name: f.name,
          title: f.title,
        })),
      });
    }

    // Internships (published).
    for (const i of c.internships) {
      await db.internship.upsert({
        where: { slug: i.slug },
        update: {
          title: i.title,
          description: i.description,
          location: i.location,
          remotePolicy: i.remotePolicy,
          stipend: i.stipend,
          duration: i.duration,
          applyUrl: i.applyUrl,
          status: "PUBLISHED",
        },
        create: {
          companyId: company.id,
          slug: i.slug,
          title: i.title,
          description: i.description,
          location: i.location,
          remotePolicy: i.remotePolicy,
          stipend: i.stipend,
          duration: i.duration,
          applyUrl: i.applyUrl,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
    }
  }
  console.log(`  ✓ companies: ${COMPANIES.length} verified (with internships)`);
}
