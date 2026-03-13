import type { AuthAdapter, AuthUser } from './types';

export interface AuthenticatedRequest {
  user: AuthUser;
  accessToken: string;
}

export interface AuthMiddlewareConfig {
  adapter: AuthAdapter;
  extractToken?: (headers: Record<string, string | undefined>) => string | null;
}

export function createAuthMiddleware(config: AuthMiddlewareConfig) {
  const extractToken =
    config.extractToken ||
    ((headers: Record<string, string | undefined>) => {
      const authHeader = headers.authorization || headers.Authorization;
      if (!authHeader) return null;

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

      return parts[1];
    });

  return async function authenticate(
    headers: Record<string, string | undefined>
  ): Promise<AuthenticatedRequest> {
    const token = extractToken(headers);

    if (!token) {
      throw new Error('No authentication token provided');
    }

    const user = await config.adapter.verifySession({ accessToken: token });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    return {
      user,
      accessToken: token,
    };
  };
}
