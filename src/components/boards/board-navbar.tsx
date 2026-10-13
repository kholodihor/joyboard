import Image from 'next/image';

import type { Board, User } from '@prisma/client';

import { AVATAR_PLACEHOLDER } from '@/constants/images';

import AddBoardMembers from './add-board-members';
import DeleteBoard from './delete-board';

const BoardNavbar = ({
  board,
  isAdmin,
}: {
  board: Board & { Users: User[] };
  isAdmin: boolean;
}) => {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-black/50 px-5 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">{board?.title}</h2>
      <div className="flex items-center gap-2">
        {board?.Users?.map(user => (
          <Image
            src={user.image || AVATAR_PLACEHOLDER}
            className="h-8 w-8 cursor-pointer rounded-full"
            width={30}
            height={30}
            alt={user.name ?? ''}
            key={user?.id}
            title={user.name ?? undefined}
          />
        ))}
        <AddBoardMembers
          board={{ id: board.id, title: board.title }}
          canInvite={isAdmin}
        />
        {isAdmin && <DeleteBoard board={{ id: board.id }} />}
      </div>
    </div>
  );
};

export default BoardNavbar;
