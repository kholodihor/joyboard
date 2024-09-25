"use client";
import { useEffect, useRef } from "react";
import { addCardComment } from "@/app/actions/card";
import React, { useState } from "react";
import { toast } from "sonner";
import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Comment } from "@/interfaces";
import { useSession } from "next-auth/react";
import { getMembersOfBoard } from "@/app/actions/board";
import Image from "next/image";

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
    const getUserImage = async (email: string) => {
      try {
        const board = await getMembersOfBoard({ boardId: card.boardId });
        const commentUser = board?.Users?.find(
          (user: any) => user.email === email
        );

        if (commentUser) {
          return commentUser.image;
        }

        return "";
      } catch (error) {
        console.error("Error getting user image:", error);
        return "";
      }
    };

    const fetchCommentImages = async () => {
      if (card?.comments) {
        const updatedComments = await Promise.all(
          card.comments.map(async (comment: Comment) => ({
            ...comment,
            image: await getUserImage(comment.user),
          }))
        );
        setComments(updatedComments);
      }
    };

    fetchCommentImages();
  }, [card.boardId, card.comments]);

  const handleSubmit = async (data: FormData) => {
    const comment = data.get("comment") as string;
    try {
      card?.comments?.push({
        text: comment,
        image: "",
        user: session?.user?.email,
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
      toast.error("Fail to add comment");
    }
  };

  return (
    <div className="mb-[1rem]">
      <div>
        <p
          className="font-bold text-slate-700 cursor-pointer flex gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          Comments
          {card?.comments?.length ? (
            <span className="text-purple-500">{card?.comments?.length}</span>
          ) : null}
        </p>
        <div
          className={`max-h-[40vh] overflow-auto no-scrollbar ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="my-2">
            {comments.map((comment: Comment, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-2 mb-2 bg-input rounded-md items-start p-2"
              >
                <Image
                  src={comment.image || ""}
                  className="h-7 w-7 rounded-full object-cover"
                  alt={`${comment.user}'s avatar`}
                  width={30}
                  height={30}
                />
                <div className="flex flex-col">
                  <p className="bg-input p-2 text-xs">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          {isEditable ? (
            <form action={handleSubmit} className="space-y-2" ref={formRef}>
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
