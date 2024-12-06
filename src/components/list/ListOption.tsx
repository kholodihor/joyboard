"use client";

import { List } from "@/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "../ui/separator";
import FormSubmit from "../atomic/FormSubmit";
import { toast } from "sonner";
import { listCopy, listDelete } from "@/app/actions/list";

const ListOption = ({ list }: { list: List }) => {
  const copyList = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission behavior
    try {
      if (!list?.id || !list?.boardId) {
        toast.error("Something went wrong");
        return;
      }
      const res = await listCopy({ id: list?.id, boardId: list?.boardId });
      if (res?.result) {
        toast.success("List copied successfully");
      }
    } catch (error) {
      toast.error("List not copied");
    }
  };

  const deleteList = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission behavior
    try {
      if (!list?.id || !list?.boardId) {
        toast.error("Something went wrong");
        return;
      }
      const res = await listDelete({ id: list?.id, boardId: list?.boardId });
      if (res?.result) {
        toast.success("List deleted successfully");
      }
    } catch (error) {
      toast.error("List not deleted");
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 bg-white">
        <Separator />
        <form onSubmit={copyList}>
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto px-5 py-2 text-sm"
          >
            Copy List
          </FormSubmit>
        </form>
        <Separator />
        <form onSubmit={deleteList}>
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto px-5 py-2 text-sm"
          >
            Delete List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOption;
