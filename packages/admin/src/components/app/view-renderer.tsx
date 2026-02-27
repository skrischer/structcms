import type { NavigationItem, Registry, SectionData } from '@structcms/core';
import type React from 'react';
import { useApiClient } from '../../hooks/use-api-client';
import {
  type NavigationData,
  type PageData,
  useNavigationData,
  usePageData,
} from '../../hooks/use-page-data';
import { NavigationEditor } from '../content/navigation-editor';
import { PageList, type PageSummary } from '../content/page-list';
import { DashboardPage } from '../dashboard/dashboard-page';
import { PageEditor } from '../editors/page-editor';
import { MediaBrowser } from '../media/media-browser';
import { Skeleton } from '../ui/skeleton';
import type { View } from './struct-cms-admin-app';

interface ViewRendererProps {
  currentView: View;
  registry: Registry;
  customRenderView?: (view: View) => React.ReactNode | null;
  onNavigate: (view: View) => void;
  onSelectPage: (page: PageSummary) => void;
  onCreatePage: () => void;
  onUploadMedia: () => void;
}

// Render page editor view with loading/error states
function renderPageEditorView(
  currentView: View,
  pageData: PageData | null,
  pageLoading: boolean,
  pageError: string | null,
  registry: Registry,
  onSave: (sections: SectionData[]) => void
): React.ReactNode {
  if (currentView.type !== 'page-editor') return null;

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

  const sections = pageData?.sections ?? [];
  const allowedSections = pageData
    ? (registry.getPageType(pageData.pageType)?.allowedSections ?? [])
    : registry.getAllSections().map((s: { name: string }) => s.name);

  return <PageEditor sections={sections} allowedSections={allowedSections} onSave={onSave} />;
}

// Render navigation view with loading/error states
function renderNavigationView(
  navigationData: NavigationData | null,
  navigationLoading: boolean,
  navigationError: string | null,
  onSave: (items: NavigationItem[]) => void
): React.ReactNode {
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
      <div className="text-gray-600">No navigation found. Create one via the seed endpoint.</div>
    );
  }

  return <NavigationEditor items={navigationData.items} onSave={onSave} />;
}

/**
 * Renders the appropriate view based on currentView state.
 * Handles data fetching, loading states, and view-specific rendering.
 */
export function ViewRenderer({
  currentView,
  registry,
  customRenderView,
  onNavigate,
  onSelectPage,
  onCreatePage,
  onUploadMedia,
}: ViewRendererProps) {
  const apiClient = useApiClient();
  const { navigationData, navigationLoading, navigationError, setNavigationData } =
    useNavigationData(currentView);
  const { pageData, pageLoading, pageError } = usePageData(currentView);

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
    case 'page-editor':
      return renderPageEditorView(
        currentView,
        pageData,
        pageLoading,
        pageError,
        registry,
        handleSavePage
      );
    case 'media':
      return <MediaBrowser onSelect={() => {}} />;
    case 'navigation':
      return renderNavigationView(
        navigationData,
        navigationLoading,
        navigationError,
        handleSaveNavigation
      );
    case 'custom':
      return <div data-testid="custom-view">Custom view for path: {currentView.path}</div>;
    default:
      return null;
  }
}
