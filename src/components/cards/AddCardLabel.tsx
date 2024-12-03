"use client";

import { useRouter } from "next/navigation";
import { updateCardLabel } from "@/app/actions/card";
import { labels } from "@/constants/labels";
import { Card, LabelData } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface CardProps {
  card: Card;
  boardId: string;
}

const AddCardLabel = ({ card }: CardProps) => {
  const router = useRouter();

  const handleSubmit = async (id: string) => {
    if (!card?.label.includes(id)) {
      card?.label?.push(id);
      await updateCardLabel({
        card,
      });
      router.refresh();
    } else {
      card.label = card.label.filter((labelId) => labelId != id);
      await updateCardLabel({
        card,
      });
      router.refresh();
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="w-full min-w-[9rem] rounded-md bg-gray-200 px-9 py-[0.4rem] text-gray-700 hover:bg-gray-200">
          Label
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-50 w-80 bg-white pt-3"
        side="bottom"
        sideOffset={18}
      >
        <div className="pb-2 text-center text-sm font-medium text-neutral-600">
          Add Label
        </div>
        <div>
          {labels?.map((label: LabelData) => (
            <div
              key={label.id}
              className={`mx-auto my-2 flex h-6 w-full items-center justify-between p-2`}
              style={{ backgroundColor: label.color }}
            >
              <input
                type="checkbox"
                name="label"
                id="label"
                checked={!!card?.label && card?.label.includes(label.id)}
                onChange={() => handleSubmit(label.id)}
              />
              <span>{label.title}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardLabel;
