import type { NavigationItem, Registry, SectionData } from '@structcms/core';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AdminProvider } from '../../context/admin-context';
import { useApiClient } from '../../hooks/use-api-client';
import { NavigationEditor } from '../content/navigation-editor';
import { PageList, type PageSummary } from '../content/page-list';
import { DashboardPage } from '../dashboard/dashboard-page';
import { PageEditor } from '../editors/page-editor';
import { AdminLayout, type SidebarNavItem } from '../layout/admin-layout';
import { MediaBrowser } from '../media/media-browser';
import { Skeleton } from '../ui/skeleton';

export interface StructCMSAdminAppProps {
  registry: Registry;
  apiBaseUrl?: string;
  className?: string;
  customNavItems?: SidebarNavItem[];
  renderView?: (view: View) => React.ReactNode | null;
}

export type View =
  | { type: 'dashboard' }
  | { type: 'pages' }
  | { type: 'page-editor'; pageId?: string }
  | { type: 'media' }
  | { type: 'navigation' }
  | { type: 'custom'; path: string };

interface NavigationData {
  id: string;
  name: string;
  items: NavigationItem[];
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  sections: SectionData[];
}

function ViewRenderer({
  currentView,
  registry,
  customRenderView,
  onNavigate,
  onSelectPage,
  onCreatePage,
  onUploadMedia,
}: {
  currentView: View;
  registry: Registry;
  customRenderView?: (view: View) => React.ReactNode | null;
  onNavigate: (view: View) => void;
  onSelectPage: (page: PageSummary) => void;
  onCreatePage: () => void;
  onUploadMedia: () => void;
}) {
  const apiClient = useApiClient();
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // Fetch navigation data when navigation view is active
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

  // Fetch page data when page-editor view is active with a pageId
  useEffect(() => {
    if (currentView.type !== 'page-editor' || !currentView.pageId) {
      return;
    }

    const fetchPage = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const response = await apiClient.get<PageData>(`/pages/id/${currentView.pageId}`);
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
  }, [currentView.type, currentView.type === 'page-editor' ? currentView.pageId : null, apiClient]);

  const handleSaveNavigation = async (items: NavigationItem[]) => {
    if (!navigationData) return;

    try {
      const response = await apiClient.put(`/navigation/id/${navigationData.id}`, {
        items,
      });

      if (response.error) {
        console.error('Failed to update navigation:', response.error.message);
      } else if (response.data) {
        setNavigationData(response.data as NavigationData);
      }
    } catch (err) {
      console.error('Failed to update navigation:', err);
    }
  };

  const handleSavePage = async (updatedSections: SectionData[]) => {
    if (!pageData) return;

    try {
      const response = await apiClient.put(`/pages/id/${pageData.id}`, {
        title: pageData.title,
        sections: updatedSections,
      });

      if (response.error) {
        console.error('Failed to update page:', response.error.message);
      } else {
        onNavigate({ type: 'pages' });
      }
    } catch (err) {
      console.error('Failed to update page:', err);
    }
  };

  if (customRenderView) {
    const customView = customRenderView(currentView);
    if (customView !== null) {
      return customView;
    }
  }

  switch (currentView.type) {
    case 'dashboard':
      return (
        <DashboardPage
          onSelectPage={onSelectPage}
          onCreatePage={onCreatePage}
          onUploadMedia={onUploadMedia}
        />
      );
    case 'pages':
      return <PageList onSelectPage={onSelectPage} onCreatePage={onCreatePage} />;
    case 'page-editor': {
      if (currentView.pageId && pageLoading) {
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        );
      }

      if (currentView.pageId && pageError) {
        return <div className="text-red-600">Error: {pageError}</div>;
      }

      if (currentView.pageId && !pageData) {
        return <div className="text-gray-600">Page not found</div>;
      }

      // For new pages (no pageId) or when data is loaded
      const sections = pageData?.sections ?? [];
      const allowedSections = pageData
        ? (registry.getPageType(pageData.pageType)?.allowedSections ?? [])
        : registry.getAllSections().map((s: { name: string }) => s.name);

      return (
        <PageEditor sections={sections} allowedSections={allowedSections} onSave={handleSavePage} />
      );
    }
    case 'media':
      return <MediaBrowser onSelect={() => {}} />;
    case 'navigation':
      if (navigationLoading) {
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        );
      }

      if (navigationError) {
        return <div className="text-red-600">Error: {navigationError}</div>;
      }

      if (!navigationData) {
        return (
          <div className="text-gray-600">
            No navigation found. Create one via the seed endpoint.
          </div>
        );
      }

      return <NavigationEditor items={navigationData.items} onSave={handleSaveNavigation} />;
    case 'custom':
      return <div data-testid="custom-view">Custom view for path: {currentView.path}</div>;
    default:
      return null;
  }
}

export function StructCMSAdminApp({
  registry,
  apiBaseUrl = '/api/cms',
  className,
  customNavItems = [],
  renderView: customRenderView,
}: StructCMSAdminAppProps) {
  const [currentView, setCurrentView] = useState<View>({ type: 'dashboard' });

  const handleNavigate = (path: string) => {
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
  };

  const handleNavigateToView = (view: View) => {
    setCurrentView(view);
  };

  const handleSelectPage = (page: PageSummary) => {
    setCurrentView({ type: 'page-editor', pageId: page.id });
  };

  const handleCreatePage = () => {
    setCurrentView({ type: 'page-editor' });
  };

  const handleUploadMedia = () => {
    setCurrentView({ type: 'media' });
  };

  const defaultNavItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Pages', path: '/pages' },
    { label: 'Navigation', path: '/navigation' },
    { label: 'Media', path: '/media' },
  ];

  const navItems = [...defaultNavItems, ...customNavItems];

  return (
    <AdminProvider registry={registry} apiBaseUrl={apiBaseUrl}>
      <AdminLayout className={className} navItems={navItems} onNavigate={handleNavigate}>
        <ViewRenderer
          currentView={currentView}
          registry={registry}
          customRenderView={customRenderView}
          onNavigate={handleNavigateToView}
          onSelectPage={handleSelectPage}
          onCreatePage={handleCreatePage}
          onUploadMedia={handleUploadMedia}
        />
      </AdminLayout>
    </AdminProvider>
  );
}
