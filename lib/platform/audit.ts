import type { Json } from '@/lib/supabase/types';

export async function writeAuditLog(
  supabase: any,
  input: {
    actor_id?: string | null;
    action: string;
    resource_type: string;
    resource_id?: string | null;
    metadata?: Json;
  }
) {
  await supabase.from('audit_logs').insert({
    actor_id: input.actor_id || null,
    action: input.action,
    resource_type: input.resource_type,
    resource_id: input.resource_id || null,
    metadata: input.metadata || {}
  });
}
