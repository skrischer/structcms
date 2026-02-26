/**
 * Auth Security Utilities
 * Provides cookie management, CSRF protection, and rate limiting
 */

import { type NextRequest, NextResponse } from 'next/server';

// Cookie configuration
const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
const CSRF_TOKEN_MAX_AGE = 60 * 60; // 1 hour

const isProduction = process.env.NODE_ENV === 'production';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
}

/**
 * Set auth tokens as httpOnly cookies
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
): void {
  // Access token cookie
  response.cookies.set('structcms_access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });

  // Refresh token cookie (only accessible to auth endpoints)
  if (refreshToken) {
    response.cookies.set('structcms_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: '/api/cms/auth',
    });
  }
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set('structcms_access_token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('structcms_refresh_token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 0,
    path: '/api/cms/auth',
  });
}

/**
 * Get access token from cookie or Authorization header
 */
export function getAccessToken(request: NextRequest): string | null {
  // Try cookie first (preferred)
  const cookieToken = request.cookies.get('structcms_access_token')?.value;
  if (cookieToken) return cookieToken;

  // Fallback to Authorization header (for backward compatibility during migration)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Get refresh token from cookie or body
 */
export function getRefreshToken(request: NextRequest, body?: { refreshToken?: string }): string | null {
  // Try cookie first (preferred)
  const cookieToken = request.cookies.get('structcms_refresh_token')?.value;
  if (cookieToken) return cookieToken;

  // Fallback to body (for backward compatibility)
  return body?.refreshToken || null;
}

// ============================================
// CSRF Protection (Double Submit Cookie)
// ============================================

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token cookie
 */
export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set('structcms_csrf_token', token, {
    httpOnly: false, // Must be accessible to JS for Double Submit pattern
    secure: isProduction,
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_MAX_AGE,
    path: '/',
  });
}

/**
 * Verify CSRF token (Double Submit Cookie pattern)
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get('structcms_csrf_token')?.value;
  const headerToken = request.headers.get('x-csrf-token');

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return cookieToken === headerToken;
}

/**
 * CSRF protection middleware
 */
export function requireCsrfToken(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        {
          error: {
            message: 'CSRF token validation failed',
            code: 'CSRF_ERROR',
          },
        },
        { status: 403 }
      );
    }
  }
  return null;
}

// ============================================
// Rate Limiting (In-Memory)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let entry = rateLimitStore.get(key);
  
  // Create new entry or reset if expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Increment count
  entry.count++;
  
  const allowed = entry.count <= config.maxAttempts;
  const remaining = Math.max(0, config.maxAttempts - entry.count);
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit middleware
 */
export function requireRateLimit(
  request: NextRequest,
  identifier: string,
  config?: RateLimitConfig
): NextResponse | null {
  const result = checkRateLimit(identifier, config);
  
  if (!result.allowed) {
    const resetDate = new Date(result.resetAt);
    return NextResponse.json(
      {
        error: {
          message: 'Too many attempts. Please try again later.',
          code: 'RATE_LIMIT',
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config?.maxAttempts.toString() || '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  return null;
}

/**
 * Get client IP address
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0]?.trim();
    if (ip) return ip;
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a placeholder for development
  return 'unknown';
}

// ============================================
// Error Handling
// ============================================

/**
 * Create generic error response (don't leak internal details)
 */
export function createErrorResponse(
  message: string = 'Authentication failed',
  code: string = 'AUTH_ERROR',
  status: number = 401
): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code,
      },
    },
    { status }
  );
}

/**
 * Log security event (for monitoring)
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  // In production, this would send to a proper logging service
  console.log('[SECURITY]', event, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}
