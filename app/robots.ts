import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/** Crawl guidance: public discovery surfaces open; portals disallowed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/company", "/admin", "/api", "/bookmarks", "/applications"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
