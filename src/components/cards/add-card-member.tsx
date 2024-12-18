'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { toast } from 'sonner';

import { addCardMember, getNoCardMembers } from '@/app/actions/card';
import { Card, User } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  boardId: string;
  children?: React.ReactNode;
  onCardUpdate?: (card: Card) => Promise<void>;
}

const AddCardMember = ({
  card,
  boardId,
  children,
  onCardUpdate,
}: CardProps) => {
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await getNoCardMembers({
          boardId,
          cardId: card.id,
        });
        if (response?.success && response.result) {
          // Transform the response to match User type
          const transformedMembers: User[] = response.result.map(member => ({
            id: member.id,
            name: member.name || '',
            email: member.email || '',
            image: member.image || '',
            emailVerified: member.emailVerified?.toISOString(),
            boardIds: member.boardIds || [],
            cardIds: member.cardIds || [],
          }));
          setMembers(transformedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
        toast.error('Failed to load members');
      }
    };
    if (card) getMembers();
  }, [boardId, card]);

  const handleSubmit = useCallback(
    async (user: User) => {
      try {
        const updatedUser = {
          ...user,
          cardIds: [...(user.cardIds || []), card.id],
        };
        const updatedCard = {
          ...card,
          userIds: [...(card.userIds || []), user.id],
          users: [...(card.users || []), user],
        };

        // Optimistic UI update
        setMembers(prev => prev.filter(m => m.id !== user.id));

        // Update parent state
        if (onCardUpdate) {
          await onCardUpdate(updatedCard);
        }

        // API update
        const res = await addCardMember({
          user: updatedUser,
          card: updatedCard,
        });

        if (!res?.success) {
          // Revert optimistic updates
          setMembers(prev => [...prev, user]);
          if (onCardUpdate) {
            await onCardUpdate(card);
          }
          toast.error('Failed to add member');
        }
      } catch (error) {
        console.error(error);
        // Revert optimistic updates
        setMembers(prev => [...prev, user]);
        if (onCardUpdate) {
          await onCardUpdate(card);
        }
        toast.error('Failed to add member');
      }
    },
    [card, onCardUpdate],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 bg-white p-0" align="start">
        <div className="grid gap-1 p-2">
          {members.map(member => (
            <div
              key={member.id}
              role="button"
              onClick={() => handleSubmit(member)}
              className="flex items-center gap-2 rounded-sm p-2 hover:bg-slate-100"
            >
              <div className="relative h-6 w-6">
                <Image
                  src={member.image || ''}
                  alt={member.name}
                  className="rounded-full"
                  fill
                />
              </div>
              <p className="text-sm">{member.name}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardMember;
