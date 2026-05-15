import { NextResponse, type NextRequest } from 'next/server';
import { createNotification, queueEmailPlaceholder } from '@/lib/platform/notifications';
import { supabaseService } from '@/lib/supabase/server';

const neutralSuccess =
  "Your request has been sent. If the Realtor is already on Viyra, they can review it. Otherwise, they'll receive an invitation to join.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

type RequestBody = {
  photographer_name?: string;
  photographer_email?: string;
  realtor_name?: string;
  realtor_email?: string;
  message?: string;
  company?: string;
};

export async function POST(request: NextRequest) {
  let body: RequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please check the details and try again.' }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true, message: neutralSuccess });
  }

  const photographerName = clean(body.photographer_name);
  const photographerEmail = clean(body.photographer_email).toLowerCase();
  const realtorName = clean(body.realtor_name);
  const realtorEmail = clean(body.realtor_email).toLowerCase();
  const message = clean(body.message, 1000);

  if (!photographerName || !photographerEmail || !realtorEmail) {
    return NextResponse.json({ error: 'Please add your name, your email, and the Realtor email.' }, { status: 400 });
  }

  if (!emailPattern.test(photographerEmail) || !emailPattern.test(realtorEmail)) {
    return NextResponse.json({ error: 'Please enter valid email addresses.' }, { status: 400 });
  }

  const rateKey = getRateKey(request);
  if (isLimited(rateKey)) {
    return NextResponse.json({ error: 'Please wait a little before sending another request.' }, { status: 429 });
  }

  const hasSupabaseAdmin = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabaseAdmin) {
    return NextResponse.json({
      ok: true,
      message: neutralSuccess,
      delivery: 'Supabase service role is not configured. Request accepted as a development placeholder.'
    });
  }

  const supabase = supabaseService() as any;

  try {
    const realtorUserId = await findExistingRealtorUserId(supabase, realtorEmail);
    const requestStatus = realtorUserId ? 'pending_realtor_review' : 'pending_realtor_signup';

    const { data: requestRow, error: requestError } = await supabase
      .from('photographer_realtor_requests')
      .insert({
        photographer_name: photographerName,
        photographer_email: photographerEmail,
        realtor_name: realtorName || null,
        realtor_email: realtorEmail,
        message: message || null,
        status: requestStatus,
        existing_realtor_user_id: realtorUserId
      })
      .select('*')
      .single();

    if (requestError) {
      throw requestError;
    }

    const { data: invitation } = await supabase
      .from('invitations')
      .insert({
        invitation_type: 'realtor_photographer_invitation',
        sender_user_id: null,
        recipient_user_id: realtorUserId,
        recipient_email: realtorEmail,
        status: 'pending',
        context: {
          source: 'photographer_access_request',
          photographer_realtor_request_id: requestRow.id,
          photographer_name: photographerName,
          photographer_email: photographerEmail,
          realtor_name: realtorName || null,
          message: message || null
        }
      })
      .select('id')
      .maybeSingle();

    if (invitation?.id) {
      await supabase.from('photographer_realtor_requests').update({ invitation_id: invitation.id }).eq('id', requestRow.id);
    }

    await queueNotifications({
      supabase,
      requestId: requestRow.id,
      realtorUserId,
      realtorEmail,
      realtorName,
      photographerName,
      photographerEmail,
      message
    });

    return NextResponse.json({ ok: true, message: neutralSuccess });
  } catch (error) {
    console.error('photographer realtor request failed', error);
    return NextResponse.json({ error: 'We could not send the request right now. Please try again shortly.' }, { status: 500 });
  }
}

function clean(value?: string, limit = 180) {
  return String(value || '').trim().slice(0, limit);
}

function getRateKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

function isLimited(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);

  if (!current || current.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

async function findExistingRealtorUserId(supabase: any, realtorEmail: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id,role')
    .ilike('email', realtorEmail)
    .maybeSingle();

  if (!profile?.user_id) {
    return null;
  }

  if (profile.role === 'realtor') {
    return profile.user_id;
  }

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', profile.user_id)
    .eq('role', 'realtor')
    .eq('status', 'active')
    .maybeSingle();

  return roleRow ? profile.user_id : null;
}

async function queueNotifications({
  supabase,
  requestId,
  realtorUserId,
  realtorEmail,
  realtorName,
  photographerName,
  photographerEmail,
  message
}: {
  supabase: any;
  requestId: string;
  realtorUserId: string | null;
  realtorEmail: string;
  realtorName: string;
  photographerName: string;
  photographerEmail: string;
  message: string;
}) {
  const payload = {
    request_id: requestId,
    realtor_name: realtorName || null,
    photographer_name: photographerName,
    photographer_email: photographerEmail,
    message: message || null
  };

  if (realtorUserId) {
    await createNotification(supabase, {
      user_id: realtorUserId,
      type: 'photographer_access_request',
      title: 'Photographer access request on Viyra',
      body:
        'A photographer has requested access to Viyra through your Realtor profile. Review and approve the request if you work with them and want to add them as a trusted photography partner.',
      metadata: payload
    });
  }

  await queueEmailPlaceholder(supabase, {
    to_email: realtorEmail,
    template: realtorUserId ? 'photographer_access_request_existing_realtor' : 'photographer_access_request_realtor_lead',
    subject: realtorUserId
      ? 'Photographer access request on Viyra'
      : 'Your photography partner invited you to discover Viyra',
    payload
  });

  await queueEmailPlaceholder(supabase, {
    to_email: photographerEmail,
    template: 'photographer_access_request_confirmation',
    subject: 'Your Viyra access request has been sent',
    payload
  });
}
