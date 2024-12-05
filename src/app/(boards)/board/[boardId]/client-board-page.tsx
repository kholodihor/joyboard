'use client'

import LargeLoader from "@/components/common/LargeLoader";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicListContainer = dynamic(
  () => import("@/components/list/ListContainer"),
  { loading: () => <LargeLoader /> }
);

const ClientBoardPage = ({ boardId, list }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LargeLoader />;
  }

  return (
    <div className="no-scrollbar w-full overflow-x-auto p-4">
      <DynamicListContainer boardId={boardId} list={list} />
    </div>
  );
};

export default ClientBoardPage;