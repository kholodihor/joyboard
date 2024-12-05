"use client";

import { listCopy, listDelete } from "@/app/actions/list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { List } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
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
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
          onClick={copyList}
        >
          Copy List
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
          onClick={deleteList}
        >
          Delete List
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ListOption;
