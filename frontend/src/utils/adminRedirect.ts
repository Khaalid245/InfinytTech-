/**
 * Resolves a safe redirect path after administrative login.
 * Guarantees open-redirect protection: only internal relative paths starting
 * with `/admin` and without scheme/host components or double slashes are permitted.
 *
 * @param fromPath - Candidate return pathname from router state
 * @returns Safe administrative pathname, defaulting to `/admin/dashboard`
 */
export function resolveSafeAdminRedirectPath(fromPath?: string | null): string {
  if (!fromPath || typeof fromPath !== 'string') {
    return '/admin/dashboard';
  }
  const trimmed = fromPath.trim();
  if (
    trimmed.startsWith('/admin') &&
    !trimmed.startsWith('/admin/login') &&
    !trimmed.includes('//') &&
    !trimmed.includes(':') &&
    !trimmed.includes('\\')
  ) {
    return trimmed;
  }
  return '/admin/dashboard';
}
