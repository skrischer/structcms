import type { HeroData } from '.';

const layoutClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function HeroSection({ data }: { data: HeroData }) {
  const textAlign = layoutClasses[data.layout] ?? 'text-center';
  const centered = data.centered;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
      <div
        className={`rounded-3xl border border-border/70 bg-card/85 px-6 py-12 shadow-xl shadow-primary/10 backdrop-blur-sm sm:px-10 sm:py-16 ${textAlign}${centered ? ' mx-auto max-w-4xl' : ''}`}
      >
        <h1
          className={`text-4xl font-bold leading-tight sm:text-5xl${centered ? ' mx-auto max-w-4xl' : ''}`}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p
            className={`mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl${centered ? ' mx-auto max-w-2xl' : ''}`}
          >
            {data.subtitle}
          </p>
        )}
        {data.image && (
          <img
            src={data.image}
            alt=""
            className={`mt-10 w-full rounded-2xl border border-border/70 shadow-lg shadow-primary/10${centered ? ' mx-auto max-w-4xl' : ''}`}
          />
        )}
      </div>
    </section>
  );
}
