'use server';

import { revalidatePath } from 'next/cache';

import type { User as PrismaUser } from '@prisma/client';

import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Board, User } from '@/types';

const getSession = async () => {
  const session = await getAuthSession();
  if (!session) {
    return { error: 'User not found. Please log in.' };
  }
  return session;
};

export const getAllBoards = async () => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  try {
    // Admin can see all boards
    if (session.user.email === 'kholodihor@gmail.com') {
      const boards = await prisma.board.findMany();
      return boards;
    }

    // Regular users can only see their boards and the Guest Board
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          {
            Users: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            title: 'Guest Board',
          },
        ],
      },
    });
    return boards;
  } catch (error) {
    console.error('Error fetching boards:', error);
    return { error: 'Failed to retrieve boards. Please try again later.' };
  }
};

export const createBoard = async (data: { title: string; image: string }) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  // Only admin can create boards
  if (session.user.email !== 'kholodihor@gmail.com') {
    return { error: 'Only admin can create new boards.' };
  }

  const { title, image } = data;

  if (!title?.trim() || !image?.trim()) {
    return { error: 'Title and image are required.' };
  }

  try {
    const board = await prisma.board.create({
      data: {
        title,
        image,
        Users: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    revalidatePath('/', 'layout');
    return { board };
  } catch (error) {
    console.error('Error creating board:', error);
    return { error: 'Failed to create board. Please try again later.' };
  }
};

export const deleteBoard = async ({ id }: { id: string }) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  // Only admin can delete boards
  if (session.user.email !== 'kholodihor@gmail.com') {
    return { error: 'Only admin can delete boards.' };
  }

  if (!id?.trim()) {
    return { error: 'Board ID is required.' };
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: { Users: true },
    });

    if (!board) {
      return { error: 'Board not found.' };
    }

    const deletedBoard = await prisma.board.delete({ where: { id } });
    revalidatePath('/', 'layout');
    return { board: deletedBoard };
  } catch (error) {
    console.error('Error deleting board:', error);
    return { error: 'Failed to delete board. Please try again later.' };
  }
};

export const getNoBoardMembers = async ({ board }: { board: Board }) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  if (!board?.id) {
    return { error: 'Board ID is required.' };
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              boards: {
                some: {
                  id: board.id,
                },
              },
            },
          },
          {
            email: {
              in: board.userEmails || [],
            },
          },
        ],
      },
    });
    return { users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: 'Failed to fetch users. Please try again later.' };
  }
};

export const addEmailToBoard = async (data: {
  email: string;
  boardId: string;
}) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  const { email, boardId } = data;
  if (!email?.trim() || !boardId?.trim()) {
    return { error: 'Email and board ID are required.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: 'User not found with the provided email.' };
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { Users: true },
    });

    if (!board) {
      return { error: 'Board not found.' };
    }

    // Check if user is already a member
    if (board.Users.some((u: PrismaUser) => u.id === user.id)) {
      return { error: 'User is already a member of this board.' };
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        Users: {
          connect: { id: user.id },
        },
      },
      include: { Users: true },
    });

    revalidatePath('/', 'layout');
    return { board: updatedBoard };
  } catch (error) {
    console.error('Error adding user to board:', error);
    return { error: 'Failed to add user to board. Please try again later.' };
  }
};

export const addMemberInBoard = async (data: { user: User; board: Board }) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  const { user, board } = data;
  if (!user?.id || !board?.id) {
    return { error: 'User and board information are required.' };
  }

  try {
    const existingBoard = await prisma.board.findUnique({
      where: { id: board.id },
      include: { Users: true },
    });

    if (!existingBoard) {
      return { error: 'Board not found.' };
    }

    // Check if user is already a member
    if (existingBoard.Users.some((u: PrismaUser) => u.id === user.id)) {
      return { error: 'User is already a member of this board.' };
    }

    const updatedBoard = await prisma.board.update({
      where: { id: board.id },
      data: {
        Users: {
          connect: { id: user.id },
        },
      },
      include: { Users: true },
    });

    revalidatePath('/', 'layout');
    return { board: updatedBoard };
  } catch (error) {
    console.error('Error adding member to board:', error);
    return { error: 'Failed to add member to board. Please try again later.' };
  }
};

export const getMembersOfBoard = async ({ boardId }: { boardId: string }) => {
  const session = await getSession();
  if ('error' in session) {
    return { error: session.error };
  }

  if (!boardId?.trim()) {
    return { error: 'Board ID is required.' };
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { Users: true },
    });

    if (!board) {
      return { error: 'Board not found.' };
    }

    return { members: board.Users };
  } catch (error) {
    console.error('Error fetching board members:', error);
    return { error: 'Failed to fetch board members. Please try again later.' };
  }
};
