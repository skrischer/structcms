import type { AuthSession, AuthUser } from '@structcms/api';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
  apiBaseUrl: string;
  onAuthStateChange?: (user: AuthUser | null) => void;
}

/**
 * Get CSRF token from cookie
 */
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/structcms_csrf_token=([^;]+)/);
  return match?.[1] ?? null;
}

/**
 * Create fetch options with CSRF token and credentials
 */
function createFetchOptions(method: string, body?: object): RequestInit {
  const options: RequestInit = {
    method,
    credentials: 'include', // Always send cookies
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add CSRF token for non-GET requests
  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      (options.headers as Record<string, string>)['X-CSRF-Token'] = csrfToken;
    }
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

export function AuthProvider({ children, apiBaseUrl, onAuthStateChange }: AuthProviderProps) {
  // Auth bypass only in development
  const isAuthDisabled =
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true' ||
      // biome-ignore lint/suspicious/noExplicitAny: Next.js internal data structure
      (window as any).__NEXT_DATA__?.props?.pageProps?.disableAuth === true);

  if (isAuthDisabled) {
    console.warn('⚠️  WARNING: Authentication is DISABLED. This should only be used in development!');
  }

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(!isAuthDisabled);

  const clearSession = useCallback(() => {
    setUser(null);
    setSession(null);
    onAuthStateChange?.(null);
  }, [onAuthStateChange]);

  const tryRefreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshResponse = await fetch(
        `${apiBaseUrl}/auth/refresh`,
        createFetchOptions('POST')
      );

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        // Session tokens are now in httpOnly cookies, we only get user data
        setSession({
          accessToken: '', // Not accessible from client
          user: data.user,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        });
        setUser(data.user);
        onAuthStateChange?.(data.user);
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
    return false;
  }, [apiBaseUrl, onAuthStateChange]);

  const loadSession = useCallback(async () => {
    if (isAuthDisabled) {
      setIsLoading(false);
      return;
    }

    try {
      // Verify session using httpOnly cookie
      const response = await fetch(
        `${apiBaseUrl}/auth/verify`,
        createFetchOptions('POST')
      );

      if (!response.ok) {
        // Try to refresh session
        const refreshed = await tryRefreshSession();
        if (!refreshed) {
          clearSession();
        }
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setSession({
        accessToken: '', // Not accessible from client
        user: userData,
      });
      onAuthStateChange?.(userData);
    } catch (error) {
      console.error('Failed to load session:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, onAuthStateChange, isAuthDisabled, tryRefreshSession, clearSession]);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await fetch(`${apiBaseUrl}/auth/csrf`, {
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, [apiBaseUrl]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/auth/signin`,
          createFetchOptions('POST', { email, password })
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || error.message || 'Sign in failed');
        }

        const data = await response.json();
        // Tokens are now in httpOnly cookies
        setSession({
          accessToken: '', // Not accessible from client
          user: data.user,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        });
        setUser(data.user);
        onAuthStateChange?.(data.user);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, onAuthStateChange]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch(
        `${apiBaseUrl}/auth/signout`,
        createFetchOptions('POST')
      );
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      clearSession();
      setIsLoading(false);
    }
  }, [apiBaseUrl, clearSession]);

  const refreshSession = useCallback(async () => {
    const response = await fetch(
      `${apiBaseUrl}/auth/refresh`,
      createFetchOptions('POST')
    );

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    const data = await response.json();
    setSession({
      accessToken: '', // Not accessible from client
      user: data.user,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });
    setUser(data.user);
    onAuthStateChange?.(data.user);
  }, [apiBaseUrl, onAuthStateChange]);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: isAuthDisabled || !!user,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
