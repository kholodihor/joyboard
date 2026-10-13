'use client';

import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { addCardComment, removeCardComment } from '@/app/actions/card';
import { AVATAR_PLACEHOLDER } from '@/constants/images';
import { saveCard } from '@/lib/save-card';
import { Card, Comment } from '@/types';

import CardSection, { RemoveItemButton } from './card-section';
import { ExpandableTextForm } from './inline-text-form';

interface CardDetails {
  card: Card;
  setCardData: (cardData: Card) => Promise<void>;
}

const CardCommentsInput = ({ card, setCardData }: CardDetails) => {
  const { data: session } = useSession();
  const comments = card.comments ?? [];

  const handleSubmit = (text: string) =>
    saveCard({
      previous: card,
      next: {
        ...card,
        comments: [
          ...comments,
          {
            id: crypto.randomUUID(),
            text,
            image: session?.user?.image ?? '',
            user: session?.user?.name ?? '',
          },
        ],
      },
      onCardUpdate: setCardData,
      action: card => addCardComment({ card }),
      successMessage: 'Your comment added to card',
      errorMessage: 'Failed to add comment',
    });

  const handleRemove = async (id: string | null) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    await saveCard({
      previous: card,
      next: {
        ...card,
        comments: comments.filter(comment => comment.id !== id),
      },
      onCardUpdate: setCardData,
      action: card => removeCardComment({ card }),
      successMessage: 'Comment deleted',
      errorMessage: 'Failed to delete comment',
    });
  };

  return (
    <CardSection
      title="Comments"
      count={comments.length}
      footer={
        <ExpandableTextForm
          name="comment"
          placeholder="Write a comment to card"
          submitLabel="Save"
          emptyMessage="Comment cannot be empty"
          onSubmit={handleSubmit}
        />
      }
    >
      {comments.map((comment: Comment) => (
        <div
          key={comment.id}
          className="mb-2 flex flex-col items-start gap-2 rounded-md bg-input p-2"
        >
          <div className="flex w-full items-center gap-2">
            <Image
              src={comment.image || AVATAR_PLACEHOLDER}
              className="h-7 w-7 rounded-full object-cover"
              alt={`${comment.user ?? ''}'s avatar`}
              width={30}
              height={30}
            />
            <span className="text-xs">{comment.user}</span>
          </div>
          <div className="flex w-full flex-col">
            <p className="bg-input p-2 text-xs">{comment.text}</p>
            <div className="flex w-full justify-end">
              <RemoveItemButton onClick={() => handleRemove(comment.id)} />
            </div>
          </div>
        </div>
      ))}
    </CardSection>
  );
};

export default CardCommentsInput;
