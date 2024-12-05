import { prisma } from "@/lib/prisma";
import ClientBoardPage from "./client-board-page";

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

const BoardPage = async ({ params }: BoardPageProps) => {
  const { boardId } = await params;

  const list = await prisma.list.findMany({
    where: { boardId: boardId },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
        include: {
          users: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return <ClientBoardPage boardId={boardId} list={list} />;
};

export default BoardPage;