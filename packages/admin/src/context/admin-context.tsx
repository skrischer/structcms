'use client';

import { createContext, type ReactNode } from 'react';
import { type Registry } from '@structcms/core';
import { ToastProvider } from '../components/ui/toast';

/**
 * Configuration for the Admin context
 */
export interface AdminContextValue {
  registry: Registry;
  apiBaseUrl: string;
}

/**
 * Props for the AdminProvider component
 */
export interface AdminProviderProps {
  children: ReactNode;
  registry: Registry;
  apiBaseUrl?: string;
}

const DEFAULT_API_BASE_URL = '/api/cms';

export const AdminContext = createContext<AdminContextValue | null>(null);

/**
 * Provider component that makes registry and API configuration available to all admin components.
 *
 * @example
 * ```tsx
 * import { AdminProvider } from '@structcms/admin';
 * import { registry } from './registry';
 *
 * export default function AdminLayout({ children }) {
 *   return (
 *     <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *       {children}
 *     </AdminProvider>
 *   );
 * }
 * ```
 */
export function AdminProvider({
  children,
  registry,
  apiBaseUrl = DEFAULT_API_BASE_URL,
}: AdminProviderProps) {
  const value: AdminContextValue = {
    registry,
    apiBaseUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      <ToastProvider>{children}</ToastProvider>
    </AdminContext.Provider>
  );
}
