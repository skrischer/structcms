'use client';

import { useRouter } from 'next/navigation';
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from '@/lib/registry';

const navItems = [
  { label: 'Pages', path: '/admin/pages' },
  { label: 'Navigation', path: '/admin/navigation' },
  { label: 'Media', path: '/admin/media' },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      <AdminLayout navItems={navItems} onNavigate={handleNavigate}>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}
