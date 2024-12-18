import { getAllBoards } from '@/app/actions/boards';
import BoardList from '@/components/boards/board-list';

const Boards = async () => {
  const boards = await getAllBoards();

  return (
    <div className="flex min-h-[80vh] flex-wrap items-start justify-start bg-gradient-to-b from-purple-700 to-pink-500 p-4">
      <BoardList boards={boards} />
    </div>
  );
};

export default Boards;
