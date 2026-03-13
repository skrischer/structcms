import type { CtaData } from '.';

const buttonStyles: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

export function CtaSection({ data }: { data: CtaData }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10 sm:py-12">
      <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8">
        <h2 className="text-2xl font-semibold">{data.heading}</h2>
        {data.description && <p className="mt-3 text-muted-foreground">{data.description}</p>}
        <div>
          <a
            href={data.buttonUrl}
            className={`mt-6 inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-colors ${buttonStyles[data.buttonStyle]}`}
            {...(data.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {data.buttonText}
          </a>
        </div>
        {data.attachment && (
          <div>
            <a
              href={data.attachment}
              download
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              Download attachment
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
