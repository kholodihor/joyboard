import { notFound } from 'next/navigation';

import BoardNavbar from '@/components/boards/board-navbar';
import { isAdmin } from '@/constants/auth';
import { canAccessBoard } from '@/lib/access';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = Promise<{ boardId: string }>;

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { boardId } = await params;
  const session = await getAuthSession();

  // Malformed ObjectIds make Prisma throw; treat them as a missing board.
  const board = await prisma.board
    .findUnique({ where: { id: boardId }, include: { Users: true } })
    .catch(() => null);

  if (!session || !board || !canAccessBoard(session, board)) {
    notFound();
  }

  return (
    <div
      className="relative h-[88vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${board.image})` }}
    >
      <BoardNavbar board={board} isAdmin={isAdmin(session.user.email)} />
      <div>{children}</div>
    </div>
  );
}
