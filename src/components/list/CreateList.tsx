"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import InputForm from "../atomic/InputForm";
import FormSubmit from "../atomic/FormSubmit";
import { toast } from "sonner";
import { createLists } from "@/app/actions/list";

const CreateList = ({ boardId }: { boardId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const editEnable = () => {
    setIsEditable(true);
  };
  const handleSubmit = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      if (!title) {
        toast.error("please add list title");
        return;
      }
      await createLists({ title, boardId });
      formRef.current?.reset();
      setIsEditable(false);
      toast.success("List successfully added");
    } catch (error) {
      toast.error("organization not created");
    }
  };

  if (isEditable) {
    return (
      <li className="shrink-0 h-full w-[272px] select-none relative">
        <form
          ref={formRef}
          action={handleSubmit}
          className="bg-white rounded-md space-y-4 shadow-lg p-3"
        >
          <div>
            <InputForm id="title" label="List Title" type="text" />
            <FormSubmit className="mt-2">Create List</FormSubmit>
          </div>
        </form>
        <Button
          className="absolute bottom-[10%]  right-0 bg-white text-black hover:bg-white"
          onClick={() => setIsEditable(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </li>
    );
  }
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <Button
        className="w-full rounded-lg bg-white text-black hover:bg-slate-100 text-sm transition p-4  flex justify-between"
        onClick={editEnable}
      >
        Create List
        <Plus className="h-4 w-4 mr-2" />
      </Button>
    </li>
  );
};

export default CreateList;
