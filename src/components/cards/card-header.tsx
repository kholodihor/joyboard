import { useParams } from 'next/navigation';

import { toast } from 'sonner';

import { updateCard } from '@/app/actions/card';

import InputForm from '../atomic/input-form';

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}

const CardHeader = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;

    try {
      const res = await updateCard({
        title,
        boardId,
        id: cardData.id,
      });
      if (res?.result) {
        setCardData(res.result);
        toast.success('Card successfully updated');
      }
    } catch (error) {
      console.log(error);
      toast.error('Card not updated');
    }
  };

  return (
    <div className="my-6 flex w-full items-start gap-x-3">
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <InputForm
            id="title"
            name="title" // Make sure the input field has a name attribute
            defaultValue={cardData?.title}
            className="relative mb-0.5 truncate border-transparent bg-transparent px-1 text-xl font-semibold text-gray-700 focus-visible:border-input"
          />
        </form>
      </div>
    </div>
  );
};

export default CardHeader;
