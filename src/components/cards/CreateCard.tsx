"use client";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import TextAreaForm from "../atomic/TextAreaForm";
import { useParams } from "next/navigation";
import { createCard } from "@/app/actions/card";

const CreateCard = ({ listId }: { listId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { boardId }: { boardId: string } = useParams();
  const [isEditable, setIsEditable] = useState(false);

  const editEnable = () => {
    setIsEditable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(formRef.current!);
    const title = formData.get("title") as string;

    if (!title) {
      toast.error("Please add list title");
      return;
    }

    try {
      const res = await createCard({ title, listId, boardId });
      if (res?.success) {
        toast.success("Card successfully added");
        setIsEditable(false); // Close the form after submission
      } else {
        toast.error("Card not created");
      }
      formRef.current?.reset();
    } catch (error) {
      toast.error("Card not created");
    }
  };

  if (isEditable) {
    return (
      <div className="shrink-0 h-full w-[272px] select-none bg-white relative">
        <form onSubmit={handleSubmit} ref={formRef} className="m-1 py-0.5 px-1 space-y-4">
          <div>
            <TextAreaForm id="title" placeholder="List Title" />
            <FormSubmit className="mt-2">Create Card</FormSubmit>
          </div>
        </form>
        <Button
          className="absolute bottom-0 right-0 bg-white text-black hover:bg-white"
          onClick={() => setIsEditable(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-2 px-2">
      <Button
        className="h-auto w-full text-muted-foreground text-sm px-2 py-1.5 bg-white hover:bg-white"
        onClick={editEnable}
      >
        Create Card
        <Plus className="h-4 w-4 mr-2" />
      </Button>
    </div>
  );
};

export default CreateCard;
