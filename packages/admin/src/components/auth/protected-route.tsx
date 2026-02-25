import React from 'react';
import { useAuth } from '../../context/auth-context';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  loadingFallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{loadingFallback || <div>Loading...</div>}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback || <div>Please sign in to access this page.</div>}</>;
  }

  return <>{children}</>;
}
