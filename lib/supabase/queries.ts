/** Luxary Realtor™ */
import { supabase } from './client';
export const listProperties = async () => supabase.from('properties').select('*').is('deleted_at', null);
export const getMyProfile = async (userId: string) => supabase.from('profiles').select('*').eq('id', userId).single();
