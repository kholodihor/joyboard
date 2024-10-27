"use client";
import { Card, LabelData } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { updateCardLabel } from "@/app/actions/card";
import { useRouter } from "next/navigation";
import { labels } from "@/constants/labels";

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
        <Button
          className="px-[2.1rem] w-full min-w-[9rem] bg-gray-200 hover:bg-gray-200 text-gray-700"
          size="sm"
        >
          Label
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 pt-3 z-50 bg-white"
        side="bottom"
        sideOffset={18}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-2">
          Add Label
        </div>
        <div>
          {labels?.map((label: LabelData) => (
            <div
              key={label.id}
              className={`w-full mx-auto flex justify-between items-center h-6 my-2 p-2`}
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
