import { getLists } from '@/app/actions/list';
import { BoardWrapper } from '@/components/boards/board-wrapper';
import ListContainer from '@/components/list/list-container';

type Params = Promise<{ boardId: string }>;

const BoardPage = async (props: { params: Params }) => {
  const { boardId } = await props.params;
  const list = await getLists({ boardId });

  return (
    <BoardWrapper boardId={boardId}>
      <div className="no-scrollbar w-full overflow-x-auto p-4">
        <ListContainer boardId={boardId} list={list.result} />
      </div>
    </BoardWrapper>
  );
};

export default BoardPage;
