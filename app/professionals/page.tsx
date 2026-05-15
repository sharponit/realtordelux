import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteChrome';

const heroImage =
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=2400&q=90';

const professionalRoles = [
  {
    title: 'Realtors',
    eyebrow: 'Luxury Representation',
    description:
      'Represent discerning buyers and sellers while positioning your expertise within an international luxury property ecosystem.',
    benefits: ['Qualified global clientele', 'Seller invitations', 'Listing visibility', 'Transaction collaboration'],
    regions: 'Prime city, coastal, golf, and new-development markets',
    cta: 'Apply as Realtor',
    href: '/join/realtor',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Lawyers',
    eyebrow: 'Cross-Border Counsel',
    description:
      'Support clients with legal guidance, due diligence, contract review, and transaction coordination across premium property markets.',
    benefits: ['Verified legal profile', 'Jurisdiction visibility', 'Transaction invitations', 'Specialty positioning'],
    regions: 'Jurisdictions, languages, and cross-border service corridors',
    cta: 'Apply as Lawyer',
    href: '/join/lawyer',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Notaries',
    eyebrow: 'Trusted Formalization',
    description:
      'Be discoverable for transfer appointments, signing workflows, and formal transaction milestones after client or legal invitation.',
    benefits: ['Verified office profile', 'Appointment readiness', 'Accepted-context sharing', 'Regional trust signals'],
    regions: 'Licensed jurisdictions and destination markets',
    cta: 'Apply as Notary',
    href: '/join/notary',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Developers',
    eyebrow: 'New Development Access',
    description:
      'Introduce off-plan projects, branded residences, investment developments, and new construction opportunities to a qualified international audience.',
    benefits: ['Project visibility', 'Investor positioning', 'Sales phase readiness', 'Development media workflows'],
    regions: 'Prime new-development corridors and destination resort markets',
    cta: 'Apply as Developer',
    href: '/join/developer',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Property Management',
    eyebrow: 'Owner Services',
    description:
      'Support luxury owners with rental management, maintenance, tenant coordination, relocation support, and concierge operations.',
    benefits: ['Managed property workflows', 'Owner communication', 'Concierge requests', 'Maintenance coordination'],
    regions: 'Urban, coastal, and resort markets with premium owner demand',
    cta: 'Apply as Property Management',
    href: '/join/property-management',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Photographers',
    eyebrow: 'Curated Visual Partners',
    description:
      'Viyra photography partners typically enter through trusted Realtor relationships to protect luxury presentation standards.',
    benefits: ['Recurring premium assignments', 'Realtor partnerships', 'Portfolio-led visibility', 'Quality-based approval path'],
    regions: 'Local luxury listing markets and trusted Realtor networks',
    cta: 'Join Through Realtor Partnership',
    href: '/join/photographer',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85'
  }
];

const profilePreviews = [
  ['Realtor', 'English, Spanish, French', 'Marbella, Dubai, Lisbon', 'Off-market villas, seller representation', '12 years', 'Verified profile pending'],
  ['Lawyer', 'English, Arabic, French', 'UAE, Morocco, France', 'Due diligence, contract review', '15 years', 'Bar registration review'],
  ['Notary', 'Spanish, Dutch, English', 'Spain, Portugal', 'Transfers, signing coordination', '18 years', 'Jurisdiction verification'],
  ['Developer', 'English, French, Arabic', 'Dubai, Cannes, Marrakech', 'Branded residences, off-plan projects', '20 years', 'Project review pending'],
  ['Property Management', 'English, Spanish, Dutch', 'Marbella, Ibiza, Algarve', 'Rental management, concierge, maintenance', '11 years', 'Company verification pending'],
  ['Photographer', 'English, Spanish', 'Costa del Sol, Ibiza', 'Luxury interiors, drone, twilight shoots', '9 years', 'Portfolio approval path']
];

const discoveryItems = [
  'Browse verified professional profiles',
  'Compare expertise, languages, and service regions',
  'Review portfolios, specialties, and experience',
  'Invite trusted professionals into transaction workflows',
  'Receive future concierge recommendations and verification badges'
];

export default function ProfessionalsPage() {
  return (
    <main className="min-h-screen bg-porcelain text-[#17110d]">
      <section className="relative overflow-hidden bg-[#080b0f] text-white">
        <img src={heroImage} alt="Luxury professional meeting space" className="absolute inset-0 h-full w-full object-cover opacity-48" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b0f]/96 via-[#080b0f]/78 to-[#080b0f]/30" />
        <div className="relative z-10">
          <SiteHeader light />
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              Professional Ecosystem
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
              Join a curated network for luxury real estate.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              Viyra connects trusted professionals with international buyers, investors, relocation clients,
              premium sellers, family offices, and global executives seeking discreet property expertise.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#roles" className="bg-gold px-7 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#d3b777]">
                Explore Roles
              </Link>
              <Link href="#membership" className="border border-white/20 px-7 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-gold hover:bg-white/5">
                Membership Model
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            How Viyra Works
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            A trusted environment for high-value property services.
          </h2>
        </div>
        <div className="grid gap-5 text-sm leading-7 text-taupe md:grid-cols-2">
          {[
            'Professionals create structured profiles that communicate service regions, languages, specialties, credentials, and experience.',
            'Clients discover relevant experts while browsing properties, preparing transactions, relocating, or coordinating premium services.',
            'Invitations bring professionals into transactions only where context is appropriate and accepted by the relevant parties.',
            'Future verification badges, premium profiles, ratings, portfolio review, and concierge recommendations will strengthen trust signals.'
          ].map((copy) => (
            <div className="border border-black/10 bg-white p-6 shadow-[0_18px_55px_rgba(23,23,23,0.05)]" key={copy}>
              {copy}
            </div>
          ))}
        </div>
      </section>

      <section id="roles" className="bg-[#080b0f] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Select Your Role
            </p>
            <h2 className="font-display text-4xl md:text-5xl">
              Professional paths inside the Viyra ecosystem.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {professionalRoles.map((role) => (
              <article className="grid overflow-hidden border border-white/10 bg-white/[0.035] md:grid-cols-[0.85fr_1.15fr]" key={role.title}>
                <img src={role.image} alt={`${role.title} profile preview`} className="h-64 w-full object-cover md:h-full" />
                <div className="p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">{role.eyebrow}</p>
                  <h3 className="mt-3 font-display text-3xl">{role.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/72">{role.description}</p>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/52">Benefits</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.benefits.map((benefit) => (
                      <span className="border border-white/10 px-3 py-2 text-xs text-white/72" key={benefit}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-white/64">{role.regions}</p>
                  <Link
                    href={role.href as any}
                    className="mt-7 inline-flex border border-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-black"
                  >
                    {role.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Client Discovery
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Be discoverable by qualified buyers, sellers, and advisors.
          </h2>
          <p className="mt-6 text-sm leading-7 text-taupe">
            Professionals become part of a trusted network where clients can evaluate expertise,
            understand service coverage, and invite the right partners into refined transaction workflows.
          </p>
        </div>
        <div className="grid gap-3">
          {discoveryItems.map((item) => (
            <div className="flex items-center justify-between border border-black/10 bg-white px-5 py-4 text-sm text-taupe" key={item}>
              <span>{item}</span>
              <span className="h-2 w-2 rotate-45 border-r border-t border-gold" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#eee6d8]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Profile Preview
              </p>
              <h2 className="font-display text-4xl md:text-5xl">Premium professional profiles.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-taupe">
              Profiles are designed to support client confidence through language, region, specialty, experience, and verification signals.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profilePreviews.map(([role, languages, regions, specialties, experience, verification], index) => (
              <article className="border border-black/10 bg-white p-5 shadow-[0_18px_55px_rgba(23,23,23,0.05)]" key={role}>
                <div className="aspect-[1.1] bg-[#080b0f]">
                  <img
                    src={`https://images.unsplash.com/photo-${[
                      '1500648767791-00dcc994a43e',
                      '1494790108377-be9c29b29330',
                      '1507003211169-0a1dd7228f2d',
                      '1486406146926-c627a92ad1ab',
                      '1560518883-ce09059eeffa',
                      '1534528741775-53994a69daeb'
                    ][index]}?auto=format&fit=crop&w=700&q=85`}
                    alt={`${role} profile placeholder`}
                    className="h-full w-full object-cover opacity-86"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl">{role}</h3>
                <dl className="mt-4 grid gap-3 text-xs leading-5 text-taupe">
                  <ProfileLine label="Languages" value={languages} />
                  <ProfileLine label="Regions" value={regions} />
                  <ProfileLine label="Specialties" value={specialties} />
                  <ProfileLine label="Experience" value={experience} />
                  <ProfileLine label="Verification" value={verification} />
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-20">
        <div className="border border-black/10 bg-white p-8 shadow-[0_20px_70px_rgba(23,23,23,0.06)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Professional Membership
          </p>
          <h2 className="font-display text-4xl leading-tight">
            Visibility within a curated ecosystem.
          </h2>
          <p className="mt-6 text-sm leading-7 text-taupe">
            A transparent professional membership gives access to visibility within the Viyra ecosystem
            and allows clients to discover your services. Membership supports ecosystem participation,
            professional exposure, and network presence. It is not a promise of clients or income.
          </p>
        </div>
        <div className="border border-black/10 bg-[#080b0f] p-8 text-white shadow-[0_20px_70px_rgba(23,23,23,0.12)]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Photographer Access Model
          </p>
          <h2 className="font-display text-4xl leading-tight">
            Curated through trusted Realtor relationships.
          </h2>
          <p className="mt-6 text-sm leading-7 text-white/72">
            Photographers are encouraged to introduce their existing Realtor partners to Viyra so they can collaborate
            together inside the ecosystem. Realtors help maintain visual consistency, luxury presentation quality,
            local trust, marketing standards, communication, and brand reliability.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-white/70">
            {['Realtor joins Viyra', 'Realtor invites preferred photographer', 'Photographer creates profile', 'Assignments flow through trusted relationships', 'Independent discoverability follows verification and quality scoring'].map((step) => (
              <div className="border border-white/10 px-4 py-3" key={step}>{step}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-[0.14em] text-[#17110d]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
