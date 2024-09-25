import BoardList from "@/components/board/BoardList";

const Boards = async () => {
  return (
    <div className="min-h-[80vh] flex justify-start items-start flex-wrap p-4">
      <BoardList />
    </div>
  );
};

export default Boards;
