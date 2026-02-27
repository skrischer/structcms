import {
  AuthValidationError,
  handleGetCurrentUser,
  handleRefreshSession,
  handleSignInWithOAuth,
  handleSignInWithPassword,
  handleSignOut,
  handleVerifySession,
} from '../auth';
import type { AuthAdapter, SignInWithOAuthInput, SignInWithPasswordInput } from '../auth';

interface RequestLike {
  json(): Promise<unknown>;
  headers: {
    get(name: string): string | null | undefined;
  };
}

interface ResponseLike {
  status: number;
  json(): Promise<unknown>;
}

interface ResponseConstructorLike {
  new (body?: string, init?: { status?: number; headers?: Record<string, string> }): ResponseLike;
  json(data: unknown, init?: { status?: number; headers?: Record<string, string> }): ResponseLike;
}

export interface NextAuthOAuthRouteConfig {
  authAdapter: AuthAdapter;
}

export interface NextAuthSignInRouteConfig {
  authAdapter: AuthAdapter;
}

export interface NextAuthSignOutRouteConfig {
  authAdapter: AuthAdapter;
}

export interface NextAuthVerifyRouteConfig {
  authAdapter: AuthAdapter;
}

export interface NextAuthRefreshRouteConfig {
  authAdapter: AuthAdapter;
}

export interface NextAuthCurrentUserRouteConfig {
  authAdapter: AuthAdapter;
}

function extractBearerToken(request: RequestLike): string | null {
  const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1] ?? null;
}

export function createNextAuthOAuthRoute(
  config: NextAuthOAuthRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function POST(request: RequestLike): Promise<ResponseLike> {
    try {
      const body = await request.json();
      const input = body as SignInWithOAuthInput;

      const result = await handleSignInWithOAuth(config.authAdapter, input);

      return Response.json({ data: result }, { status: 200 });
    } catch (err) {
      if (err instanceof AuthValidationError) {
        return Response.json(
          { error: { message: err.message, code: 'VALIDATION_ERROR' } },
          { status: 400 }
        );
      }

      // For unknown errors, return a generic message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Internal Server Error', code: 'OAUTH_ERROR' } },
        { status: 500 }
      );
    }
  };
}

export function createNextAuthSignInRoute(
  config: NextAuthSignInRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function POST(request: RequestLike): Promise<ResponseLike> {
    try {
      const body = await request.json();
      const input = body as SignInWithPasswordInput;

      const session = await handleSignInWithPassword(config.authAdapter, input);

      return Response.json(session, { status: 200 });
    } catch (err) {
      if (err instanceof AuthValidationError) {
        return Response.json(
          { error: { message: err.message, code: 'VALIDATION_ERROR' } },
          { status: 400 }
        );
      }

      // For unknown errors, return a generic message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Invalid credentials', code: 'AUTH_ERROR' } },
        { status: 401 }
      );
    }
  };
}

export function createNextAuthSignOutRoute(
  config: NextAuthSignOutRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function POST(request: RequestLike): Promise<ResponseLike> {
    try {
      const token = extractBearerToken(request);
      if (!token) {
        return Response.json(
          { error: { message: 'No token provided', code: 'NO_TOKEN' } },
          { status: 401 }
        );
      }

      await handleSignOut(config.authAdapter, token);

      return Response.json({ message: 'Signed out successfully' }, { status: 200 });
    } catch (error) {
      // Return generic error message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Internal Server Error', code: 'SIGNOUT_ERROR' } },
        { status: 500 }
      );
    }
  };
}

export function createNextAuthVerifyRoute(
  config: NextAuthVerifyRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function POST(request: RequestLike): Promise<ResponseLike> {
    try {
      const token = extractBearerToken(request);
      if (!token) {
        return Response.json(
          { error: { message: 'No token provided', code: 'NO_TOKEN' } },
          { status: 401 }
        );
      }

      const user = await handleVerifySession(config.authAdapter, { accessToken: token });

      if (!user) {
        return Response.json(
          { error: { message: 'Invalid token', code: 'INVALID_TOKEN' } },
          { status: 401 }
        );
      }

      return Response.json(user, { status: 200 });
    } catch (error) {
      // Return generic error message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Authentication failed', code: 'VERIFY_ERROR' } },
        { status: 401 }
      );
    }
  };
}

export function createNextAuthRefreshRoute(
  config: NextAuthRefreshRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function POST(request: RequestLike): Promise<ResponseLike> {
    try {
      const body = await request.json();
      const { refreshToken } = body as { refreshToken: string };

      if (!refreshToken) {
        return Response.json(
          { error: { message: 'Refresh token required', code: 'NO_REFRESH_TOKEN' } },
          { status: 400 }
        );
      }

      const session = await handleRefreshSession(config.authAdapter, refreshToken);

      return Response.json(session, { status: 200 });
    } catch (error) {
      // Return generic error message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Session refresh failed', code: 'REFRESH_ERROR' } },
        { status: 401 }
      );
    }
  };
}

export function createNextAuthCurrentUserRoute(
  config: NextAuthCurrentUserRouteConfig,
  Response: ResponseConstructorLike
) {
  return async function GET(request: RequestLike): Promise<ResponseLike> {
    try {
      const token = extractBearerToken(request);
      if (!token) {
        return Response.json(
          { error: { message: 'No token provided', code: 'NO_TOKEN' } },
          { status: 401 }
        );
      }

      const user = await handleGetCurrentUser(config.authAdapter, token);

      if (!user) {
        return Response.json(
          { error: { message: 'User not found', code: 'USER_NOT_FOUND' } },
          { status: 401 }
        );
      }

      return Response.json(user, { status: 200 });
    } catch (error) {
      // Return generic error message to avoid leaking internal details
      return Response.json(
        { error: { message: 'Internal Server Error', code: 'GET_USER_ERROR' } },
        { status: 500 }
      );
    }
  };
}

export function createAuthenticatedRoute<T>(
  authAdapter: AuthAdapter,
  Response: ResponseConstructorLike,
  handler: (request: RequestLike, user: { id: string; email: string }) => Promise<T>
) {
  return async (request: RequestLike): Promise<T | ResponseLike> => {
    const token = extractBearerToken(request);
    if (!token) {
      return Response.json(
        { error: { message: 'Authentication required', code: 'NO_TOKEN' } },
        { status: 401 }
      );
    }

    const user = await handleVerifySession(authAdapter, { accessToken: token });
    if (!user) {
      return Response.json(
        { error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' } },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}
