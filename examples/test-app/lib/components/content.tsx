import type { ContentData } from '.';

export function ContentSection({ data }: { data: ContentData }) {
  return (
    <section className="prose max-w-3xl mx-auto py-12">
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </section>
  );
}
