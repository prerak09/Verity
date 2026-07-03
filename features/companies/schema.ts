// features/companies/schema.ts — Zod validation for company inputs (PRD §17, FR-10).
//
// The result envelope's fieldErrors are keyed by these field names, so the
// frontend form field names must match. Verification-gating (all Req. fields
// present) is enforced separately server-side in actions.ts (NFR 13.4).

import { z } from "zod";

export const FUNDING_STAGES = [
  "BOOTSTRAPPED",
  "PRE_SEED",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C_PLUS",
  "PUBLIC",
] as const;

export const REMOTE_POLICIES = ["REMOTE", "HYBRID", "ONSITE"] as const;

const httpsUrl = z
  .string()
  .trim()
  .url("Must be a valid URL.")
  .refine((u) => /^https?:\/\//.test(u), "URL must start with http(s)://");

const slug = z
  .string()
  .trim()
  .min(2, "Slug is too short.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

/** FR-10: name, domain (websiteUrl), tagline required to register. */
export const registerCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name is required.").max(120),
  slug,
  websiteUrl: httpsUrl,
  tagline: z.string().trim().min(4, "Add a short tagline.").max(160),
});
export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>;

/** Partial profile update — any subset of §17 fields (FR-11/13). */
export const updateCompanySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    tagline: z.string().trim().max(160),
    about: z.string().trim().max(20_000),
    logoUrl: httpsUrl,
    bannerUrl: httpsUrl,
    websiteUrl: httpsUrl,
    fundingStage: z.enum(FUNDING_STAGES),
    remotePolicy: z.enum(REMOTE_POLICIES),
    visaSponsorship: z.boolean(),
    employeeCountRange: z.string().trim().max(40),
    categoryIds: z.array(z.string().cuid()).max(20),
    technologyIds: z.array(z.string().cuid()).max(40),
  })
  .partial();
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;

export const founderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  title: z.string().trim().max(120).optional(),
  linkedinUrl: httpsUrl.optional(),
  twitterUrl: httpsUrl.optional(),
  photoUrl: httpsUrl.optional(),
  isHiringManager: z.boolean().optional(),
});
export type FounderSchema = z.infer<typeof founderSchema>;

export const companyNewsSchema = z.object({
  title: z.string().trim().min(2).max(200),
  url: httpsUrl.optional(),
  publishedAt: z.string().datetime({ message: "Must be an ISO date." }),
});
export type CompanyNewsSchema = z.infer<typeof companyNewsSchema>;

export const companyLinkSchema = z.object({
  type: z.string().trim().min(2).max(40),
  url: httpsUrl,
});
export type CompanyLinkSchema = z.infer<typeof companyLinkSchema>;

export const companyLocationSchema = z.object({
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  isHQ: z.boolean().optional(),
});
export type CompanyLocationSchema = z.infer<typeof companyLocationSchema>;

/** Fields required to reach Verified (PRD §17 "(Req.)" columns). */
export const REQUIRED_FOR_VERIFICATION = [
  "name",
  "tagline",
  "about",
  "logoUrl",
  "websiteUrl",
  "remotePolicy",
  "employeeCountRange",
] as const;
