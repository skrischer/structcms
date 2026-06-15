'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { HeaderBar } from './header-bar';
import { Sidebar, type SidebarNavItem } from './sidebar';

export type { SidebarNavItem };

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  navItems?: SidebarNavItem[];
  activePath?: string;
  onNavigate: (path: string) => void;
  userName?: string;
  userInitials?: string;
  userRole?: string;
  onLogout?: () => void;
  className?: string;
}

/**
 * Admin layout with sidebar navigation, header, and content area.
 *
 * @example
 * ```tsx
 * <AdminLayout
 *   title="My CMS"
 *   onNavigate={(path) => router.push(path)}
 *   activePath="/pages"
 * >
 *   <PageList ... />
 * </AdminLayout>
 * ```
 */
function AdminLayout({
  children,
  title = 'StructCMS',
  navItems,
  activePath = '/',
  onNavigate,
  userName,
  userInitials,
  userRole,
  onLogout,
  className,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return !window.matchMedia('(min-width: 1024px)').matches;
  });

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setSidebarCollapsed(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={cn('flex h-dvh overflow-hidden bg-[var(--admin-gray-50)]', className)}
      data-testid="admin-layout"
      data-structcms-admin=""
    >
      <Sidebar
        currentPath={activePath}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        title={title}
        navItems={navItems}
        userName={userName}
        userInitials={userInitials}
        userRole={userRole}
        onLogout={onLogout}
        className="shrink-0"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar userInitials={userInitials} />

        {/* Content */}
        <main className="flex-1 overflow-auto" data-testid="main-content">
          <div className="min-h-full px-10 pt-10 flex flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}

AdminLayout.displayName = 'AdminLayout';

export { AdminLayout };
