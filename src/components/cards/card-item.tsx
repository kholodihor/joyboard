/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import { GoPaperclip } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';

import { Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

import { updateCardLabel } from '@/app/actions/card';
import AvatarGroup from '@/components/ui/avatar-group';
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
  const [isModalAllowed, setIsModalAllowed] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleModal = () => {
    if (isModalAllowed) {
      setIsModal(true);
    }
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
            className="group overflow-hidden rounded-lg bg-white px-4 py-3 text-sm shadow-sm transition-all hover:shadow-md"
          >
            {/* Card Content */}
            <div className="space-y-3">
              {/* Title and Members */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 flex-1 font-medium text-gray-900">
                  {card.title}
                </h3>

                {/* Members */}
                {card?.users?.length && card?.users?.length > 0 && (
                  <div className="flex-shrink-0">
                    <AvatarGroup users={card.users} size="sm" />
                  </div>
                )}
              </div>

              {/* Labels and Metadata */}
              <div className="space-y-2">
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
                        <IoClose className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Date and Time Tracker */}
                <div className="flex items-center justify-between">
                  {card?.dateTo && (
                    <div
                      className="max-w-[5rem] transition-opacity"
                      onMouseEnter={() => setIsModalAllowed(false)}
                      onMouseLeave={() => setIsModalAllowed(true)}
                    >
                      <CardDate cardData={card} />
                    </div>
                  )}
                  <div
                    className="transition-opacity"
                    onMouseEnter={() => setIsModalAllowed(false)}
                    onMouseLeave={() => setIsModalAllowed(true)}
                  >
                    <TimeTracker cardData={card} />
                  </div>
                </div>
              </div>

              {/* Card Footer - Metadata Icons */}
              <div className="flex items-center gap-3">
                {/* Links */}
                {card?.links?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors group-hover:text-gray-700">
                    <GoPaperclip className="h-4 w-4" />
                    {card.links.length}
                  </div>
                )}

                {/* Comments */}
                {card?.comments?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors group-hover:text-gray-700">
                    <FiMessageCircle className="h-4 w-4" />
                    {card.comments.length}
                  </div>
                )}

                {/* Todos */}
                {card?.todos?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors group-hover:text-gray-700">
                    <FaTools className="h-4 w-4" />
                    {card.todos.length}
                  </div>
                )}
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
