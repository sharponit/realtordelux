import { NextResponse, type NextRequest } from 'next/server';
import { verifyBusinessRegistration } from '@/lib/verification/businessRegistry';
import { supabaseService } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await verifyBusinessRegistration({
    country: body.country,
    registrationNumber: body.registrationNumber,
    vatNumber: body.vatNumber,
    firmName: body.firmName,
    professionType: body.professionType
  });

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && body.userId) {
    const supabase = supabaseService() as any;
    await supabase.from('professional_verifications').insert({
      user_id: body.userId,
      firm_id: body.firmId || null,
      profession_type: body.professionType || 'firm',
      country: body.country,
      registry_source: result.source,
      registry_number: result.registration_number,
      verification_status: result.matched ? 'verified_mock' : 'pending',
      verification_payload: result.raw_payload,
      verified_at: result.matched ? new Date().toISOString() : null
    });

    if (body.firmId) {
      await supabase
        .from('firms')
        .update({ verification_status: result.matched ? 'verified_mock' : 'pending' })
        .eq('id', body.firmId);
    }
  }

  return NextResponse.json(result);
}
