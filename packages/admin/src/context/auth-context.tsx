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

export function AuthProvider({ children, apiBaseUrl, onAuthStateChange }: AuthProviderProps) {
  const isAuthDisabled =
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true' ||
      // biome-ignore lint/suspicious/noExplicitAny: Next.js internal data structure
      (window as any).__NEXT_DATA__?.props?.pageProps?.disableAuth === true);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(!isAuthDisabled);

  const clearSession = useCallback(() => {
    localStorage.removeItem('structcms_access_token');
    localStorage.removeItem('structcms_refresh_token');
    setUser(null);
    setSession(null);
    onAuthStateChange?.(null);
  }, [onAuthStateChange]);

  const tryRefreshSession = useCallback(
    async (refreshToken: string): Promise<boolean> => {
      try {
        const refreshResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const newSession = await refreshResponse.json();
          localStorage.setItem('structcms_access_token', newSession.accessToken);
          if (newSession.refreshToken) {
            localStorage.setItem('structcms_refresh_token', newSession.refreshToken);
          }
          setSession(newSession);
          setUser(newSession.user);
          onAuthStateChange?.(newSession.user);
          return true;
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
      return false;
    },
    [apiBaseUrl, onAuthStateChange]
  );

  const loadSession = useCallback(async () => {
    if (isAuthDisabled) {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem('structcms_access_token');
    const storedRefreshToken = localStorage.getItem('structcms_refresh_token');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        const refreshed = storedRefreshToken && (await tryRefreshSession(storedRefreshToken));
        if (!refreshed) {
          clearSession();
        }
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setSession({
        accessToken: storedToken,
        refreshToken: storedRefreshToken || undefined,
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

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Sign in failed');
        }

        const newSession: AuthSession = await response.json();
        localStorage.setItem('structcms_access_token', newSession.accessToken);
        if (newSession.refreshToken) {
          localStorage.setItem('structcms_refresh_token', newSession.refreshToken);
        }
        setSession(newSession);
        setUser(newSession.user);
        onAuthStateChange?.(newSession.user);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, onAuthStateChange]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      if (session?.accessToken) {
        await fetch(`${apiBaseUrl}/auth/signout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('structcms_access_token');
      localStorage.removeItem('structcms_refresh_token');
      setUser(null);
      setSession(null);
      onAuthStateChange?.(null);
      setIsLoading(false);
    }
  }, [apiBaseUrl, session, onAuthStateChange]);

  const refreshSession = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('structcms_refresh_token');
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    const newSession: AuthSession = await response.json();
    localStorage.setItem('structcms_access_token', newSession.accessToken);
    if (newSession.refreshToken) {
      localStorage.setItem('structcms_refresh_token', newSession.refreshToken);
    }
    setSession(newSession);
    setUser(newSession.user);
    onAuthStateChange?.(newSession.user);
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
