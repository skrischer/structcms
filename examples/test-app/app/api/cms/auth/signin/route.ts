import { createAuthAdapter, handleSignInWithPassword } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import {
  createErrorResponse,
  generateCsrfToken,
  getClientIp,
  logSecurityEvent,
  requireCsrfToken,
  requireRateLimit,
  setAuthCookies,
  setCsrfCookie,
} from '../../../../../lib/auth-utils';

// Use server-side secret key (NOT public anon key)
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
        endpoint: '/api/cms/auth/signin',
        ip: getClientIp(request),
      });
      return csrfError;
    }

    // 2. Rate Limiting (5 attempts per 15 minutes per IP)
    const clientIp = getClientIp(request);
    const rateLimitError = requireRateLimit(request, `signin:${clientIp}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (rateLimitError) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint: '/api/cms/auth/signin',
        ip: clientIp,
      });
      return rateLimitError;
    }

    // 3. Parse and validate input
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 'VALIDATION_ERROR', 400);
    }

    // 4. Authenticate with Supabase using secret key
    const supabaseClient = createClient(supabaseUrl, supabaseSecretKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const session = await handleSignInWithPassword(authAdapter, {
      email,
      password,
    });

    // 5. Create response with httpOnly cookies
    const response = NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
    });

    setAuthCookies(response, session.accessToken, session.refreshToken);

    // 6. Set CSRF token for subsequent requests
    const csrfToken = generateCsrfToken();
    setCsrfCookie(response, csrfToken);

    // 7. Log successful signin
    logSecurityEvent('signin_success', {
      userId: session.user.id,
      email: session.user.email,
      ip: clientIp,
    });

    return response;
  } catch (error) {
    // 8. Generic error response (don't leak internal details)
    const clientIp = getClientIp(request);
    
    logSecurityEvent('signin_failed', {
      ip: clientIp,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return createErrorResponse();
  }
}
