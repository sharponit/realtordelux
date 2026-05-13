import { NextResponse, type NextRequest } from 'next/server';
import { rankPhotographers } from '@/lib/photography/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const photographers = rankPhotographers({
    country: searchParams.get('country') || 'Spain',
    city: searchParams.get('city') || undefined,
    radiusKm: Number(searchParams.get('radiusKm') || 100),
    requiresDrone: searchParams.get('requiresDrone') === 'true'
  });

  return NextResponse.json({ photographers });
}
