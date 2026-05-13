import { NextResponse, type NextRequest } from 'next/server';
import { acceptSellerInvitation } from '@/lib/seller-invitations/service';

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json();
    const result = await acceptSellerInvitation({ ...body, token });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to accept seller invitation.' },
      { status: 400 }
    );
  }
}
