'use client';

import { useRouter } from 'next/navigation';
import { PageList, type PageSummary } from '@structcms/admin';

export default function PagesPage() {
  const router = useRouter();

  const handleSelectPage = (page: PageSummary) => {
    router.push(`/admin/pages/${page.slug}`);
  };

  const handleCreatePage = () => {
    router.push('/admin/pages/new');
  };

  return (
    <PageList
      onSelectPage={handleSelectPage}
      onCreatePage={handleCreatePage}
    />
  );
}
