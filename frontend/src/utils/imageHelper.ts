// ─── imageHelper.ts ──────────────────────────────────────────────────────────
// Utility to resolve relative image URLs by prepending the API base URL.
// Handles both relative paths from Django and fully-qualified URLs.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

/**
 * Resolves an image URL safely. Prepends the backend API base URL if the path is relative.
 */
export function resolveImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Clean slash mapping
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${BASE_URL}${cleanUrl}`;
}
