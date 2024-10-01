import Link from "next/link";
import { Users2 } from "lucide-react";
import CreateBoardPopup from "./CreateBoardPopup";
import { Board } from "@/types";
import { getAllBoards } from "@/app/actions/board";

const BoardList = async () => {
  const boards = await getAllBoards();
  return (
    <div>
      <div className="flex items-center font-bold text-lg border-b-4 border-b-black bg-white/30 backdrop-blur-sm w-60 mb-2">
        <Users2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {boards?.boards?.map((board: Board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group aspect-video relative bg-no-repeat bg-center bg-cover w-60 p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.image})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-medium text-white text-center">
              {board.title}
            </p>
          </Link>
        ))}
        <CreateBoardPopup />
      </div>
    </div>
  );
};

export default BoardList;
