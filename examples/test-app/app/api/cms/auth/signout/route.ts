import { createAuthAdapter, handleSignOut } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import {
  clearAuthCookies,
  createErrorResponse,
  getAccessToken,
  getClientIp,
  logSecurityEvent,
  requireCsrfToken,
} from '../../../../../lib/auth-utils';

// Use server-side secret key
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
}

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Protection
    const csrfError = requireCsrfToken(request);
    if (csrfError) {
      logSecurityEvent('csrf_validation_failed', {
        endpoint: '/api/cms/auth/signout',
        ip: getClientIp(request),
      });
      return csrfError;
    }

    // 2. Get access token
    const token = getAccessToken(request);

    if (token) {
      // 3. Sign out with Supabase
      const supabaseClient = createClient(supabaseUrl, supabaseSecretKey);
      const authAdapter = createAuthAdapter({ client: supabaseClient });

      await handleSignOut(authAdapter, token);

      logSecurityEvent('signout_success', {
        ip: getClientIp(request),
      });
    }

    // 4. Clear cookies
    const response = NextResponse.json({
      message: 'Signed out successfully',
    });

    clearAuthCookies(response);

    return response;
  } catch (error) {
    logSecurityEvent('signout_failed', {
      ip: getClientIp(request),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Still clear cookies even on error
    const response = createErrorResponse('Sign out failed', 'SIGNOUT_ERROR', 500);
    clearAuthCookies(response);
    return response;
  }
}
