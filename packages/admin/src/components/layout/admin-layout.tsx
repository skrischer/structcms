"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { HeaderBar } from "./header-bar";
import { Sidebar, type SidebarNavItem } from "./sidebar";

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
  title = "StructCMS",
  navItems,
  activePath = "/",
  onNavigate,
  userName,
  userInitials,
  userRole,
  onLogout,
  className,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "flex h-dvh overflow-hidden bg-[var(--admin-gray-50)]",
        className,
      )}
      data-testid="admin-layout"
      data-structcms-admin=""
    >
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              setMobileSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar — fixed on mobile, relative on desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:relative md:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          currentPath={activePath}
          onNavigate={(path) => {
            onNavigate(path);
            setMobileSidebarOpen(false);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          title={title}
          navItems={navItems}
          userName={userName}
          userInitials={userInitials}
          userRole={userRole}
          onLogout={onLogout}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar
          onToggleSidebar={() => setMobileSidebarOpen((o) => !o)}
          userInitials={userInitials}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

AdminLayout.displayName = "AdminLayout";

export { AdminLayout };
