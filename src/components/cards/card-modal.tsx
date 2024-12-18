'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { X } from 'lucide-react';
import useSWR, { mutate } from 'swr';

import { removeMemberFromCard } from '@/app/actions/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { labels } from '@/constants/labels';
import { fetcher } from '@/lib/fetcher';
import { User } from '@/types';

import CardActions from './card-actions';
import CardCommentsInput from './card-comments';
import CardDate from './card-date';
import CardDescription from './card-description';
import CardHeader from './card-header';
import CardLinks from './card-links';
import CardTodo from './card-todo';

interface CardModel {
  id: string;
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
}

const CardModal = ({ id, isModal, setIsModal }: CardModel) => {
  const { data: cardData, mutate: mutateCard } = useSWR(
    `/api/card/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  const { boardId }: { boardId: string } = useParams();

  const getColor = (id: string) => {
    const foundLabel = labels.find(label => label.id === id);
    return foundLabel?.color;
  };

  const handleCardUpdate = useCallback(
    async (updatedData: any) => {
      // Optimistically update the UI
      await mutateCard(updatedData, false);

      // Revalidate the board data as well
      await mutate(`/api/board/${boardId}`);
    },
    [mutateCard, boardId],
  );

  const removeCardMember = async (user: User) => {
    if (!user || !cardData) return;

    const updatedUser = {
      ...user,
      cardIds: user.cardIds?.filter(id => id !== cardData.id),
    };

    const updatedCard = {
      ...cardData,
      userIds: cardData.userIds?.filter((id: any) => id !== user.id),
      users: cardData.users?.filter((u: any) => u.id !== user.id),
    };

    // Optimistically update UI
    await handleCardUpdate(updatedCard);

    // Make API call
    await removeMemberFromCard({
      user: updatedUser,
      card: updatedCard,
    });
  };

  return (
    <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] md:max-w-[800px]">
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <div className="relative flex h-full flex-col space-y-8 overflow-hidden p-6">
          {/* Header Section */}
          <div>
            <CardHeader cardData={cardData} setCardData={handleCardUpdate} />
          </div>

          {/* Main Content Section */}
          <div className="flex gap-6">
            {/* Left Column - Main Content */}
            <div className="w-[70%] space-y-6">
              {/* Members Section */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {cardData?.users?.map((user: User) => (
                    <div
                      key={user.id}
                      className="group relative flex items-center gap-x-2 rounded-md border bg-gray-50/50 px-3 py-2 transition hover:bg-gray-100/50"
                    >
                      <div className="relative h-6 w-6">
                        <Image
                          src={user.image || ''}
                          alt={user.name || ''}
                          className="rounded-full"
                          fill
                        />
                      </div>
                      <span className="text-sm text-gray-700">{user.name}</span>
                      <button
                        onClick={() => removeCardMember(user)}
                        className="absolute -right-2 -top-2 hidden rounded-full bg-rose-500 p-0.5 text-white transition group-hover:block hover:bg-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 max-w-[5rem]">
                <CardDate cardData={cardData} onCardUpdate={handleCardUpdate} />
              </div>

              {/* Labels Section */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {cardData?.label?.map((labelId: string) => (
                    <div
                      key={labelId}
                      className="rounded-md px-3 py-1.5"
                      style={{ backgroundColor: getColor(labelId) }}
                    />
                  ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="rounded-lg bg-gray-50/50">
                <CardDescription
                  cardData={cardData}
                  setCardData={handleCardUpdate}
                />
              </div>

              {/* Links, Todo, and Comments Section */}
              <div className="space-y-6">
                <CardLinks
                  cardData={cardData}
                  onCardUpdate={handleCardUpdate}
                />
                <CardTodo cardData={cardData} setCardData={handleCardUpdate} />
                <CardCommentsInput
                  card={cardData}
                  setCardData={handleCardUpdate}
                />
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="w-[30%]">
              <div className="sticky top-4">
                <CardActions
                  cardData={cardData}
                  onCardUpdate={handleCardUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
