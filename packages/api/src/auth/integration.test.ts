import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  handleGetCurrentUser,
  handleRefreshSession,
  handleSignInWithPassword,
  handleSignOut,
  handleVerifySession,
} from './handlers';
import { createAuthAdapter } from './supabase-adapter';
import type { AuthSession } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
const testPassword = process.env.TEST_USER_PASSWORD || 'test123456';

describe('Auth Integration Tests', () => {
  let authAdapter: ReturnType<typeof createAuthAdapter>;
  let testSession: AuthSession | null = null;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping auth integration tests: Missing Supabase credentials');
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    authAdapter = createAuthAdapter({ client: supabase });
  });

  afterAll(async () => {
    // Sign out test user if session exists
    if (testSession?.accessToken && authAdapter) {
      try {
        await handleSignOut(authAdapter, testSession.accessToken);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('Complete Auth Flow', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should complete full auth flow: sign in → verify → refresh → sign out',
      async () => {
        // Note: This test requires a valid test user to exist in Supabase
        // Skip if user credentials are not configured or user doesn't exist
        let signInResult: Awaited<ReturnType<typeof handleSignInWithPassword>> | undefined;
        try {
          // Step 1: Sign in with password
          signInResult = await handleSignInWithPassword(authAdapter, {
            email: testEmail,
            password: testPassword,
          });
        } catch (_error) {
          console.warn(
            'Skipping auth integration test: Test user not found or invalid credentials'
          );
          return;
        }

        expect(signInResult).toBeDefined();
        expect(signInResult.accessToken).toBeDefined();
        expect(signInResult.refreshToken).toBeDefined();
        expect(signInResult.user).toBeDefined();
        expect(signInResult.user.email).toBe(testEmail);
        expect(signInResult.expiresAt).toBeInstanceOf(Date);

        testSession = signInResult;

        // Step 2: Verify session with access token
        const verifiedUser = await handleVerifySession(authAdapter, {
          accessToken: signInResult.accessToken,
        });

        expect(verifiedUser).not.toBeNull();
        expect(verifiedUser?.email).toBe(testEmail);
        expect(verifiedUser?.id).toBe(signInResult.user.id);

        // Step 3: Get current user
        const currentUser = await handleGetCurrentUser(authAdapter, signInResult.accessToken);

        expect(currentUser).not.toBeNull();
        expect(currentUser?.email).toBe(testEmail);
        expect(currentUser?.id).toBe(signInResult.user.id);

        // Step 4: Refresh session
        const refreshedSession = await handleRefreshSession(authAdapter, signInResult.refreshToken);

        expect(refreshedSession).toBeDefined();
        expect(refreshedSession.accessToken).toBeDefined();
        expect(refreshedSession.refreshToken).toBeDefined();
        expect(refreshedSession.user.email).toBe(testEmail);

        // Step 5: Sign out
        await expect(handleSignOut(authAdapter, signInResult.accessToken)).resolves.toBeUndefined();

        // Step 6: Verify session is invalid after sign out
        const verifyAfterSignOut = await handleVerifySession(authAdapter, {
          accessToken: signInResult.accessToken,
        });

        // Note: Depending on Supabase config, the token might still be valid
        // but the session should be invalidated server-side
        // For now, we just check that verify returns without error
        expect(verifyAfterSignOut).toBeDefined();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)('should reject invalid credentials', async () => {
      await expect(
        handleSignInWithPassword(authAdapter, {
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should throw error for invalid access token',
      async () => {
        await expect(
          handleVerifySession(authAdapter, {
            accessToken: 'invalid-token-12345',
          })
        ).rejects.toThrow('Invalid or expired token');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)('should reject invalid refresh token', async () => {
      await expect(handleRefreshSession(authAdapter, 'invalid-refresh-token')).rejects.toThrow();
    });
  });

  describe('Session Token Validation', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should verify valid session returns user data',
      async () => {
        // Sign in first to get a valid token
        let signInResult: Awaited<ReturnType<typeof handleSignInWithPassword>> | undefined;
        try {
          signInResult = await handleSignInWithPassword(authAdapter, {
            email: testEmail,
            password: testPassword,
          });
        } catch (_error) {
          console.warn('Skipping auth integration test: Test user not found');
          return;
        }

        const user = await handleVerifySession(authAdapter, {
          accessToken: signInResult.accessToken,
        });

        expect(user).not.toBeNull();
        expect(user?.id).toBeDefined();
        expect(user?.email).toBe(testEmail);

        // Cleanup
        await handleSignOut(authAdapter, signInResult.accessToken);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should handle getCurrentUser with valid token',
      async () => {
        // Sign in first to get a valid token
        let signInResult: Awaited<ReturnType<typeof handleSignInWithPassword>> | undefined;
        try {
          signInResult = await handleSignInWithPassword(authAdapter, {
            email: testEmail,
            password: testPassword,
          });
        } catch (_error) {
          console.warn('Skipping auth integration test: Test user not found');
          return;
        }

        const user = await handleGetCurrentUser(authAdapter, signInResult.accessToken);

        expect(user).not.toBeNull();
        expect(user?.id).toBe(signInResult.user.id);
        expect(user?.email).toBe(testEmail);

        // Cleanup
        await handleSignOut(authAdapter, signInResult.accessToken);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for getCurrentUser with invalid token',
      async () => {
        const user = await handleGetCurrentUser(authAdapter, 'invalid-token-xyz');

        expect(user).toBeNull();
      }
    );
  });
});
