
"use client";
import { useEffect, useRef } from "react";
import { addCardLink, removeCardLink } from "@/app/actions/card";
import React, { useState } from "react";
import { toast } from "sonner";
import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Card } from '@/types';
import { Skeleton } from "../ui/skeleton";
import { FaRegTrashCan } from "react-icons/fa6";
import SubTitle from "./SubTitle";


interface CardProps {
  cardData: Card;
  setCardData: (cardData: any) => void;
}

const CardLinks = ({ cardData, setCardData }: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setLinks(cardData.links);
  }, [cardData]);

  const handleSubmit = async (data: FormData) => {
    const newLink = data.get("link") as string;
    if (!newLink.trim()) {
      toast.error('Todo content cannot be empty')
      return
    }
    try {
      setLinks([...links, newLink]);
      const updatedCard = {
        ...cardData,
        links: [...links, newLink],
      }
      const res = await addCardLink({
        card: updatedCard,
      });
      formRef.current?.reset();
      if (res?.success) {
        setCardData(res.result);
        toast.success("Your link added to card");
      }
    } catch (error) {
      toast.error("Fail to add link");
    }
  };

  const handleRemove = async (linkToDelete: string) => {
    try {
      if (confirm('Are you sure you want to delete this link?')) {
        const updatedCard = {
          ...cardData,
          links: links.filter((link) => link !== linkToDelete),
        }
        const res = await removeCardLink({
          card: updatedCard
        })
        if (res?.success) {
          setCardData(res.result)
          setLinks(res.result.links)
          toast.success('Link deleted')
        } else {
          toast.error(res?.error || 'Failed to delete link')
        }
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
    }
  }

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle title="Links" isOpen={isOpen} setIsOpen={setIsOpen} length={links.length} />
        <div
          className={`max-h-[40vh] overflow-auto no-scrollbar ${isOpen ? "block" : "hidden"
            }`}
        >
          <div className="my-2">
            {links ? (links?.map((link: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 mb-2 bg-input rounded-md items-start p-2"
              >
                <a href={link} target="_blank" className="text-xs whitespace-nowrap truncate flex-1 hover:text-blue-700">{link}</a>
                <button onClick={() => handleRemove(link)} className="text-red-500"><FaRegTrashCan /></button>
              </div>
            ))) : (<div className="flex flex-col space-y-3">

              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
            </div>)}
          </div>
          {isEditable ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(formRef.current!);
              handleSubmit(formData);
            }} className="space-y-2" ref={formRef}>
              <TextAreaForm
                id="link"
                className="w-full mt-2"
                placeholder="Add a link to card"
                defaultValue={""}
              />
              <div className="flex justify-between items-center">
                <FormSubmit>Add</FormSubmit>
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
              {"Add a link to card"}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}

export default CardLinks

