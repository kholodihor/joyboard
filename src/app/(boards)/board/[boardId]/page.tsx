import LargeLoader from "@/components/common/LargeLoader";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";

const DynamicListContainer = dynamic(
  () => import("@/components/list/ListContainer"),
  { loading: () => <LargeLoader /> }
);

const BoardPage = async ({ params }: { params: { boardId: string } }) => {

  const list = await prisma.list.findMany({
    where: { boardId: params.boardId },
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

  return <DynamicListContainer boardId={params.boardId} list={list} />
};

export default BoardPage;