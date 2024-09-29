import BoardList from "@/components/board/BoardList";

const Boards = async () => {
  return (
    <div className="min-h-[80vh] flex justify-start items-start flex-wrap p-4 bg-[url(/hellokitty.gif)] bg-repeat bg-[length:150px_100px]">
      <BoardList />
    </div>
  );
};

export default Boards;
