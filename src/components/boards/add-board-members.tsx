'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import type { User } from '@prisma/client';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { toast } from 'sonner';

import {
  addEmailToBoard,
  addMemberInBoard,
  getNoBoardMembers,
} from '@/app/actions/boards';
import { AVATAR_PLACEHOLDER } from '@/constants/images';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent } from '../ui/popover';

const AddBoardMembers = ({
  board,
  canInvite,
}: {
  board: { id: string; title: string };
  canInvite: boolean;
}) => {
  const router = useRouter();
  const [members, setMembers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getMembers = async () => {
      const response = await getNoBoardMembers({ boardId: board.id });
      if ('error' in response) {
        toast.error(response.error);
        return;
      }
      setMembers(response.users);
    };

    getMembers();
  }, [board.id]);

  const addMembers = async (user: User) => {
    const res = await addMemberInBoard({ userId: user.id, boardId: board.id });
    if ('error' in res) {
      toast.error(res.error);
      return;
    }
    setMembers(prev => prev.filter(u => u.id !== user.id));
    toast.success('Member added');
    router.refresh();
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/board/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          boardId: board.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      const res = await addEmailToBoard({ email, boardId: board.id });
      if ('error' in res) {
        toast.error(res.error);
        return;
      }

      toast.success('Invitation sent');
      setEmail('');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="h-auto w-auto p-2 text-white">
        Add Members
      </PopoverTrigger>
      <PopoverContent
        className="bg-white px-0 py-3"
        side="bottom"
        align="start"
      >
        {canInvite && (
          <div className="px-4 pb-4">
            <h3 className="mb-2 text-sm font-medium">Invite via Email</h3>
            <form onSubmit={sendInvitation} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-8"
              />
              <Button type="submit" disabled={isLoading} className="h-8">
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>
        )}

        <div className="border-t">
          <div className="p-2 text-sm font-medium text-neutral-600">
            Add Existing Members
          </div>
          {members.map(user => (
            <div
              key={user.id}
              className="flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-100"
              onClick={() => addMembers(user)}
            >
              <Image
                src={user.image || AVATAR_PLACEHOLDER}
                className="h-12 w-12 rounded-full object-cover"
                alt={user.name ?? ''}
                width={30}
                height={30}
              />
              <div>
                <h1 className="font-semibold">{user.name}</h1>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddBoardMembers;
