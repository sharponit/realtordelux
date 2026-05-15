import { getPrimaryRole, isUserRole, type UserRole } from '@/lib/auth/roles';

export type OnboardingIntent =
  | 'buy_property'
  | 'sell_property'
  | 'rent_property'
  | 'invest_real_estate'
  | 'represent_clients'
  | 'legal_services'
  | 'notary_services'
  | 'develop_projects'
  | 'manage_properties'
  | 'photography_services'
  | 'explore_opportunities';

export type OnboardingAnswers = {
  intents: OnboardingIntent[];
  profile: {
    fullName: string;
    phone?: string;
    preferredLanguages: string[];
  };
  details: Record<string, unknown>;
};

const intentRoleMap: Record<OnboardingIntent, UserRole> = {
  buy_property: 'buyer',
  sell_property: 'seller',
  rent_property: 'renter',
  invest_real_estate: 'investor',
  represent_clients: 'realtor',
  legal_services: 'lawyer',
  notary_services: 'notary',
  develop_projects: 'developer',
  manage_properties: 'property_manager',
  photography_services: 'photographer',
  explore_opportunities: 'general'
};

export function assignRolesFromOnboarding(answers: OnboardingAnswers) {
  const roles = Array.from(
    new Set(answers.intents.map((intent) => intentRoleMap[intent]).filter(isUserRole))
  );
  const assignedRoles = roles.length ? roles : (['general'] satisfies UserRole[]);

  return {
    roles: assignedRoles,
    primaryRole: getPrimaryRole(assignedRoles),
    onboardingStatus: 'complete' as const
  };
}
