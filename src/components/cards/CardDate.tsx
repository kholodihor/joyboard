"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { updateCardIsCompleted } from "@/app/actions/card";
import { Card } from "@/types";
import {
  formatDate,
  isDateInPast,
  isLessThan24Hours,
  isToday,
} from "@/utils/date";

interface CardProps {
  cardData: Card;
  boardId: string;
}

const CardDate = ({ cardData }: CardProps) => {
  const router = useRouter();
  const [isIn24Hours, setIsIn24Hours] = useState(false);
  const [isOutdated, setOutdated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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

  const handleIsCompleted = async () => {
    cardData.isCompleted = isCompleted;
    await updateCardIsCompleted({
      card: cardData,
    });
    router.refresh();
  };

  useEffect(() => {
    handleIsCompleted();
  }, [isCompleted]);

  console.log(isCompleted);

  return (
    <div
      className={`flex items-center justify-start gap-2 border px-2 py-1 text-xs ${
        isIn24Hours
          ? "bg-yellow-300"
          : isOutdated
            ? "bg-red-300"
            : isCompleted
              ? "bg-green-300"
              : "bg-transparent"
      } `}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => setIsCompleted((prev) => !prev)}
        className="cursor-pointer"
      />
      {formatDate(cardData.dateTo as string)}
    </div>
  );
};

export default CardDate;
