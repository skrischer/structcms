import type { NavigationItem, SectionData } from '@structcms/core';
import { useEffect, useState } from 'react';
import type { View } from '../components/app/struct-cms-admin-app';
import { useApiClient } from './use-api-client';

export interface NavigationData {
  id: string;
  name: string;
  items: NavigationItem[];
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  sections: SectionData[];
}

export interface UsePageDataResult {
  pageData: PageData | null;
  pageLoading: boolean;
  pageError: string | null;
}

export interface UseNavigationDataResult {
  navigationData: NavigationData | null;
  navigationLoading: boolean;
  navigationError: string | null;
  setNavigationData: (data: NavigationData | null) => void;
}

/**
 * Hook for fetching page data based on current view.
 *
 * @param currentView - Current view state
 * @returns Object with pageData, pageLoading, and pageError
 */
export function usePageData(currentView: View): UsePageDataResult {
  const apiClient = useApiClient();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (currentView.type !== 'page-editor') {
      return;
    }

    const pageId = currentView.pageId;
    if (!pageId) {
      return;
    }

    const fetchPage = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const response = await apiClient.get<PageData>(`/pages/id/${pageId}`);
        if (response.error) {
          setPageError(response.error.message);
        } else if (response.data) {
          setPageData(response.data);
        }
      } catch (err) {
        setPageError('Failed to load page');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchPage();
  }, [currentView, apiClient]);

  return { pageData, pageLoading, pageError };
}

/**
 * Hook for fetching navigation data based on current view.
 *
 * @param currentView - Current view state
 * @returns Object with navigationData, navigationLoading, navigationError, and setNavigationData
 */
export function useNavigationData(currentView: View): UseNavigationDataResult {
  const apiClient = useApiClient();
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  useEffect(() => {
    if (currentView.type !== 'navigation') {
      return;
    }

    const fetchNavigation = async () => {
      setNavigationLoading(true);
      setNavigationError(null);
      try {
        const response = await apiClient.get<NavigationData>('/navigation/main');
        if (response.error) {
          setNavigationError(response.error.message);
        } else if (response.data) {
          setNavigationData(response.data);
        }
      } catch (err) {
        setNavigationError('Failed to load navigation');
        console.error(err);
      } finally {
        setNavigationLoading(false);
      }
    };

    fetchNavigation();
  }, [currentView.type, apiClient]);

  return { navigationData, navigationLoading, navigationError, setNavigationData };
}
