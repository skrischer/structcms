import { type NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, setCsrfCookie } from '../../../../../lib/auth-utils';

/**
 * GET /api/cms/auth/csrf
 *
 * Returns a CSRF token for the client to use in subsequent requests.
 * This endpoint is called on initial page load to bootstrap CSRF protection.
 */
export async function GET(request: NextRequest) {
  const csrfToken = generateCsrfToken();

  const response = NextResponse.json({
    csrfToken,
  });

  setCsrfCookie(response, csrfToken);

  return response;
}
