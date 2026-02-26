import { createAuthAdapter, handleVerifySession } from '@structcms/api';
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import {
  createErrorResponse,
  getAccessToken,
  getClientIp,
  logSecurityEvent,
} from '../../../../../lib/auth-utils';

// Use server-side secret key
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get access token from cookie (preferred) or Authorization header (backward compatibility)
    const token = getAccessToken(request);

    if (!token) {
      return createErrorResponse('No token provided', 'NO_TOKEN', 401);
    }

    // 2. Verify session with Supabase
    const supabaseClient = createClient(supabaseUrl, supabaseSecretKey);
    const authAdapter = createAuthAdapter({ client: supabaseClient });

    const user = await handleVerifySession(authAdapter, {
      accessToken: token,
    });

    if (!user) {
      return createErrorResponse('Invalid or expired token', 'INVALID_TOKEN', 401);
    }

    return NextResponse.json(user);
  } catch (error) {
    logSecurityEvent('verify_failed', {
      ip: getClientIp(request),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return createErrorResponse('Verification failed', 'VERIFY_ERROR');
  }
}
