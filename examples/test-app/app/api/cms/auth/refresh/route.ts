import { createAuthAdapter, handleRefreshSession } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import {
  createErrorResponse,
  generateCsrfToken,
  getClientIp,
  getRefreshToken,
  logSecurityEvent,
  requireCsrfToken,
  setAuthCookies,
  setCsrfCookie,
} from '../../../../../lib/auth-utils';

// Use server-side secret key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables at runtime
    if (!supabaseUrl || !supabaseSecretKey) {
      return createErrorResponse('Server configuration error', 'SERVER_CONFIG_ERROR', 500);
    }

    // 1. CSRF Protection
    const csrfError = requireCsrfToken(request);
    if (csrfError) {
      logSecurityEvent('csrf_validation_failed', {
        endpoint: '/api/cms/auth/refresh',
        ip: getClientIp(request),
      });
      return csrfError;
    }

    // 2. Get refresh token from cookie (preferred) or body (backward compatibility)
    const body = await request.json().catch(() => ({}));
    const refreshToken = getRefreshToken(request, body);

    if (!refreshToken) {
      return createErrorResponse('No refresh token provided', 'NO_REFRESH_TOKEN', 401);
    }

    // 3. Refresh session with Supabase
    const supabaseClient = createClient(supabaseUrl, supabaseSecretKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const session = await handleRefreshSession(authAdapter, refreshToken);

    // 4. Create response with updated cookies
    const response = NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
    });

    setAuthCookies(response, session.accessToken, session.refreshToken);

    // 5. Rotate CSRF token
    const csrfToken = generateCsrfToken();
    setCsrfCookie(response, csrfToken);

    // 6. Log successful refresh
    logSecurityEvent('session_refreshed', {
      userId: session.user.id,
      ip: getClientIp(request),
    });

    return response;
  } catch (error) {
    logSecurityEvent('refresh_failed', {
      ip: getClientIp(request),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return createErrorResponse('Session refresh failed', 'REFRESH_ERROR');
  }
}
