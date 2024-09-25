/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Card, UpdateCard, User } from "@/interfaces";

export const cardCreate = async (data: {
  title: string;
  listId: string;
  boardId: string;
}) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { title, listId, boardId } = data;
  let card;

  try {
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const order = lastCard ? lastCard.order + 1 : 1;
    card = await prisma.card.create({
      data: {
        title,
        listId,
        boardId,
        order,
        label: [],
        comments: [],
        dateTo: new Date(Date.now()),
      },
    });
  } catch (error) {
    return {
      error: "card not created",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// update card
export const updateCard = async (data: z.infer<typeof UpdateCard>) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { boardId, id, ...values } = data;
  let card;
  try {
    card = await prisma.card.update({
      where: { id },
      data: { ...values },
    });
  } catch (error) {
    return {
      error: "card not updated",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// copy card
export const CardCopy = async (data: { id: string; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    const getCard = await prisma.card.findUnique({ where: { id } });

    if (!getCard) {
      return {
        error: "card not exist",
      };
    }
    const lastCard = await prisma.card.findFirst({
      where: { listId: getCard?.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = lastCard ? lastCard.order + 1 : 1;

    card = await prisma.card.create({
      data: {
        title: `${getCard?.title} - copy`,
        description: getCard?.description,
        label: [],
        comments: [],
        dateTo: "",
        listId: getCard.listId,
        boardId,
        order,
      },
    });
  } catch (error) {
    return {
      error: "card not created",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// delete card
export const CardDelete = async (data: { id: string; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { id, boardId } = data;
  let card;
  try {
    card = await prisma.card.delete({
      where: { id },
    });
  } catch (error) {
    return {
      error: "card not deleted",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: card };
};

// add members in card
export const getNoCardMembers = async (data: {
  boardId: string;
  cardId: string;
}) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { boardId, cardId } = data;
  let users;
  try {
    users = await prisma.user.findMany({
      where: {
        boards: {
          some: { id: boardId },
        },
        NOT: {
          cards: {
            some: { id: cardId },
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { result: users };
};

// add card members
export const addCardMember = async (data: { user: User; card: Card }) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { user, card } = data;
  let updateUser, updatedCard;
  try {
    [updateUser, updatedCard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          cardIds: user.cardIds,
        },
      }),
      prisma.card.update({
        where: { id: card.id },
        data: {
          userIds: card.userIds,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updateUser, updatedCard } };
};

//update label of the card
export const updateCardLabel = async (data: { card: Card }) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }
  const { card } = data;
  let updatedCard;
  try {
    [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: card.id },
        data: {
          label: card.label,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updatedCard } };
};

//update label of the card
export const updateCardIsCompleted = async (data: { card: Card }) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }
  const { card } = data;
  let updatedCard;
  try {
    [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: card.id },
        data: {
          isCompleted: card.isCompleted,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updatedCard } };
};

//add  comment to the card
export const addCardComment = async (data: { card: Card }) => {
  const session: any = await getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { card } = data;
  let updatedCard;
  try {
    [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: card.id },
        data: {
          comments: card.comments,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updatedCard } };
};

//update card date
export const updateCardDate = async (data: { card: Card }) => {
  const session: any = await getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { card } = data;
  let updatedCard;
  try {
    [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: card.id },
        data: {
          dateTo: card.dateTo,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user not found",
    };
  }
  revalidatePath(`/`);
  return { result: { updatedCard } };
};

// re order card
export const reorderCard = async (data: { items: any; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { items, boardId } = data;
  let cards;
  try {
    const transaction = items.map((card: any) =>
      prisma.card.update({
        where: { id: card.id },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );
    cards = await prisma.$transaction(transaction);
  } catch (error) {
    return { error: "list not reordered" };
  }

  revalidatePath(`/board/${boardId}`);
  return { result: cards };
};
