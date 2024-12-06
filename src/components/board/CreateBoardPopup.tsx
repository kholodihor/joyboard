"use client";

import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ImagesForm from "../atomic/ImagesForm";
import InputForm from "../atomic/InputForm";
import FormSubmit from "../atomic/FormSubmit";
import { toast } from "sonner";
import { createBoard } from "@/app/actions/board";

const CreateBoardPopup = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const image = formData.get("image") as string;

      if (!title || !image) {
        toast.error("Please fill all required fields");
        return;
      }

      const res = await createBoard({ title, image });
      toast.success("Board successfully added");
      router.push(`/board/${res?.result?.id}`);
    } catch (error) {
      toast.error("Board not created");
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleSubmit(formData);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div
          role="button"
          className="w-60 p-3 aspect-video relative bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition border-2 border-pink-300"
        >
          <p className="text-sm">Create new board</p>
          <p className="text-xs">Unlimited</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="font-medium text-center text-gray-600 pb-4 text-sm">
          Create Board
        </div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <ImagesForm name="image" />
            <InputForm id="title" label="Board Title" type="text" />
            <FormSubmit className="w-full mt-2">Create Board</FormSubmit>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBoardPopup;
