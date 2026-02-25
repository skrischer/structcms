import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuthAdapter, AuthError } from './supabase-adapter';

interface MockSupabaseClient {
  auth: {
    signInWithOAuth: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    refreshSession: ReturnType<typeof vi.fn>;
  };
}

function createMockSupabaseClient(): MockSupabaseClient {
  return {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
    },
  };
}

describe('SupabaseAuthAdapter', () => {
  let mockClient: MockSupabaseClient;
  let adapter: SupabaseAuthAdapter;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    adapter = new SupabaseAuthAdapter({ client: mockClient as any });
  });

  describe('signInWithOAuth', () => {
    it('should initiate OAuth flow', async () => {
      mockClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth.provider.com/auth', provider: 'google' } as any,
        error: null,
      });

      const result = await adapter.signInWithOAuth({
        provider: 'google',
        redirectTo: '/admin',
      });

      expect(result.url).toBe('https://oauth.provider.com/auth');
      expect(result.provider).toBe('google');
      expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: '/admin' },
      });
    });

    it('should throw AuthError when OAuth fails', async () => {
      mockClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: '', provider: 'google' } as any,
        error: { message: 'OAuth failed' } as any,
      });

      await expect(
        adapter.signInWithOAuth({ provider: 'google' })
      ).rejects.toThrow(AuthError);
    });

    it('should throw AuthError when URL is missing', async () => {
      mockClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: '', provider: 'google' } as any,
        error: null,
      });

      await expect(
        adapter.signInWithOAuth({ provider: 'google' })
      ).rejects.toThrow('OAuth URL not provided');
    });
  });

  describe('signInWithPassword', () => {
    it('should sign in with valid credentials', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_at: 1735689600,
          } as any,
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' },
          } as any,
        },
        error: null,
      });

      const result = await adapter.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.id).toBe('user-123');
    });

    it('should throw AuthError on invalid credentials', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null } as any,
        error: { message: 'Invalid credentials' } as any,
      });

      await expect(
        adapter.signInWithPassword({
          email: 'wrong@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow(AuthError);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      await expect(
        adapter.signOut('access-token')
      ).resolves.toBeUndefined();
    });

    it('should throw AuthError on signout failure', async () => {
      mockClient.auth.signOut.mockResolvedValue({
        error: { message: 'Signout failed' } as any,
      });

      await expect(
        adapter.signOut('access-token')
      ).rejects.toThrow(AuthError);
    });
  });

  describe('verifySession', () => {
    it('should verify valid session', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: {},
          } as any,
        },
        error: null,
      });

      const result = await adapter.verifySession({
        accessToken: 'valid-token',
      });

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null for invalid session', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null } as any,
        error: { message: 'Invalid token' } as any,
      });

      const result = await adapter.verifySession({
        accessToken: 'invalid-token',
      });

      expect(result).toBeNull();
    });
  });

  describe('refreshSession', () => {
    it('should refresh session successfully', async () => {
      mockClient.auth.refreshSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_at: 1735689600,
          } as any,
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: {},
          } as any,
        },
        error: null,
      });

      const result = await adapter.refreshSession('refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw AuthError on refresh failure', async () => {
      mockClient.auth.refreshSession.mockResolvedValue({
        data: { session: null, user: null } as any,
        error: { message: 'Refresh failed' } as any,
      });

      await expect(
        adapter.refreshSession('invalid-refresh')
      ).rejects.toThrow(AuthError);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' },
          } as any,
        },
        error: null,
      });

      const result = await adapter.getCurrentUser('access-token');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
      expect(result?.metadata?.name).toBe('Test User');
    });

    it('should return null when user not found', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null } as any,
        error: { message: 'User not found' } as any,
      });

      const result = await adapter.getCurrentUser('invalid-token');

      expect(result).toBeNull();
    });
  });
});
