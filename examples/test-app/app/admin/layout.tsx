'use client';

import { registry } from '@/lib/registry';
import {
  AdminProvider,
  AuthProvider,
  HeaderBar,
  ProtectedRoute,
  Sidebar,
  type SidebarItem,
  useAuth,
} from '@structcms/admin';
import type { BreadcrumbItem } from '@structcms/admin';
import { FileText, Image, LayoutDashboard, Navigation2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const navItems: SidebarItem[] = [
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
    icon: <Navigation2 size={20} strokeWidth={1.5} />,
  },
];

const pathLabels: Record<string, string> = {
  pages: 'Pages',
  media: 'Media',
  navigation: 'Navigation',
};

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname
    .replace(/^\/admin\/?/, '')
    .split('/')
    .filter(Boolean);

  if (segments.length === 0) {
    return [{ label: 'Dashboard' }];
  }

  const items: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/admin' }];

  let currentPath = '/admin';
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i] ?? '';
    currentPath += `/${segment}`;
    const isLast = i === segments.length - 1;
    const label = pathLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

    items.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  }

  return items;
}

const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

function useAuthSafe() {
  try {
    return useAuth();
  } catch {
    return null;
  }
}

function deriveInitials(email: string): string {
  const name = email.split('@')[0] ?? '';
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuthSafe();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setCollapsed(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const currentPath = pathname.replace(/^\/admin/, '') || '/';

  const breadcrumbItems = useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  const handleNavigate = (path: string) => {
    router.push(`/admin${path === '/' ? '' : path}`);
  };

  const userEmail = auth?.user?.email;
  const userName = auth?.user?.metadata?.name as string | undefined;
  const userInitials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : userEmail
      ? deriveInitials(userEmail)
      : undefined;

  return (
    <div className="flex h-dvh" data-structcms-admin="">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary-600)]"
      >
        Skip to content
      </a>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        navItems={navItems}
        userName={userName ?? userEmail}
        userInitials={userInitials}
        onLogout={() => {
          auth?.signOut();
          router.push('/admin/login');
        }}
        className="shrink-0"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar breadcrumbItems={breadcrumbItems} userInitials={userInitials} />
        <main id="main-content" className="flex-1 overflow-auto bg-background">
          <div className="min-h-full px-10 pt-10 flex flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't protect the login page
  const isLoginPage = pathname === '/admin/login';

  // If auth is disabled and user tries to access login, redirect to dashboard
  if (isAuthDisabled && isLoginPage) {
    router.push('/admin');
    return <div>Redirecting...</div>;
  }

  // Always render content without auth when disabled
  if (isAuthDisabled) {
    return (
      <AdminProvider registry={registry} apiBaseUrl="/api/cms">
        <AdminShell>{children}</AdminShell>
      </AdminProvider>
    );
  }

  // With auth enabled, wrap everything in AuthProvider
  return (
    <AuthProvider apiBaseUrl="/api/cms">
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-gray-600">Please sign in to access this page.</p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/login')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          }
          loadingFallback={
            <div className="min-h-screen flex items-center justify-center">
              <p>Loading...</p>
            </div>
          }
        >
          <AdminProvider registry={registry} apiBaseUrl="/api/cms">
            <AdminShell>{children}</AdminShell>
          </AdminProvider>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
