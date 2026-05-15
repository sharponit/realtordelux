import type { Json } from '@/lib/supabase/types';

export const RESIDENCY_DISCLAIMER =
  'This is not legal advice. Eligibility must be verified by a qualified immigration lawyer.';

export type ResidencyActionSource = 'view' | 'save' | 'offer' | 'purchase' | 'manual_review';

export type BuyerResidencyProfile = {
  nationality?: string | null;
  currentTaxResidency?: string | null;
  familySize?: number | null;
  remoteWorker?: boolean | null;
  investmentIntent?: 'primary_residence' | 'investment' | 'relocation' | 'tax_planning' | null;
  preferredLanguage?: string | null;
};

export type ResidencyRule = {
  id: string;
  country: string;
  countryCode: string;
  pathwayKey: string;
  pathwayName: string;
  status: 'active' | 'draft' | 'paused';
  minPropertyValue: number;
  currency: string;
  eligibleNationalities?: string[];
  excludedNationalities?: string[];
  buyerProfileRequirements?: Record<string, Json>;
  summary: string;
  multilingualContent: Record<string, { pathwayName: string; summary: string }>;
  disclaimer: string;
  reviewRecommended: boolean;
  luxuryMarkets: string[];
};

export type PropertyResidencyInput = {
  id: string;
  country?: string | null;
  city?: string | null;
  price?: number | null;
};

export type ResidencyOpportunity = {
  applicable: boolean;
  country: string;
  pathwayKey: string;
  pathwayName: string;
  summary: string;
  minPropertyValue: number;
  currency: string;
  propertyPrice: number;
  actionSource: ResidencyActionSource;
  ruleId: string;
  disclaimer: string;
};

export const defaultResidencyRules: ResidencyRule[] = [
  {
    id: 'spain-golden-visa-transition',
    country: 'Spain',
    countryCode: 'ES',
    pathwayKey: 'spain_residency_legal_review',
    pathwayName: 'Spain Residency Legal Review',
    status: 'active',
    minPropertyValue: 500000,
    currency: 'EUR',
    excludedNationalities: ['Spain'],
    summary:
      'Spanish luxury property may create immigration, relocation, or tax residency planning questions that should be reviewed before offer or completion.',
    multilingualContent: {
      en: {
        pathwayName: 'Spain Residency Legal Review',
        summary:
          'This property may justify a qualified review of Spanish residency, relocation, or tax residency options.'
      },
      es: {
        pathwayName: 'Revision legal de residencia en Espana',
        summary:
          'Esta propiedad puede justificar una revision cualificada de opciones de residencia, reubicacion o residencia fiscal en Espana.'
      },
      fr: {
        pathwayName: 'Revue juridique de residence en Espagne',
        summary:
          'Ce bien peut justifier une analyse qualifiee des options de residence, relocation ou residence fiscale en Espagne.'
      },
      ar: {
        pathwayName: 'Spain Residency Legal Review',
        summary:
          'This property may justify a qualified review of Spanish residency, relocation, or tax residency options.'
      },
      nl: {
        pathwayName: 'Juridische beoordeling verblijf Spanje',
        summary:
          'Deze woning kan aanleiding geven tot een gekwalificeerde beoordeling van verblijf, verhuizing of fiscale residentie in Spanje.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Marbella', 'Madrid', 'Barcelona', 'Mallorca', 'Ibiza']
  },
  {
    id: 'uae-golden-visa-property-investor',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    pathwayKey: 'uae_property_investor_review',
    pathwayName: 'UAE Property Investor Residency Review',
    status: 'draft',
    minPropertyValue: 2000000,
    currency: 'AED',
    summary:
      'UAE property purchases can be relevant to investor residency review depending on property value, title status, and buyer profile.',
    multilingualContent: {
      en: {
        pathwayName: 'UAE Property Investor Residency Review',
        summary:
          'This property may be relevant to a qualified review of UAE investor residency options.'
      },
      ar: {
        pathwayName: 'UAE Property Investor Residency Review',
        summary:
          'This property may be relevant to a qualified review of UAE investor residency options.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Dubai', 'Abu Dhabi']
  },
  {
    id: 'portugal-residency-relocation-review',
    country: 'Portugal',
    countryCode: 'PT',
    pathwayKey: 'portugal_residency_relocation_review',
    pathwayName: 'Portugal Residency & Relocation Review',
    status: 'draft',
    minPropertyValue: 0,
    currency: 'EUR',
    summary:
      'Portugal remains relevant for relocation, tax residency, and immigration planning reviews even where property is not a standalone guarantee.',
    multilingualContent: {
      en: {
        pathwayName: 'Portugal Residency & Relocation Review',
        summary:
          'This property may support a qualified relocation or tax residency planning review for Portugal.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Lisbon', 'Cascais', 'Comporta', 'Algarve']
  },
  {
    id: 'greece-golden-visa-review',
    country: 'Greece',
    countryCode: 'GR',
    pathwayKey: 'greece_golden_visa_review',
    pathwayName: 'Greece Golden Visa Review',
    status: 'draft',
    minPropertyValue: 250000,
    currency: 'EUR',
    summary:
      'Greek property may be relevant to golden visa review subject to location, threshold, and current legal rules.',
    multilingualContent: {
      en: {
        pathwayName: 'Greece Golden Visa Review',
        summary:
          'This property may justify a qualified review of Greek golden visa or relocation options.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Athens', 'Mykonos', 'Santorini', 'Crete']
  },
  {
    id: 'morocco-residency-review',
    country: 'Morocco',
    countryCode: 'MA',
    pathwayKey: 'morocco_residency_review',
    pathwayName: 'Morocco Residency Review',
    status: 'draft',
    minPropertyValue: 0,
    currency: 'MAD',
    summary:
      'Moroccan luxury property can be relevant to relocation and long-stay residency planning review.',
    multilingualContent: {
      en: {
        pathwayName: 'Morocco Residency Review',
        summary:
          'This property may support a qualified Moroccan residency or relocation planning review.'
      },
      fr: {
        pathwayName: 'Revue de residence au Maroc',
        summary:
          'Ce bien peut soutenir une analyse qualifiee de residence ou de relocation au Maroc.'
      },
      ar: {
        pathwayName: 'Morocco Residency Review',
        summary:
          'This property may support a qualified Moroccan residency or relocation planning review.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Marrakech', 'Casablanca', 'Rabat', 'Tangier']
  },
  {
    id: 'paraguay-residency-review',
    country: 'Paraguay',
    countryCode: 'PY',
    pathwayKey: 'paraguay_residency_review',
    pathwayName: 'Paraguay Residency Review',
    status: 'draft',
    minPropertyValue: 0,
    currency: 'USD',
    summary:
      'Paraguay property interest can be relevant to residency and tax planning review depending on buyer circumstances.',
    multilingualContent: {
      en: {
        pathwayName: 'Paraguay Residency Review',
        summary:
          'This property may support a qualified Paraguay residency or tax planning review.'
      },
      es: {
        pathwayName: 'Revision de residencia en Paraguay',
        summary:
          'Esta propiedad puede apoyar una revision cualificada de residencia o planificacion fiscal en Paraguay.'
      }
    },
    disclaimer: RESIDENCY_DISCLAIMER,
    reviewRecommended: true,
    luxuryMarkets: ['Asuncion']
  }
];

export function evaluateResidencyOpportunity({
  property,
  buyerProfile,
  actionSource = 'view',
  rules = defaultResidencyRules,
  language = 'en'
}: {
  property: PropertyResidencyInput;
  buyerProfile?: BuyerResidencyProfile | null;
  actionSource?: ResidencyActionSource;
  rules?: ResidencyRule[];
  language?: string;
}): ResidencyOpportunity | null {
  const propertyCountry = normalizeCountry(property.country);
  const propertyPrice = Number(property.price || 0);

  if (!propertyCountry || propertyPrice < 0) {
    return null;
  }

  const matchingRules = rules
    .filter((rule) => rule.status === 'active')
    .filter((rule) => normalizeCountry(rule.country) === propertyCountry)
    .filter((rule) => propertyPrice >= Number(rule.minPropertyValue || 0))
    .filter((rule) => isNationalityAllowed(rule, buyerProfile?.nationality))
    .sort((a, b) => Number(b.minPropertyValue || 0) - Number(a.minPropertyValue || 0));

  const rule = matchingRules[0];

  if (!rule) {
    return null;
  }

  const translated = rule.multilingualContent[language] || rule.multilingualContent.en;

  return {
    applicable: true,
    country: rule.country,
    pathwayKey: rule.pathwayKey,
    pathwayName: translated?.pathwayName || rule.pathwayName,
    summary: translated?.summary || rule.summary,
    minPropertyValue: rule.minPropertyValue,
    currency: rule.currency,
    propertyPrice,
    actionSource,
    ruleId: rule.id,
    disclaimer: rule.disclaimer || RESIDENCY_DISCLAIMER
  };
}

export function getResidencyRulesForCountry(country?: string | null) {
  const normalized = normalizeCountry(country);
  return defaultResidencyRules.filter((rule) => normalizeCountry(rule.country) === normalized);
}

function isNationalityAllowed(rule: ResidencyRule, nationality?: string | null) {
  const normalizedNationality = normalizeCountry(nationality);

  if (!normalizedNationality) {
    return true;
  }

  if (rule.excludedNationalities?.some((country) => normalizeCountry(country) === normalizedNationality)) {
    return false;
  }

  if (!rule.eligibleNationalities?.length) {
    return true;
  }

  return rule.eligibleNationalities.some((country) => normalizeCountry(country) === normalizedNationality);
}

export function normalizeCountry(country?: string | null) {
  return String(country || '')
    .trim()
    .toLowerCase()
    .replace(/^uae$/, 'united arab emirates')
    .replace(/^es$/, 'spain')
    .replace(/^ae$/, 'united arab emirates')
    .replace(/^pt$/, 'portugal')
    .replace(/^gr$/, 'greece')
    .replace(/^ma$/, 'morocco')
    .replace(/^py$/, 'paraguay');
}
