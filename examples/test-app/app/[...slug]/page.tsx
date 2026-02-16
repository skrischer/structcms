import { notFound } from 'next/navigation';
import { handleGetPageBySlug, handleGetNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { isSectionType, getComponent } from '@/lib/components';
import { Navigation } from '@/lib/components/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = await handleGetPageBySlug(storageAdapter, slug.join('/'));
  const nav = await handleGetNavigation(storageAdapter, 'main');

  if (!page) {
    notFound();
  }

  return (
    <>
      {nav && (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-sm font-semibold tracking-wide text-primary">StructCMS</p>
            <Navigation items={nav.items} />
          </div>
        </header>
      )}
      <main className="pb-16">
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
    </>
  );
}
