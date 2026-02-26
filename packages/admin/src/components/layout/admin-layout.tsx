'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export interface SidebarNavItem {
  label: string;
  path: string;
}

const DEFAULT_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Pages', path: '/pages' },
  { label: 'Navigation', path: '/navigation' },
  { label: 'Media', path: '/media' },
];

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  navItems?: SidebarNavItem[];
  activePath?: string;
  onNavigate: (path: string) => void;
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
  navItems = DEFAULT_NAV_ITEMS,
  activePath,
  onNavigate,
  className,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={cn('flex h-screen bg-background', className)} data-testid="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-input transform transition-transform duration-200 md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        data-testid="sidebar"
      >
        <div className="flex items-center h-14 px-4 border-b border-input">
          <h1 className="text-lg font-bold" data-testid="sidebar-title">
            {title}
          </h1>
        </div>
        <nav className="p-2 space-y-1" data-testid="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                activePath === item.path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
              onClick={() => {
                onNavigate(item.path);
                setSidebarOpen(false);
              }}
              data-testid={`nav-link-${item.path}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="flex items-center h-14 px-4 border-b border-input bg-card"
          data-testid="header"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="sidebar-toggle"
          >
            ☰
          </Button>
          <h2 className="text-lg font-semibold" data-testid="header-title">
            {title}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

AdminLayout.displayName = 'AdminLayout';

export { AdminLayout };
