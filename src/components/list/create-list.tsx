'use client';

import { toast } from 'sonner';

import { createList } from '@/app/actions/list';

import InlineCreateForm from '../atomic/inline-create-form';

const CreateList = ({ boardId }: { boardId: string }) => {
  const handleCreate = async (title: string) => {
    if (!title) {
      toast.error('Please add list title');
      return false;
    }

    try {
      const res = await createList({ title, boardId });
      if (res.error) {
        toast.error(res.error);
        return false;
      }
      toast.success('List successfully added');
      return true;
    } catch (error) {
      console.log(error);
      toast.error('List not created');
      return false;
    }
  };

  return (
    <InlineCreateForm
      as="li"
      triggerLabel="Create List"
      placeholder=""
      submitLabel="Create List"
      label="List Title"
      onCreate={handleCreate}
      className="h-full w-[272px] shrink-0 select-none"
      openClassName="relative h-full w-[272px] shrink-0 select-none"
      triggerClassName="flex w-full justify-between rounded-lg bg-white p-4 text-sm text-black transition hover:bg-slate-100"
      formClassName="space-y-4 rounded-md bg-white p-3 shadow-lg"
      closeClassName="absolute bottom-[10%] right-0 bg-white text-black hover:bg-white"
    />
  );
};

export default CreateList;
