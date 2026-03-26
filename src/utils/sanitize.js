/**
 * Input sanitization utilities.
 *
 * XSS Prevention Strategy:
 * - All user-submitted text is stripped of HTML tags before being stored.
 * - React's JSX already escapes values rendered with {expression}, so this
 *   is a defence-in-depth layer that protects against stored XSS if content
 *   is ever rendered via dangerouslySetInnerHTML or third-party components.
 *
 * SQL Injection: Not applicable — the app uses Supabase client queries (no raw SQL from user input).
 * Auth / Secrets: Managed by Supabase Auth and RLS.
 */

/**
 * Strips all HTML/script tags and trims whitespace.
 * Safe to call on any string before storing it.
 */
export function sanitizeText(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/<[^>]*>/g, "") // strip all HTML tags
    .replace(/javascript:/gi, "") // strip js: URIs
    .replace(/on\w+\s*=/gi, "") // strip inline event handlers (onclick=, etc.)
    .trim();
}

/**
 * Sanitizes all string values in a plain object one level deep.
 * Use before any insert/update call with user input.
 */
export function sanitizeFormData(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === "string" ? sanitizeText(value) : value;
  }
  return result;
}