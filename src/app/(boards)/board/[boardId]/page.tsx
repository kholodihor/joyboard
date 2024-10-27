import LargeLoader from "@/components/common/LargeLoader";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";

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
    <div className="p-4 w-full overflow-x-auto no-scrollbar">
      <DynamicPage boardId={params.boardId} list={list} />
    </div>
  );
};

export default BoardPage;
