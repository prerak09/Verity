import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Static marketing routes + every public company and internship detail page. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/companies",
    "/internships",
    "/jobs",
    "/categories",
    "/search",
    "/team",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [companies, internships] = await Promise.all([
      db.company.findMany({
        where: { deletedAt: null, verificationStatus: "VERIFIED" },
        select: { slug: true, updatedAt: true },
      }),
      db.internship.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          company: { deletedAt: null, verificationStatus: "VERIFIED" },
        },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const companyRoutes: MetadataRoute.Sitemap = companies.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    const internshipRoutes: MetadataRoute.Sitemap = internships.map((i) => ({
      url: `${base}/internships/${i.slug}`,
      lastModified: i.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...companyRoutes, ...internshipRoutes];
  } catch {
    // DB unreachable at build/request — still serve the static routes.
    return staticRoutes;
  }
}
