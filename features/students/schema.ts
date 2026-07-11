// features/students/schema.ts — Zod for student profile (PRD §14.1).

import { z } from "zod";

const currentYear = new Date().getFullYear();

const httpsUrl = z
  .string()
  .trim()
  .url("Must be a valid URL.")
  .refine((u) => /^https?:\/\//.test(u), "URL must start with http(s)://");

const tagList = z.array(z.string().trim().min(1).max(40)).max(30);

export const updateStudentProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    headline: z.string().trim().max(160),
    location: z.string().trim().max(120),
    college: z.string().trim().max(160),
    degree: z.string().trim().max(80),
    major: z.string().trim().max(120),
    gradYear: z
      .number()
      .int()
      .min(currentYear - 10, "Graduation year looks too far in the past.")
      .max(currentYear + 10, "Graduation year looks too far in the future."),
    skills: tagList,
    interests: tagList,
    linkedinUrl: httpsUrl,
    githubUrl: httpsUrl,
    portfolioUrl: httpsUrl,
    resumeUrl: httpsUrl,
    bio: z.string().trim().max(2_000),
  })
  .partial();
export type UpdateStudentProfileSchema = z.infer<typeof updateStudentProfileSchema>;
