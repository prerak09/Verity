import type { CompanyCard, CompanyDetail } from "@/types";

import { MOCK_CATEGORIES, MOCK_TECHNOLOGIES } from "./taxonomy";
import { getMockInternshipsByCompany } from "./internships";

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString();

function cat(...slugs: string[]) {
  return MOCK_CATEGORIES.filter((c) => slugs.includes(c.slug));
}
function tech(...slugs: string[]) {
  return MOCK_TECHNOLOGIES.filter((t) => slugs.includes(t.slug));
}

/** Everything but `openInternships`, filled in below once internship mocks resolve. */
const BASE_DETAILS: Omit<CompanyDetail, "openInternships">[] = [
  {
    id: "co_ledgerly",
    slug: "ledgerly",
    name: "Ledgerly",
    tagline: "Payments infrastructure for small business software.",
    about:
      "<p>Ledgerly gives vertical SaaS platforms embedded payments in an afternoon, not a quarter. We process billions annually for over 400 software partners.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://ledgerly.example.com",
    fundingStage: "SERIES_B",
    remotePolicy: "HYBRID",
    visaSponsorship: true,
    employeeCountRange: "51-200",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: true,
    categories: cat("fintech", "developer-tools"),
    technologies: tech("typescript", "postgresql", "aws"),
    founders: [
      {
        id: "fnd_ledgerly_1",
        name: "Priya Raman",
        title: "Co-founder & CEO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: false,
      },
      {
        id: "fnd_ledgerly_2",
        name: "Marcus Webb",
        title: "Co-founder & CTO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: "https://twitter.com/example",
        photoUrl: null,
        isHiringManager: true,
      },
    ],
    news: [
      {
        id: "news_ledgerly_1",
        title: "Ledgerly raises $32M Series B led by Fenwick Partners",
        url: "https://example.com/news/ledgerly-series-b",
        publishedAt: daysAgo(40),
      },
    ],
    links: [
      { id: "lnk_ledgerly_1", type: "website", url: "https://ledgerly.example.com" },
      { id: "lnk_ledgerly_2", type: "linkedin", url: "https://linkedin.com/company/example" },
    ],
    locations: [
      { id: "loc_ledgerly_1", city: "New York", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(400),
    updatedAt: daysAgo(4),
  },
  {
    id: "co_arclight",
    slug: "arclight-ai",
    name: "Arclight AI",
    tagline: "Retrieval-grounded AI systems for regulated industries.",
    about:
      "<p>Arclight builds evaluation and retrieval infrastructure so enterprises can put LLMs into production without guessing at accuracy.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://arclight.example.com",
    fundingStage: "SERIES_A",
    remotePolicy: "ONSITE",
    visaSponsorship: true,
    employeeCountRange: "11-50",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: true,
    categories: cat("ai-ml", "developer-tools"),
    technologies: tech("python", "kubernetes", "rust"),
    founders: [
      {
        id: "fnd_arclight_1",
        name: "Dr. Alina Voss",
        title: "Founder & CEO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: "https://twitter.com/example",
        photoUrl: null,
        isHiringManager: true,
      },
    ],
    news: [
      {
        id: "news_arclight_1",
        title: "Arclight AI named to this year's emerging AI infra list",
        url: null,
        publishedAt: daysAgo(18),
      },
    ],
    links: [
      { id: "lnk_arclight_1", type: "website", url: "https://arclight.example.com" },
    ],
    locations: [
      { id: "loc_arclight_1", city: "San Francisco", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(300),
    updatedAt: daysAgo(1),
  },
  {
    id: "co_meridian",
    slug: "meridian-health",
    name: "Meridian Health",
    tagline: "Care coordination software for independent clinics.",
    about:
      "<p>Meridian replaces fax-and-phone referral coordination with a shared queue clinics and specialists both trust.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://meridianhealth.example.com",
    fundingStage: "SEED",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    verified: false,
    verificationStatus: "PENDING",
    isFeatured: false,
    categories: cat("healthtech"),
    technologies: tech("typescript", "react", "postgresql"),
    founders: [
      {
        id: "fnd_meridian_1",
        name: "Dr. Sam Okafor",
        title: "Co-founder & CEO",
        linkedinUrl: null,
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: true,
      },
    ],
    news: [],
    links: [
      { id: "lnk_meridian_1", type: "website", url: "https://meridianhealth.example.com" },
    ],
    locations: [
      { id: "loc_meridian_1", city: "Boston", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(60),
    updatedAt: daysAgo(6),
  },
  {
    id: "co_northwind",
    slug: "northwind-climate",
    name: "Northwind Climate",
    tagline: "Grid-scale battery dispatch software.",
    about:
      "<p>Northwind's dispatch engine helps utility partners squeeze more clean capacity out of the batteries they already have.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://northwindclimate.example.com",
    fundingStage: "PRE_SEED",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "1-10",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: false,
    categories: cat("climate"),
    technologies: tech("python", "go", "aws"),
    founders: [
      {
        id: "fnd_northwind_1",
        name: "Teo Larsen",
        title: "Founder",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: true,
      },
    ],
    news: [],
    links: [],
    locations: [
      { id: "loc_northwind_1", city: "Denver", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(120),
    updatedAt: daysAgo(3),
  },
  {
    id: "co_cargobyte",
    slug: "cargobyte",
    name: "Cargobyte",
    tagline: "Freight matching for regional trucking fleets.",
    about:
      "<p>Cargobyte connects independent trucking fleets to freight brokers in real time, cutting empty-mile rates industry-wide.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://cargobyte.example.com",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: true,
    employeeCountRange: "201-500",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: false,
    categories: cat("logistics"),
    technologies: tech("go", "postgresql", "kubernetes"),
    founders: [
      {
        id: "fnd_cargobyte_1",
        name: "Jenna Ruiz",
        title: "Co-founder & CEO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: "https://twitter.com/example",
        photoUrl: null,
        isHiringManager: false,
      },
    ],
    news: [
      {
        id: "news_cargobyte_1",
        title: "Cargobyte crosses 10,000 active carriers",
        url: null,
        publishedAt: daysAgo(90),
      },
    ],
    links: [
      { id: "lnk_cargobyte_1", type: "website", url: "https://cargobyte.example.com" },
    ],
    locations: [
      { id: "loc_cargobyte_1", city: "Austin", country: "US", isHQ: true },
      { id: "loc_cargobyte_2", city: "Columbus", country: "US", isHQ: false },
    ],
    createdAt: daysAgo(700),
    updatedAt: daysAgo(21),
  },
  {
    id: "co_haven",
    slug: "haven-consumer",
    name: "Haven",
    tagline: "A calmer way to plan shared household finances.",
    about:
      "<p>Haven helps couples and roommates split bills, save toward shared goals, and stop arguing about money admin.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://haven.example.com",
    fundingStage: "BOOTSTRAPPED",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1-10",
    verified: false,
    verificationStatus: "UNVERIFIED",
    isFeatured: false,
    categories: cat("consumer"),
    technologies: tech("react", "typescript"),
    founders: [
      {
        id: "fnd_haven_1",
        name: "Noa Bergman",
        title: "Founder",
        linkedinUrl: null,
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: true,
      },
    ],
    news: [],
    links: [],
    locations: [
      { id: "loc_haven_1", city: "Los Angeles", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(200),
    updatedAt: daysAgo(60),
  },
  {
    id: "co_sentrywall",
    slug: "sentrywall",
    name: "SentryWall",
    tagline: "Runtime detection for containerized workloads.",
    about:
      "<p>SentryWall watches syscalls in production so security teams find the container that got popped before it becomes a headline.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://sentrywall.example.com",
    fundingStage: "SERIES_A",
    remotePolicy: "REMOTE",
    visaSponsorship: true,
    employeeCountRange: "11-50",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: false,
    categories: cat("security", "developer-tools"),
    technologies: tech("rust", "kubernetes", "go"),
    founders: [
      {
        id: "fnd_sentrywall_1",
        name: "Idris Osei",
        title: "Co-founder & CEO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: false,
      },
    ],
    news: [],
    links: [
      { id: "lnk_sentrywall_1", type: "website", url: "https://sentrywall.example.com" },
      { id: "lnk_sentrywall_2", type: "github", url: "https://github.com/example" },
    ],
    locations: [
      { id: "loc_sentrywall_1", city: "Remote", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(250),
    updatedAt: daysAgo(7),
  },
  {
    id: "co_fernbank",
    slug: "fernbank-robotics",
    name: "Fernbank Robotics",
    tagline: "Warehouse picking arms that learn from one demonstration.",
    about:
      "<p>Fernbank's arms pick and pack novel SKUs after a single human demo, no per-item training pipeline required.</p>",
    logoUrl: null,
    bannerUrl: null,
    websiteUrl: "https://fernbankrobotics.example.com",
    fundingStage: "SERIES_B",
    remotePolicy: "ONSITE",
    visaSponsorship: true,
    employeeCountRange: "51-200",
    verified: true,
    verificationStatus: "VERIFIED",
    isFeatured: false,
    categories: cat("logistics", "ai-ml"),
    technologies: tech("python", "rust"),
    founders: [
      {
        id: "fnd_fernbank_1",
        name: "Grace Lindqvist",
        title: "Co-founder & CEO",
        linkedinUrl: "https://linkedin.com/in/example",
        twitterUrl: null,
        photoUrl: null,
        isHiringManager: false,
      },
    ],
    news: [],
    links: [],
    locations: [
      { id: "loc_fernbank_1", city: "Pittsburgh", country: "US", isHQ: true },
    ],
    createdAt: daysAgo(500),
    updatedAt: daysAgo(30),
    // No published internships right now — exercises the "0 open roles" empty state (doc §13).
  },
];

export const MOCK_COMPANY_DETAILS: Record<string, CompanyDetail> =
  Object.fromEntries(
    BASE_DETAILS.map((base) => [
      base.slug,
      { ...base, openInternships: getMockInternshipsByCompany(base.id) },
    ]),
  );

export const MOCK_COMPANIES: CompanyCard[] = Object.values(
  MOCK_COMPANY_DETAILS,
).map((c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  tagline: c.tagline,
  logoUrl: c.logoUrl,
  fundingStage: c.fundingStage,
  remotePolicy: c.remotePolicy,
  verified: c.verified,
  categories: c.categories,
  openInternshipCount: c.openInternships.length,
}));
