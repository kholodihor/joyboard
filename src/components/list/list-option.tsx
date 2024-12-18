'use client';

import React from 'react';

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { deleteList } from '@/app/actions/list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { List } from '@/types';

import FormSubmit from '../atomic/form-submit';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const ListOption = ({ list }: { list: List }) => {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this list?')) {
      try {
        if (!list?.id || !list?.boardId) {
          toast.error('Something went wrong');
          return;
        }
        const res = await deleteList({ id: list?.id, boardId: list?.boardId });
        if (res?.result) {
          toast.success('List deleted successfully');
        }
      } catch (error) {
        console.log(error);
        toast.error('List not deleted');
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-auto p-2 transition-colors hover:bg-neutral-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 px-0 pb-3 pt-3 shadow-md"
        side="bottom"
        align="end"
      >
        <div className="pb-3 text-center text-sm font-medium text-neutral-600">
          List actions
        </div>
        <Separator className="mb-1" />
        <form onSubmit={handleDelete}>
          <FormSubmit
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal text-red-600 transition-colors hover:bg-red-50/75 hover:text-red-700"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOption;
