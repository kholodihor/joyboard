'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';

import { toast } from 'sonner';

import { addCardLink, removeCardLink } from '@/app/actions/card';
import { Card } from '@/types';

import FormSubmit from '../atomic/form-submit';
import TextAreaForm from '../atomic/textarea-form';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

import SubTitle from './sub-title';

interface CardProps {
  cardData: Card;
  onCardUpdate?: (card: Card) => Promise<void>;
}

const CardLinks = ({ cardData, onCardUpdate }: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!cardData) return;
    setLinks(cardData?.links || []);
  }, [cardData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cardData?.id) return;

      const formData = new FormData(formRef.current!);
      const newLink = formData.get('link') as string;

      if (!newLink.trim()) {
        toast.error('Link cannot be empty');
        return;
      }

      try {
        const updatedLinks = [...links, newLink];
        const updatedCard = {
          ...cardData,
          links: updatedLinks,
        };

        // Update UI optimistically
        setLinks(updatedLinks);

        // Update parent state
        if (onCardUpdate) {
          await onCardUpdate(updatedCard);
        }

        // Make API call
        const res = await addCardLink({
          card: updatedCard,
        });

        if (res?.success) {
          toast.success('Your link added to card');
          formRef.current?.reset();
          setIsEditable(false);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to add link');
      }
    },
    [cardData?.id, links, onCardUpdate],
  );

  const handleRemove = useCallback(
    async (index: number) => {
      if (!cardData?.id) return;

      try {
        const updatedLinks = links.filter((_, i) => i !== index);
        const updatedCard = {
          ...cardData,
          links: updatedLinks,
        };

        // Update UI optimistically
        setLinks(updatedLinks);

        // Update parent state
        if (onCardUpdate) {
          await onCardUpdate(updatedCard);
        }

        // Make API call
        const res = await removeCardLink({
          card: updatedCard,
        });

        if (res?.success) {
          toast.success('Link removed from card');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to remove link');
      }
    },
    [cardData?.id, links, onCardUpdate],
  );

  const editEnable = () => setIsEditable(true);
  const editDisable = () => setIsEditable(false);

  if (isEditable) {
    return (
      <div>
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
          <TextAreaForm id="link" placeholder="Add Link" />
          <div className="flex items-center gap-x-2">
            <FormSubmit>Add Link</FormSubmit>
            <Button
              type="button"
              onClick={editDisable}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle
          title="Links"
          length={links.length}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div
          className={`no-scrollbar max-h-[40vh] overflow-auto ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="my-2">
            {links ? (
              links?.map((link: string, index: number) => (
                <div
                  key={index}
                  className="mb-2 flex items-start gap-2 rounded-md bg-input p-2"
                >
                  <a
                    href={link}
                    target="_blank"
                    className="flex-1 truncate whitespace-nowrap text-xs hover:text-blue-700"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500"
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
              </div>
            )}
          </div>
          <Button
            onClick={editEnable}
            variant="ghost"
            className="h-auto w-full justify-start p-2 text-sm font-normal text-muted-foreground hover:bg-gray-50"
          >
            Add Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardLinks;
