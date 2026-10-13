import { NextRequest, NextResponse } from 'next/server';

import { AccessError, requireCardAccess } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> },
) {
  try {
    const { cardId } = await params;
    await requireCardAccess(cardId);

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: true,
        users: true,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    if (error instanceof AccessError) {
      return new NextResponse(error.message, { status: 404 });
    }
    console.error('Error in GET /api/card/[cardId]:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
