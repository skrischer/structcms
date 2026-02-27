export type {
  AuthUser,
  AuthSession,
  SignInWithOAuthInput,
  SignInWithPasswordInput,
  OAuthResponse,
  VerifySessionInput,
  AuthAdapter,
} from './types';

export {
  SupabaseAuthAdapter,
  createAuthAdapter,
  AuthError,
} from './supabase-adapter';

export type { SupabaseAuthAdapterConfig } from './supabase-adapter';

export {
  handleSignInWithOAuth,
  handleSignInWithPassword,
  handleSignOut,
  handleVerifySession,
  handleRefreshSession,
  handleGetCurrentUser,
  AuthValidationError,
} from './handlers';

export { createAuthMiddleware } from './middleware';
export type { AuthMiddlewareConfig, AuthenticatedRequest } from './middleware';

export { generateCsrfToken, validateCsrfToken } from './csrf';

export { createRateLimiter } from './rate-limiter';
export type { RateLimiter, RateLimiterConfig, RateLimitResult } from './rate-limiter';
