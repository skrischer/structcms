import { useCallback, useState } from 'react';
import type { View } from '../components/app/struct-cms-admin-app';
import type { SidebarNavItem } from '../components/layout/admin-layout';

export interface UseNavigationResult {
  currentView: View;
  setView: (view: View) => void;
  handleNavigate: (path: string) => void;
  buildNavItems: (customNavItems: SidebarNavItem[]) => SidebarNavItem[];
}

/**
 * Hook for managing navigation state and path-to-view conversion.
 *
 * @returns Object with currentView, setView, handleNavigate, and buildNavItems
 */
export function useNavigation(): UseNavigationResult {
  const [currentView, setCurrentView] = useState<View>({ type: 'dashboard' });

  const handleNavigate = useCallback((path: string) => {
    if (path === '/') {
      setCurrentView({ type: 'dashboard' });
    } else if (path === '/pages') {
      setCurrentView({ type: 'pages' });
    } else if (path === '/media') {
      setCurrentView({ type: 'media' });
    } else if (path === '/navigation') {
      setCurrentView({ type: 'navigation' });
    } else {
      setCurrentView({ type: 'custom', path });
    }
  }, []);

  const buildNavItems = useCallback((customNavItems: SidebarNavItem[]): SidebarNavItem[] => {
    const defaultNavItems: SidebarNavItem[] = [
      { label: 'Dashboard', path: '/' },
      { label: 'Pages', path: '/pages' },
      { label: 'Navigation', path: '/navigation' },
      { label: 'Media', path: '/media' },
    ];

    return [...defaultNavItems, ...customNavItems];
  }, []);

  return {
    currentView,
    setView: setCurrentView,
    handleNavigate,
    buildNavItems,
  };
}
