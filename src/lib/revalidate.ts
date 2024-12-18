import { revalidatePath } from 'next/cache';

export const revalidateCard = (boardId: string, cardId: string) => {
  revalidatePath(`/board/${boardId}`);
  revalidatePath(`/card/${cardId}`);
};

export const revalidateBoard = (boardId: string) => {
  revalidatePath(`/board/${boardId}`);
};
