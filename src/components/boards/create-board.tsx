'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { createBoard } from '@/app/actions/boards';
import FormSubmit from '@/components/atomic/form-submit';
import ImagesForm from '@/components/atomic/images-form';
import InputForm from '@/components/atomic/input-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const CreateBoardPopup = () => {
  const router = useRouter();

  const handleCreateBoard = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;

    if (!title || !image) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await createBoard({ title, image });
      if ('board' in res && res.board) {
        toast.success('Board successfully added');
        router.push(`/board/${res.board.id}`);
      } else {
        toast.error(res.error || 'Failed to create board');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Board not created';
      toast.error(errorMessage);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleCreateBoard(formData);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div
          role="button"
          className="relative flex aspect-video w-60 flex-col items-center justify-center gap-y-1 rounded-sm border-2 border-pink-300 bg-muted p-3 transition hover:opacity-75"
        >
          <p className="text-sm">Create new board</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="pb-4 text-center text-sm font-medium text-gray-600">
          Create Board
        </div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <ImagesForm name="image" />
            <InputForm
              id="title"
              name="title"
              label="Board Title"
              type="text"
            />
            <FormSubmit className="mt-2 w-full">Create Board</FormSubmit>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBoardPopup;
