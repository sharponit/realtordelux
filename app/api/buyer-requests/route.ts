import { NextResponse, type NextRequest } from 'next/server';
import { matchRealtorsForBuyerRequest } from '@/lib/buyerRequests/matching';
import { createNotification, queueEmailPlaceholder } from '@/lib/platform/notifications';
import { supabaseService } from '@/lib/supabase/server';

const successMessage =
  'Your request has been shared with selected Viyra Realtors in your chosen region. Qualified professionals can now respond with tailored service proposals. You stay in control of who you choose to continue with.';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

type BuyerRequestBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  preferred_contact_method?: string;
  preferred_language?: string;
  country?: string;
  region?: string;
  city?: string;
  property_type?: string;
  budget_min?: string | number | null;
  budget_max?: string | number | null;
  budget_label?: string;
  timeline?: string;
  buying_purpose?: string;
  financing_needed?: string;
  special_requirements?: string[];
  message?: string;
  company?: string;
};

export async function POST(request: NextRequest) {
  let body: BuyerRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please check the buying brief and try again.' }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true, message: successMessage, matched_realtors: 0 });
  }

  const payload = normalize(body);
  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const rateKey = getRateKey(request);
  if (isLimited(rateKey)) {
    return NextResponse.json({ error: 'Please wait a little before sending another buying brief.' }, { status: 429 });
  }

  const hasSupabaseAdmin = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabaseAdmin) {
    return NextResponse.json({
      ok: true,
      message: successMessage,
      matched_realtors: 0,
      delivery: 'Supabase service role is not configured. Request accepted as a development placeholder.'
    });
  }

  const supabase = supabaseService() as any;

  try {
    const { data: requestRow, error: requestError } = await supabase
      .from('buyer_requests')
      .insert({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone || null,
        preferred_contact_method: payload.preferred_contact_method,
        preferred_language: payload.preferred_language,
        country: payload.country,
        region: payload.region || null,
        city: payload.city,
        property_type: payload.property_type,
        budget_min: payload.budget_min,
        budget_max: payload.budget_max,
        timeline: payload.timeline,
        buying_purpose: payload.buying_purpose,
        financing_needed: payload.financing_needed,
        special_requirements: payload.special_requirements,
        message: payload.message || null,
        status: 'submitted'
      })
      .select('*')
      .single();

    if (requestError) {
      throw requestError;
    }

    const matches = await matchRealtorsForBuyerRequest(supabase, {
      id: requestRow.id,
      country: requestRow.country,
      region: requestRow.region,
      city: requestRow.city,
      property_type: requestRow.property_type,
      preferred_language: requestRow.preferred_language,
      budget_min: requestRow.budget_min,
      budget_max: requestRow.budget_max,
      timeline: requestRow.timeline,
      buying_purpose: requestRow.buying_purpose,
      special_requirements: requestRow.special_requirements || []
    });

    if (matches.length) {
      const { error: matchError } = await supabase.from('buyer_request_realtor_matches').insert(
        matches.map((match) => ({
          buyer_request_id: requestRow.id,
          realtor_user_id: match.realtor_user_id,
          match_score: match.match_score,
          status: 'notified',
          lead_summary: match.lead_summary
        }))
      );

      if (matchError) {
        throw matchError;
      }

      await supabase.from('buyer_requests').update({ status: 'matched' }).eq('id', requestRow.id);
    }

    await queueEmailPlaceholder(supabase, {
      to_email: requestRow.email,
      template: 'buyer_request_confirmation',
      subject: 'Your Viyra buying request has been received',
      payload: {
        buyer_request_id: requestRow.id,
        country: requestRow.country,
        city: requestRow.city,
        property_type: requestRow.property_type
      }
    });

    await notifyMatchedRealtors(supabase, requestRow.id, matches);

    return NextResponse.json({ ok: true, message: successMessage, matched_realtors: matches.length });
  } catch (error) {
    console.error('buyer request failed', error);
    return NextResponse.json({ error: 'We could not submit your buying brief right now. Please try again shortly.' }, { status: 500 });
  }
}

function normalize(body: BuyerRequestBody) {
  return {
    full_name: clean(body.full_name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    preferred_contact_method: clean(body.preferred_contact_method),
    preferred_language: clean(body.preferred_language),
    country: clean(body.country),
    region: clean(body.region),
    city: clean(body.city),
    property_type: clean(body.property_type),
    budget_min: toNumber(body.budget_min),
    budget_max: toNumber(body.budget_max),
    budget_label: clean(body.budget_label),
    timeline: clean(body.timeline),
    buying_purpose: clean(body.buying_purpose),
    financing_needed: clean(body.financing_needed),
    special_requirements: Array.isArray(body.special_requirements)
      ? body.special_requirements.map((item) => clean(item, 80)).filter(Boolean)
      : [],
    message: clean(body.message, 1200)
  };
}

function validate(payload: ReturnType<typeof normalize>) {
  if (!payload.full_name || !payload.email || !payload.country || !payload.city) {
    return 'Please add your name, email, country, and city or region.';
  }

  if (!emailPattern.test(payload.email)) {
    return 'Please enter a valid email address.';
  }

  if (!payload.preferred_contact_method || !payload.preferred_language || !payload.property_type) {
    return 'Please complete your contact preference, language, and property type.';
  }

  if (!payload.budget_label && payload.budget_min === null && payload.budget_max === null) {
    return 'Please choose a budget range, even if it is undecided.';
  }

  if (!payload.timeline || !payload.buying_purpose || !payload.financing_needed) {
    return 'Please complete timeline, purpose, and financing preference.';
  }

  return '';
}

function clean(value?: string, limit = 180) {
  return String(value || '').trim().slice(0, limit);
}

function toNumber(value?: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

async function notifyMatchedRealtors(supabase: any, buyerRequestId: string, matches: Array<{ realtor_user_id: string; lead_summary: Record<string, unknown> }>) {
  const realtorIds = matches.map((match) => match.realtor_user_id);
  const { data: profiles } = realtorIds.length
    ? await supabase.from('profiles').select('user_id,email').in('user_id', realtorIds)
    : { data: [] };
  const emailsByUserId = new Map<string, string | null>(
    (profiles || []).map((profile: { user_id: string; email: string | null }) => [profile.user_id, profile.email])
  );

  for (const match of matches) {
    await createNotification(supabase, {
      user_id: match.realtor_user_id,
      type: 'buyer_request_match',
      title: 'New buyer request in your region',
      body:
        'A qualified buyer is looking for property in your service region. Review the request and respond if you can provide a premium service.',
      metadata: {
        buyer_request_id: buyerRequestId,
        lead_summary: match.lead_summary
      } as any
    });

    const realtorEmail = emailsByUserId.get(match.realtor_user_id);
    if (realtorEmail) {
      await queueEmailPlaceholder(supabase, {
        to_email: realtorEmail,
        template: 'buyer_request_realtor_notification',
        subject: 'New buyer request in your region',
        payload: {
          buyer_request_id: buyerRequestId,
          lead_summary: match.lead_summary
        } as any
      });
    }
  }
}
