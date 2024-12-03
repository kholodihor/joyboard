"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Board, User } from "@/types";
import { authenticateUser } from "./helpers/authenticateUser";

export const getAllBoards = async () => {
  await authenticateUser();
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
  await authenticateUser();

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

export const deleteBoard = async ({ id }: { id: string }) => {
  await authenticateUser();
  try {
    const board = await prisma.board.delete({ where: { id } });
    return { board };
  } catch (error) {
    return {
      error: "board not created",
    };
  }
};

export const getNoBoardMembers = async (data: { board: any }) => {
  const session = await getAuthSession();

  if (!session) {
    return {
      error: "user not found",
    };
  }

  const { board } = data;

  try {
    const users = await prisma.user.findMany({
      where: {
        boards: {
          none: { id: board.id },
        },
      },
    });

    revalidatePath(`/board/${board.id}`);

    return { result: users };
  } catch (error) {
    return {
      error: "board id not exist",
    };
  }
};

export const addMemberInBoard = async (data: { user: User; board: Board }) => {
  const session = getAuthSession();

  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  const { user, board } = data;

  let updateUser: any, updateBoard: any;

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
