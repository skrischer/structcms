'use client';

import {
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../lib/utils';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  title?: string;
  navItems?: SidebarNavItem[];
  userName?: string;
  userInitials?: string;
  userRole?: string;
  onLogout?: () => void;
  className?: string;
}

const DEFAULT_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
  },
  {
    label: 'Pages',
    path: '/pages',
    icon: <FileText size={20} strokeWidth={1.5} />,
  },
  {
    label: 'Media',
    path: '/media',
    icon: <Image size={20} strokeWidth={1.5} />,
  },
  {
    label: 'Navigation',
    path: '/navigation',
    icon: <Navigation size={20} strokeWidth={1.5} />,
  },
];

function Sidebar({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  title = 'StructCMS',
  navItems = DEFAULT_NAV_ITEMS,
  userName,
  userInitials,
  userRole,
  onLogout,
  className,
}: SidebarProps) {
  const displayName = userName ?? 'User';
  const initials =
    userInitials ??
    (userName
      ? userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '?');
  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-[var(--admin-gray-200)] bg-[var(--admin-surface-sidebar)] transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-[260px]',
        className
      )}
      data-testid="sidebar"
    >
      {/* Logo / collapse toggle */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--admin-gray-100)] shrink-0">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'flex items-center rounded-md text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-100)] transition-colors',
            collapsed ? 'justify-center h-8 w-8 mx-auto' : 'gap-2 h-8 px-1'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          data-testid="sidebar-collapse-toggle"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} strokeWidth={1.5} />
          ) : (
            <>
              <PanelLeftClose size={18} strokeWidth={1.5} className="shrink-0" />
              <span
                className="text-base font-bold text-[var(--admin-gray-900)] truncate"
                data-testid="sidebar-title"
              >
                {title}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1" data-testid="sidebar-nav">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={cn(
                'flex items-center w-full rounded-md text-sm font-medium transition-colors',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2',
                isActive
                  ? 'bg-[var(--admin-surface-sidebar-active)] text-[var(--admin-primary-600)]'
                  : 'text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-100)] hover:text-[var(--admin-gray-700)]'
              )}
              title={collapsed ? item.label : undefined}
              data-testid={`nav-link-${item.path}`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className={cn(
          'shrink-0 border-t border-[var(--admin-gray-100)] p-2',
          collapsed ? 'flex flex-col items-center gap-1' : ''
        )}
        data-testid="sidebar-footer"
      >
        {collapsed ? (
          <>
            <div
              className="size-8 rounded-full bg-[var(--admin-primary-100)] text-[var(--admin-primary-700)] flex items-center justify-center text-[13px] font-semibold"
              data-testid="sidebar-avatar"
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center size-8 rounded-md text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-100)] hover:text-[var(--admin-gray-700)] transition-colors"
              aria-label="Log out"
              title="Log out"
              data-testid="sidebar-logout"
            >
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div
              className="size-8 rounded-full bg-[var(--admin-primary-100)] text-[var(--admin-primary-700)] flex items-center justify-center text-[13px] font-semibold shrink-0"
              data-testid="sidebar-avatar"
            >
              {initials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-medium text-[var(--admin-gray-800)] truncate">
                {displayName}
              </span>
              {userRole && (
                <span className="text-[12px] text-[var(--admin-gray-500)] truncate">
                  {userRole}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center shrink-0 size-8 rounded-md text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-100)] hover:text-[var(--admin-gray-700)] transition-colors"
              aria-label="Log out"
              data-testid="sidebar-logout"
            >
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

Sidebar.displayName = 'Sidebar';

export { Sidebar };
