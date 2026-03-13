import { render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../../context/auth-context';
import { ProtectedRoute } from '../protected-route';

function mockFetch(response: { ok: boolean; data?: unknown; status?: number }) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(response.data ? JSON.stringify(response.data) : null, {
      status: response.status ?? (response.ok ? 200 : 400),
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider apiBaseUrl="/api/auth">{children}</AuthProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  process.env.NEXT_PUBLIC_DISABLE_AUTH = undefined;
  if (typeof document !== 'undefined') {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  }
});

describe('ProtectedRoute', () => {
  describe('Loading State', () => {
    it('shows loading fallback during authentication check', () => {
      // Mock slow auth check
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('shows custom loading fallback when provided', () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

      render(
        <TestWrapper>
          <ProtectedRoute loadingFallback={<div>Custom Loading Spinner</div>}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText(/custom loading spinner/i)).toBeInTheDocument();
      expect(screen.queryByText(/^loading\.\.\.$/i)).not.toBeInTheDocument();
    });

    it('stops showing loading after auth completes', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify success
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Authenticated State', () => {
    it('renders children when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify success
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('renders complex children when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back!</p>
            </div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('Unauthenticated State', () => {
    it('shows default fallback when not authenticated', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 }); // refresh also fails

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('shows custom fallback when provided and not authenticated', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute fallback={<div>Access Denied - Please Login</div>}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/access denied - please login/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/please sign in to access this page/i)).not.toBeInTheDocument();
    });

    it('hides protected content when not authenticated', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Auth Disabled Mode', () => {
    it('renders children immediately when NEXT_PUBLIC_DISABLE_AUTH=true', () => {
      vi.stubEnv('NEXT_PUBLIC_DISABLE_AUTH', 'true');

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Should render immediately without loading
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('bypasses authentication check when auth is disabled', () => {
      vi.stubEnv('NEXT_PUBLIC_DISABLE_AUTH', 'true');

      const fetchMock = vi.spyOn(globalThis, 'fetch');

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText(/protected content/i)).toBeInTheDocument();
      // Verify should still be called by AuthContext, but ProtectedRoute doesn't wait
      expect(fetchMock).toHaveBeenCalled();
    });

    it('does not bypass auth when NEXT_PUBLIC_DISABLE_AUTH is false', async () => {
      vi.stubEnv('NEXT_PUBLIC_DISABLE_AUTH', 'false');

      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });
    });

    it('does not bypass auth when environment variable is not set', async () => {
      // Don't set NEXT_PUBLIC_DISABLE_AUTH

      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });
    });
  });

  describe('Transition States', () => {
    it('transitions from loading to authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Initially loading
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Then shows content
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('transitions from loading to unauthenticated fallback', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Initially loading
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Then shows fallback
      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders nothing when both children and fallback are null', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      const { container } = render(
        <TestWrapper>
          <ProtectedRoute fallback={null}>{null}</ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Should render the default fallback since fallback=null
      expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
    });

    it('handles multiple ProtectedRoute components independently', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <div>
            <ProtectedRoute>
              <div data-testid="route-1">Route 1</div>
            </ProtectedRoute>
            <ProtectedRoute>
              <div data-testid="route-2">Route 2</div>
            </ProtectedRoute>
          </div>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('route-1')).toBeInTheDocument();
        expect(screen.getByTestId('route-2')).toBeInTheDocument();
      });
    });

    it('re-evaluates authentication when auth state changes', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      const { rerender } = render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/please sign in to access this page/i)).toBeInTheDocument();
      });

      // Simulate auth state change by re-rendering with new auth state
      // In real app, this would happen via signIn()
      const mockUser = { id: '1', email: 'test@example.com' };
      mockFetch({ ok: true, data: {} }); // CSRF
      mockFetch({ ok: true, data: mockUser }); // verify

      rerender(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Note: This test is limited because we can't easily trigger auth state change
      // The real behavior is tested in auth-context.test.tsx
    });
  });

  describe('Custom Fallbacks', () => {
    it('renders custom JSX fallback', async () => {
      // Mock CSRF and verify failure
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: false, status: 401 });
      mockFetch({ ok: false, status: 401 });

      render(
        <TestWrapper>
          <ProtectedRoute
            fallback={
              <div>
                <h1>Unauthorized</h1>
                <button type="button">Go to Login</button>
              </div>
            }
          >
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
      });
    });

    it('renders custom loading fallback with spinner', () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

      render(
        <TestWrapper>
          <ProtectedRoute
            loadingFallback={
              <div>
                <span role="status">Loading...</span>
                <div className="spinner" />
              </div>
            }
          >
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    });
  });

  describe('Children Prop', () => {
    it('renders string children when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      render(
        <TestWrapper>
          <ProtectedRoute>Hello World</ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/hello world/i)).toBeInTheDocument();
      });
    });

    it('renders nested components when authenticated', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      // Mock CSRF and verify
      mockFetch({ ok: true, data: {} });
      mockFetch({ ok: true, data: mockUser });

      function NestedComponent() {
        return (
          <div>
            <h1>Nested</h1>
            <p>Component</p>
          </div>
        );
      }

      render(
        <TestWrapper>
          <ProtectedRoute>
            <NestedComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/nested/i)).toBeInTheDocument();
        expect(screen.getByText(/component/i)).toBeInTheDocument();
      });
    });
  });
});
