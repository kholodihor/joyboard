'use client';

import { toast } from 'sonner';

import { createCard } from '@/app/actions/card';

import InlineCreateForm from '../atomic/inline-create-form';

const CreateCard = ({ listId }: { listId: string }) => {
  const handleCreate = async (title: string) => {
    if (!title) {
      toast.error('Please add card title');
      return false;
    }

    try {
      const res = await createCard({ title, listId });
      if (!res.success) {
        toast.error(res.error);
        return false;
      }
      toast.success('Card successfully added');
      return true;
    } catch (error) {
      console.log(error);
      toast.error('Card not created');
      return false;
    }
  };

  return (
    <InlineCreateForm
      triggerLabel="Create Card"
      placeholder="Card Title"
      submitLabel="Create Card"
      onCreate={handleCreate}
      multiline
      className="px-2 pt-2"
      openClassName="relative h-full w-[272px] shrink-0 select-none bg-white"
      triggerClassName="h-auto w-full bg-white px-2 py-1.5 text-sm text-muted-foreground hover:bg-white"
      formClassName="m-1 space-y-4 px-1 py-0.5"
      closeClassName="absolute bottom-0 right-0 bg-white text-black hover:bg-white"
    />
  );
};

export default CreateCard;
