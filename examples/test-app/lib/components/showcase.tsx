import type { ShowcaseData } from '.';

const themeClasses: Record<string, string> = {
  light: 'bg-white text-foreground',
  dark: 'bg-zinc-900 text-zinc-100',
  auto: '',
};

const buttonVariants: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

export function ShowcaseSection({ data }: { data: ShowcaseData }) {
  const theme = themeClasses[data.theme] ?? '';

  return (
    <section className={`mx-auto max-w-6xl px-6 py-10 sm:py-14 ${theme}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{data.title}</h2>
          {data.subtitle && <p className="mt-2 text-lg text-muted-foreground">{data.subtitle}</p>}
          {data.summary && (
            <p className="mt-4 leading-relaxed text-muted-foreground">{data.summary}</p>
          )}
        </div>

        {/* Hero image */}
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="w-full rounded-xl border border-border/70 shadow-md"
          />
        )}

        {/* Rich text body */}
        {data.body && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.body }} />
        )}

        {/* Grid items */}
        {data.grid && data.grid.length > 0 && (
          <div
            className={`grid gap-4 ${data.layout === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}
          >
            {data.grid.map((item, i) => (
              <div
                key={`grid-${item.title}-${i}`}
                className="overflow-hidden rounded-lg border border-border/70 bg-card"
              >
                <img src={item.image} alt="" className="aspect-video w-full object-cover" />
                {data.showCaption && <p className="p-3 text-sm font-medium">{item.title}</p>}
              </div>
            ))}
          </div>
        )}

        {/* CTA area */}
        <div className="flex flex-wrap items-center gap-4">
          {data.button && data.showButton && (
            <a
              href={data.button.url}
              target={data.button.target}
              rel={data.button.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-colors ${buttonVariants[data.button.variant] ?? ''}`}
            >
              {data.button.label}
            </a>
          )}
          {data.externalUrl && (
            <a
              href={data.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              External link
            </a>
          )}
        </div>

        {/* Attachment */}
        {data.attachment && (
          <a
            href={data.attachment}
            download
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Download attachment
          </a>
        )}

        {/* Metadata footer */}
        {(data.author || (data.tags && data.tags.length > 0)) && (
          <footer className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
            {data.author && (
              <p>
                {data.author.name}
                {data.author.role && <span className="ml-1">({data.author.role})</span>}
              </p>
            )}
            {data.tags && data.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </footer>
        )}
      </div>
    </section>
  );
}
