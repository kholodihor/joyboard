/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createLists = async (data: { title: string; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { title, boardId } = data;
  let list;
  try {
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastList ? lastList?.order + 1 : 1;
    list = await prisma.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "failed to create",
    };
  }
  revalidatePath("/");
  return { result: list };
};

// update list

export const updateList = async (data: {
  title: string;
  boardId: string;
  id: string;
}) => {
  const { title, id, boardId } = data;
  let list;

  try {
    list = await prisma.list.update({
      where: {
        id,
        boardId,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Not updated",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { result: list };
};

// copy list

export const listCopy = async (data: { id: string; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { id, boardId } = data;
  let list;
  try {
    const listtoCopy = await prisma.list.findUnique({
      where: { id, boardId },
      include: {
        cards: true,
      },
    });

    if (!listtoCopy) {
      return {
        error: "list not found",
      };
    }
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const order = lastList ? lastList.order + 1 : 1;

    list = await prisma.list.create({
      data: {
        boardId: listtoCopy.boardId,
        title: `${listtoCopy?.title} - copy`,
        order,
        cards: listtoCopy?.cards?.length
          ? {
              createMany: {
                data: listtoCopy?.cards?.map((card: any) => ({
                  title: card?.title,
                  description: card.description,
                  order: card.order,
                  label: card.label,
                  comments: card.comments,
                  dateTo: card.dateTo,
                  boardId: card.boardId,
                })),
              },
            }
          : {},
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: "failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { result: list };
};

//  delete list
export const listDelete = async (data: { id: string; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { id, boardId } = data;
  let list;
  try {
    list = await prisma.list.delete({
      where: { id, boardId },
    });
  } catch (error) {
    return {
      error: "failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { result: list };
};

// re order list
export const reorderList = async (data: { items: any; boardId: string }) => {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: "user not found",
    };
  }
  const { items, boardId } = data;
  let lists;
  try {
    const transaction = items.map((list: any) =>
      prisma.list.update({
        where: { id: list.id },
        data: {
          order: list.order,
        },
      })
    );
    lists = await prisma.$transaction(transaction);
  } catch (error) {
    return { error: "list not reordered" };
  }

  revalidatePath(`/board/${boardId}`);
  return { result: lists };
};
