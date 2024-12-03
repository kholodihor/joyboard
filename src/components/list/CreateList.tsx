"use client";

import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createLists } from "@/app/actions/list";
import FormSubmit from "../atomic/FormSubmit";
import InputForm from "../atomic/InputForm";
import { Button } from "../ui/button";

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
      <li className="relative h-full w-[272px] shrink-0 select-none">
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-4 rounded-md bg-white p-3 shadow-lg"
        >
          <div>
            <InputForm id="title" label="List Title" type="text" />
            <FormSubmit className="mt-2">Create List</FormSubmit>
          </div>
        </form>
        <Button
          className="absolute bottom-[10%] right-0 bg-white text-black hover:bg-white"
          onClick={() => setIsEditable(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </li>
    );
  }
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <Button
        className="flex w-full justify-between rounded-lg bg-white p-4 text-sm text-black transition hover:bg-slate-100"
        onClick={editEnable}
      >
        Create List
        <Plus className="mr-2 h-4 w-4" />
      </Button>
    </li>
  );
};

export default CreateList;
