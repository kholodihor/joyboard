'use client';

import { useCallback } from 'react';

import { updateCardLabel } from '@/app/actions/card';
import { labels } from '@/constants/labels';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  children?: React.ReactNode;
  onCardUpdate: (card: Card) => void | Promise<void>;
}

const AddCardLabel = ({ card, children, onCardUpdate }: CardProps) => {
  const handleSubmit = useCallback(
    async (id: string) => {
      const label = card.label.includes(id)
        ? card.label.filter(labelId => labelId !== id)
        : [...card.label, id];
      await saveCard({
        previous: card,
        next: { ...card, label },
        onCardUpdate,
        action: c => updateCardLabel({ card: c }),
        errorMessage: 'Failed to update label',
      });
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
              {card.label.includes(label.id) && (
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
