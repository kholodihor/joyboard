/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, User } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import CardModal from "./CardModal";
import { labels } from "@/constants/labels";
import { FiMessageCircle } from "react-icons/fi";
import Image from "next/image";
import CardDate from "./CardDate";
import { useParams } from "next/navigation";

const getColor = (id: string) => {
  const foundLabel = labels.find((label) => label.id === id);
  return foundLabel?.color;
};

const CardItem = ({ card, index }: { card: Card; index: number }) => {
  const { boardId }: { boardId: string } = useParams();
  const [isModal, setIsModal] = useState(false);
  const [isModalAllowed, setIsModalAllowed] = useState(true);

  const handleModal = () => {
    if (isModalAllowed) {
      setIsModal(true);
    }
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleModal}
            role="button"
            className="truncate py-2 px-3 text-sm rounded-md bg-white shadow-md font-bold"
          >
            <div className="mb-2 flex justify-start gap-2">
              {card?.label?.map((item: any) => (
                <div className="" key={item}>
                  <div
                    className="w-8 h-2 rounded-md"
                    style={{ backgroundColor: getColor(item) }}
                  ></div>
                </div>
              ))}
            </div>
            {card.title}
            <div className="mt-3 flex justify-between items-center gap-2">
              <div className="flex gap-4">
                {card && card?.comments.length ? (
                  <div className="flex gap-[5px] items-center text-sm text-slate-600">
                    <FiMessageCircle />
                    {card?.comments?.length}
                  </div>
                ) : null}
                <div
                  onMouseEnter={() => setIsModalAllowed(false)}
                  onMouseLeave={() => setIsModalAllowed(true)}
                >
                  {card && card.dateTo ? (
                    <CardDate cardData={card} boardId={boardId} />
                  ) : null}
                </div>
              </div>
              {card?.users?.slice(0, 2).map((user: User) => (
                <div className="" key={user.id}>
                  <Image
                    src={user?.image || "/logo.jpg"}
                    alt={user?.name}
                    width={30}
                    height={30}
                    className="h-7 w-7 rounded-full"
                  />
                </div>
              ))}
              {card?.users && card?.users?.length > 2 && <span>...</span>}
            </div>
          </div>
        )}
      </Draggable>
      {isModal && (
        <CardModal id={card.id} isModal={isModal} setIsModal={setIsModal} />
      )}
    </>
  );
};

export default CardItem;
