"use client";

import { Card } from "@/types";
import { Button } from "../ui/button";
import { copyCard, deleteCard } from "@/app/actions/card";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import AddCardMember from "./AddCardMember";
import AddCardLabel from "./AddCardLabel";
import AddCardDate from "./AddCardDate";

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
    <div className="space-y-2 mt-2">
      <p className="font-bold text-sm">Actions</p>
      <AddCardMember card={cardData} boardId={boardId} />
      <AddCardLabel card={cardData} boardId={boardId} />
      <AddCardDate card={cardData} boardId={boardId} />
      <Button
        className="w-full bg-gray-200 hover:bg-gray-200 text-gray-700"
        size="sm"
        onClick={handleCopy}
      >
        Copy
      </Button>
      <Button
        className="w-full bg-gray-200 hover:bg-gray-200 text-gray-700"
        size="sm"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default CardActions;
