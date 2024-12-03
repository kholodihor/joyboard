"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { updateCard } from "@/app/actions/card";
// import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}

const CardDescription = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [editorValue, setEditorValue] = useState(cardData?.description || "");

  console.log(editorValue);

  const handleSubmit = async () => {
    // const description = data.get("description") as string;
    const res = await updateCard({
      description: editorValue,
      boardId,
      id: cardData?.id,
    });
    if (res?.result) {
      setCardData(res.result);
      toast.success("Card successfully udpated");
    }
    try {
    } catch (error) {
      toast.error("Card not udpated");
    }
  };
  return (
    <div className="mb-[1rem]">
      <div>
        <p className="flex cursor-pointer items-center gap-2 font-bold text-slate-700">
          Description
        </p>
        <div className={`mt-5`}>
          {isEditable ? (
            <form action={handleSubmit} className="space-y-2">
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
                className="mt-2 w-full"
              />
              <div className="flex items-center justify-between">
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
              className="max-h-70 rounded-ms min-h-20 overflow-auto bg-slate-100 p-3 pl-6 text-sm"
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
