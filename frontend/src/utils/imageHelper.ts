// ─── imageHelper.ts ──────────────────────────────────────────────────────────
// Utility to resolve relative image URLs by prepending the API base URL.
// Handles both relative paths from Django and fully-qualified URLs.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export function resolveImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  
  let cleanedUrl = url;
  
  // Clean port-less localhost backend misconfigurations by rewriting to BASE_URL
  if (cleanedUrl.startsWith('http://localhost/') && !cleanedUrl.startsWith('http://localhost:')) {
    cleanedUrl = cleanedUrl.replace('http://localhost', BASE_URL);
  } else if (cleanedUrl.startsWith('http://127.0.0.1/') && !cleanedUrl.startsWith('http://127.0.0.1:')) {
    cleanedUrl = cleanedUrl.replace('http://127.0.0.1', BASE_URL);
  }

  if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
    return cleanedUrl;
  }
  
  // Clean slash mapping for relative URLs
  const cleanUrl = cleanedUrl.startsWith('/') ? cleanedUrl : `/${cleanedUrl}`;
  return `${BASE_URL}${cleanUrl}`;
}
