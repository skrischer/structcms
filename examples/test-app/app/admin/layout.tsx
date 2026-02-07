'use client';

import { useRouter } from 'next/navigation';
import { AdminProvider, AdminLayout } from '@structcms/admin';
import { registry } from '@/lib/registry';

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
      <AdminLayout onNavigate={handleNavigate}>
        {children}
      </AdminLayout>
    </AdminProvider>
  );
}
