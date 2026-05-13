import { NextResponse, type NextRequest } from 'next/server';
import { createSellerInvitation } from '@/lib/seller-invitations/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createSellerInvitation(body, request.nextUrl.origin);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create seller invitation.' },
      { status: 400 }
    );
  }
}
