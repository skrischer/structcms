import { describe, it, expect } from 'vitest';
import {
  handleSignInWithOAuth,
  handleSignInWithPassword,
  handleSignOut,
  handleVerifySession,
  handleRefreshSession,
  handleGetCurrentUser,
  AuthValidationError,
} from './handlers';
import type {
  AuthAdapter,
  AuthUser,
  AuthSession,
  SignInWithOAuthInput,
  SignInWithPasswordInput,
  VerifySessionInput,
} from './types';

const testUser: AuthUser = {
  id: 'user-123',
  email: 'test@example.com',
  metadata: { name: 'Test User' },
};

const testSession: AuthSession = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-123',
  expiresAt: new Date('2026-01-01T00:00:00Z'),
  user: testUser,
};

function createMockAuthAdapter(): AuthAdapter {
  return {
    signInWithOAuth: async (input: SignInWithOAuthInput) => ({
      url: `https://oauth.provider.com/auth?provider=${input.provider}`,
      provider: input.provider,
    }),
    signInWithPassword: async (input: SignInWithPasswordInput) => {
      if (input.email === 'wrong@example.com') {
        throw new Error('Invalid credentials');
      }
      return testSession;
    },
    signOut: async () => {},
    verifySession: async (input: VerifySessionInput) => {
      if (input.accessToken === 'invalid-token') {
        return null;
      }
      return testUser;
    },
    refreshSession: async (refreshToken: string) => {
      if (refreshToken === 'invalid-refresh') {
        throw new Error('Invalid refresh token');
      }
      return testSession;
    },
    getCurrentUser: async (accessToken: string) => {
      if (accessToken === 'invalid-token') {
        return null;
      }
      return testUser;
    },
  };
}

describe('handleSignInWithOAuth', () => {
  const adapter = createMockAuthAdapter();

  it('should initiate OAuth flow with valid provider', async () => {
    const result = await handleSignInWithOAuth(adapter, {
      provider: 'google',
      redirectTo: '/admin',
    });

    expect(result.provider).toBe('google');
    expect(result.url).toContain('google');
  });

  it('should throw validation error when provider is missing', async () => {
    await expect(
      handleSignInWithOAuth(adapter, {} as SignInWithOAuthInput)
    ).rejects.toThrow(AuthValidationError);
  });

  it('should throw validation error for invalid provider', async () => {
    await expect(
      handleSignInWithOAuth(adapter, {
        provider: 'invalid' as 'google',
      })
    ).rejects.toThrow(AuthValidationError);
  });

  it('should support all valid OAuth providers', async () => {
    const providers = ['google', 'github', 'gitlab', 'azure', 'bitbucket'] as const;

    for (const provider of providers) {
      const result = await handleSignInWithOAuth(adapter, { provider });
      expect(result.provider).toBe(provider);
    }
  });
});

describe('handleSignInWithPassword', () => {
  const adapter = createMockAuthAdapter();

  it('should sign in with valid credentials', async () => {
    const result = await handleSignInWithPassword(adapter, {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeDefined();
  });

  it('should throw validation error when email is missing', async () => {
    await expect(
      handleSignInWithPassword(adapter, {
        email: '',
        password: 'password123',
      })
    ).rejects.toThrow(AuthValidationError);
  });

  it('should throw validation error when password is missing', async () => {
    await expect(
      handleSignInWithPassword(adapter, {
        email: 'test@example.com',
        password: '',
      })
    ).rejects.toThrow(AuthValidationError);
  });

  it('should throw validation error for invalid email format', async () => {
    await expect(
      handleSignInWithPassword(adapter, {
        email: 'invalid-email',
        password: 'password123',
      })
    ).rejects.toThrow(AuthValidationError);
  });

  it('should throw validation error for short password', async () => {
    await expect(
      handleSignInWithPassword(adapter, {
        email: 'test@example.com',
        password: '12345',
      })
    ).rejects.toThrow('Password must be at least 6 characters');
  });
});

describe('handleSignOut', () => {
  const adapter = createMockAuthAdapter();

  it('should sign out with valid token', async () => {
    await expect(
      handleSignOut(adapter, 'valid-token')
    ).resolves.toBeUndefined();
  });

  it('should throw validation error when token is missing', async () => {
    await expect(
      handleSignOut(adapter, '')
    ).rejects.toThrow(AuthValidationError);
  });
});

describe('handleVerifySession', () => {
  const adapter = createMockAuthAdapter();

  it('should verify valid session', async () => {
    const result = await handleVerifySession(adapter, {
      accessToken: 'valid-token',
    });

    expect(result).toEqual(testUser);
  });

  it('should return null for invalid token', async () => {
    const result = await handleVerifySession(adapter, {
      accessToken: 'invalid-token',
    });

    expect(result).toBeNull();
  });

  it('should throw validation error when token is missing', async () => {
    await expect(
      handleVerifySession(adapter, { accessToken: '' })
    ).rejects.toThrow(AuthValidationError);
  });
});

describe('handleRefreshSession', () => {
  const adapter = createMockAuthAdapter();

  it('should refresh session with valid token', async () => {
    const result = await handleRefreshSession(adapter, 'valid-refresh-token');

    expect(result.accessToken).toBeDefined();
    expect(result.user).toEqual(testUser);
  });

  it('should throw validation error when token is missing', async () => {
    await expect(
      handleRefreshSession(adapter, '')
    ).rejects.toThrow(AuthValidationError);
  });
});

describe('handleGetCurrentUser', () => {
  const adapter = createMockAuthAdapter();

  it('should get current user with valid token', async () => {
    const result = await handleGetCurrentUser(adapter, 'valid-token');

    expect(result).toEqual(testUser);
  });

  it('should return null for invalid token', async () => {
    const result = await handleGetCurrentUser(adapter, 'invalid-token');

    expect(result).toBeNull();
  });

  it('should throw validation error when token is missing', async () => {
    await expect(
      handleGetCurrentUser(adapter, '')
    ).rejects.toThrow(AuthValidationError);
  });
});
