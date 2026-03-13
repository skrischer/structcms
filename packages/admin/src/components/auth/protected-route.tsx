import type React from 'react';
import { useAuth } from '../../context/auth-context';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback, loadingFallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Bypass auth in test/dev mode
  const disableAuth =
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DISABLE_AUTH === 'true';
  if (disableAuth) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <>{loadingFallback || <div>Loading...</div>}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback || <div>Please sign in to access this page.</div>}</>;
  }

  return <>{children}</>;
}
