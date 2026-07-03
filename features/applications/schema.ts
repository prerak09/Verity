// features/applications/schema.ts — Zod for application tracker (FR-42/43).

import { z } from "zod";

export const APPLICATION_STATUSES = [
  "SAVED",
  "APPLIED",
  "OA",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const createApplicationSchema = z.object({
  internshipId: z.string().cuid("Invalid internship id."),
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().trim().max(5_000).optional(), // PRIVATE (FR-44)
});
export type CreateApplicationSchema = z.infer<typeof createApplicationSchema>;

export const updateApplicationSchema = z
  .object({
    status: z.enum(APPLICATION_STATUSES),
    notes: z.string().trim().max(5_000),
  })
  .partial();
export type UpdateApplicationSchema = z.infer<typeof updateApplicationSchema>;
