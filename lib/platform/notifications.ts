import type { Json } from '@/lib/supabase/types';

export async function createNotification(
  supabase: any,
  input: {
    user_id: string;
    type: string;
    title: string;
    body: string;
    metadata?: Json;
  }
) {
  await supabase.from('notifications').insert({
    user_id: input.user_id,
    type: input.type,
    title: input.title,
    body: input.body,
    metadata: input.metadata || {}
  });
}

export async function queueEmailPlaceholder(
  supabase: any,
  input: {
    to_email: string;
    template: string;
    subject: string;
    payload?: Json;
  }
) {
  await supabase.from('notification_events').insert({
    channel: 'email',
    status: 'queued',
    to_email: input.to_email,
    template: input.template,
    subject: input.subject,
    payload: input.payload || {}
  });
}
