import type { ReactElement, SVGProps } from 'react';
import { enabledSocialPlatforms, type SocialPlatformId } from '@/lib/config/social';
import { t, type Locale } from '@/lib/i18n';

type SocialProfileButtonsVariant = 'footer' | 'inline' | 'compact';

type SocialProfileButtonsProps = {
  variant?: SocialProfileButtonsVariant;
  showLabels?: boolean;
  className?: string;
  locale?: Locale;
};

const iconClassName = 'h-4 w-4';

const icons: Record<SocialPlatformId, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M5.1 8.6H2v10h3.1v-10ZM3.5 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 3.5 4Zm13 4.4c-1.6 0-2.6.9-3.1 1.7V8.6h-3v10h3.1v-5.4c0-1.4.7-2.2 1.9-2.2 1.1 0 1.7.7 1.7 2.1v5.5h3.1v-5.9c0-2.9-1.5-4.3-3.7-4.3Z" />
    </svg>
  ),
  instagram: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect width="14.5" height="14.5" x="4.75" y="4.75" rx="4.2" />
      <circle cx="12" cy="12" r="3.3" />
      <circle cx="16.35" cy="7.65" r=".8" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M21 8.1a3 3 0 0 0-2.1-2.1C17 5.5 12 5.5 12 5.5S7 5.5 5.1 6A3 3 0 0 0 3 8.1 31 31 0 0 0 2.5 12c0 1.3.2 2.6.5 3.9A3 3 0 0 0 5.1 18c1.9.5 6.9.5 6.9.5s5 0 6.9-.5a3 3 0 0 0 2.1-2.1c.3-1.3.5-2.6.5-3.9s-.2-2.6-.5-3.9ZM10.3 15V9l5.2 3-5.2 3Z" />
    </svg>
  ),
  x: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M14 10.6 21.7 2h-1.8l-6.7 7.5L7.9 2H1.7l8.1 11.5L1.7 22h1.8l7.1-7.9 5.7 7.9h6.2L14 10.6Zm-2.5 2.8-.8-1.1L4.2 3.4H7l5.2 7.1.8 1.1 6.9 9.1h-2.8l-5.6-7.3Z" />
    </svg>
  )
};

const variantClasses: Record<SocialProfileButtonsVariant, string> = {
  footer: 'justify-center md:justify-start',
  inline: 'justify-center sm:justify-start',
  compact: 'justify-center'
};

const buttonClasses: Record<SocialProfileButtonsVariant, string> = {
  footer:
    'h-10 min-w-10 border-white/15 bg-white/[0.03] px-3 text-white/78 hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:ring-gold/70',
  inline:
    'h-11 min-w-11 border-black/10 bg-[#171717] px-3 text-ivory hover:border-gold hover:bg-[#211c14] hover:text-gold focus-visible:ring-gold/70',
  compact:
    'h-9 min-w-9 border-white/15 bg-white/[0.03] px-2.5 text-white/78 hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:ring-gold/70'
};

export function SocialProfileButtons({
  variant = 'inline',
  showLabels = variant !== 'compact',
  className = '',
  locale = 'en'
}: SocialProfileButtonsProps) {
  const copy = t(locale);

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${variantClasses[variant]} ${className}`}>
      {showLabels ? (
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-current opacity-60">
          {copy.social.followViyra}
        </span>
      ) : null}
      {enabledSocialPlatforms.map((platform) => {
        const Icon = icons[platform.id];

        return (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.ariaLabel}
            className={`inline-flex items-center justify-center gap-2 rounded-full border text-[11px] font-semibold uppercase tracking-[0.14em] transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] ${buttonClasses[variant]}`}
          >
            <Icon className={iconClassName} />
            {showLabels ? <span>{platform.name}</span> : null}
          </a>
        );
      })}
    </div>
  );
}
