import { SupabaseClient } from '@supabase/supabase-js';
import type {
  AuthAdapter,
  AuthUser,
  AuthSession,
  SignInWithOAuthInput,
  SignInWithPasswordInput,
  OAuthResponse,
  VerifySessionInput,
} from './types';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface SupabaseAuthAdapterConfig {
  client: SupabaseClient;
}

export class SupabaseAuthAdapter implements AuthAdapter {
  private client: SupabaseClient;

  constructor(config: SupabaseAuthAdapterConfig) {
    this.client = config.client;
  }

  private mapSupabaseUser(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): AuthUser {
    if (!user.email) {
      throw new AuthError('User email is required', 'INVALID_USER');
    }

    return {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    };
  }

  async signInWithOAuth(input: SignInWithOAuthInput): Promise<OAuthResponse> {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: input.provider,
      options: {
        redirectTo: input.redirectTo,
      },
    });

    if (error) {
      throw new AuthError(error.message, error.status?.toString(), error.message);
    }

    if (!data.url) {
      throw new AuthError('OAuth URL not provided', 'OAUTH_URL_MISSING');
    }

    return {
      url: data.url,
      provider: input.provider,
    };
  }

  async signInWithPassword(
    input: SignInWithPasswordInput
  ): Promise<AuthSession> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new AuthError(error.message, error.status?.toString(), error.message);
    }

    if (!data.session || !data.user) {
      throw new AuthError('Session or user not returned', 'AUTH_FAILED');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at
        ? new Date(data.session.expires_at * 1000)
        : undefined,
      user: this.mapSupabaseUser(data.user),
    };
  }

  async signOut(accessToken: string): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw new AuthError(error.message, error.status?.toString(), error.message);
    }
  }

  async verifySession(input: VerifySessionInput): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser(input.accessToken);

    if (error) {
      return null;
    }

    if (!data.user) {
      return null;
    }

    return this.mapSupabaseUser(data.user);
  }

  async refreshSession(refreshToken: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new AuthError(error.message, error.status?.toString(), error.message);
    }

    if (!data.session || !data.user) {
      throw new AuthError('Session refresh failed', 'REFRESH_FAILED');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at
        ? new Date(data.session.expires_at * 1000)
        : undefined,
      user: this.mapSupabaseUser(data.user),
    };
  }

  async getCurrentUser(accessToken: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser(accessToken);

    if (error) {
      return null;
    }

    if (!data.user) {
      return null;
    }

    return this.mapSupabaseUser(data.user);
  }
}

export function createAuthAdapter(
  config: SupabaseAuthAdapterConfig
): AuthAdapter {
  return new SupabaseAuthAdapter(config);
}
