'use server';

import { revalidateTag } from 'next/cache';

import { List } from '@prisma/client';

import { prisma } from '@/lib/prisma';

interface ReorderListItem {
  id: string;
  order: number;
}

type ActionResponse<T> = Promise<
  { error: string; result?: never } | { error?: never; result: T }
>;

export const createList = async (data: {
  title: string;
  boardId: string;
}): ActionResponse<List> => {
  const { title, boardId } = data;

  try {
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const list = await prisma.list.create({
      data: {
        title,
        boardId,
        order: lastList ? lastList.order + 1 : 1,
      },
    });

    revalidateTag(`board-${boardId}`);
    return { result: list };
  } catch (error) {
    console.error('Failed to create list:', error);
    return { error: 'Failed to create list' };
  }
};

export const getLists = async ({
  boardId,
}: {
  boardId: string;
}): ActionResponse<List[]> => {
  try {
    const lists = await prisma.list.findMany({
      where: { boardId },
      include: {
        cards: {
          orderBy: { order: 'asc' },
          include: { users: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return { result: lists };
  } catch (error) {
    console.error('Failed to fetch lists:', error);
    return { error: 'Failed to fetch lists' };
  }
};

export const updateList = async (data: {
  title: string;
  boardId: string;
  id: string;
}): ActionResponse<List> => {
  const { title, id, boardId } = data;

  try {
    const list = await prisma.list.update({
      where: { id, boardId },
      data: { title },
    });

    revalidateTag(`board-${boardId}`);
    revalidateTag(`list-${id}`);
    return { result: list };
  } catch (error) {
    console.error('Failed to update list:', error);
    return { error: 'Failed to update list' };
  }
};

export const deleteList = async (data: {
  id: string;
  boardId: string;
}): ActionResponse<List> => {
  const { id, boardId } = data;

  try {
    const list = await prisma.list.delete({
      where: { id, boardId },
    });

    revalidateTag(`board-${boardId}`);
    revalidateTag(`list-${id}`);
    return { result: list };
  } catch (error) {
    console.error('Failed to delete list:', error);
    return { error: 'Failed to delete list' };
  }
};

export const reorderLists = async (data: {
  items: ReorderListItem[];
  boardId: string;
}): ActionResponse<List[]> => {
  const { items, boardId } = data;

  try {
    const transaction = items.map(list =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      }),
    );

    const lists = await prisma.$transaction(transaction);

    revalidateTag(`board-${boardId}`);
    items.forEach(item => revalidateTag(`list-${item.id}`));

    return { result: lists };
  } catch (error) {
    console.error('Failed to reorder lists:', error);
    return { error: 'Failed to reorder lists' };
  }
};

// copy list
// export const listCopy = async (data: { id: string; boardId: string }) => {
//   const { id, boardId } = data;
//   let list;
//   try {
//     const listtoCopy = await prisma.list.findUnique({
//       where: { id, boardId },
//       include: {
//         cards: true,
//       },
//     });

//     if (!listtoCopy) {
//       return {
//         error: 'list not found',
//       };
//     }
//     const lastList = await prisma.list.findFirst({
//       where: { boardId },
//       orderBy: { order: 'desc' },
//       select: { order: true },
//     });

//     const order = lastList ? lastList.order + 1 : 1;

//     list = await prisma.list.create({
//       data: {
//         boardId: listtoCopy.boardId,
//         title: `${listtoCopy?.title} - copy`,
//         order,
//         cards: listtoCopy?.cards?.length
//           ? {
//             createMany: {
//               data: listtoCopy?.cards?.map(card => ({
//                 title: card?.title,
//                 description: card.description,
//                 order: card.order,
//                 label: card.label,
//                 comments: card.comments,
//                 dateTo: card.dateTo,
//                 boardId: card.boardId,
//               })),
//             },
//           }
//           : {},
//       },
//       include: {
//         cards: true,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return {
//       error: 'failed to copy',
//     };
//   }

//   revalidatePath(`/board/${boardId}`);
//   return { result: list };
// };
