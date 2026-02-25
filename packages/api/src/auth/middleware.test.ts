import { describe, it, expect, vi } from 'vitest';
import { createAuthMiddleware } from './middleware';
import type { AuthAdapter, AuthUser } from './types';

function createMockAuthAdapter(user: AuthUser | null = null): AuthAdapter {
  return {
    signInWithOAuth: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    verifySession: vi.fn().mockResolvedValue(user),
    refreshSession: vi.fn(),
    getCurrentUser: vi.fn(),
  };
}

describe('createAuthMiddleware', () => {
  const testUser: AuthUser = {
    id: 'user-123',
    email: 'test@example.com',
    metadata: {},
  };

  it('should authenticate valid Bearer token', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      authorization: 'Bearer valid-token',
    };

    const result = await authenticate(headers);

    expect(result.user).toEqual(testUser);
    expect(result.accessToken).toBe('valid-token');
    expect(adapter.verifySession).toHaveBeenCalledWith({
      accessToken: 'valid-token',
    });
  });

  it('should handle Authorization header with capital A', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      Authorization: 'Bearer valid-token',
    };

    const result = await authenticate(headers);

    expect(result.user).toEqual(testUser);
    expect(result.accessToken).toBe('valid-token');
  });

  it('should throw error when no token provided', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {};

    await expect(authenticate(headers)).rejects.toThrow(
      'No authentication token provided'
    );
  });

  it('should throw error when token format is invalid', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      authorization: 'InvalidFormat token',
    };

    await expect(authenticate(headers)).rejects.toThrow(
      'No authentication token provided'
    );
  });

  it('should throw error when token is invalid', async () => {
    const adapter = createMockAuthAdapter(null);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      authorization: 'Bearer invalid-token',
    };

    await expect(authenticate(headers)).rejects.toThrow(
      'Invalid or expired token'
    );
  });

  it('should support custom token extraction', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({
      adapter,
      extractToken: (headers) => headers['x-custom-token'] ?? null,
    });

    const headers = {
      'x-custom-token': 'custom-token-value',
    };

    const result = await authenticate(headers);

    expect(result.user).toEqual(testUser);
    expect(result.accessToken).toBe('custom-token-value');
  });

  it('should handle missing Bearer prefix', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      authorization: 'just-a-token',
    };

    await expect(authenticate(headers)).rejects.toThrow(
      'No authentication token provided'
    );
  });

  it('should handle empty Bearer token', async () => {
    const adapter = createMockAuthAdapter(testUser);
    const authenticate = createAuthMiddleware({ adapter });

    const headers = {
      authorization: 'Bearer ',
    };

    await expect(authenticate(headers)).rejects.toThrow(
      'No authentication token provided'
    );
  });
});
