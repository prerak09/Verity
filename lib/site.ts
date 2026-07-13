// lib/site.ts — canonical absolute base URL for metadata, sitemap, robots.
//
// Prefers an explicit NEXT_PUBLIC_SITE_URL, then the Vercel-provided deployment
// host, then localhost for dev. Always returns an origin with no trailing slash.

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
