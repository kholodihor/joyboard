'use client';

import React, { useEffect, useState } from 'react';

import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

import { reorderCard } from '@/app/actions/card';
import { reorderLists } from '@/app/actions/list';
import type { ListWithCards } from '@/types';

import CreateList from './create-list';
import ListItem from './list-item';

interface ListProps {
  boardId: string;
  list: ListWithCards[];
}

function reOrderData<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const toCardItems = (cards: ListWithCards['cards']) =>
  cards.map(({ id, order, listId }) => ({ id, order, listId }));

const ListContainer = ({ boardId, list }: ListProps) => {
  const [listData, setListData] = useState(list);

  useEffect(() => {
    setListData(list);
  }, [list]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const previous = listData;

    if (type === 'list') {
      const data = reOrderData(listData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );
      setListData(data);
      const res = await reorderLists({
        items: data.map(({ id, order }) => ({ id, order })),
        boardId,
      });
      if (res.error) {
        toast.error(res.error);
        setListData(previous);
      }
      return;
    }

    if (type === 'card') {
      const sourceList = listData.find(item => item.id === source.droppableId);
      const destList = listData.find(
        item => item.id === destination.droppableId,
      );
      if (!sourceList || !destList) return;

      let changedLists: ListWithCards[];

      if (source.droppableId === destination.droppableId) {
        const cards = reOrderData(
          sourceList.cards ?? [],
          source.index,
          destination.index,
        ).map((card, idx) => ({ ...card, order: idx }));
        changedLists = [{ ...sourceList, cards }];
      } else {
        const sourceCards = [...(sourceList.cards ?? [])];
        const [movedCard] = sourceCards.splice(source.index, 1);
        if (!movedCard) return;
        const destCards = [...(destList.cards ?? [])];
        destCards.splice(destination.index, 0, {
          ...movedCard,
          listId: destList.id,
        });
        changedLists = [
          {
            ...sourceList,
            cards: sourceCards.map((card, idx) => ({ ...card, order: idx })),
          },
          {
            ...destList,
            cards: destCards.map((card, idx) => ({ ...card, order: idx })),
          },
        ];
      }

      const newListData = listData.map(
        item => changedLists.find(changed => changed.id === item.id) ?? item,
      );
      setListData(newListData);

      const res = await reorderCard({
        boardId,
        items: changedLists.flatMap(item => toCardItems(item.cards)),
      });
      if (!res.success) {
        toast.error(res.error);
        setListData(previous);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {provided => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full min-h-[75vh] w-full list-none gap-x-3"
          >
            {listData?.map((list, index) => (
              <ListItem key={list.id} list={list} index={index} />
            ))}
            {provided.placeholder}
            <CreateList boardId={boardId} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
