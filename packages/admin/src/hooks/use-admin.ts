'use client';

import { useContext } from 'react';
import { AdminContext, type AdminContextValue } from '../context/admin-context';

/**
 * Hook to access the Admin context.
 * Must be used within an AdminProvider.
 *
 * @returns The admin context containing registry and apiBaseUrl
 * @throws Error if used outside of AdminProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { registry, apiBaseUrl } = useAdmin();
 *   const sections = registry.getAllSections();
 *   // ...
 * }
 * ```
 */
export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);

  if (context === null) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }

  return context;
}
