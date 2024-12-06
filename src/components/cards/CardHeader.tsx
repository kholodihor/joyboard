import { useParams } from "next/navigation";
import { updateCard } from "@/app/actions/card";
import { toast } from "sonner";
import InputForm from "../atomic/InputForm";

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}

const CardHeader = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;

    try {
      const res = await updateCard({
        title,
        boardId,
        id: cardData.id,
      });
      if (res?.result) {
        setCardData(res.result);
        toast.success("Card successfully updated");
      }
    } catch (error) {
      toast.error("Card not updated");
    }
  };

  return (
    <div className="flex items-start gap-x-3 my-6 w-full">
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <InputForm
            id="title"
            name="title" // Make sure the input field has a name attribute
            defaultValue={cardData?.title}
            className="font-semibold text-xl px-1 text-gray-700 bg-transparent border-transparent focus-visible:border-input mb-0.5 truncate relative"
          />
        </form>
      </div>
    </div>
  );
};

export default CardHeader;
