import { getPrimaryRole, roleDashboardPath, type OnboardingStatus, type UserRole } from './roles';

export interface RoutingProfile {
  role: UserRole;
  roles?: UserRole[];
  onboarding_status: OnboardingStatus;
}

export function getPostLoginPath(profile: RoutingProfile | null, nextPath?: string | null) {
  const onboardingNext = nextPath?.startsWith('/onboarding') ? nextPath : null;

  if (!profile) {
    return onboardingNext || '/onboarding';
  }

  if (profile.onboarding_status !== 'complete') {
    return onboardingNext || '/onboarding';
  }

  return roleDashboardPath[getPrimaryRole(profile.roles?.length ? profile.roles : [profile.role])];
}
