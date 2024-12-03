"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { addMemberInBoard, getNoBoardMembers } from "@/app/actions/board";
import { Board, User } from "@/types";
import { Popover, PopoverContent } from "../ui/popover";

const AddBoardMembers = ({ board }: { board: Board }) => {
  const router = useRouter();
  const [members, setMembers] = useState<any>();

  const getMembers = async () => {
    const getUsers = await getNoBoardMembers({ board });
    setMembers(getUsers?.result);
  };

  useEffect(() => {
    if (!board) return;
    getMembers();
  }, []);

  const addMembers = async (user: User) => {
    user?.boardIds?.push(board.id);
    board?.userIds?.push(user.id);
    await addMemberInBoard({
      user,
      board,
    });
    setMembers(members?.filter((item: User) => item.id != user.id));
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger className="h-auto w-auto p-2 text-white">
        Join Board
      </PopoverTrigger>
      <PopoverContent
        className="bg-white px-0 py-3"
        side="bottom"
        align="start"
      >
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Board Actions
        </div>
        {members?.map((user: any) => (
          <div
            key={user?.id}
            className="flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-100"
            onClick={() => addMembers(user)}
          >
            <Image
              src={user?.image}
              className="h-12 w-12 rounded-full object-cover"
              alt={user?.name}
              width={30}
              height={30}
            />
            <div>
              <h1 className="font-semibold">{user?.name}</h1>
              <p className="text-xs text-gray-400">{user?.id}</p>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default AddBoardMembers;
