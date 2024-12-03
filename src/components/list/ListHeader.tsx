"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { updateList } from "@/app/actions/list";
import { bgColors } from "@/constants/colors";
import { List } from "@/types";
import InputForm from "../atomic/InputForm";
import ListOption from "./ListOption";

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
      className={`sticky inset-0 flex h-[2.5rem] items-center justify-between border-b px-2 text-sm font-semibold`}
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
            className="h-7 truncate border-transparent bg-white px-2 py-1 text-sm font-medium transition hover:border-input focus:bg-white"
            ref={inputRef}
          />
          <button type="submit" hidden className=""></button>
        </form>
      ) : (
        <div
          className="tet-sm h-7 w-full border-transparent px-2.5 py-1 font-semibold"
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
