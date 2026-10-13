'use client';

import React, { useRef, useState } from 'react';

import { toast } from 'sonner';

import { updateList } from '@/app/actions/list';
import { bgColors } from '@/constants/colors';
import type { List } from '@/types';

import InputForm from '../atomic/input-form';

import ListOption from './list-option';

const ListHeader = ({ list, index }: { list: List; index: number }) => {
  const [title, setTitle] = useState(list?.title);
  const [isEditable, setIsEditable] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const newTitle = inputRef.current?.value || '';

    if (newTitle === title) {
      setIsEditable(false);
      return;
    }

    try {
      const res = await updateList({ title: newTitle, id: list.id });
      if (!res.result) {
        toast.error(res.error ?? 'List not updated');
        return;
      }
      setTitle(res.result.title);
      setIsEditable(false); // Close the edit mode after submission
      toast.success('List successfully updated');
    } catch (error) {
      console.log(error);
      toast.error('List not updated');
    }
  };

  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between gap-x-2 bg-slate-50 px-2 py-2`}
      style={{ backgroundColor: bgColors[index % bgColors.length] }}
    >
      {isEditable ? (
        <form onSubmit={handleSubmit} className="w-full shadow-md">
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
