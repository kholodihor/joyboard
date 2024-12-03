import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import LargeLoader from "@/components/common/LargeLoader";

const DynamicPage = dynamic(
  () => import("@/components/list/ListContainer"),

  { ssr: false, loading: () => <LargeLoader /> }
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

  return (
    <div className="no-scrollbar w-full overflow-x-auto p-4">
      <DynamicPage boardId={params.boardId} list={list} />
    </div>
  );
};

export default BoardPage;
