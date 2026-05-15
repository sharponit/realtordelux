import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active');
  const canInvite = (roles || []).some((row: { role: string }) =>
    ['realtor', 'admin', 'super_admin'].includes(row.role)
  );

  if (!canInvite) {
    return NextResponse.json({ error: 'Photographer invitations are available to verified Realtors.' }, { status: 403 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('photography_job_invites')
    .insert({
      photography_job_id: body.photography_job_id || null,
      property_id: body.property_id || null,
      invited_by: user.id,
      photographer_name: body.photographer_name,
      photographer_email: body.photographer_email,
      photographer_phone: body.photographer_phone || null,
      notes: body.notes || null,
      status: 'invited'
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    invite: data,
    delivery: 'Email delivery placeholder. Connect transactional email provider here.'
  });
}
