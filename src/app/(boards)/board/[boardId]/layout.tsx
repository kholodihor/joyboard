import BoardNavbar from "@/components/board/BoardNavbar";
import { prisma } from "@/lib/prisma";

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
      className="relative h-[88vh] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board?.image})` }}
    >
      <BoardNavbar board={board} />
      <div>{children}</div>
    </div>
  );
};

export default BoardLayout;
