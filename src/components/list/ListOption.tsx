"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { listCopy, listDelete } from "@/app/actions/list";
import { List } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const ListOption = ({ list }: { list: List }) => {
  const copyList = async () => {
    try {
      if (!list?.id || !list?.boardId) {
        toast.error("something went wrong");
        return;
      }
      const res = await listCopy({ id: list?.id, boardId: list?.boardId });
      if (res?.result) {
        toast.success("list copied successfully");
      }
    } catch (error) {
      toast.error("list not copied");
    }
  };

  const deleteList = async () => {
    try {
      if (!list?.id || !list?.boardId) {
        toast.error("something went wrong");
        return;
      }
      const res = await listDelete({ id: list?.id, boardId: list?.boardId });
      if (res?.result) {
        toast.success("list deleted successfully");
      }
    } catch (error) {
      toast.error("list not deleted");
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white px-0">
        <Separator />
        <form action={copyList}>
          <FormSubmit
            variant="ghost"
            className="tet-sm h-auto w-full rounded-none px-5 py-2"
          >
            Copy List
          </FormSubmit>
        </form>
        <Separator />
        <form action={deleteList}>
          <FormSubmit
            variant="ghost"
            className="tet-sm h-auto w-full rounded-none px-5 py-2"
          >
            Delete List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOption;
