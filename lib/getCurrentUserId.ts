/**
 * Get current user ID from localStorage.
 *
 * Single source of truth for user identification.
 * BACKEND MIGRATION: Replace this function body with JWT/session lookup.
 *
 * @returns userId string or null if not logged in
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentUserId');
}

/**
 * Get current user ID with fallback to 'user_default'.
 *
 * Use this in contexts where a userId is always required
 * (e.g., creating copies, loading stats for demo mode).
 *
 * BACKEND MIGRATION: Remove fallback when auth is mandatory.
 */
export function getCurrentUserIdOrDefault(): string {
  return getCurrentUserId() || 'user_default';
}
