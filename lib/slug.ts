// lib/slug.ts — slug + domain helpers.

/** URL-safe slug from an arbitrary string (lowercase, hyphenated, ascii). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Canonical registrable domain from a URL or bare host (FR-15 duplicate key).
 * Drops protocol, `www.`, path, and lowercases. Returns null if unparseable.
 */
export function normalizeDomain(input: string): string | null {
  if (!input) return null;
  let host = input.trim().toLowerCase();
  try {
    if (!/^[a-z]+:\/\//.test(host)) host = `https://${host}`;
    const url = new URL(host);
    host = url.hostname;
  } catch {
    return null;
  }
  host = host.replace(/^www\./, "");
  return host || null;
}
