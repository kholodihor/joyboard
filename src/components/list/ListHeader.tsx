"use client";
import { List } from "@/types";
import React, { useRef, useState } from "react";
import InputForm from "../atomic/InputForm";
import { updateList } from "@/app/actions/list";
import { toast } from "sonner";
import ListOption from "./ListOption";
import { bgColors } from "@/constants/colors";

const ListHeader = ({ list, index }: { list: List; index: number }) => {
  const [title, setTitle] = useState(list?.title);
  const [isEditable, setIsEditable] = useState(false);

  const inputRef = useRef(null);

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;
    const id = formData.get("id") as string;

    if (title == list.title) {
      setIsEditable(false);
    }
    try {
      const res: any = await updateList({ title, boardId, id });
      setTitle(res?.result?.title);
      if (res?.result) toast.success("List successfully updated");
    } catch (error) {
      toast.error("List not updated");
    }
  };
  return (
    <div
      className={`px-2 text-sm font-semibold flex justify-between items-center border-b`}
      style={{ backgroundColor: bgColors[index] }}
    >
      {isEditable ? (
        <form action={handleSubmit} className="shadow-md">
          <input hidden id="id" name="id" value={list.id} />
          <input hidden id="boardId" name="boardId" value={list.boardId} />
          <InputForm
            id="title"
            placeholder="Enter List name"
            defaultValue={title}
            className="px-2 py-1 h-7 font-medium border-transparent text-sm hover:border-input transition truncate 
            bg-white focus:bg-white"
            ref={inputRef}
          />
          <button type="submit" hidden className=""></button>
        </form>
      ) : (
        <div
          className="w-full tet-sm px-2.5 py-1 h-7 border-transparent font-semibold"
          onClick={() => setIsEditable(true)}
        >
          {title.toUpperCase()}
        </div>
      )}
      <ListOption list={list} />
    </div>
  );
};

export default ListHeader;
