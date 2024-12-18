'use client';
import React, { useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import { createCard } from '@/app/actions/card';

import FormSubmit from '../atomic/form-submit';
import TextAreaForm from '../atomic/textarea-form';
import { Button } from '../ui/button';

const CreateCard = ({ listId }: { listId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { boardId }: { boardId: string } = useParams();
  const [isEditable, setIsEditable] = useState(false);

  const editEnable = () => {
    setIsEditable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(formRef.current!);
    const title = formData.get('title') as string;

    if (!title) {
      toast.error('Please add list title');
      return;
    }

    try {
      const res = await createCard({ title, listId, boardId });
      if (res?.success) {
        toast.success('Card successfully added');
        setIsEditable(false); // Close the form after submission
      } else {
        toast.error('Card not created');
      }
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      toast.error('Card not created');
    }
  };

  if (isEditable) {
    return (
      <div className="relative h-full w-[272px] shrink-0 select-none bg-white">
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="m-1 space-y-4 px-1 py-0.5"
        >
          <div>
            <TextAreaForm id="title" placeholder="List Title" />
            <FormSubmit className="mt-2">Create Card</FormSubmit>
          </div>
        </form>
        <Button
          className="absolute bottom-0 right-0 bg-white text-black hover:bg-white"
          onClick={() => setIsEditable(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-2 pt-2">
      <Button
        className="h-auto w-full bg-white px-2 py-1.5 text-sm text-muted-foreground hover:bg-white"
        onClick={editEnable}
      >
        Create Card
        <Plus className="mr-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default CreateCard;
