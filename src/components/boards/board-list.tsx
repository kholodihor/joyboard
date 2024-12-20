import Link from 'next/link';

import { Users2 } from 'lucide-react';

import { Board } from '@/types';

import CreateBoardPopup from './create-board';

interface BoardListProps {
  boards: Board[] | { error: string };
}

const BoardList = ({ boards }: BoardListProps) => {
  return (
    <div>
      <div className="mb-2 flex w-60 items-center border-b-4 border-b-black bg-white/30 text-lg font-bold backdrop-blur-sm">
        <Users2 className="mr-2 h-6 w-6" />
        All Boards
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {boards && Array.isArray(boards) ? (
          boards.map((board: Board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative flex aspect-video w-60 items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat p-2"
              style={{ backgroundImage: `url(${board.image})` }}
            >
              <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
              <p className="relative text-center text-xl font-medium text-white">
                {board.title}
              </p>
            </Link>
          ))
        ) : (
          <p>{boards.error}</p>
        )}
        <CreateBoardPopup />
      </div>
    </div>
  );
};

export default BoardList;
