import Link from 'next/link';
import { searchPropertiesServer } from '@/lib/search/propertySearchServer';

export const dynamic = 'force-dynamic';

const highlighted = [
  ['Villa Horizon', 'Marbella, Spain', 'EUR8,950,000'],
  ['The Oak Estate', 'Los Angeles, USA', 'EUR12,500,000'],
  ['Skyline Penthouse', 'New York, USA', 'EUR9,750,000']
];

export default async function HighlightedPropertiesPage() {
  const response = await searchPropertiesServer({
    filters: { highlightedOnly: true },
    pagination: { pageSize: 12, pageNumber: 1 },
    sort: 'relevance'
  });
  const dynamicHighlights = response.results;

  return (
    <main className="min-h-screen bg-porcelain text-black">
      <section className="border-b border-black/10 bg-ivory/55">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Highlighted Properties
          </p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-6xl">
            A curated glimpse into Viyra's luxury property universe.
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3 lg:px-10">
        {(dynamicHighlights.length
          ? dynamicHighlights.map((item) => [item.title, `${item.city}, ${item.country}`, `${item.currency}${Number(item.price).toLocaleString()}`, item.id])
          : highlighted.map((item) => [...item, ''])
        ).map(([title, location, price, id]) => (
          <article className="border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(23,23,23,0.07)]" key={title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{location}</p>
            <h2 className="font-display mt-5 text-3xl">{title}</h2>
            <p className="mt-4 text-sm font-semibold text-black">{price}</p>
            <p className="mt-3 text-sm leading-7 text-taupe">
              Full details, private viewings, and transaction support are available after secure access.
            </p>
            {id ? (
              <Link
                className="mt-6 inline-flex border border-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-gold"
                href={`/property/${id}`}
              >
                View Details
              </Link>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
