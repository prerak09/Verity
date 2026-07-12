// features/internships/schema.ts — Zod for internship inputs (PRD §18, FR-20).

import { z } from "zod";
import { REMOTE_POLICIES } from "@/features/companies/schema";

export const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;
export const SEASONS = ["SUMMER", "FALL", "SPRING", "WINTER", "YEAR_ROUND"] as const;

const httpsUrl = z
  .string()
  .trim()
  .url("Must be a valid URL.")
  .refine((u) => /^https?:\/\//.test(u), "URL must start with http(s)://");

/** FR-20 required: title, description, location, remote policy, apply link. */
export const createInternshipSchema = z.object({
  title: z.string().trim().min(4, "Title is required.").max(160),
  description: z.string().trim().min(20, "Add a fuller description.").max(20_000),
  location: z.string().trim().min(1, "Location is required.").max(160),
  department: z.string().trim().max(120).optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  season: z.enum(SEASONS).optional(),
  remotePolicy: z.enum(REMOTE_POLICIES),
  stipend: z.string().trim().max(80).optional(),
  duration: z.string().trim().max(80).optional(),
  applyUrl: httpsUrl,
  categoryIds: z.array(z.string().cuid()).max(10).optional(),
});
export type CreateInternshipSchema = z.infer<typeof createInternshipSchema>;

export const updateInternshipSchema = createInternshipSchema.partial();
export type UpdateInternshipSchema = z.infer<typeof updateInternshipSchema>;
