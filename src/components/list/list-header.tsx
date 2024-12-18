'use client';

import React, { useRef, useState } from 'react';

import { toast } from 'sonner';

import { updateList } from '@/app/actions/list';
import { bgColors } from '@/constants/colors';
import { List } from '@/types';

import InputForm from '../atomic/input-form';

import ListOption from './list-option';

const ListHeader = ({ list, index }: { list: List; index: number }) => {
  const [title, setTitle] = useState(list?.title);
  const [isEditable, setIsEditable] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const title = inputRef.current?.value || '';
    const boardId = list.boardId;
    const id = list.id;

    if (title === list.title) {
      setIsEditable(false);
      return;
    }

    try {
      const res: any = await updateList({ title, boardId, id });
      setTitle(res?.result?.title);
      setIsEditable(false); // Close the edit mode after submission
      if (res?.result) toast.success('List successfully updated');
    } catch (error) {
      console.log(error);
      toast.error('List not updated');
    }
  };

  return (
    <div
      className={`sticky inset-0 flex h-[2.5rem] items-center justify-between border-b px-2 text-sm font-semibold`}
      style={{ backgroundColor: bgColors[index] }}
    >
      {isEditable ? (
        <form onSubmit={handleSubmit} className="w-full shadow-md">
          <input hidden id="id" name="id" value={list.id} />
          <input hidden id="boardId" name="boardId" value={list.boardId} />
          <InputForm
            id="title"
            placeholder="Enter List name"
            defaultValue={title}
            className="h-7 truncate border-transparent bg-white px-2 py-1 text-sm font-medium transition hover:border-input focus:bg-white"
            ref={inputRef}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          className="h-7 w-full cursor-pointer border-transparent px-2.5 py-1 text-sm font-semibold"
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
