'use client';

import { useRouter } from 'next/navigation';
import { DashboardPage, type PageSummary } from '@structcms/admin';

export default function AdminDashboard() {
  const router = useRouter();

  const handleSelectPage = (page: PageSummary) => {
    router.push(`/admin/pages/${page.slug}`);
  };

  const handleCreatePage = () => {
    router.push('/admin/pages/new');
  };

  const handleUploadMedia = () => {
    router.push('/admin/media');
  };

  return (
    <DashboardPage
      onSelectPage={handleSelectPage}
      onCreatePage={handleCreatePage}
      onUploadMedia={handleUploadMedia}
    />
  );
}
