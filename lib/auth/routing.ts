import { roleDashboardPath, type OnboardingStatus, type UserRole } from './roles';

export interface RoutingProfile {
  role: UserRole;
  onboarding_status: OnboardingStatus;
}

export function getPostLoginPath(profile: RoutingProfile | null) {
  if (!profile) {
    return '/onboarding';
  }

  if (profile.onboarding_status !== 'complete') {
    return '/onboarding';
  }

  return roleDashboardPath[profile.role];
}
