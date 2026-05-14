import { getPrimaryRole, roleDashboardPath, type OnboardingStatus, type UserRole } from './roles';

export interface RoutingProfile {
  role: UserRole;
  roles?: UserRole[];
  onboarding_status: OnboardingStatus;
}

export function getPostLoginPath(profile: RoutingProfile | null) {
  if (!profile) {
    return '/onboarding';
  }

  if (profile.onboarding_status !== 'complete') {
    return '/onboarding';
  }

  return roleDashboardPath[getPrimaryRole(profile.roles?.length ? profile.roles : [profile.role])];
}
