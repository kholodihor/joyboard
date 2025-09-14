import BoardNavbar from '@/components/boards/board-navbar';
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

  const board: any = await prisma.board.findUnique({
    where: { id: boardId },
    include: { Users: true },
  });

  if (!board) {
    // Handle the case where the board is not found
    return <div>Board not found</div>;
  }

  return (
    <div
      className="relative h-[88vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${board.image})` }}
    >
      <BoardNavbar board={board} />
      <div>{children}</div>
    </div>
  );
}
