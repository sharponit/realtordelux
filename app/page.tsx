import Link from 'next/link';
import { SocialProfileButtons } from '@/components/common/SocialProfileButtons';
import { SiteHeader } from '@/components/layout/SiteChrome';
import { LandingPropertySearch } from '@/components/search/LandingPropertySearch';
import { getRequestLocale } from '@/lib/i18n/request';
import { t } from '@/lib/i18n';

const heroImage =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=90';

const properties = [
  {
    title: 'Villa Horizon',
    location: 'Marbella, Spain',
    price: 'EUR8,950,000',
    beds: 6,
    baths: 7,
    size: '950 m2',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'The Oak Estate',
    location: 'Los Angeles, USA',
    price: 'EUR12,500,000',
    beds: 7,
    baths: 9,
    size: '1,200 m2',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Skyline Penthouse',
    location: 'New York, USA',
    price: 'EUR9,750,000',
    beds: 4,
    baths: 4,
    size: '450 m2',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'
  }
];

const quickLinks = [
  ['buy', '/buying'],
  ['sell', '/selling'],
  ['rent', '/renting'],
  ['newDevelopments', '/new-developments'],
  ['join', '/professionals']
] as const;

export default async function Home() {
  const locale = await getRequestLocale();
  const copy = t(locale);

  return (
    <main className="min-h-screen bg-ivory text-navy">
      <section className="relative min-h-[680px] overflow-hidden bg-navy text-white lg:min-h-[720px]">
        <img
          src={heroImage}
          alt="Contemporary luxury villa at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06101f]/95 via-[#081225]/55 to-[#081225]/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06101f]/60 via-transparent to-[#06101f]/30" />

        <div className="relative z-10">
          <SiteHeader light locale={locale} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-24 lg:px-10 lg:pt-36">
          <div className="max-w-2xl">
            <h1 className="font-display whitespace-pre-line text-5xl leading-[1.05] text-white md:text-7xl">
              {copy.home.heroTitle}
            </h1>
            <p className="mt-7 max-w-lg whitespace-pre-line text-lg leading-8 text-white/86">
              {copy.home.heroCopy}
            </p>
            <Link
              href="/login"
              className="mt-9 inline-flex bg-gold px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:bg-[#b8914b]"
            >
              {copy.actions.login}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-14 max-w-6xl px-6 lg:px-10">
        <div className="overflow-visible border border-white/10 bg-[rgba(17,16,14,0.9)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-5 lg:p-6">
          <LandingPropertySearch />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {copy.home.featuredEyebrow}
            </p>
            <h2 className="font-display text-4xl text-[#17110d] md:text-5xl">
              {copy.home.featuredTitle}
            </h2>
          </div>
          <Link
            href="/search?highlighted=true"
            className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#17110d] hover:text-gold md:inline-flex"
          >
            {copy.actions.viewHighlights}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {properties.map((property) => (
            <article
              className="group bg-white shadow-[0_18px_60px_rgba(8,18,37,0.08)]"
              key={property.title}
            >
              <div className="relative aspect-[1.38] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-[#07111f] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  {copy.home.forSale}
                </span>
                <span
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center"
                  aria-hidden="true"
                >
                  <span className="h-4 w-4 rotate-45 border-b-2 border-r-2 border-white" />
                </span>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-[#17110d]">{property.title}</h3>
                    <p className="mt-1 text-sm text-[#6e685f]">{property.location}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#17110d]">
                    {property.price}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-[#5d554c]">
                  <span>{property.beds} {copy.home.beds}</span>
                  <span>{property.baths} {copy.home.baths}</span>
                  <span>{property.size}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="h-2 w-2 rounded-full bg-[#d8d2c9]" />
          <span className="h-2 w-2 rounded-full bg-[#d8d2c9]" />
        </div>
      </section>

      <section className="bg-[#080b0f] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.25fr] lg:px-10">
          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury living room overlooking the water"
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {copy.home.whyEyebrow}
            </p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              {copy.home.whyTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78">
              {copy.home.whyCopy}
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {copy.home.strengths.map(([title, body]) => (
                <div key={title}>
                  <div className="mb-5 h-px w-12 bg-gold" />
                  <h3 className="font-display text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">{body}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-10 inline-flex w-fit border border-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-navy"
            >
              {copy.actions.learnMore}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#080b0f]">
          <div className="mx-auto grid max-w-7xl gap-3 px-6 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
            {quickLinks.map(([key, href]) => (
              <Link
                className="border border-white/10 px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-gold hover:text-gold"
                href={href}
                key={key}
              >
                {copy.home.quickLinks[key]}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-9 text-center md:grid-cols-4 lg:px-10">
            {copy.home.stats.map(([value, label]) => (
              <div className="md:border-r md:border-white/10 last:border-r-0" key={label}>
                <p className="font-display text-4xl text-gold">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/75">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-[8px] tracking-[0.04em] text-white/35 sm:text-[11px] lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
            <p className="text-center md:text-left">{copy.footer}</p>
            <SocialProfileButtons variant="compact" showLabels={false} locale={locale} className="text-white/45" />
          </div>
        </div>
      </section>
    </main>
  );
}
