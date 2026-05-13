import { NextResponse, type NextRequest } from 'next/server';
import { calculatePhotographyPrice } from '@/lib/photography/pricing';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const photographerPrice = Number(body.photographer_price || body.photographerPrice || 0);

  return NextResponse.json(calculatePhotographyPrice(photographerPrice));
}
