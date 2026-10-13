'use client';

import React, { FC, useState } from 'react';

import { addCardLink, removeCardLink } from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';

import { Button } from '../ui/button';

import CardSection, { RemoveItemButton } from './card-section';
import { InlineTextForm } from './inline-text-form';

interface CardLinksProps {
  cardData: Card;
  onCardUpdate: (card: Card) => Promise<void>;
}

const CardLinks: FC<CardLinksProps> = ({
  cardData,
  onCardUpdate,
}): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const links = cardData.links ?? [];

  const handleSubmit = async (newLink: string): Promise<boolean> => {
    const saved = await saveCard({
      previous: cardData,
      next: { ...cardData, links: [...links, newLink] },
      onCardUpdate,
      action: card => addCardLink({ card }),
      successMessage: 'Your link added to card',
      errorMessage: 'Failed to add link',
    });
    if (saved) setIsEditable(false);
    return saved;
  };

  const handleRemove = (index: number) =>
    saveCard({
      previous: cardData,
      next: { ...cardData, links: links.filter((_, i) => i !== index) },
      onCardUpdate,
      action: card => removeCardLink({ card }),
      successMessage: 'Link removed from card',
      errorMessage: 'Failed to remove link',
    });

  if (isEditable) {
    return (
      <div>
        <InlineTextForm
          name="link"
          placeholder="Add Link"
          submitLabel="Add Link"
          emptyMessage="Link cannot be empty"
          onSubmit={handleSubmit}
          onCancel={() => setIsEditable(false)}
          className="space-y-4"
          textareaClassName=""
          actionsClassName="flex items-center gap-x-2"
        />
      </div>
    );
  }

  return (
    <CardSection
      title="Links"
      count={links.length}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      footer={
        <Button
          onClick={() => setIsEditable(true)}
          variant="ghost"
          className="h-auto w-full justify-start p-2 text-sm font-normal text-muted-foreground hover:bg-gray-50"
        >
          Add Link
        </Button>
      }
    >
      {links.map((link: string, index: number) => (
        // Links are plain strings with no id; the index is their identity.
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
          <RemoveItemButton onClick={() => handleRemove(index)} />
        </div>
      ))}
    </CardSection>
  );
};

export default CardLinks;
