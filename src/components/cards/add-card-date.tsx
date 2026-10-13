'use client';

import { useCallback } from 'react';

import { updateCardDate } from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';

import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  children?: React.ReactNode;
  onCardUpdate: (card: Card) => void | Promise<void>;
}

const AddCardDate = ({ card, children, onCardUpdate }: CardProps) => {
  // Cards from the SWR cache carry dates as ISO strings, so always wrap them.
  const selected = card.dateTo ? new Date(card.dateTo) : new Date();

  const handleDateChange = useCallback(
    async (newDate: Date | undefined) => {
      await saveCard({
        previous: card,
        next: { ...card, dateTo: newDate || new Date() },
        onCardUpdate,
        action: c => updateCardDate({ card: c }),
        errorMessage: 'Failed to update date',
      });
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
          selected={selected}
          onSelect={handleDateChange}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
};

export default AddCardDate;
