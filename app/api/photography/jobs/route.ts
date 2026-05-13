import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { calculatePhotographyPrice } from '@/lib/photography/pricing';

export async function POST(request: NextRequest) {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const pricing = calculatePhotographyPrice(Number(body.photographer_price || 0));

  const { data, error } = await supabase
    .from('photography_jobs')
    .insert({
      property_id: body.property_id || null,
      requested_by: user.id,
      photographer_id: body.photographer_id || null,
      property_address: body.property_address,
      property_city: body.property_city,
      property_region: body.property_region,
      property_country: body.property_country,
      requested_shoot_date: body.requested_shoot_date,
      service_package: body.service_package || [],
      requires_drone: Boolean(body.requires_drone),
      photographer_price: pricing.photographer_price,
      viyra_service_fee: pricing.viyra_service_fee,
      customer_total: pricing.customer_total,
      platform_fee_amount: pricing.viyra_service_fee,
      photographer_payout_amount: pricing.photographer_price,
      status: body.photographer_id ? 'pending_acceptance' : 'draft'
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ job: data });
}
