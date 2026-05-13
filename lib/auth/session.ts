import { redirect } from 'next/navigation';
import { getPostLoginPath } from './routing';
import { canAccessRole } from './permissions';
import { isUserRole, type UserRole } from './roles';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ProfileRow } from '@/lib/supabase/types';

export async function getCurrentUserProfile() {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
  return { user, profile: (profile || null) as ProfileRow | null };
}

export async function requireUserProfile() {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    redirect('/login');
  }

  if (!profile) {
    redirect('/onboarding');
  }

  return { user, profile };
}

export async function requireOnboardedProfile() {
  const { user, profile } = await requireUserProfile();

  if (profile.onboarding_status !== 'complete') {
    redirect(getPostLoginPath({ role: profile.role, onboarding_status: profile.onboarding_status }) as any);
  }

  return { user, profile };
}

export async function requireRoleRoute(routeRole: string) {
  const { user, profile } = await requireOnboardedProfile();
  const normalizedRole = routeRole.replaceAll('-', '_');

  if (!isUserRole(normalizedRole) || !canAccessRole(profile.role, normalizedRole as UserRole)) {
    redirect(getPostLoginPath({ role: profile.role, onboarding_status: profile.onboarding_status }) as any);
  }

  return { user, profile, routeRole: normalizedRole as UserRole };
}
