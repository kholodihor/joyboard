'use server';

import { revalidatePath } from 'next/cache';

import { GUEST_BOARD_TITLE, isAdmin } from '@/constants/auth';
import {
  AccessError,
  requireAdmin,
  requireBoardAccess,
  requireSession,
  toErrorMessage,
} from '@/lib/access';
import { prisma } from '@/lib/prisma';

const run = async <T>(fallback: string, fn: () => Promise<T>) => {
  try {
    return await fn();
  } catch (error) {
    return { error: toErrorMessage(error, fallback) };
  }
};

export const getAllBoards = async () =>
  run('Failed to retrieve boards. Please try again later.', async () => {
    const session = await requireSession();
    if (isAdmin(session.user.email)) {
      return prisma.board.findMany();
    }

    return prisma.board.findMany({
      where: {
        OR: [
          { userIds: { has: session.user.id } },
          { userEmails: { has: session.user.email ?? '' } },
          { title: GUEST_BOARD_TITLE },
        ],
      },
    });
  });

export const createBoard = async (data: { title: string; image: string }) =>
  run('Failed to create board. Please try again later.', async () => {
    const session = await requireAdmin();
    const title = data.title?.trim();
    const image = data.image?.trim();
    if (!title || !image) {
      throw new AccessError('Title and image are required.');
    }

    const board = await prisma.board.create({
      data: {
        title,
        image,
        Users: { connect: { id: session.user.id } },
      },
    });
    revalidatePath('/', 'layout');
    return { board };
  });

export const deleteBoard = async ({ id }: { id: string }) =>
  run('Failed to delete board. Please try again later.', async () => {
    await requireAdmin();
    const board = await prisma.board.delete({ where: { id } });
    revalidatePath('/', 'layout');
    return { board };
  });

// Users who were invited by email and have signed up, but aren't members yet.
export const getNoBoardMembers = async ({ boardId }: { boardId: string }) =>
  run('Failed to fetch users. Please try again later.', async () => {
    const { board } = await requireBoardAccess(boardId);
    const users = await prisma.user.findMany({
      where: {
        email: { in: board.userEmails },
        NOT: { boardIds: { has: boardId } },
      },
    });
    return { users };
  });

// Records the invite so the invitee can open the board once they sign up,
// and adds them right away if they already have an account.
export const addEmailToBoard = async (data: {
  email: string;
  boardId: string;
}) =>
  run('Failed to add user to board. Please try again later.', async () => {
    await requireAdmin();
    const email = data.email?.trim().toLowerCase();
    if (!email) throw new AccessError('Email is required.');

    const { board } = await requireBoardAccess(data.boardId);
    const user = await prisma.user.findUnique({ where: { email } });

    const updatedBoard = await prisma.board.update({
      where: { id: board.id },
      data: {
        ...(!board.userEmails.includes(email) && {
          userEmails: { push: email },
        }),
        ...(user && { Users: { connect: { id: user.id } } }),
      },
      include: { Users: true },
    });
    revalidatePath('/', 'layout');
    return { board: updatedBoard };
  });

export const addMemberInBoard = async (data: {
  userId: string;
  boardId: string;
}) =>
  run('Failed to add member to board. Please try again later.', async () => {
    const { board } = await requireBoardAccess(data.boardId);
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user?.email || !board.userEmails.includes(user.email)) {
      throw new AccessError('User has not been invited to this board.');
    }
    if (board.userIds.includes(user.id)) {
      throw new AccessError('User is already a member of this board.');
    }

    const updatedBoard = await prisma.board.update({
      where: { id: board.id },
      data: { Users: { connect: { id: user.id } } },
      include: { Users: true },
    });
    revalidatePath('/', 'layout');
    return { board: updatedBoard };
  });
