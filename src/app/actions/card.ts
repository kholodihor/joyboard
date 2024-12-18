'use server';

import { z } from 'zod';

import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidateBoard, revalidateCard } from '@/lib/revalidate';
import { Card, UpdateCard, User } from '@/types';

type CardResponse =
  | { success: true; result: any }
  | { success: false; error: string };

// Helper function for authentication
const authenticateUser = async () => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
};

// Helper function for error handling
const handleServerError = (error: unknown, message: string) => {
  console.error(`Error: ${message}`, error);
  return { error: message };
};

export const createCard = async (data: {
  title: string;
  listId: string;
  boardId: string;
}) => {
  try {
    await authenticateUser();

    const { title, listId, boardId } = data;
    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list) {
      return { error: 'List not found' };
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = lastCard ? lastCard.order + 1 : 1;
    const card = await prisma.card.create({
      data: {
        title,
        listId,
        boardId,
        order,
        label: [],
        comments: [],
        links: [],
        trackedTimes: [],
        todos: [],
        dateTo: null,
      },
    });

    revalidateBoard(boardId);
    return { success: true, result: card };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to create card'),
    };
  }
};

// update card
export const updateCard = async (data: z.infer<typeof UpdateCard>) => {
  try {
    await authenticateUser();

    const { boardId, id, ...values } = data;
    const card = await prisma.card.update({
      where: { id },
      data: { ...values },
    });
    revalidateCard(boardId, id);
    return { success: true, result: card };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to update card'),
    };
  }
};

// copy card
export const copyCard = async (data: { id: string; boardId: string }) => {
  try {
    await authenticateUser();

    const { id, boardId } = data;
    const originalCard = await prisma.card.findUnique({ where: { id } });

    if (!originalCard) {
      return {
        error: 'card not exist',
      };
    }
    const lastCard = await prisma.card.findFirst({
      where: { listId: originalCard?.listId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = lastCard ? lastCard.order + 1 : 1;

    const card = await prisma.card.create({
      data: {
        title: `${originalCard?.title} - copy`,
        description: originalCard?.description,
        label: [],
        comments: [],
        trackedTimes: [],
        todos: [],
        links: [],
        dateTo: null,
        listId: originalCard.listId,
        boardId,
        order,
      },
    });
    revalidateCard(boardId, card.id);
    return { success: true, result: card };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to copy card'),
    };
  }
};

// delete card
export const deleteCard = async (data: { id: string; boardId: string }) => {
  try {
    await authenticateUser();

    const { id, boardId } = data;
    const card = await prisma.card.delete({
      where: { id },
    });
    revalidateCard(boardId, id);
    return { success: true, result: card };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to delete card'),
    };
  }
};

// get no card members
export const getNoCardMembers = async (data: {
  boardId: string;
  cardId: string;
}) => {
  try {
    await authenticateUser();

    const { boardId, cardId } = data;
    const users = await prisma.user.findMany({
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
    revalidateBoard(boardId);
    return { success: true, result: users };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to get non-card members'),
    };
  }
};

// add card members
export const addCardMember = async (data: { user: User; card: Card }) => {
  try {
    await authenticateUser();
    const { user, card } = data;

    const [updateUser, updatedCard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          cardIds: { push: card.id },
        },
      }),
      prisma.card.update({
        where: { id: card.id },
        data: {
          userIds: { push: user.id },
        },
      }),
    ]);

    revalidateCard(card.boardId, card.id);
    return { success: true, result: { updateUser, updatedCard } };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to add card member'),
    };
  }
};

export const removeMemberFromCard = async (data: {
  user: User;
  card: Card;
}) => {
  try {
    await authenticateUser();
    const { user, card } = data;

    const [updatedUser, updatedCard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          cardIds: { set: user?.cardIds?.filter(id => id !== card.id) }, // Remove card ID from user's cardIds
        },
      }),
      prisma.card.update({
        where: { id: card.id },
        data: {
          userIds: { set: card?.userIds?.filter(id => id !== user.id) }, // Remove user ID from card's userIds
        },
      }),
    ]);

    revalidateCard(card.boardId, card.id);
    return { success: true, result: { updatedUser, updatedCard } };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to remove card member'),
    };
  }
};

//update label of the card
export const updateCardLabel = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        label: card.label,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to update card label'),
    };
  }
};

//update isCompleted of the card
export const updateCardIsCompleted = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        isCompleted: card.isCompleted,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to update card completion status'),
    };
  }
};

//add  comment to the card
export const addCardComment = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        comments: card.comments,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to add card comment'),
    };
  }
};

//remove comment from the card
export const removeCardComment = async (data: {
  card: Card;
}): Promise<CardResponse> => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        comments: card.comments,
      },
    });
    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to delete card comment'),
    };
  }
};

//add todo to the card
export const addCardTodo = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        todos: card.todos,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to add card todo'),
    };
  }
};

//update todo completed
export const changeTodoCompleted = async (data: {
  card: Card;
}): Promise<CardResponse> => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        todos: card.todos,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to add card todo'),
    };
  }
};

//remove todo from the card
export const removeCardTodo = async (data: {
  card: Card;
}): Promise<CardResponse> => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        todos: card.todos,
      },
    });
    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to delete card todo'),
    };
  }
};

//add link to the card
export const addCardLink = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        links: card.links,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to add card link'),
    };
  }
};

//remove link from the card
export const removeCardLink = async (data: {
  card: Card;
}): Promise<CardResponse> => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        links: card.links,
      },
    });
    revalidateCard(card.boardId, card.id);
    return { success: true, result: updatedCard };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to delete card link'),
    };
  }
};

//update card date
export const updateCardDate = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        dateTo: card.dateTo,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: { updatedCard } };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to update card date'),
    };
  }
};

// re order card
export const reorderCard = async (data: { items: any[]; boardId: string }) => {
  try {
    await authenticateUser();
    const { items, boardId } = data;

    const cards = await prisma.$transaction(
      items.map(card =>
        prisma.card.update({
          where: { id: card.id },
          data: {
            order: card.order,
            listId: card.listId,
          },
        }),
      ),
    );

    revalidateBoard(boardId);
    return { success: true, result: cards };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to reorder cards'),
    };
  }
};

//tracked time
export const updateCardTrackedTimes = async (data: { card: Card }) => {
  try {
    await authenticateUser();
    const { card } = data;

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        trackedTimes: card.trackedTimes,
      },
    });

    revalidateCard(card.boardId, card.id);
    return { success: true, result: { updatedCard } };
  } catch (error) {
    return {
      success: false,
      ...handleServerError(error, 'Failed to update card tracked times'),
    };
  }
};
