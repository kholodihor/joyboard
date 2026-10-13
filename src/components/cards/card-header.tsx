import { updateCard } from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';

import InputForm from '../atomic/input-form';

interface CardDetails {
  cardData: Card;
  setCardData: (cardData: Card) => void | Promise<void>;
}

const CardHeader = ({ cardData, setCardData }: CardDetails) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(e.target as HTMLFormElement);
    const title = String(formData.get('title') ?? '');

    await saveCard({
      previous: cardData,
      next: { ...cardData, title },
      onCardUpdate: setCardData,
      action: c => updateCard({ id: c.id, title: c.title }),
      successMessage: 'Card successfully updated',
    });
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
