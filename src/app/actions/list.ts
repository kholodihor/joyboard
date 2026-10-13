'use server';

import { List } from '@prisma/client';

import {
  AccessError,
  requireBoardAccess,
  requireListAccess,
  toErrorMessage,
} from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { revalidateBoard } from '@/lib/revalidate';

type ActionResponse<T> = Promise<
  { error: string; result?: never } | { error?: never; result: T }
>;

const run = async <T>(fallback: string, fn: () => Promise<T>) => {
  try {
    return { result: await fn() };
  } catch (error) {
    return { error: toErrorMessage(error, fallback) };
  }
};

export const createList = async (data: {
  title: string;
  boardId: string;
}): ActionResponse<List> =>
  run('Failed to create list', async () => {
    const { boardId } = data;
    const title = data.title?.trim();
    if (!title) throw new AccessError('List title is required.');

    await requireBoardAccess(boardId);
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const list = await prisma.list.create({
      data: { title, boardId, order: lastList ? lastList.order + 1 : 1 },
    });
    revalidateBoard(boardId);
    return list;
  });

export const getLists = async ({ boardId }: { boardId: string }) =>
  run('Failed to fetch lists', async () => {
    await requireBoardAccess(boardId);
    return prisma.list.findMany({
      where: { boardId },
      include: {
        cards: {
          orderBy: { order: 'asc' },
          include: { users: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  });

export const updateList = async (data: {
  title: string;
  id: string;
}): ActionResponse<List> =>
  run('Failed to update list', async () => {
    const title = data.title?.trim();
    if (!title) throw new AccessError('List title is required.');

    const { boardId } = await requireListAccess(data.id);
    const list = await prisma.list.update({
      where: { id: data.id },
      data: { title },
    });
    revalidateBoard(boardId);
    return list;
  });

export const deleteList = async (data: { id: string }): ActionResponse<List> =>
  run('Failed to delete list', async () => {
    const { boardId } = await requireListAccess(data.id);
    const list = await prisma.list.delete({ where: { id: data.id } });
    revalidateBoard(boardId);
    return list;
  });

export const reorderLists = async (data: {
  items: { id: string; order: number }[];
  boardId: string;
}): ActionResponse<List[]> =>
  run('Failed to reorder lists', async () => {
    const { items, boardId } = data;
    await requireBoardAccess(boardId);

    const lists = await prisma.$transaction(
      items.map(list =>
        prisma.list.update({
          where: { id: list.id, boardId },
          data: { order: list.order },
        }),
      ),
    );
    revalidateBoard(boardId);
    return lists;
  });
