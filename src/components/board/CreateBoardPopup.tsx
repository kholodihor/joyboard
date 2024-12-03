"use client";

import { toast } from "sonner";
import { createBoard } from "@/app/actions/board";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FormSubmit from "../atomic/FormSubmit";
import ImagesForm from "../atomic/ImagesForm";
import InputForm from "../atomic/InputForm";

const CreateBoardPopup = () => {
  const handleSubmit = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const image = formData.get("image") as string;
      if (!title || !image) {
        toast.error("please fill all required fields");
        return;
      }
      const res = await createBoard({ title, image });
      if (res && res.result) {
        toast.success("Board successfully added");
      }
      window.location.reload();
    } catch (error) {
      toast.error("organization not created");
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div
          role="button"
          className="relative flex aspect-video w-60 flex-col items-center justify-center gap-y-1 rounded-sm border-2 border-pink-300 bg-muted p-3 transition hover:opacity-75"
        >
          <p className="text-sm">Create new board</p>
          <p className="text-xs">Unlimited</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="pb-4 text-center text-sm font-medium text-gray-600">
          Create Board
        </div>
        <form action={handleSubmit}>
          <div>
            <ImagesForm name="image" />
            <InputForm id="title" label="Board Title" type="text" />
            <FormSubmit className="mt-2 w-full">Create Board</FormSubmit>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBoardPopup;
