/* eslint-disable prettier/prettier */
'use client';

import { useCallback, useState } from 'react';

import { updateCardIsCompleted } from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';
import {
  formatDate,
  isDateInPast,
  isLessThan24Hours,
  isToday,
} from '@/utils/date';

interface CardProps {
  cardData: Card;
  onCardUpdate: (card: Card) => void | Promise<void>;
}

const CardDate = ({ cardData, onCardUpdate }: CardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleIsCompleted = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation(); // Prevent event bubbling
      setIsLoading(true);
      await saveCard({
        previous: cardData,
        next: { ...cardData, isCompleted: !cardData.isCompleted },
        onCardUpdate,
        action: c => updateCardIsCompleted({ card: c }),
        errorMessage: 'Failed to update card status',
      });
      setIsLoading(false);
    },
    [cardData, onCardUpdate],
  );

  if (!cardData.dateTo) return null;

  const { dateTo, isCompleted } = cardData;
  const isIn24Hours =
    !isCompleted && (isLessThan24Hours(dateTo) || isToday(dateTo));
  const isOutdated = !isCompleted && !isIn24Hours && isDateInPast(dateTo);

  return (
    <div
      className={`flex items-center justify-start gap-2 border px-2 py-1 text-xs ${
        isIn24Hours
          ? 'bg-yellow-300'
          : isOutdated
            ? 'bg-red-300'
            : isCompleted
              ? 'bg-green-300'
              : 'bg-transparent'
      }`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleIsCompleted}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      />
      {formatDate(dateTo)}
    </div>
  );
};

export default CardDate;
