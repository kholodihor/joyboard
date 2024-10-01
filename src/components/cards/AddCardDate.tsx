"use client";

import { useState, useEffect } from "react";
import { Card } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { updateCardDate } from "@/app/actions/card";
import { useRouter } from "next/navigation";

interface CardProps {
  card: Card;
  boardId: string;
}

const AddCardDate = ({ card }: CardProps) => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const updateDate = async () => {
      if (date) {
        const updatedCard = { ...card, dateTo: date };
        await updateCardDate({ card: updatedCard });
      }
    };
    updateDate();
    router.refresh();
  }, [date, router, card]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="px-9 w-full bg-gray-200 hover:bg-gray-200 text-gray-700"
          size="sm"
        >
          Date
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 pt-3 z-50 bg-white"
        side="right"
        sideOffset={5}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-2">
          Add Date
        </div>
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardDate;
