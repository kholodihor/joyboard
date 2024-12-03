import { useParams } from "next/navigation";
import { toast } from "sonner";
import { updateCard } from "@/app/actions/card";
import InputForm from "../atomic/InputForm";

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}
const CardHeader = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();
  const handleSubmit = async (data: FormData) => {
    const title = data.get("title") as string;

    const res = await updateCard({
      title,
      boardId,
      id: cardData.id,
    });
    if (res?.result) {
      setCardData(res.result);
      toast.success("Card successfully udpated");
    }
    try {
    } catch (error) {
      toast.error("Card not udpated");
    }
  };

  return (
    <div className="my-6 flex w-full items-start gap-x-3">
      <div className="w-full">
        <form action={handleSubmit}>
          <InputForm
            id="title"
            defaultValue={cardData?.title}
            className="relative mb-0.5 truncate border-transparent bg-transparent px-1 text-xl font-semibold text-gray-700 focus-visible:border-input"
          />
        </form>
      </div>
    </div>
  );
};

export default CardHeader;
