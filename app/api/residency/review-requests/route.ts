import { NextResponse, type NextRequest } from 'next/server';
import { createNotification } from '@/lib/platform/notifications';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required to request lawyer review.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.country || !body?.residency_pathway) {
    return NextResponse.json({ error: 'Residency country and pathway are required.' }, { status: 400 });
  }

  const assignedLawyerId = await findImmigrationLawyer(supabase, body.country);
  const propertyId = uuidPattern.test(String(body.property_id || '')) ? body.property_id : null;

  const { data: interest, error: interestError } = await supabase
    .from('residency_opportunity_interests')
    .insert({
      buyer_id: user.id,
      property_id: propertyId,
      country: String(body.country),
      residency_pathway: String(body.residency_pathway),
      rule_id: body.rule_id || null,
      action_source: body.action_source || 'manual_review',
      buyer_nationality: body.buyer_nationality || null,
      buyer_profile: body.buyer_profile || {},
      status: assignedLawyerId ? 'assigned' : 'review_requested',
      assigned_lawyer_id: assignedLawyerId
    })
    .select('*')
    .single();

  if (interestError) {
    return NextResponse.json({ error: interestError.message }, { status: 400 });
  }

  const { data: reviewRequest, error: reviewError } = await supabase
    .from('residency_lawyer_review_requests')
    .insert({
      interest_id: interest.id,
      requested_by: user.id,
      assigned_lawyer_id: assignedLawyerId,
      country: String(body.country),
      residency_pathway: String(body.pathway_name || body.residency_pathway),
      message: body.message || null,
      status: assignedLawyerId ? 'assigned' : 'pending_lawyer_assignment'
    })
    .select('*')
    .single();

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 400 });
  }

  if (assignedLawyerId) {
    await createNotification(supabase, {
      user_id: assignedLawyerId,
      type: 'immigration_lawyer_review_requested',
      title: 'Immigration lawyer review requested',
      body:
        'A buyer requested an informational residency and relocation review for a property opportunity.',
      metadata: {
        request_id: reviewRequest.id,
        interest_id: interest.id,
        country: body.country,
        residency_pathway: body.residency_pathway,
        property_id: propertyId
      }
    });
  }

  return NextResponse.json({
    request: reviewRequest,
    interest,
    message: assignedLawyerId
      ? 'Your request has been routed to an immigration lawyer profile.'
      : 'Your request has been stored and is awaiting immigration lawyer assignment.'
  });
}

async function findImmigrationLawyer(supabase: any, country: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id,country,role')
    .eq('role', 'lawyer')
    .or(`country.ilike.${country},country.is.null`)
    .limit(1)
    .maybeSingle();

  if (profile?.user_id) {
    return profile.user_id;
  }

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'lawyer')
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  return roleRow?.user_id || null;
}
