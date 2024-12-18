import { NextRequest, NextResponse } from 'next/server';

import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    const { cardId } = await params;
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: true,
        users: true,
      },
    });

    if (!card) {
      return new NextResponse('Card not found', { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error in GET /api/card/[cardId]:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
