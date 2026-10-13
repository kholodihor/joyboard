import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export type { Board, Comment, List, Todo, User } from '@prisma/client';

// A card as the app passes it around: board lists and the card modal both
// load its members. The modal's card also carries `list`, which is a superset.
export type Card = Prisma.CardGetPayload<{ include: { users: true } }>;

export type ListWithCards = Prisma.ListGetPayload<{
  include: { cards: { include: { users: true } } };
}>;

export type TImage = {
  id: string;
  image: string;
  name: string;
};

export const UpdateCard = z.object({
  id: z.string(),
  title: z.optional(z.string().trim().min(1)),
  description: z.optional(z.string()),
});
