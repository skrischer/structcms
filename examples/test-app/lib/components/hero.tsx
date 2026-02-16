import type { HeroData } from '.';

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
      <div className="rounded-3xl border border-border/70 bg-card/85 px-6 py-12 text-center shadow-xl shadow-primary/10 backdrop-blur-sm sm:px-10 sm:py-16">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {data.subtitle}
          </p>
        )}
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border border-border/70 shadow-lg shadow-primary/10"
          />
        )}
      </div>
    </section>
  );
}
