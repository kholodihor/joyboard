"use client";

import { updateCard } from "@/app/actions/card";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
// import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}

const CardDescription = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [editorValue, setEditorValue] = useState(cardData?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await updateCard({
        description: editorValue,
        boardId,
        id: cardData?.id,
      });
      if (res?.result) {
        setCardData(res.result);
        toast.success("Card successfully updated");
      }
    } catch (error) {
      toast.error("Card not updated");
    }
  };

  return (
    <div className="mb-[1rem]">
      <div>
        <p className="font-bold text-slate-700 cursor-pointer flex gap-2 items-center">
          Description
        </p>
        <div className={`mt-5`}>
          {isEditable ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* <TextAreaForm
                id="description"
                className="w-full mt-2"
                placeholder="Add more details"
                defaultValue={cardData?.description || ""}
              /> */}
              <ReactQuill
                value={editorValue}
                onChange={setEditorValue}
                placeholder="Add more details"
                className="w-full mt-2"
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
              className="min-h-20 pl-6 max-h-70 bg-slate-100 text-sm p-3 rounded-ms overflow-auto"
              onClick={() => setIsEditable(true)}
              dangerouslySetInnerHTML={{ __html: editorValue }}
            >
              {/* {cardData?.description || "Add More Details"} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDescription;
