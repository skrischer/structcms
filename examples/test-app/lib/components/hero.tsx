import type { HeroData } from '.';

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      {data.subtitle && (
        <p className="mt-4 text-xl text-gray-600">{data.subtitle}</p>
      )}
      {data.image && (
        <img src={data.image} alt="" className="mt-8 mx-auto max-w-2xl" />
      )}
    </section>
  );
}
