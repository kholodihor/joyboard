'use client';

import { useCallback } from 'react';

import { toast } from 'sonner';

import { updateCardLabel } from '@/app/actions/card';
import { labels } from '@/constants/labels';
import { Card } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  boardId: string;
  children?: React.ReactNode;
  onCardUpdate?: (card: Card) => Promise<void>;
}

const AddCardLabel = ({ card, children, onCardUpdate }: CardProps) => {
  const handleSubmit = useCallback(
    async (id: string) => {
      try {
        const updatedCard = { ...card };
        if (!updatedCard.label?.includes(id)) {
          updatedCard.label = [...(updatedCard.label || []), id];
        } else {
          updatedCard.label = updatedCard.label.filter(
            labelId => labelId !== id,
          );
        }

        // Optimistic update
        if (onCardUpdate) {
          await onCardUpdate(updatedCard);
        }

        // API update
        const res = await updateCardLabel({
          card: updatedCard,
        });

        if (!res?.success) {
          toast.error('Failed to update label');
          // Revert optimistic update
          if (onCardUpdate) {
            await onCardUpdate(card);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to update label');
        // Revert optimistic update
        if (onCardUpdate) {
          await onCardUpdate(card);
        }
      }
    },
    [card, onCardUpdate],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 bg-white p-0" align="start">
        <div className="grid gap-1 p-2">
          {labels.map(label => (
            <div
              key={label.id}
              role="button"
              onClick={() => handleSubmit(label.id)}
              className="flex items-center justify-between rounded-sm p-2 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: label.color }}
                />
                <p className="text-sm">{label.title}</p>
              </div>
              {card?.label?.includes(label.id) && (
                <div className="h-2 w-2 rounded-full bg-sky-500" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardLabel;
