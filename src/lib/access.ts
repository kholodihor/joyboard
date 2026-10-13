import { unstable_rethrow } from 'next/navigation';
import type { Session } from 'next-auth';

import { GUEST_BOARD_TITLE, isAdmin } from '@/constants/auth';

import { getAuthSession } from './auth';
import { prisma } from './prisma';

export class AccessError extends Error {}

type BoardAccessFields = {
  title: string;
  userIds: string[];
  userEmails: string[];
};

export const requireSession = async () => {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new AccessError('Unauthorized. Please log in.');
  }
  return session;
};

export const requireAdmin = async () => {
  const session = await requireSession();
  if (!isAdmin(session.user.email)) {
    throw new AccessError('Only admin can perform this action.');
  }
  return session;
};

// Admin sees everything, everyone sees the Guest Board, otherwise the user
// must be a member or have been invited by email.
export const canAccessBoard = (session: Session, board: BoardAccessFields) => {
  const { id, email } = session.user;
  return (
    isAdmin(email) ||
    board.title === GUEST_BOARD_TITLE ||
    (!!id && board.userIds.includes(id)) ||
    (!!email && board.userEmails.includes(email))
  );
};

export const requireBoardAccess = async (boardId: string) => {
  const session = await requireSession();
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board || !canAccessBoard(session, board)) {
    throw new AccessError('Board not found.');
  }
  return { session, board };
};

export const requireCardAccess = async (cardId: string) => {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true, boardId: true, listId: true },
  });
  if (!card) {
    throw new AccessError('Card not found.');
  }
  await requireBoardAccess(card.boardId);
  return card;
};

export const requireListAccess = async (listId: string) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { id: true, boardId: true },
  });
  if (!list) {
    throw new AccessError('List not found.');
  }
  await requireBoardAccess(list.boardId);
  return list;
};

// Expected access failures surface their own message; anything else is logged
// and replaced with a generic one so internals don't leak to the client.
export const toErrorMessage = (error: unknown, fallback: string) => {
  // Let Next's own control-flow errors (dynamic usage, notFound, redirect) through.
  unstable_rethrow(error);
  if (error instanceof AccessError) return error.message;
  console.error(fallback, error);
  return fallback;
};
