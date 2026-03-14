/**
 * Generates a cryptographically secure random CSRF token
 * @returns A hex-encoded random token (32 bytes = 64 hex characters)
 */
export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates CSRF tokens using double-submit cookie pattern
 * Compares the token from the cookie with the token from the request header
 *
 * @param cookieToken - Token from the cookie
 * @param headerToken - Token from the X-CSRF-Token header
 * @returns true if tokens match and are valid, false otherwise
 */
export function validateCsrfToken(
  cookieToken: string | undefined,
  headerToken: string | undefined
): boolean {
  // Both tokens must be present
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Both tokens must be non-empty strings
  if (cookieToken.trim() === '' || headerToken.trim() === '') {
    return false;
  }

  // Tokens must match exactly
  return cookieToken === headerToken;
}
