'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { toast } from 'sonner';

import { addCardMember, getNoCardMembers } from '@/app/actions/card';
import { AVATAR_PLACEHOLDER } from '@/constants/images';
import { saveCard } from '@/lib/save-card';
import { Card, User } from '@/types';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface CardProps {
  card: Card;
  children?: React.ReactNode;
  onCardUpdate: (card: Card) => void | Promise<void>;
}

const AddCardMember = ({ card, children, onCardUpdate }: CardProps) => {
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await getNoCardMembers({ cardId: card.id });
        if (response.success) setMembers(response.result);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        toast.error('Failed to load members');
      }
    };
    getMembers();
  }, [card.id]);

  const handleSubmit = useCallback(
    async (user: User) => {
      // Hide the member right away; put them back if the save fails.
      setMembers(prev => prev.filter(m => m.id !== user.id));
      const saved = await saveCard({
        previous: card,
        next: {
          ...card,
          userIds: [...card.userIds, user.id],
          users: [...card.users, user],
        },
        onCardUpdate,
        action: c => addCardMember({ user, card: c }),
        errorMessage: 'Failed to add member',
      });
      if (!saved) setMembers(prev => [...prev, user]);
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
                  src={member.image || AVATAR_PLACEHOLDER}
                  alt={member.name ?? ''}
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
