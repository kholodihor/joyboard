import { z } from "zod";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified?: string;
  image?: string;
  boardIds?: string[];
  cardIds?: string[];
};

export type Board = {
  id: string;
  title: string;
  image: string;
  userIds?: string[];
  Users?: User[];
  lists?: List[];
};

export type List = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  board: Board;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
};

export type Card = {
  id: string;
  title: string;
  order: number;
  description: string;
  listId?: string;
  list?: List;
  userIds?: string[];
  users?: User[];
  label: string[];
  dateTo: string | Date;
  isCompleted: boolean;
  comments: Comment[];
  trackedTimes: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  text: string;
  image: string;
  user: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
  cardId?: string;
  card: Card;
};

export type LabelData = {
  id: string;
  title: string;
  color: string;
};

export type TImage = {
  id: string;
  image: string;
  name: string;
};

export const UpdateCard = z.object({
  description: z.optional(z.string()),
  title: z.optional(z.string()),
  comments: z.optional(z.any()),
  boardId: z.string(),
  id: z.string(),
});
