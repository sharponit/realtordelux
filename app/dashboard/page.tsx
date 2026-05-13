import { redirect } from 'next/navigation';
import { getPostLoginPath } from '@/lib/auth/routing';
import { requireUserProfile } from '@/lib/auth/session';

export default async function DashboardIndex() {
  const { profile } = await requireUserProfile();
  redirect(getPostLoginPath({ role: profile.role, onboarding_status: profile.onboarding_status }) as any);
}
