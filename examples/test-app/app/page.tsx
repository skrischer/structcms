export const dynamic = 'force-dynamic';

import { handleGetPageBySlug, handleGetNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { isSectionType, getComponent } from '@/lib/components';
import { Navigation } from '@/lib/components/navigation';

export default async function Home() {
  const page = await handleGetPageBySlug(storageAdapter, 'home');
  const nav = await handleGetNavigation(storageAdapter, 'main');

  if (!page) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-border/70 bg-card/90 p-8 shadow-lg shadow-primary/5 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">StructCMS Test App</h1>
          <p className="mt-3 text-muted-foreground">
            No &quot;home&quot; page found. Seed data via{' '}
            <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-sm text-foreground">
              /api/cms/testing/seed
            </code>
            .
          </p>
        </div>
      </main>
    );
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
