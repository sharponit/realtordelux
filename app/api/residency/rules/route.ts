import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { isPlatformRole } from '@/lib/auth/roles';
import { RESIDENCY_DISCLAIMER } from '@/lib/residency/rules';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data, error } = await supabase
    .from('residency_rules')
    .select('*')
    .order('country', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ rules: data || [] });
}

export async function POST(request: NextRequest) {
  const { user, profile } = await getCurrentUserProfile();

  if (!user || !profile || (profile.role !== 'lawyer' && !isPlatformRole(profile.role))) {
    return NextResponse.json({ error: 'Admin or legal partner access required.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.id || !body?.country || !body?.pathway_name) {
    return NextResponse.json({ error: 'Rule id, country, and pathway name are required.' }, { status: 400 });
  }

  const supabase = (await createSupabaseServerClient()) as any;
  const { data, error } = await supabase
    .from('residency_rules')
    .upsert({
      id: String(body.id),
      country: String(body.country),
      country_code: String(body.country_code || '').slice(0, 3).toUpperCase(),
      pathway_key: String(body.pathway_key || body.id),
      pathway_name: String(body.pathway_name),
      status: String(body.status || 'draft'),
      min_property_value: Number(body.min_property_value || 0),
      currency: String(body.currency || 'EUR').slice(0, 3).toUpperCase(),
      eligible_nationalities: body.eligible_nationalities || [],
      excluded_nationalities: body.excluded_nationalities || [],
      buyer_profile_requirements: body.buyer_profile_requirements || {},
      summary: String(body.summary || ''),
      multilingual_content: body.multilingual_content || {},
      disclaimer: RESIDENCY_DISCLAIMER,
      luxury_markets: body.luxury_markets || [],
      managed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ rule: data });
}
