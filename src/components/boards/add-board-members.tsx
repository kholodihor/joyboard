'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { PopoverTrigger } from '@radix-ui/react-popover';
import { toast } from 'sonner';

import {
  addEmailToBoard,
  addMemberInBoard,
  getNoBoardMembers,
} from '@/app/actions/boards';
import { Board, User } from '@/types';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent } from '../ui/popover';

const AddBoardMembers = ({ board }: { board: Board }) => {
  const session = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getMembers = async () => {
    const response = await getNoBoardMembers({ board });
    if ('users' in response && Array.isArray(response.users)) {
      const mappedUsers = response.users
        .filter((user): user is NonNullable<typeof user> => user !== null)
        .map(user => ({
          id: user.id,
          name: user.name || 'Unnamed User',
          email: user.email || '',
          image: user.image || '',
          boardIds: user.boardIds || [],
          cardIds: user.cardIds || [],
        }));
      setMembers(mappedUsers);
    } else {
      toast.error(response.error || 'Failed to fetch members');
    }
  };

  useEffect(() => {
    if (!board) return;
    getMembers();
  }, []);

  console.log(session.data?.user.email);

  const addMembers = async (user: User) => {
    user?.boardIds?.push(board.id);
    board?.userIds?.push(user.id);
    await addMemberInBoard({
      user,
      board,
    });
    setMembers(members?.filter((item: User) => item.id != user.id));
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
          boardName: board.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      toast.success('Invitation sent successfully!');
      setEmail('');

      await addEmailToBoard({
        email,
        boardId: board.id,
      });

      toast.success('User added to board successfully!');
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
        {session.data?.user.email === 'kholodihor@gmail.com' && (
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
          {members?.map((user: any) => (
            <div
              key={user?.id}
              className="flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-100"
              onClick={() => addMembers(user)}
            >
              <Image
                src={user?.image}
                className="h-12 w-12 rounded-full object-cover"
                alt={user?.name}
                width={30}
                height={30}
              />
              <div>
                <h1 className="font-semibold">{user?.name}</h1>
                <p className="text-xs text-gray-400">{user?.id}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddBoardMembers;
