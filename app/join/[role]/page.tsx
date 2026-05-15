import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotographerRealtorRequest } from '@/components/join/PhotographerRealtorRequest';
import { SiteHeader } from '@/components/layout/SiteChrome';
import type { OnboardingIntent } from '@/lib/onboarding/roleAssignment';

type JoinRole = 'realtor' | 'lawyer' | 'notary' | 'developer' | 'property-management' | 'photographer';

const openRolePages: Record<Exclude<JoinRole, 'photographer'>, {
  title: string;
  eyebrow: string;
  intro: string;
  intent: OnboardingIntent;
  collect: string[];
  verification: string[];
  dashboard: string[];
  image: string;
}> = {
  realtor: {
    title: 'Apply as a Viyra Realtor',
    eyebrow: 'Luxury Representation',
    intro:
      'Build a verified professional presence for luxury buyers, sellers, investors, and relocation clients seeking trusted market representation.',
    intent: 'represent_clients',
    collect: ['Individual or agency profile', 'Company and chamber details', 'Operating countries and cities', 'Team size and specialties', 'Languages and luxury market experience', 'Website and social presence'],
    verification: ['Company verification', 'License validation', 'Identity verification'],
    dashboard: ['Listings', 'Clients', 'Seller Invitations', 'Photographer Invitations', 'Lawyer Recommendations', 'Transactions'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=90'
  },
  lawyer: {
    title: 'Apply as a Viyra Lawyer',
    eyebrow: 'Legal Trust',
    intro:
      'Position your legal expertise for premium property clients who need due diligence, contract review, tax, immigration, investment structure, or inheritance support.',
    intent: 'legal_services',
    collect: ['Law firm name', 'Bar registration', 'Jurisdiction', 'Specializations', 'Languages spoken', 'Countries served', 'Luxury transaction experience'],
    verification: ['Bar registration review', 'Jurisdiction validation', 'Professional profile verification'],
    dashboard: ['Legal Files', 'Due Diligence', 'Contracts', 'Client Requests', 'Transaction Context'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=90'
  },
  notary: {
    title: 'Apply as a Viyra Notary',
    eyebrow: 'Formal Transaction Support',
    intro:
      'Create a verified office profile for clients and lawyers coordinating signing appointments, transfer milestones, and formal transaction steps.',
    intent: 'notary_services',
    collect: ['Office name', 'Registration number', 'Jurisdiction', 'Supported regions', 'Appointment capabilities', 'Languages spoken'],
    verification: ['Office verification', 'Registration validation', 'Jurisdiction review'],
    dashboard: ['Notary Files', 'Transfer Appointments', 'Signing Workflow', 'Accepted Transaction Context'],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=90'
  },
  developer: {
    title: 'Apply as a Viyra Developer',
    eyebrow: 'New Construction And Projects',
    intro:
      'Introduce off-plan projects, branded residences, investment developments, and new construction inventory inside a premium property ecosystem.',
    intent: 'develop_projects',
    collect: ['Developer company name', 'Active projects', 'Regions', 'Project scale', 'Construction status', 'Website', 'Investment focus', 'Luxury segment experience'],
    verification: ['Company verification', 'Project review', 'Development documentation placeholder'],
    dashboard: ['Development Projects', 'Investor Leads', 'Sales Progress', 'Floorplans', 'Investor Marketing', 'Media Management'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=90'
  },
  'property-management': {
    title: 'Apply as a Property Management Company',
    eyebrow: 'Owner Operations',
    intro:
      'Support luxury owners with rental management, concierge service, maintenance, tenant handling, relocation support, and investment operations.',
    intent: 'manage_properties',
    collect: ['Company name', 'Operating regions', 'Services offered', 'Team size', 'Luxury experience', 'Emergency support capabilities', 'Languages', 'Management types'],
    verification: ['Company verification', 'Service region review', 'Operational capability placeholder'],
    dashboard: ['Managed Properties', 'Maintenance', 'Tenants', 'Concierge Requests', 'Owner Communication'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=90'
  }
};

export function generateStaticParams() {
  return ['realtor', 'lawyer', 'notary', 'developer', 'property-management', 'photographer'].map((role) => ({ role }));
}

export default async function JoinRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;

  if (role === 'photographer') {
    return <PhotographerInvitationPage />;
  }

  if (!isOpenRole(role)) {
    notFound();
  }

  const page = openRolePages[role];
  const onboardingPath = `/onboarding?intent=${page.intent}`;

  return (
    <main className="min-h-screen bg-porcelain text-[#17110d]">
      <section className="relative overflow-hidden bg-[#080b0f] text-white">
        <img src={page.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b0f]/96 via-[#080b0f]/78 to-[#080b0f]/28" />
        <div className="relative z-10">
          <SiteHeader light />
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pb-28 lg:pt-28">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">{page.eyebrow}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">{page.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/76">{page.intro}</p>
            <Link
              href={`/login?next=${encodeURIComponent(onboardingPath)}` as any}
              className="mt-10 inline-flex bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#d3b777]"
            >
              Begin Application
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-3 lg:px-10">
        <InfoPanel title="Onboarding Focus" items={page.collect} />
        <InfoPanel title="Verification Path" items={page.verification} />
        <InfoPanel title="Dashboard Preview" items={page.dashboard} />
      </section>
    </main>
  );
}

function PhotographerInvitationPage() {
  return (
    <main className="min-h-screen bg-[#080b0f] text-white">
      <SiteHeader light />
      <section className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-10 lg:py-28">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">Invitation-Only Partner Access</p>
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">Photographers join through trusted Realtor partnerships.</h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/72">
          Viyra photography partners enter through Realtor invitation to protect luxury presentation standards,
          communication quality, local trust, reliability, and brand consistency.
        </p>
        <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
          {[
            'Realtor invites preferred photographer',
            'Photographer creates profile after invitation',
            'Portfolio, pricing, drone, equipment, regions, and languages are reviewed',
            'Independent discoverability follows successful projects, platform verification, quality scoring, and portfolio approval'
          ].map((item) => (
            <div className="border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/74" key={item}>
              {item}
            </div>
          ))}
        </div>
        <PhotographerRealtorRequest />
      </section>
    </main>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(23,23,23,0.05)]">
      <h2 className="font-display text-3xl">{title}</h2>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div className="border border-black/10 bg-porcelain px-4 py-3 text-sm text-taupe" key={item}>
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function isOpenRole(role: string): role is Exclude<JoinRole, 'photographer'> {
  return role in openRolePages;
}
