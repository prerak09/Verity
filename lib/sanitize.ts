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
