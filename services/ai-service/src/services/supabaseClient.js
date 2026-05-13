import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export function createSupabaseServiceClient() {
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function logAiEvent(event) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return;
  }

  await supabase.from('ai_service_events').insert({
    event_type: event.type,
    role: event.role || null,
    language: event.language || null,
    metadata: event.metadata || {}
  });
}
