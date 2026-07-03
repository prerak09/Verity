// features/bookmarks/schema.ts — Zod for bookmark inputs (FR-40/41).

import { z } from "zod";

export const createBookmarkSchema = z.object({
  targetType: z.enum(["COMPANY", "INTERNSHIP"]),
  targetId: z.string().cuid("Invalid target id."),
});
export type CreateBookmarkSchema = z.infer<typeof createBookmarkSchema>;
