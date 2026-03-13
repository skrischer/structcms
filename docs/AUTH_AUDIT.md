# StructCMS Authentication Security Audit

**Audit Date:** 2026-02-26  
**Auditor:** Cascade AI  
**Scope:** Complete authentication implementation across `@structcms/api` and `@structcms/admin`

---

## Executive Summary

**Overall Security Rating: 5/10 (Medium Risk)**

The authentication system is built on a solid foundation (Supabase Auth) with a clean adapter pattern, but contains several critical security vulnerabilities that must be addressed before production deployment. The most severe issues involve token storage in localStorage (XSS vulnerability), use of public anon keys in server-side auth endpoints, and missing security layers like CSRF protection and rate limiting.

---

## 🔴 Critical Vulnerabilities (Must Fix)

### 1. Insecure Token Storage (HIGH RISK)

**Location:** `packages/admin/src/context/auth-context.tsx:35-36, 140-142`

**Issue:**
```typescript
localStorage.setItem('structcms_access_token', newSession.accessToken);
localStorage.setItem('structcms_refresh_token', newSession.refreshToken);
```

**Risk:**
- **XSS Vulnerability**: Any XSS attack can steal tokens from localStorage
- **No HttpOnly Protection**: Tokens accessible to JavaScript
- **Session Hijacking**: Stolen tokens allow full account takeover

**Impact:** CRITICAL - Complete account compromise possible

**Recommendation:**
```typescript
// Use httpOnly cookies instead
// Server-side (Next.js API route):
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const session = await handleSignInWithPassword(...);
  
  cookies().set('structcms_access_token', session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  });
  
  cookies().set('structcms_refresh_token', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 604800, // 7 days
    path: '/api/cms/auth',
  });
  
  return NextResponse.json({ user: session.user });
}
```

---

### 2. Wrong Supabase Key in Auth Endpoints (HIGH RISK)

**Location:** `examples/test-app/app/api/cms/auth/signin/route.ts:5-6`

**Issue:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
```

**Risk:**
- Using **public anon key** instead of **secret service key**
- Anon key is exposed to client-side and has limited permissions
- May bypass RLS policies or cause unexpected authorization issues
- Inconsistent with other parts of the system using `SUPABASE_SECRET_KEY`

**Impact:** HIGH - Potential security bypass, inconsistent auth behavior

**Recommendation:**
```typescript
// Use server-side secret key
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseSecretKey);
```

**Note:** Check all auth-related routes (`signin`, `signout`, `verify`, `refresh`) for this issue.

---

### 3. No CSRF Protection (HIGH RISK)

**Location:** All auth endpoints

**Issue:**
- No CSRF tokens implemented
- No SameSite cookie attributes (when cookies are used)
- State-changing operations (signin, signout) vulnerable to CSRF

**Risk:**
- Attackers can force authenticated actions from victim's browser
- Session hijacking through cross-site requests

**Impact:** HIGH - Unauthorized actions on behalf of users

**Recommendation:**
```typescript
// 1. Add CSRF token middleware
import { createCsrfProtect } from '@edge-csrf/nextjs';

const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// 2. Protect auth routes
export async function POST(request: NextRequest) {
  await csrfProtect(request);
  // ... rest of auth logic
}

// 3. Client-side: Include CSRF token in requests
const response = await fetch('/api/cms/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken(),
  },
  body: JSON.stringify({ email, password }),
});
```

---

### 4. No Rate Limiting (HIGH RISK)

**Location:** All auth endpoints, especially `/api/cms/auth/signin`

**Issue:**
- No protection against brute-force attacks
- Unlimited login attempts possible
- No IP-based throttling

**Risk:**
- Password guessing attacks
- Account enumeration
- DoS through repeated auth attempts

**Impact:** HIGH - Account compromise, service disruption

**Recommendation:**
```typescript
// Install: pnpm add @upstash/ratelimit @upstash/redis

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
  analytics: true,
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `auth_signin_${ip}`
  );

  if (!success) {
    return NextResponse.json(
      { error: { message: 'Too many attempts. Please try again later.', code: 'RATE_LIMIT' } },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // ... rest of auth logic
}
```

---

## 🟡 High Priority Issues

### 5. Weak Password Policy (MEDIUM RISK)

**Location:** `packages/api/src/auth/handlers.ts:40-42`

**Issue:**
```typescript
if (input.password.length < 6) {
  throw new AuthValidationError('Password must be at least 6 characters');
}
```

**Risk:**
- Only 6 characters minimum is too weak
- No complexity requirements
- Vulnerable to dictionary attacks

**Impact:** MEDIUM - Weak passwords allow easier compromise

**Recommendation:**
```typescript
function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new AuthValidationError('Password must be at least 8 characters');
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const complexityCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;
  
  if (complexityCount < 3) {
    throw new AuthValidationError(
      'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters'
    );
  }
  
  // Check against common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', ...];
  if (commonPasswords.includes(password.toLowerCase())) {
    throw new AuthValidationError('Password is too common');
  }
}
```

---

### 6. Auth Bypass Flag in Production (MEDIUM RISK)

**Location:** `examples/test-app/app/admin/layout.tsx:14`

**Issue:**
```typescript
const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
```

**Risk:**
- Could be accidentally enabled in production
- Bypasses all authentication
- No audit trail when auth is disabled

**Impact:** CRITICAL if enabled in production

**Recommendation:**
```typescript
// Only allow in development
const isAuthDisabled = 
  process.env.NODE_ENV === 'development' && 
  process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

// Add warning
if (isAuthDisabled) {
  console.warn('⚠️  WARNING: Authentication is DISABLED. This should only be used in development!');
}
```

---

### 7. No Token Expiration Enforcement (MEDIUM RISK)

**Location:** `packages/api/src/auth/types.ts:10`, auth handlers

**Issue:**
- `expiresAt` is optional
- No active checking of token expiration
- Tokens may be used past their expiry

**Risk:**
- Stale tokens remain valid
- No forced re-authentication
- Increased window for token theft impact

**Impact:** MEDIUM - Extended exposure window

**Recommendation:**
```typescript
// In verifySession handler
export async function handleVerifySession(adapter: AuthAdapter, input: VerifySessionInput) {
  if (!input.accessToken) {
    throw new AuthValidationError('Access token is required');
  }

  const user = await adapter.verifySession(input);
  
  if (!user) {
    return null;
  }
  
  // Check expiration if available
  if (input.expiresAt && new Date() > new Date(input.expiresAt)) {
    throw new AuthValidationError('Token has expired');
  }
  
  return user;
}

// Make expiresAt required
export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date; // Required, not optional
  user: AuthUser;
}
```

---

### 8. Insufficient Error Handling & Logging (MEDIUM RISK)

**Location:** All auth endpoints

**Issue:**
```typescript
console.error('Sign in error:', error);
return NextResponse.json({
  message: error instanceof Error ? error.message : 'Sign in failed',
}, { status: 401 });
```

**Risk:**
- May leak sensitive error details
- No security event logging
- No monitoring/alerting for suspicious activity
- Difficult to detect attacks

**Impact:** MEDIUM - Reduced visibility, information leakage

**Recommendation:**
```typescript
// 1. Generic error messages to client
return NextResponse.json({
  error: { 
    message: 'Authentication failed',
    code: 'AUTH_ERROR'
  }
}, { status: 401 });

// 2. Detailed logging server-side
import { logger } from '@/lib/logger';

logger.security('auth_signin_failed', {
  email: email, // or hash for privacy
  ip: request.ip,
  userAgent: request.headers.get('user-agent'),
  error: error.message,
  timestamp: new Date().toISOString(),
});

// 3. Alert on suspicious patterns
if (failedAttempts > 10) {
  logger.alert('potential_brute_force', { ip, email });
}
```

---

## 🟢 Medium Priority Issues

### 9. Missing Security Headers

**Recommendation:**
```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

---

### 10. No Session Management

**Issue:**
- No limit on concurrent sessions per user
- No ability to revoke sessions
- No session listing/management

**Recommendation:**
- Implement session tracking in database
- Add "active sessions" management UI
- Allow users to revoke sessions
- Limit max concurrent sessions (e.g., 5 per user)

---

### 11. Missing 2FA/MFA Support

**Issue:**
- Only password-based auth
- No second factor available
- High-value accounts at risk

**Recommendation:**
- Add TOTP (Time-based One-Time Password) support
- Integrate with Supabase MFA features
- Make 2FA optional but encouraged
- Consider mandatory 2FA for admin users

---

### 12. No Account Lockout

**Issue:**
- Failed login attempts don't lock accounts
- Brute-force attacks can continue indefinitely

**Recommendation:**
```typescript
// Track failed attempts in database or Redis
const failedAttempts = await getFailedAttempts(email);

if (failedAttempts >= 5) {
  const lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await lockAccount(email, lockoutUntil);
  
  return NextResponse.json({
    error: { 
      message: 'Account temporarily locked due to too many failed attempts',
      code: 'ACCOUNT_LOCKED',
      lockoutUntil: lockoutUntil.toISOString(),
    }
  }, { status: 423 });
}
```

---

## ✅ Positive Security Aspects

1. **Supabase Auth Foundation** - Industry-standard, well-tested auth provider
2. **Bearer Token Authentication** - Standard, widely-supported approach
3. **Refresh Token Support** - Enables token rotation
4. **OAuth Support** - Multiple providers (Google, GitHub, GitLab, Azure, Bitbucket)
5. **Adapter Pattern** - Clean architecture, provider-agnostic
6. **Session Verification** - Token validation on protected routes
7. **Input Validation** - Basic email/password validation present
8. **TypeScript** - Type safety reduces certain classes of bugs

---

## Compliance Considerations

### GDPR
- ✅ User data minimization (only id, email, metadata)
- ⚠️ Need audit logging for data access
- ⚠️ Need "right to be forgotten" implementation
- ⚠️ Need data export functionality

### OWASP Top 10 (2021)
- ❌ A01: Broken Access Control - Auth bypass flag, missing CSRF
- ❌ A02: Cryptographic Failures - Tokens in localStorage
- ⚠️ A03: Injection - Basic validation, could be improved
- ❌ A05: Security Misconfiguration - Missing security headers
- ❌ A07: Identification and Authentication Failures - Weak password policy, no rate limiting

---

## Recommended Implementation Timeline

### Week 1 (Critical Fixes)
1. ✅ Switch to httpOnly cookies for token storage
2. ✅ Fix Supabase key usage (service key in auth endpoints)
3. ✅ Implement CSRF protection
4. ✅ Add rate limiting to auth endpoints

### Week 2 (High Priority)
5. ✅ Strengthen password policy
6. ✅ Restrict auth bypass to development only
7. ✅ Enforce token expiration
8. ✅ Improve error handling and logging

### Week 3 (Medium Priority)
9. ✅ Add security headers
10. ✅ Implement session management
11. ✅ Add account lockout mechanism
12. ✅ Set up security monitoring/alerting

### Week 4 (Enhancements)
13. ✅ Add 2FA/MFA support
14. ✅ Implement audit logging
15. ✅ Add security tests
16. ✅ Documentation and training

---

## Testing Recommendations

### Security Tests to Add

```typescript
// 1. XSS Protection Test
describe('Auth Security', () => {
  it('should not expose tokens to JavaScript', async () => {
    await signIn(email, password);
    expect(localStorage.getItem('structcms_access_token')).toBeNull();
    // Tokens should only be in httpOnly cookies
  });

  // 2. CSRF Protection Test
  it('should reject requests without CSRF token', async () => {
    const response = await fetch('/api/cms/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      // Missing CSRF token
    });
    expect(response.status).toBe(403);
  });

  // 3. Rate Limiting Test
  it('should rate limit login attempts', async () => {
    for (let i = 0; i < 6; i++) {
      await fetch('/api/cms/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'wrong' }),
      });
    }
    const response = await fetch('/api/cms/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    expect(response.status).toBe(429);
  });

  // 4. Token Expiration Test
  it('should reject expired tokens', async () => {
    const expiredToken = generateExpiredToken();
    const response = await fetch('/api/cms/auth/verify', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    expect(response.status).toBe(401);
  });
});
```

---

## Monitoring & Alerting

### Metrics to Track
- Failed login attempts (per IP, per email)
- Successful logins from new IPs/devices
- Token refresh rate
- Session duration
- Password reset requests
- Account lockouts
- CSRF token failures
- Rate limit hits

### Alert Triggers
- 🚨 More than 10 failed logins from same IP in 5 minutes
- 🚨 Auth bypass flag enabled in production
- 🚨 Successful login from unusual location
- 🚨 Multiple concurrent sessions from different IPs
- ⚠️ High rate of token refresh requests
- ⚠️ Unusual spike in auth endpoint traffic

---

## References & Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Supabase Auth Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

## Conclusion

The StructCMS authentication system has a solid architectural foundation but requires immediate attention to critical security vulnerabilities before production deployment. The most urgent issues are:

1. **Token storage in localStorage** (XSS vulnerability)
2. **Wrong Supabase key usage** (security misconfiguration)
3. **Missing CSRF protection** (CSRF attacks)
4. **No rate limiting** (brute-force vulnerability)

Addressing these four issues should be the top priority. Following the recommended timeline will bring the authentication system to production-ready security standards within 4 weeks.

**Current Risk Level:** HIGH  
**Target Risk Level:** LOW (after implementing all critical and high-priority fixes)

---

**Next Steps:**
1. Review this audit with the development team
2. Prioritize fixes based on risk and effort
3. Create GitHub issues for each vulnerability
4. Implement fixes following the recommended timeline
5. Conduct security testing after each fix
6. Schedule follow-up audit after 4 weeks
