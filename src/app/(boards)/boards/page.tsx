import BoardList from "@/components/board/BoardList";

const Boards = async () => {
  return (
    <div className="min-h-[80vh] flex justify-start items-start flex-wrap p-4 bg-gradient-to-r from-[#e1eec3] to-[#f05053]">
      <BoardList />
    </div>
  );
};

export default Boards;
