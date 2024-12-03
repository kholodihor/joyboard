"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { addCardMember, getNoCardMembers } from "@/app/actions/card";
import { Card, User } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
      const updatedUser = {
        ...user,
        cardIds: [...(user.cardIds || []), card.id],
      };
      const updatedCard = {
        ...card,
        userIds: [...(card.userIds || []), user.id],
      };

      setMembers((prevMembers) =>
        prevMembers?.filter((item: User) => item?.id !== user.id)
      );

      await addCardMember({
        user: updatedUser,
        card: updatedCard,
      });

      window.location.reload();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="w-full min-w-[9rem] rounded-md bg-gray-200 px-9 py-[0.4rem] text-gray-700 hover:bg-gray-200">
          Members
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-50 w-80 bg-white pt-3"
        side="right"
        sideOffset={5}
      >
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Add Member
        </div>
        <div className="max-h-80 overflow-auto">
          {members?.map((user: any) => (
            <div
              key={user?.id}
              className="flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-100"
              onClick={() => handleSubmit(user)}
            >
              <Image
                src={user?.image}
                className="h-12 w-12 rounded-full object-cover"
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
