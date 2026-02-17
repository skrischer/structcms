import React, { useState } from 'react';
import type { Registry } from '@structcms/core';
import { AdminProvider } from '../../context/admin-context';
import { AdminLayout, type SidebarNavItem } from '../layout/admin-layout';
import { DashboardPage } from '../dashboard/dashboard-page';
import { PageList, type PageSummary } from '../content/page-list';
import { PageEditor } from '../editors/page-editor';
import { MediaBrowser } from '../media/media-browser';
import { NavigationEditor } from '../content/navigation-editor';

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
  | { type: 'page-editor' }
  | { type: 'media' }
  | { type: 'navigation' }
  | { type: 'custom'; path: string };

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

  const handleSelectPage = (_page: PageSummary) => {
    setCurrentView({ type: 'page-editor' });
  };

  const handleCreatePage = () => {
    setCurrentView({ type: 'page-editor' });
  };

  const handleUploadMedia = () => {
    setCurrentView({ type: 'media' });
  };

  const renderView = () => {
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
            onSelectPage={handleSelectPage}
            onCreatePage={handleCreatePage}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'pages':
        return (
          <PageList
            onSelectPage={handleSelectPage}
            onCreatePage={handleCreatePage}
          />
        );
      case 'page-editor':
        return (
          <PageEditor
            sections={[]}
            allowedSections={registry.getAllSections().map(s => s.name)}
            onSave={() => {
              setCurrentView({ type: 'pages' });
            }}
          />
        );
      case 'media':
        return <MediaBrowser onSelect={() => {}} />;
      case 'navigation':
        return (
          <NavigationEditor
            items={[]}
            onSave={async () => {
              setCurrentView({ type: 'navigation' });
            }}
          />
        );
      case 'custom':
        return (
          <div data-testid="custom-view">
            Custom view for path: {currentView.path}
          </div>
        );
      default:
        return null;
    }
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
      <AdminLayout 
        className={className}
        navItems={navItems}
        onNavigate={handleNavigate}
      >
        {renderView()}
      </AdminLayout>
    </AdminProvider>
  );
}
