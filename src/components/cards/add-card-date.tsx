'use client';

import { useCallback, useState } from 'react';

import { toast } from 'sonner';

import { updateCardDate } from '@/app/actions/card';
import { Card } from '@/types';

import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  boardId: string;
  children?: React.ReactNode;
  onCardUpdate?: (card: Card) => Promise<void>;
}

const AddCardDate = ({ card, children, onCardUpdate }: CardProps) => {
  const [date, setDate] = useState<Date>(
    card.dateTo ? new Date(card.dateTo) : new Date(),
  );

  const handleDateChange = useCallback(
    async (newDate: Date | undefined) => {
      if (!card) return;

      try {
        const updatedCard = {
          ...card,
          dateTo: newDate || new Date(), // Provide default date if undefined
        };

        // Update UI optimistically
        setDate(newDate || new Date());

        // Update parent state
        if (onCardUpdate) {
          await onCardUpdate(updatedCard);
        }

        // API update
        const res = await updateCardDate({
          card: updatedCard,
        });

        if (!res?.success) {
          // Revert optimistic update
          setDate(card.dateTo ? new Date(card.dateTo) : new Date());
          if (onCardUpdate) {
            await onCardUpdate(card);
          }
          toast.error('Failed to update date');
        }
      } catch (error) {
        console.error(error);
        // Revert optimistic update
        setDate(card.dateTo ? new Date(card.dateTo) : new Date());
        if (onCardUpdate) {
          await onCardUpdate(card);
        }
        toast.error('Failed to update date');
      }
    },
    [card, onCardUpdate],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <div className="w-full min-w-[9rem] rounded-md bg-gray-200 px-9 py-[0.4rem] text-gray-700 hover:bg-gray-200">
            Date
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-50 w-80 bg-white pt-3"
        side="right"
        sideOffset={5}
      >
        <div className="pb-2 text-center text-sm font-medium text-neutral-600">
          Add Date
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
};

export default AddCardDate;
