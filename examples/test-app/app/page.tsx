import { handleGetPageBySlug, handleGetNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { isSectionType, getComponent } from '@/lib/components';
import { Navigation } from '@/lib/components/navigation';

export default async function Home() {
  const page = await handleGetPageBySlug(storageAdapter, 'home');
  const nav = await handleGetNavigation(storageAdapter, 'main');

  if (!page) {
    return (
      <main className="px-6 py-12">
        <h1 className="text-2xl font-bold">StructCMS Test App</h1>
        <p className="mt-2 text-gray-600">
          No &quot;home&quot; page found. Seed data via{' '}
          <code className="rounded bg-gray-100 px-1">/api/cms/testing/seed</code>.
        </p>
      </main>
    );
  }

  return (
    <>
      {nav && (
        <header className="border-b bg-white px-6 py-3">
          <Navigation items={nav.items} />
        </header>
      )}
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
    </>

  );
}
