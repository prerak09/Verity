// lib/sanitize.ts — XSS sanitization for user-authored rich text (NFR 13.4).
//
// Applied on WRITE (before store) to company about/news and internship
// descriptions, so nothing malicious ever reaches the database or a reader.
// Allows a safe subset of formatting tags; strips scripts, event handlers, etc.

import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "code", "pre",
  "h1", "h2", "h3", "h4", "a", "span",
];
const ALLOWED_ATTR = ["href", "target", "rel"];

/** Sanitize rich text/HTML, keeping only safe formatting. */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i, // no javascript: URLs
  });
}

/** Strip ALL tags — for fields that must be plain text (names, taglines). */
export function stripTags(input: string | null | undefined): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/**
 * Plain-text excerpt for meta descriptions / social snippets: strips tags AND
 * decodes the common HTML entities left behind (&amp;, &nbsp;, …) so the text
 * never leaks raw entity codes (audit ISSUE-031), then collapses whitespace and
 * truncates to `max` chars on a word boundary.
 */
export function excerpt(
  input: string | null | undefined,
  max = 160,
): string {
  if (!input) return "";
  let text = stripTags(input);
  text = text.replace(
    /&(amp|lt|gt|quot|#39|apos|nbsp);/g,
    (m) => NAMED_ENTITIES[m] ?? m,
  );
  text = text.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
