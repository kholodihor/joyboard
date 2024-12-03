import { prisma } from "@/lib/prisma";
import BoardNavbar from "@/components/board/BoardNavbar";

const BoardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const board: any = await prisma.board.findUnique({
    where: { id: params.boardId },
    include: { Users: true },
  });
  return (
    <div
      className="relative h-[88vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${board?.image})` }}
    >
      <BoardNavbar board={board} />
      <div>{children}</div>
    </div>
  );
};

export default BoardLayout;
