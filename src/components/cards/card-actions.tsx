'use client';

import { FC, JSX, useCallback } from 'react';
import { FiCalendar, FiCopy, FiTag, FiTrash2, FiUsers } from 'react-icons/fi';
import { useParams } from 'next/navigation';

import { toast } from 'sonner';

import { copyCard, deleteCard } from '@/app/actions/card';
import { Card } from '@/types';

import { Button } from '../ui/button';

import AddCardDate from './add-card-date';
import AddCardLabel from './add-card-label';
import AddCardMember from './add-card-member';

interface CardActionsProps {
  cardData: Card;
  onCardUpdate: (card: Card) => Promise<void>;
}

const CardActions: FC<CardActionsProps> = ({
  cardData,
  onCardUpdate,
}): JSX.Element | null => {
  const { boardId }: { boardId: string } = useParams();

  const handleCopy = useCallback(async () => {
    if (!cardData?.id) return;

    try {
      const res = await copyCard({ id: cardData.id, boardId });
      if (res.success) {
        toast.success('Card successfully copied');
      } else {
        toast.error(res.error || 'Failed to copy card');
      }
    } catch (error) {
      console.error('Error copying card:', error);
      toast.error('Failed to copy card');
    }
  }, [cardData?.id, boardId]);

  const handleDelete = useCallback(async () => {
    if (!cardData?.id) return;

    if (confirm('Are you sure you want to delete this card?')) {
      try {
        const res = await deleteCard({ id: cardData.id, boardId });
        if (res.success) {
          toast.success('Card deleted');
        } else {
          toast.error('Failed to delete card');
        }
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
      }
    }
  }, [cardData?.id, boardId]);

  // Return null while data is loading
  if (!cardData?.id) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700">Add to card</h3>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <div className="grid gap-2">
        <div className="group relative">
          <AddCardMember
            card={cardData}
            boardId={boardId}
            onCardUpdate={onCardUpdate}
          >
            <Button
              className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100"
              size="sm"
            >
              <FiUsers className="mr-2 h-4 w-4" />
              Members
            </Button>
          </AddCardMember>
        </div>

        <div className="group relative">
          <AddCardLabel
            card={cardData}
            boardId={boardId}
            onCardUpdate={onCardUpdate}
          >
            <Button
              className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100"
              size="sm"
            >
              <FiTag className="mr-2 h-4 w-4" />
              Labels
            </Button>
          </AddCardLabel>
        </div>

        <div className="group relative">
          <AddCardDate
            card={cardData}
            boardId={boardId}
            onCardUpdate={onCardUpdate}
          >
            <Button
              className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100"
              size="sm"
            >
              <FiCalendar className="mr-2 h-4 w-4" />
              Date
            </Button>
          </AddCardDate>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <div className="grid gap-2">
        <Button
          className="w-full justify-start bg-gray-50 text-gray-700 hover:bg-gray-100"
          size="sm"
          onClick={handleCopy}
        >
          <FiCopy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button
          className="w-full justify-start bg-gray-50 text-red-600 hover:bg-red-50"
          size="sm"
          onClick={handleDelete}
        >
          <FiTrash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CardActions;
