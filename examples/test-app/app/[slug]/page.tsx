import { notFound } from 'next/navigation';
import { handleGetPageBySlug } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { isSectionType, getComponent } from '@/lib/components';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await handleGetPageBySlug(storageAdapter, slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.sections.map((section, index) => {
        if (!isSectionType(section.type)) {
          console.warn(`Unknown section type: ${section.type}`);
          return null;
        }
        const Component = getComponent(section.type);
        return <Component key={index} data={section.data} />;
      })}
    </main>
  );
}
