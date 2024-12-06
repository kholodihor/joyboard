"use client";

import { useEffect, useRef } from "react";
import { addCardComment, removeCardComment } from "@/app/actions/card";
import React, { useState } from "react";
import { toast } from "sonner";
import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Comment } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaRegTrashCan } from "react-icons/fa6";
import SubTitle from "./SubTitle";

interface CardDetails {
  card: any;
  setCardData: (cardData: any) => void;
}

const CardCommentsInput = ({ card, setCardData }: CardDetails) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setComments(card.comments);
  }, [card]);

  const handleSubmit = async (data: FormData) => {
    const comment = data.get("comment") as string;
    try {
      card?.comments?.push({
        id: crypto.randomUUID(),
        text: comment,
        image: session?.user?.image,
        user: session?.user?.name,
      });
      const res = await addCardComment({
        card,
      });
      formRef.current?.reset();
      if (res?.result) {
        setCardData(res.result);
        toast.success("Your comment added to card");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this comment?')) {
        const updatedCard = {
          ...card,
          comments: card.comments.filter((comment: { id: string; }) => comment.id !== id),
        }
        setComments(updatedCard.comments);
        const res = await removeCardComment({
          card: updatedCard
        });
        if (res?.success) {
          setCardData(res.result);
          setComments(res.result.comments);
          toast.success('Comment deleted');
        } else {
          toast.error(res?.error || 'Failed to delete comment');
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    handleSubmit(formData);
  };

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle title="Comments" isOpen={isOpen} setIsOpen={setIsOpen} length={comments.length} />
        <div
          className={`max-h-[40vh] overflow-auto no-scrollbar ${isOpen ? "block" : "hidden"
            }`}
        >
          <div className="my-2">
            {comments.map((comment: Comment, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-2 mb-2 bg-input rounded-md items-start p-2"
              >
                <div className="flex w-full gap-2 items-center">
                  <Image
                    src={comment.image || "/logo.jpg"}
                    className="h-7 w-7 rounded-full object-cover"
                    alt={`${comment.user}'s avatar`}
                    width={30}
                    height={30}
                  />
                  <span className="text-xs">{comment.user}</span>
                </div>
                <div className="flex flex-col w-full">
                  <p className="bg-input p-2 text-xs">{comment.text}</p>
                  <div className="flex justify-end w-full"><button onClick={() => handleRemove(comment.id)} className="text-red-500"><FaRegTrashCan /></button></div>
                </div>
              </div>
            ))}
          </div>
          {isEditable ? (
            <form onSubmit={handleFormSubmit} className="space-y-2" ref={formRef}>
              <TextAreaForm
                id="comment"
                className="w-full mt-2"
                placeholder="Write a comment to card"
                defaultValue={""}
              />
              <div className="flex justify-between items-center">
                <FormSubmit>Save</FormSubmit>
                <Button
                  type="button"
                  onClick={() => setIsEditable(false)}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              role="button"
              className="min-h-20 bg-slate-100 text-sm p-3 rounded-ms"
              onClick={() => setIsEditable(true)}
            >
              {"Write a comment to card"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCommentsInput;
