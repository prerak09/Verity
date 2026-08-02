// lib/time-ago.ts — shared "posted N days ago" formatting for listing cards/pages.

export const DAY_MS = 24 * 60 * 60 * 1000;

/** "Posted today" / "Posted yesterday" / "Posted 5d ago" / "Posted 2mo ago". */
export function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / DAY_MS);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days}d ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}
