import Link from 'next/link';

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

const searchItems = [
  ['Location', 'Any Location'],
  ['Property Type', 'Any Type'],
  ['Price Range', 'Any Price'],
  ['Beds', 'Any'],
  ['Baths', 'Any']
];

const strengths = [
  ['Exclusive Listings', 'Access to off-market and private properties.'],
  ['Personalized Service', 'Tailored guidance every step of the way.'],
  ['Global Reach', 'Prime locations for discerning clients worldwide.']
];

export default function Home() {
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

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
          <Link href="/" className="flex items-center gap-4">
            <span className="grid h-12 w-10 place-items-center border border-gold text-xl font-semibold text-gold">
              V
            </span>
            <span className="leading-none">
              <span className="block font-serif text-3xl uppercase tracking-[0.18em] text-white">
                Viyra
              </span>
              <span className="block text-center text-[11px] uppercase tracking-[0.48em] text-white/70">
                Realty
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 lg:flex">
            <Link href="/search" className="hover:text-gold">
              Properties
            </Link>
            <Link href="/ai-concierge" className="hover:text-gold">
              Buyers
            </Link>
            <Link href="/agent-center" className="hover:text-gold">
              Sellers
            </Link>
            <Link href="/markets" className="hover:text-gold">
              About
            </Link>
            <Link href="/documents" className="hover:text-gold">
              Contact
            </Link>
          </nav>

          <Link
            href="/ai-concierge"
            className="hidden border border-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-navy md:inline-flex"
          >
            Book a Consultation
          </Link>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-24 lg:px-10 lg:pt-36">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl leading-[1.05] text-white md:text-7xl">
              Extraordinary Homes.
              <br />
              Exceptional Lives.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-white/86">
              Curated luxury properties. World-class service.
              <br />
              Your vision, our expertise.
            </p>
            <Link
              href="/search"
              className="mt-9 inline-flex bg-gold px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:bg-[#b8914b]"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-16 max-w-5xl px-6 lg:px-0">
        <div className="grid overflow-hidden rounded-sm bg-[#0a0d10] shadow-2xl md:grid-cols-[1.1fr_1.1fr_1.1fr_0.7fr_0.7fr_1fr]">
          {searchItems.map(([label, value]) => (
            <button
              className="border-b border-white/10 px-7 py-6 text-left md:border-b-0 md:border-r"
              key={label}
              type="button"
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                {label}
              </span>
              <span className="mt-4 flex items-center justify-between text-sm text-white">
                {value}
                <span className="text-gold">v</span>
              </span>
            </button>
          ))}
          <Link
            href="/search"
            className="m-6 flex items-center justify-center gap-3 bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b8914b]"
          >
            <span className="text-base">O</span>
            Search
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pt-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Featured Properties
            </p>
            <h2 className="font-serif text-4xl text-[#17110d] md:text-5xl">
              Handpicked For You
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#17110d] hover:text-gold md:inline-flex"
          >
            View All Properties -&gt;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {properties.map((property) => (
            <article className="group bg-white shadow-[0_18px_60px_rgba(8,18,37,0.08)]" key={property.title}>
              <div className="relative aspect-[1.38] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-[#07111f] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  For Sale
                </span>
                <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center" aria-hidden="true">
                  <span className="h-4 w-4 rotate-45 border-b-2 border-r-2 border-white" />
                </span>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#17110d]">{property.title}</h3>
                    <p className="mt-1 text-sm text-[#6e685f]">{property.location}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#17110d]">{property.price}</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-[#5d554c]">
                  <span>{property.beds} Beds</span>
                  <span>{property.baths} Baths</span>
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
              Why Choose Viyra Realty
            </p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              Discretion. Expertise. Results.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78">
              We offer a bespoke real estate experience tailored to your lifestyle and aspirations.
              With unparalleled market knowledge, global connections, and absolute discretion, we
              deliver exceptional results.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {strengths.map(([title, copy]) => (
                <div key={title}>
                  <div className="mb-5 h-px w-12 bg-gold" />
                  <h3 className="font-serif text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">{copy}</p>
                </div>
              ))}
            </div>

            <Link
              href="/markets"
              className="mt-10 inline-flex w-fit border border-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-navy"
            >
              Learn More About Us
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-9 text-center md:grid-cols-4 lg:px-10">
            {[
              ['EUR2.8B+', 'Total Sales'],
              ['500+', 'Properties Sold'],
              ['25+', 'Years of Experience'],
              ['98%', 'Client Satisfaction']
            ].map(([value, label]) => (
              <div className="md:border-r md:border-white/10 last:border-r-0" key={label}>
                <p className="font-serif text-4xl text-gold">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/75">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
