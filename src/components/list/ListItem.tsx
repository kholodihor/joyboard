import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Card, List } from "@/types";
import CardItem from "../cards/CardItem";
import CreateCard from "../cards/CreateCard";
import ListHeader from "./ListHeader";

const ListItem = ({ list, index }: { list: List; index: number }) => {
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="no-scrollbar h-full max-h-[77vh] w-[272px] shrink-0 select-none overflow-auto rounded-md"
        >
          <div
            {...provided.dragHandleProps}
            className="relative w-full rounded-md bg-slate-50 pb-2 shadow-md"
          >
            <ListHeader list={list} index={index} />
            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 flex flex-col gap-y-2 rounded-md px-1 py-0.5",
                    list?.cards?.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {list?.cards?.map((card: Card, index: number) => (
                    <CardItem key={card.id} card={card} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CreateCard listId={list.id} />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
