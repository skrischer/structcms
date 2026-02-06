'use client';

import { useRouter } from 'next/navigation';
import { PageList, type PageSummary } from '@structcms/admin';

export default function PagesPage() {
  const router = useRouter();

  const handleSelectPage = (page: PageSummary) => {
    router.push(`/pages/${page.slug}`);
  };

  const handleCreatePage = () => {
    router.push('/pages/new');
  };

  return (
    <PageList
      onSelectPage={handleSelectPage}
      onCreatePage={handleCreatePage}
    />
  );
}
