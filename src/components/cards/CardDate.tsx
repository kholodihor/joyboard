/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/interfaces";
import { updateCardIsCompleted } from "@/app/actions/card";
import {
  formatDate,
  isLessThan24Hours,
  isDateInPast,
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

  return (
    <div
      className={`flex items-center justify-start gap-2 text-xs border px-2 py-1 ${
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
      {formatDate(cardData?.dateTo as string)}
    </div>
  );
};

export default CardDate;
