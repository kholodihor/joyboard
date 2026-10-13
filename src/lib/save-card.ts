import { toast } from 'sonner';

import type { CardResponse } from '@/app/actions/card';
import type { Card } from '@/types';

type SaveCardOptions = {
  previous: Card;
  next: Card;
  // Writes a card into the UI (the modal's SWR cache, or local state).
  onCardUpdate: (card: Card) => void | Promise<void>;
  action: (card: Card) => Promise<CardResponse<Card>>;
  successMessage?: string;
  errorMessage?: string;
};

// Optimistically shows `next`, persists it, then adopts the server's card or
// rolls back to `previous`. Resolves to whether the save succeeded.
export const saveCard = async ({
  previous,
  next,
  onCardUpdate,
  action,
  successMessage,
  errorMessage = 'Something went wrong',
}: SaveCardOptions) => {
  await onCardUpdate(next);
  try {
    const res = await action(next);
    if (!res.success) throw new Error(res.error);
    await onCardUpdate(res.result);
    if (successMessage) toast.success(successMessage);
    return true;
  } catch (error) {
    await onCardUpdate(previous);
    toast.error(error instanceof Error ? error.message : errorMessage);
    return false;
  }
};
