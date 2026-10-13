'use server';

import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  AccessError,
  requireBoardAccess,
  requireCardAccess,
  requireListAccess,
  toErrorMessage,
} from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { revalidateBoard, revalidateCard } from '@/lib/revalidate';
import { Card, UpdateCard, User } from '@/types';

export type CardResponse<T> =
  | { success: true; result: T }
  | { success: false; error: string };

// Same shape as GET /api/card/[cardId], so the modal can drop results straight
// into its SWR cache without losing members.
const cardInclude = { list: true, users: true } as const;

const run = async <T>(
  fallback: string,
  fn: () => Promise<T>,
): Promise<CardResponse<T>> => {
  try {
    return { success: true, result: await fn() };
  } catch (error) {
    return { success: false, error: toErrorMessage(error, fallback) };
  }
};

const nextOrder = async (listId: string) => {
  const lastCard = await prisma.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });
  return lastCard ? lastCard.order + 1 : 1;
};

const updateCardFields = (
  cardId: string,
  data: Prisma.CardUpdateInput,
  fallback: string,
) =>
  run(fallback, async () => {
    const { boardId } = await requireCardAccess(cardId);
    const card = await prisma.card.update({
      where: { id: cardId },
      data,
      include: cardInclude,
    });
    revalidateCard(boardId, cardId);
    return card;
  });

export const createCard = async (data: { title: string; listId: string }) =>
  run('Failed to create card', async () => {
    const { listId } = data;
    const title = data.title?.trim();
    if (!title) throw new AccessError('Card title is required.');

    const { boardId } = await requireListAccess(listId);
    const card = await prisma.card.create({
      data: { title, listId, boardId, order: await nextOrder(listId) },
    });
    revalidateBoard(boardId);
    return card;
  });

export const updateCard = async (data: z.infer<typeof UpdateCard>) => {
  const parsed = UpdateCard.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: 'Invalid card data' };
  }
  const { id, title, description } = parsed.data;
  return updateCardFields(id, { title, description }, 'Failed to update card');
};

export const copyCard = async (data: { id: string }) =>
  run('Failed to copy card', async () => {
    const { boardId } = await requireCardAccess(data.id);
    const original = await prisma.card.findUniqueOrThrow({
      where: { id: data.id },
    });

    const card = await prisma.card.create({
      data: {
        title: `${original.title} - copy`,
        description: original.description,
        listId: original.listId,
        boardId,
        order: await nextOrder(original.listId),
      },
    });
    revalidateBoard(boardId);
    return card;
  });

export const deleteCard = async (data: { id: string }) =>
  run('Failed to delete card', async () => {
    const { boardId } = await requireCardAccess(data.id);
    const card = await prisma.card.delete({ where: { id: data.id } });
    revalidateCard(boardId, data.id);
    return card;
  });

export const getNoCardMembers = async (data: { cardId: string }) =>
  run('Failed to get non-card members', async () => {
    const { boardId } = await requireCardAccess(data.cardId);
    return prisma.user.findMany({
      where: {
        boards: { some: { id: boardId } },
        NOT: { cards: { some: { id: data.cardId } } },
      },
    });
  });

export const addCardMember = async (data: { user: User; card: Card }) =>
  run('Failed to add card member', async () => {
    const { boardId } = await requireCardAccess(data.card.id);
    const isBoardMember = await prisma.user.count({
      where: { id: data.user.id, boardIds: { has: boardId } },
    });
    if (!isBoardMember) {
      throw new AccessError('User is not a member of this board.');
    }

    const card = await prisma.card.update({
      where: { id: data.card.id },
      data: { users: { connect: { id: data.user.id } } },
      include: cardInclude,
    });
    revalidateCard(boardId, card.id);
    return card;
  });

export const removeMemberFromCard = async (data: { user: User; card: Card }) =>
  updateCardFields(
    data.card.id,
    { users: { disconnect: { id: data.user.id } } },
    'Failed to remove card member',
  );

export const updateCardLabel = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { label: card.label },
    'Failed to update card label',
  );

export const updateCardIsCompleted = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { isCompleted: card.isCompleted },
    'Failed to update card completion status',
  );

export const updateCardDate = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { dateTo: card.dateTo || null },
    'Failed to update card date',
  );

export const updateCardTrackedTimes = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { trackedTimes: card.trackedTimes },
    'Failed to update card tracked times',
  );

export const addCardComment = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { comments: card.comments },
    'Failed to add card comment',
  );

export const removeCardComment = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { comments: card.comments },
    'Failed to delete card comment',
  );

export const addCardTodo = async ({ card }: { card: Card }) =>
  updateCardFields(card.id, { todos: card.todos }, 'Failed to add card todo');

export const changeTodoCompleted = async ({ card }: { card: Card }) =>
  updateCardFields(card.id, { todos: card.todos }, 'Failed to update todo');

export const removeCardTodo = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { todos: card.todos },
    'Failed to delete card todo',
  );

export const addCardLink = async ({ card }: { card: Card }) =>
  updateCardFields(card.id, { links: card.links }, 'Failed to add card link');

export const removeCardLink = async ({ card }: { card: Card }) =>
  updateCardFields(
    card.id,
    { links: card.links },
    'Failed to delete card link',
  );

export const reorderCard = async (data: {
  items: { id: string; order: number; listId: string }[];
  boardId: string;
}) =>
  run('Failed to reorder cards', async () => {
    const { boardId, items } = data;
    await requireBoardAccess(boardId);

    // Cards may only move between lists of this board.
    const boardListIds = new Set(
      (
        await prisma.list.findMany({ where: { boardId }, select: { id: true } })
      ).map(list => list.id),
    );
    if (items.some(item => !boardListIds.has(item.listId))) {
      throw new AccessError('Invalid list.');
    }

    const cards = await prisma.$transaction(
      items.map(card =>
        prisma.card.update({
          where: { id: card.id, boardId },
          data: { order: card.order, listId: card.listId },
        }),
      ),
    );
    revalidateBoard(boardId);
    return cards;
  });
