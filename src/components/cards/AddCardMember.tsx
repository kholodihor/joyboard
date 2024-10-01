"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, User } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { addCardMember, getNoCardMembers } from "@/app/actions/card";
import Image from "next/image";

interface CardProps {
  card: Card;
  boardId: string;
}
const AddCardMember = ({ card, boardId }: CardProps) => {
  const router = useRouter();
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
    user?.cardIds?.push(card?.id);
    card?.userIds?.push(user?.id);
    await addCardMember({
      user,
      card,
    });
    setMembers(members?.filter((item: User) => item?.id != user?.id));
    router.refresh();
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="px-5 w-full bg-gray-200 hover:bg-gray-200 text-gray-700"
          size="sm"
        >
          Members
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 pt-3 z-50 bg-white"
        side="bottom"
        sideOffset={18}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Add Member
        </div>
        <div>
          {members?.map((user: any) => (
            <div
              key={user?.id}
              className="flex items-center gap-2 hover:bg-slate-100 p-2 cursor-pointer"
              onClick={() => handleSubmit(user)}
            >
              <Image
                src={user?.image}
                className="object-cover rounded-full h-12 w-12"
                alt={user?.name}
                width={50}
                height={50}
              />
              <div>
                <h1 className="font-semibold">{user?.name}</h1>
                <p className="text-gray-400 text-xs">{user?.id}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardMember;
