import { getAllBoards } from "@/app/actions/board";
import BoardList from "@/components/board/BoardList";

const Boards = async () => {
  const boards = await getAllBoards();
  return (
    <div className="min-h-[80vh] flex justify-start items-start flex-wrap p-4 bg-gradient-to-r from-[#e1eec3] to-[#f05053]">
      <BoardList boards={boards} />
    </div>
  );
};

export default Boards;
