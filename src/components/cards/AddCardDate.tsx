"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateCardDate } from "@/app/actions/card";
import { Card } from "@/types";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
        <div className="w-full min-w-[9rem] rounded-md bg-gray-200 px-9 py-[0.4rem] text-gray-700 hover:bg-gray-200">
          Date
        </div>
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
