import { createSupabaseBrowserClient } from './client';
import { createSupabaseServerClient } from './server';

export const listProperties = async () =>
  createSupabaseBrowserClient().from('properties').select('*').is('deleted_at', null);

export async function getMyProfileClient(userId: string) {
  return createSupabaseBrowserClient().from('profiles').select('*').eq('user_id', userId).single();
}

export async function getMyProfileServer() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
  return { user, profile };
}
