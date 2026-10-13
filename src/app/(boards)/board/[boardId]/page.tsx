import { notFound } from 'next/navigation';

import { getLists } from '@/app/actions/list';
import ListContainer from '@/components/list/list-container';

type Params = Promise<{ boardId: string }>;

const BoardPage = async (props: { params: Params }) => {
  const { boardId } = await props.params;
  const lists = await getLists({ boardId });
  if ('error' in lists) notFound();

  return (
    <div className="no-scrollbar w-full overflow-x-auto p-4">
      <ListContainer boardId={boardId} list={lists.result} />
    </div>
  );
};

export default BoardPage;
