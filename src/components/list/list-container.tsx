'use client';

import React, { useEffect, useState } from 'react';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { reorderCard } from '@/app/actions/card';
import { reorderLists } from '@/app/actions/list';

import CreateList from './create-list';
import ListItem from './list-item';

interface ListProps {
  boardId: string;
  list: any;
}

function reOrderData<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ boardId, list }: ListProps) => {
  const [listData, setListData] = useState(list);

  useEffect(() => {
    setListData(list);
  }, [list]);

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      const data = reOrderData(listData, source.index, destination.index).map(
        (item: any, index: number) => ({ ...item, order: index }),
      );
      setListData(data);
      await reorderLists({ items: data, boardId });
    }

    if (type === 'card') {
      const newListData = [...listData];
      const sourceList = newListData.find(
        list => list.id === source.droppableId,
      );
      const destList = newListData.find(
        list => list.id === destination.droppableId,
      );
      if (!sourceList || !destList) return;

      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destList.cards) {
        destList.cards = [];
      }
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reOrderData(
          sourceList.cards,
          source.index,
          destination.index,
        );
        reorderedCards.forEach((card: any, idx: number) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;
        setListData(newListData);
        await reorderCard({ boardId: boardId, items: reorderedCards });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;
        destList.cards.splice(destination.index, 0, movedCard);
        sourceList.cards.forEach((card: any, idx: number) => {
          card.order = idx;
        });
        destList.cards.forEach((card: any, idx: number) => {
          card.order = idx;
        });
        setListData(newListData);
        await reorderCard({ boardId: boardId, items: destList.cards });
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
            className="flex h-full min-h-[75vh] w-full gap-x-3"
          >
            {listData?.map((list: any, index: number) => (
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
