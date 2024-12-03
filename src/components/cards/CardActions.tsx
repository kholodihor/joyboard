"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { copyCard, deleteCard } from "@/app/actions/card";
import { Card } from "@/types";
import { Button } from "../ui/button";
import AddCardDate from "./AddCardDate";
import AddCardLabel from "./AddCardLabel";
import AddCardMember from "./AddCardMember";

const CardActions = ({ cardData }: { cardData: Card }) => {
  const { boardId }: { boardId: string } = useParams();

  const handleCopy = async () => {
    try {
      const res = await copyCard({ id: cardData.id, boardId });
      if (res.success) {
        toast.success("Card successfully copied");
      }
    } catch (error) {
      toast.error("Card not copied");
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteCard({ id: cardData.id, boardId });
      if (res.success) {
        toast.success("Card successfully deleted");
      }
    } catch (error) {
      toast.error("Card not deleted");
    }
  };
  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-bold">Actions</p>
      <AddCardMember card={cardData} boardId={boardId} />
      <AddCardLabel card={cardData} boardId={boardId} />
      <AddCardDate card={cardData} boardId={boardId} />
      <Button
        className="w-full bg-gray-200 text-gray-700 hover:bg-gray-200"
        size="sm"
        onClick={handleCopy}
      >
        Copy
      </Button>
      <Button
        className="w-full bg-gray-200 text-gray-700 hover:bg-gray-200"
        size="sm"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default CardActions;
