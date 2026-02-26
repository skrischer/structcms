import type { ContentData } from '.';

export function ContentSection({ data }: { data: ContentData }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
      <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8">
        <div
          className="space-y-4 leading-7 text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-base [&_strong]:font-semibold"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: CMS content is sanitized on the server
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
    </section>
  );
}
