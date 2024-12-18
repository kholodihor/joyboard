/* eslint-disable prettier/prettier */
'use client';

import { useCallback, useEffect, useState } from 'react';

import { toast } from 'sonner';

import { updateCardIsCompleted } from '@/app/actions/card';
import { Card } from '@/types';
import {
  formatDate,
  isDateInPast,
  isLessThan24Hours,
  isToday,
} from '@/utils/date';

interface CardProps {
  cardData: Card;
  onCardUpdate?: (card: Card) => Promise<void>;
}

const CardDate = ({ cardData, onCardUpdate }: CardProps) => {
  const [isIn24Hours, setIsIn24Hours] = useState(false);
  const [isOutdated, setOutdated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cardData) return;
    if (
      isLessThan24Hours(cardData?.dateTo as string) ||
      isToday(cardData?.dateTo as string)
    ) {
      setIsIn24Hours(true);
    }
    if (isDateInPast(cardData?.dateTo as string)) {
      setOutdated(true);
    }
    if (cardData.isCompleted) {
      setIsIn24Hours(false);
      setOutdated(false);
      setIsCompleted(true);
    }
  }, [cardData]);

  const handleIsCompleted = useCallback(async () => {
    try {
      setIsLoading(true);
      const newIsCompleted = !isCompleted;
      const updatedCard = {
        ...cardData,
        isCompleted: newIsCompleted,
      };

      // Optimistic UI update
      setIsCompleted(newIsCompleted);
      if (newIsCompleted) {
        setIsIn24Hours(false);
        setOutdated(false);
      }

      // Update parent state
      if (onCardUpdate) {
        await onCardUpdate(updatedCard);
      }

      // Update API
      const res = await updateCardIsCompleted({
        card: updatedCard,
      });

      if (!res?.success) {
        // Revert optimistic update if API call fails
        setIsCompleted(!newIsCompleted);
        if (!newIsCompleted) {
          setIsIn24Hours(true);
          setOutdated(true);
        }
        toast.error('Failed to update card status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update card status');
    } finally {
      setIsLoading(false);
    }
  }, [cardData, isCompleted, onCardUpdate]);

  if (!cardData?.dateTo) return null;

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
        disabled={isLoading}
        className="cursor-pointer"
      />
      {formatDate(cardData.dateTo as string)}
    </div>
  );
};

export default CardDate;
