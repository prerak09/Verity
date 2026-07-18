"use server";

// features/admin/taxonomy.ts — Category & Technology CRUD + merge (FR-54).
// Admin-only (category:manage / technology:manage).

import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction, parseInput } from "@/lib/action";
import { slugify } from "@/lib/slug";
import { z } from "zod";
import {
  ConflictError,
  NotFoundError,
  type Result,
  type TaxonomyInput,
  type TaxonomyRef,
} from "@/types";

/** Full technology taxonomy, for the admin CRUD page (CONTRACTS.md CR-13) and
 *  the public search filters. Cached — taxonomy is admin-managed and changes
 *  rarely; mutations below revalidate the `taxonomy:list` tag. */
export async function listTechnologies(): Promise<TaxonomyRef[]> {
  return unstable_cache(
    listTechnologiesUncached,
    ["technologies-list"],
    { tags: ["taxonomy:list"], revalidate: 300 },
  )();
}

async function listTechnologiesUncached(): Promise<TaxonomyRef[]> {
  const rows = await db.technology.findMany({ orderBy: { name: "asc" } });
  return rows.map((t) => ({ id: t.id, slug: t.slug, name: t.name }));
}

const taxonomySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional(),
});

// ── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(input: TaxonomyInput): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "category:manage");
    const data = parseInput(taxonomySchema, input);
    const slug = data.slug ?? slugify(data.name);
    const exists = await db.category.findUnique({ where: { slug }, select: { id: true } });
    if (exists) throw new ConflictError("Category slug already exists.");
    const c = await db.category.create({ data: { name: data.name, slug } });
    revalidateTag("taxonomy:list", "max");
    return { id: c.id };
  });
}

export async function renameCategory(
  id: string,
  name: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "category:manage");
    const parsed = z.string().trim().min(2).max(80).parse(name);
    await db.category.update({ where: { id }, data: { name: parsed } });
    revalidateTag("taxonomy:list", "max");
    return null;
  });
}

/** Merge `sourceId` into `targetId`: move joins, delete source (FR-54 dedupe). */
export async function mergeCategories(
  sourceId: string,
  targetId: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "category:manage");
    if (sourceId === targetId) throw new ConflictError("Cannot merge into itself.");
    const [src, tgt] = await Promise.all([
      db.category.findUnique({ where: { id: sourceId }, select: { id: true } }),
      db.category.findUnique({ where: { id: targetId }, select: { id: true } }),
    ]);
    if (!src || !tgt) throw new NotFoundError("Category not found.");

    await db.$transaction(async (tx) => {
      const links = await tx.companyCategory.findMany({ where: { categoryId: sourceId } });
      for (const l of links) {
        await tx.companyCategory.upsert({
          where: { companyId_categoryId: { companyId: l.companyId, categoryId: targetId } },
          update: {},
          create: { companyId: l.companyId, categoryId: targetId },
        });
      }
      await tx.companyCategory.deleteMany({ where: { categoryId: sourceId } });
      await tx.category.delete({ where: { id: sourceId } });
    });
    revalidateTag("taxonomy:list", "max");
    return null;
  });
}

// ── Technologies ─────────────────────────────────────────────────────────────

export async function createTechnology(input: TaxonomyInput): Promise<Result<{ id: string }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "technology:manage");
    const data = parseInput(taxonomySchema, input);
    const slug = data.slug ?? slugify(data.name);
    const exists = await db.technology.findUnique({ where: { slug }, select: { id: true } });
    if (exists) throw new ConflictError("Technology slug already exists.");
    const t = await db.technology.create({ data: { name: data.name, slug } });
    revalidateTag("taxonomy:list", "max");
    return { id: t.id };
  });
}

export async function mergeTechnologies(
  sourceId: string,
  targetId: string,
): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "technology:manage");
    if (sourceId === targetId) throw new ConflictError("Cannot merge into itself.");
    const [src, tgt] = await Promise.all([
      db.technology.findUnique({ where: { id: sourceId }, select: { id: true } }),
      db.technology.findUnique({ where: { id: targetId }, select: { id: true } }),
    ]);
    if (!src || !tgt) throw new NotFoundError("Technology not found.");

    await db.$transaction(async (tx) => {
      const links = await tx.companyTechnology.findMany({ where: { technologyId: sourceId } });
      for (const l of links) {
        await tx.companyTechnology.upsert({
          where: { companyId_technologyId: { companyId: l.companyId, technologyId: targetId } },
          update: {},
          create: { companyId: l.companyId, technologyId: targetId },
        });
      }
      await tx.companyTechnology.deleteMany({ where: { technologyId: sourceId } });
      await tx.technology.delete({ where: { id: sourceId } });
    });
    revalidateTag("taxonomy:list", "max");
    return null;
  });
}
