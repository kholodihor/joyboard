/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import { GoPaperclip } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

import { Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

import { updateCardLabel } from '@/app/actions/card';
import { labels } from '@/constants/labels';
import { Card } from '@/types';

import CardDate from './card-date';
import CardModal from './card-modal';
import TimeTracker from './time-tracker';

const getColor = (id: string) => {
  const foundLabel = labels.find(label => label.id === id);
  return foundLabel?.color;
};

const CardItem = ({ card, index }: { card: Card; index: number }) => {
  const [isModal, setIsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleModal = () => {
    setIsModal(true);
  };

  const handleRemoveLabel = async (labelId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const updatedCard = {
        ...card,
        label: card.label.filter(id => id !== labelId),
      };

      const response = await updateCardLabel({ card: updatedCard });
      if (!response.success) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove label');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleModal}
            role="button"
            className={`group relative flex cursor-pointer flex-col rounded-lg border bg-white p-3 shadow-sm hover:shadow-md ${isUpdating && 'pointer-events-none opacity-50'} `}
          >
            {/* Card Content */}
            <div className="space-y-4">
              {/* Title */}
              <h3 className="line-clamp-2 font-medium text-gray-900">
                {card.title}
              </h3>

              {/* Labels and Metadata */}
              <div className="space-y-3">
                {/* Labels */}
                <div className="flex gap-1.5">
                  {card?.label?.map((item: string) => (
                    <div
                      key={item}
                      className="group/label relative h-2 w-8 rounded-full"
                      style={{ backgroundColor: getColor(item) }}
                    >
                      <button
                        onClick={e => handleRemoveLabel(item, e)}
                        className="absolute -right-1 -top-1 hidden h-4 w-4 rounded-full bg-white text-gray-500 shadow-sm group-hover/label:block hover:text-gray-700"
                        disabled={isUpdating}
                      >
                        <IoClose className="h-full w-full" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Members */}
                {card?.users && card?.users?.length > 0 && (
                  <div className="flex items-center">
                    {card.users.slice(0, 3).map(user => (
                      <div key={user.id} className="group relative">
                        <Image
                          src={user.image || '/logo.jpg'}
                          alt={user.name || 'User'}
                          width={24}
                          height={24}
                          unoptimized={true}
                          className="-ml-2 h-6 w-6 rounded-full ring-2 ring-white first:ml-0"
                        />
                        <div className="absolute left-full top-0 z-10 ml-2 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                          {user.name || 'User'}
                        </div>
                      </div>
                    ))}
                    {card.users.length > 3 && (
                      <div className="group relative">
                        <div className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium text-white ring-2 ring-white">
                          +{card.users.length - 3}
                        </div>
                        <div className="absolute left-full top-0 z-10 ml-2 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                          {card.users.length - 3} more members
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-gray-500">
                  <div className="flex items-center gap-3">
                    <CardDate cardData={card} />
                    <TimeTracker cardData={card} />
                  </div>
                  <div className="flex items-center gap-3">
                    {card?.description && (
                      <div className="flex items-center gap-1">
                        <GoPaperclip className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {card?.comments?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FiMessageCircle className="h-3.5 w-3.5" />
                        <span className="text-xs">{card.comments.length}</span>
                      </div>
                    )}
                    {card?.isCompleted && (
                      <div className="flex items-center gap-1">
                        <FaTools className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Card Modal */}
      {isModal && (
        <CardModal id={card.id} isModal={isModal} setIsModal={setIsModal} />
      )}
    </>
  );
};

export default CardItem;