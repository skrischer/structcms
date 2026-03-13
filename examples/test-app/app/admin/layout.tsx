'use client';

import { registry } from '@/lib/registry';
import { AdminLayout, AdminProvider, AuthProvider, ProtectedRoute } from '@structcms/admin';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Pages', path: '/admin/pages' },
  { label: 'Navigation', path: '/admin/navigation' },
  { label: 'Media', path: '/admin/media' },
];

const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

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
        <AdminLayout navItems={navItems} onNavigate={handleNavigate}>
          {children}
        </AdminLayout>
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
            <AdminLayout navItems={navItems} onNavigate={handleNavigate}>
              {children}
            </AdminLayout>
          </AdminProvider>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
