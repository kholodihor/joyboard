/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FaTools } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { GoPaperclip } from "react-icons/go";
import { labels } from "@/constants/labels";
import { Card, User } from "@/types";
import CardDate from "./CardDate";
import CardModal from "./CardModal";
import TimeTracker from "./TimeTracker";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

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
            className="overflow-x-hidden rounded-md bg-white px-3 py-2 text-sm font-bold shadow-md"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              {card?.label?.map((item: any) => (
                <div className="flex gap-2" key={item}>
                  <div
                    className="h-2 w-8 rounded-md"
                    style={{ backgroundColor: getColor(item) }}
                  ></div>
                </div>
              ))}
              <div className="flex flex-1 justify-end gap-[2px]">
                {card?.users?.slice(0, 2).map((user: User) => (
                  <div className="" key={user.id} title={user?.name}>
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
            {card.title}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {card && card?.links.length ? (
                  <div className="flex items-center gap-[5px] text-sm text-slate-600">
                    <GoPaperclip />
                    {card?.links?.length}
                  </div>
                ) : null}
                {card && card?.comments.length ? (
                  <div className="flex items-center gap-[5px] text-sm text-slate-600">
                    <FiMessageCircle />
                    {card?.comments?.length}
                  </div>
                ) : null}
                {card && card?.todos.length ? (
                  <div className="flex items-center gap-[5px] text-sm text-slate-600">
                    <FaTools />
                    {card?.todos?.length}
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
            </div>
            <div
              onMouseEnter={() => setIsModalAllowed(false)}
              onMouseLeave={() => setIsModalAllowed(true)}
            >
              {card ? <TimeTracker cardData={card} /> : null}
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
