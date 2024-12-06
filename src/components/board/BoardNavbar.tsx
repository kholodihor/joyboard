import Image from "next/image";
import { Board, User } from "@/types";
import DeleteBoard from "./DeleteBoard";
import AddBoardMembers from "./AddBoardMembers";

const BoardNavbar = ({ board }: { board: Board }) => {
  return (
    <div className="w-full h-14 bg-black/50 flex items-center justify-between backdrop-blur-sm px-5">
      <h2 className="text-xl font-bold text-white">{board?.title}</h2>
      <div className="flex items-center gap-2">
        {board?.Users?.map((user: User) => (
          <Image
            src={user?.image || "/logo.jpg"}
            className="h-8 w-8 rounded-full cursor-pointer"
            width={30}
            height={30}
            alt={user.name}
            key={user?.id}
            title={user.name}
          />
        ))}
        <AddBoardMembers board={board} />
        <DeleteBoard board={board} />
      </div>
    </div>
  );
};

export default BoardNavbar;
