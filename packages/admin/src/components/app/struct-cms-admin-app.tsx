import type { Registry } from '@structcms/core';
import type React from 'react';
import { AdminProvider } from '../../context/admin-context';
import { AuthProvider } from '../../context/auth-context';
import { useNavigation } from '../../hooks/use-navigation';
import type { PageSummary } from '../content/page-list';
import { AdminLayout, type SidebarNavItem } from '../layout/admin-layout';
import { ViewRenderer } from './view-renderer';

export interface StructCMSAdminAppProps {
  registry: Registry;
  apiBaseUrl?: string;
  className?: string;
  customNavItems?: SidebarNavItem[];
  renderView?: (view: View) => React.ReactNode | null;
  /**
   * If true, wraps the app in AuthProvider. When enabled, you should provide login/auth handling.
   * @default false
   */
  enableAuth?: boolean;
  /**
   * Callback when user authentication state changes
   */
  onAuthStateChange?: (user: import('../../context/auth-context').AuthContextValue['user']) => void;
}

export type View =
  | { type: 'dashboard' }
  | { type: 'pages' }
  | { type: 'page-editor'; pageId?: string }
  | { type: 'media' }
  | { type: 'navigation' }
  | { type: 'custom'; path: string };

export function StructCMSAdminApp({
  registry,
  apiBaseUrl = '/api/cms',
  className,
  customNavItems = [],
  renderView: customRenderView,
  enableAuth = false,
  onAuthStateChange,
}: StructCMSAdminAppProps) {
  const { currentView, setView, handleNavigate, buildNavItems } = useNavigation();

  const handleSelectPage = (page: PageSummary) => {
    setView({ type: 'page-editor', pageId: page.id });
  };

  const handleCreatePage = () => {
    setView({ type: 'page-editor' });
  };

  const handleUploadMedia = () => {
    setView({ type: 'media' });
  };

  const navItems = buildNavItems(customNavItems);

  const appContent = (
    <AdminProvider registry={registry} apiBaseUrl={apiBaseUrl}>
      <AdminLayout className={className} navItems={navItems} onNavigate={handleNavigate}>
        <ViewRenderer
          currentView={currentView}
          registry={registry}
          customRenderView={customRenderView}
          onNavigate={setView}
          onSelectPage={handleSelectPage}
          onCreatePage={handleCreatePage}
          onUploadMedia={handleUploadMedia}
        />
      </AdminLayout>
    </AdminProvider>
  );

  if (enableAuth) {
    return (
      <AuthProvider apiBaseUrl={apiBaseUrl} onAuthStateChange={onAuthStateChange}>
        {appContent}
      </AuthProvider>
    );
  }

  return appContent;
}
