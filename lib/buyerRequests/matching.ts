export type BuyerRequestForMatching = {
  id: string;
  country: string;
  region?: string | null;
  city?: string | null;
  property_type: string;
  preferred_language: string;
  budget_min?: number | null;
  budget_max?: number | null;
  timeline: string;
  buying_purpose: string;
  special_requirements: string[];
};

export type BuyerRequestRealtorMatch = {
  realtor_user_id: string;
  match_score: number;
  lead_summary: Record<string, unknown>;
};

export async function matchRealtorsForBuyerRequest(supabase: any, request: BuyerRequestForMatching) {
  const candidates = new Map<string, BuyerRequestRealtorMatch>();
  const city = request.city?.trim();
  const region = request.region?.trim();

  const { data: serviceRows } = await supabase
    .from('service_regions')
    .select('user_id,country,region,city,service_type')
    .eq('role', 'realtor')
    .eq('country', request.country);

  for (const row of serviceRows || []) {
    if (!row.user_id) {
      continue;
    }

    let score = 55;
    if (city && row.city?.toLowerCase() === city.toLowerCase()) score += 25;
    if (region && row.region?.toLowerCase() === region.toLowerCase()) score += 15;
    if (row.service_type?.toLowerCase().includes(request.property_type.toLowerCase())) score += 10;
    addCandidate(candidates, request, row.user_id, score);
  }

  const { data: profileRows } = await supabase
    .from('professional_profiles')
    .select('user_id,languages,service_regions,specialties,verification_status')
    .eq('role', 'realtor');

  for (const row of profileRows || []) {
    if (!row.user_id) {
      continue;
    }

    const regions = (row.service_regions || []).map((value: string) => value.toLowerCase());
    const specialties = (row.specialties || []).map((value: string) => value.toLowerCase());
    const languages = (row.languages || []).map((value: string) => value.toLowerCase());
    const locationMatch =
      regions.includes(request.country.toLowerCase()) ||
      (city ? regions.includes(city.toLowerCase()) : false) ||
      (region ? regions.includes(region.toLowerCase()) : false);

    if (!locationMatch) {
      continue;
    }

    let score = 60;
    if (languages.includes(request.preferred_language.toLowerCase())) score += 12;
    if (specialties.some((item: string) => item.includes(request.property_type.toLowerCase()))) score += 12;
    if (row.verification_status === 'verified') score += 12;
    if (specialties.some((item: string) => item.includes('luxury'))) score += 8;
    addCandidate(candidates, request, row.user_id, score);
  }

  return [...candidates.values()]
    .sort((left, right) => right.match_score - left.match_score)
    .slice(0, 12);
}

function addCandidate(
  candidates: Map<string, BuyerRequestRealtorMatch>,
  request: BuyerRequestForMatching,
  realtorUserId: string,
  score: number
) {
  const existing = candidates.get(realtorUserId);
  if (existing && existing.match_score >= score) {
    return;
  }

  candidates.set(realtorUserId, {
    realtor_user_id: realtorUserId,
    match_score: score,
    lead_summary: {
      buyer_request_id: request.id,
      country: request.country,
      region: request.region || null,
      city: request.city || null,
      property_type: request.property_type,
      budget_min: request.budget_min || null,
      budget_max: request.budget_max || null,
      timeline: request.timeline,
      buying_purpose: request.buying_purpose,
      preferred_language: request.preferred_language,
      special_requirements: request.special_requirements
    }
  });
}
