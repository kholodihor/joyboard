import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (req: Request, props: { params: Promise<{ cardId: string }> }) => {
  const params = await props.params;
  try {
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const card = await prisma.card.findUnique({
      where: { id: params.cardId },
      include: {
        list: true,
        users: true,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};
