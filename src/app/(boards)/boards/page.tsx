import BoardList from "@/components/board/BoardList";

const Boards = async () => {
  return (
    <div className="flex min-h-[80vh] flex-wrap items-start justify-start bg-gradient-to-r from-[#e1eec3] to-[#f05053] p-4">
      <BoardList />
    </div>
  );
};

export default Boards;
