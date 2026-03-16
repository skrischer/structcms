'use client';
import { DashboardPage, type PageSummary } from '@structcms/admin';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <DashboardPage
      onSelectPage={(page: PageSummary) => router.push(`/admin/pages/${page.slug}`)}
      onCreatePage={() => router.push('/admin/pages/new')}
      onUploadMedia={() => router.push('/admin/media')}
      onViewAllPages={() => router.push('/admin/pages')}
      onEditNavigation={() => router.push('/admin/navigation')}
    />
  );
}
