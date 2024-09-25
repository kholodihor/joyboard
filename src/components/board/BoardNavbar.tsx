import { Board, User } from "@/interfaces";
import DeleteBoard from "./DeleteBoard";
import AddBoardMembers from "./AddBoardMembers";

const BoardNavbar = async ({ board }: { board: Board }) => {
  return (
    <div className="w-full h-14 bg-black/50 flex items-center justify-between backdrop-blur-sm px-5">
      <h2 className="text-xl font-bold text-white">{board?.title}</h2>
      <div className="flex items-center gap-5">
        {board?.Users?.map((user: User) => (
          <img
            src={user?.image || "/logo.jpg"}
            className="h-7 w-7 rounded-full cursor-pointer"
            alt={user.name}
            key={user?.id}
          />
        ))}
        <AddBoardMembers board={board} />
        <DeleteBoard board={board} />
      </div>
    </div>
  );
};

export default BoardNavbar;
