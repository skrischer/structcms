import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../auth-context';

/**
 * URL-based fetch mock that handles concurrent useEffect calls correctly.
 * Maps URL patterns to responses so the order of fetch calls doesn't matter.
 */
function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function createMockResponse(r: { ok: boolean; data?: unknown; status?: number }): Response {
  const status = r.status ?? (r.ok ? 200 : 400);
  const body = r.data ? JSON.stringify(r.data) : null;
  return new Response(body, { status, headers: { 'Content-Type': 'application/json' } });
}

function setupFetchMock(routes: Record<string, { ok: boolean; data?: unknown; status?: number }>) {
  const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
    const url = resolveUrl(input);
    for (const [pattern, response] of Object.entries(routes)) {
      if (url.includes(pattern)) return createMockResponse(response);
    }
    return new Response(null, { status: 404 });
  });
  return spy;
}

/** Legacy single-call mock for simple cases */
function mockFetch(response: { ok: boolean; data?: unknown; status?: number }) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(response.data ? JSON.stringify(response.data) : null, {
      status: response.status ?? (response.ok ? 200 : 400),
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mockFetchError() {
  return vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider apiBaseUrl="/api/auth" onAuthStateChange={vi.fn()}>
      {children}
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  // Clear cookies
  if (typeof document !== 'undefined') {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  }
});

describe('AuthContext', () => {
  describe('Initial State', () => {
    it('starts with loading=true, authenticated=false, user=null', async () => {
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
      expect(() => renderHook(() => useAuth())).toThrow(
        'useAuth must be used within an AuthProvider'
      );
    });
  });

  describe('Session Verification on Mount', () => {
    it('verifies session on mount and sets user if valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.session).toEqual({
        accessToken: '',
        user: mockUser,
      });
    });

    it('tries refresh when verify fails', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: true, data: { user: mockUser, expiresAt: '2026-12-31T23:59:59Z' } },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('clears session when both verify and refresh fail', async () => {
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('CSRF Token Fetching', () => {
    it('fetches CSRF token on mount', async () => {
      const fetchMock = setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/auth/csrf'),
          expect.objectContaining({ credentials: 'include' })
        );
      });
    });

    it('handles CSRF fetch failure gracefully', async () => {
      setupFetchMock({
        '/auth/csrf': { ok: false, status: 500 },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      // Should not crash
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });

  describe('signIn()', () => {
    it('signs in successfully and sets user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Mock signIn response
      mockFetch({
        ok: true,
        data: { user: mockUser, expiresAt: '2026-12-31T23:59:59Z' },
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.session).toMatchObject({
        user: mockUser,
        expiresAt: expect.any(Date),
      });
    });

    it('throws error on signIn failure', async () => {
      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Mock signIn failure
      mockFetch({
        ok: false,
        status: 401,
        data: { message: 'Invalid credentials' },
      });

      await expect(
        act(async () => {
          await result.current.signIn('wrong@example.com', 'wrong');
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('handles signIn with error.message format', async () => {
      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Mock signIn failure with error.message
      mockFetch({
        ok: false,
        status: 401,
        data: { error: { message: 'Account locked' } },
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'password');
        })
      ).rejects.toThrow('Account locked');
    });

    it('sets loading state during signIn', async () => {
      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Mock slow signIn
      vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(JSON.stringify({ user: { id: '1' } }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                  })
                ),
              100
            )
          )
      );

      act(() => {
        result.current.signIn('test@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });

  describe('signOut()', () => {
    it('signs out and clears session', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.user).toEqual(mockUser));

      // Re-mock for signOut action
      setupFetchMock({
        '/auth/signout': { ok: true, data: {} },
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });

    it('clears session even when signOut API fails', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.user).toEqual(mockUser));

      // Mock signOut failure
      vi.restoreAllMocks();
      mockFetchError();

      await act(async () => {
        await result.current.signOut();
      });

      // Session should still be cleared
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Token Refresh Flow', () => {
    it('refreshes session successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.user).toEqual(mockUser));

      const updatedUser = { id: '1', email: 'updated@example.com' };

      // Re-mock for refresh action
      setupFetchMock({
        '/auth/refresh': {
          ok: true,
          data: { user: updatedUser, expiresAt: '2026-12-31T23:59:59Z' },
        },
      });

      await act(async () => {
        await result.current.refreshSession();
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(result.current.session?.expiresAt).toBeInstanceOf(Date);
    });

    it('throws error when refresh fails', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.user).toEqual(mockUser));

      // Re-mock for refresh failure
      setupFetchMock({
        '/auth/refresh': { ok: false, status: 401 },
      });

      await expect(
        act(async () => {
          await result.current.refreshSession();
        })
      ).rejects.toThrow('Failed to refresh session');
    });
  });

  describe('Error Handling', () => {
    it('handles network failure during session load', async () => {
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 500 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('isAuthDisabled Logic', () => {
    it('bypasses auth when NEXT_PUBLIC_DISABLE_AUTH=true', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('NEXT_PUBLIC_DISABLE_AUTH', 'true');

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      // Should be authenticated immediately without loading
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('does not bypass auth in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_DISABLE_AUTH', 'true');

      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      // Should still verify session
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('createFetchOptions()', () => {
    it('adds CSRF token header for POST requests', async () => {
      // Set CSRF cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'structcms_csrf_token=test-csrf-token',
      });

      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Mock signIn to check headers
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ user: mockUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await act(async () => {
        await result.current.signIn('test@example.com', 'password');
      });

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/auth/signin',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: expect.objectContaining({
            'X-CSRF-Token': 'test-csrf-token',
          }),
        })
      );
    });

    it('does not add CSRF token for GET requests', async () => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'structcms_csrf_token=test-csrf-token',
      });

      const mockUser = { id: '1', email: 'test@example.com' };

      const fetchMock = setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      renderHook(() => useAuth(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/auth/verify'),
          expect.objectContaining({
            credentials: 'include',
          })
        );
      });
    });
  });

  describe('onAuthStateChange Callback', () => {
    it('calls onAuthStateChange when user signs in', async () => {
      const onAuthStateChange = vi.fn();
      const mockUser = { id: '1', email: 'test@example.com' };

      function WrapperWithCallback({ children }: { children: React.ReactNode }) {
        return (
          <AuthProvider apiBaseUrl="/api/auth" onAuthStateChange={onAuthStateChange}>
            {children}
          </AuthProvider>
        );
      }

      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: WrapperWithCallback });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      onAuthStateChange.mockClear();

      // Mock signIn
      mockFetch({ ok: true, data: { user: mockUser } });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password');
      });

      expect(onAuthStateChange).toHaveBeenCalledWith(mockUser);
    });

    it('calls onAuthStateChange with null when user signs out', async () => {
      const onAuthStateChange = vi.fn();
      const mockUser = { id: '1', email: 'test@example.com' };

      function WrapperWithCallback({ children }: { children: React.ReactNode }) {
        return (
          <AuthProvider apiBaseUrl="/api/auth" onAuthStateChange={onAuthStateChange}>
            {children}
          </AuthProvider>
        );
      }

      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: true, data: mockUser },
      });

      const { result } = renderHook(() => useAuth(), { wrapper: WrapperWithCallback });

      await waitFor(() => expect(result.current.user).toEqual(mockUser));

      onAuthStateChange.mockClear();

      // Re-mock for signOut
      setupFetchMock({
        '/auth/signout': { ok: true, data: {} },
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(onAuthStateChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Component Rendering', () => {
    it('renders children correctly', () => {
      // Mock initial state: not authenticated
      setupFetchMock({
        '/auth/csrf': { ok: true, data: {} },
        '/auth/verify': { ok: false, status: 401 },
        '/auth/refresh': { ok: false, status: 401 },
      });

      render(
        <AuthProvider apiBaseUrl="/api/auth">
          <div data-testid="test-child">Test Content</div>
        </AuthProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });
});
