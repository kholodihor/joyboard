"use client";

import React, { useEffect, useState } from "react";
import { Card, User } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addCardMember, getNoCardMembers } from "@/app/actions/card";
import Image from "next/image";

interface CardProps {
  card: Card;
  boardId: string;
}
const AddCardMember = ({ card, boardId }: CardProps) => {
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    const getMembers = async () => {
      const getUsers = await getNoCardMembers({
        boardId,
        cardId: card.id,
      });
      setMembers(getUsers?.result);
    };
    if (card) getMembers();
  }, [boardId, card]);

  const handleSubmit = async (user: any) => {
    if (user && card) {
      const updatedUser = { ...user, cardIds: [...(user.cardIds || []), card.id] };
      const updatedCard = { ...card, userIds: [...(card.userIds || []), user.id] };

      setMembers((prevMembers) => prevMembers?.filter((item: User) => item?.id !== user.id));

      await addCardMember({
        user: updatedUser,
        card: updatedCard,
      });

      // window.location.reload();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="px-9 py-[0.4rem] rounded-md w-full min-w-[9rem] bg-gray-200 hover:bg-gray-200 text-gray-700"
        >
          Members
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 pt-3 z-50 bg-white"
        side="right"
        sideOffset={5}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Add Member
        </div>
        <div className="max-h-80 overflow-auto">
          {members?.map((user: any) => (
            <div
              key={user?.id}
              className="flex items-center gap-2 hover:bg-slate-100 p-2 cursor-pointer "
              onClick={() => handleSubmit(user)}
            >
              <Image
                src={user?.image}
                className="object-cover rounded-full h-12 w-12"
                alt={user?.name}
                width={50}
                height={50}
              />
              <div className="">
                <h1 className="font-semibold">{user?.name}</h1>
                {/* <p className="text-gray-400 text-xs">{user?.id}</p> */}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardMember;
