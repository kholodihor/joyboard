/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Board, User } from "@/interfaces";

export const getAllBoards = async () => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  try {
    const boards = await prisma.board.findMany();
    return {
      boards,
    };
  } catch (error) {
    return {
      error: "failed to get board",
    };
  }
};

export const createBoard = async (data: { title: string; image: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { title, image } = data;

  let board;
  try {
    board = await prisma.board.create({
      data: {
        title,
        image,
      },
    });
  } catch (error) {
    return {
      error: "failed to create",
    };
  }
  revalidatePath("/");
  return { result: board };
};

// delete board
export const deleteBoard = async ({ id }: { id: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  let board;
  try {
    board = await prisma.board.delete({ where: { id } });
    return { board };
  } catch (error) {
    return {
      error: "board not created",
    };
  }
};

// get member without current board
export const getWithoutBoardMembers = async (data: { board: any }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { board } = data;
  let users;

  try {
    users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              boards: {
                some: { id: board.id },
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    return {
      error: "board id not exist",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { result: users };
};

// add memeber in board
export const addMemberInBoard = async (data: { user: User; board: Board }) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { user, board } = data;
  let updateUser, updateBoard;
  try {
    [updateUser, updateBoard] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          boardIds: user.boardIds,
        },
      }),
      prisma.board.update({
        where: { id: board.id },
        data: {
          userIds: board.userIds,
        },
      }),
    ]);
  } catch (error) {
    return {
      error: "user already exist",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { result: { updateUser, updateBoard } };
};

//get members
export const getMembersOfBoard = async ({ boardId }: { boardId: string }) => {
  console.log(boardId);
  try {
    const board: any = await prisma.board.findUnique({
      where: { id: boardId },
      include: { Users: true },
    });
    return board;
  } catch (error) {
    return {
      error: "cant get board",
    };
  }
};
