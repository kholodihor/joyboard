import Image from "next/image";
import { Board, User } from "@/types";
import AddBoardMembers from "./AddBoardMembers";
import DeleteBoard from "./DeleteBoard";

const BoardNavbar = async ({ board }: { board: Board }) => {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-black/50 px-5 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">{board?.title}</h2>
      <div className="flex items-center gap-2">
        {board?.Users?.map((user: User) => (
          <Image
            src={user?.image || "/logo.jpg"}
            className="h-8 w-8 cursor-pointer rounded-full"
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
