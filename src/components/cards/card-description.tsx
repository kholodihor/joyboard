'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { updateCard } from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card } from '@/types';

import FormSubmit from '../atomic/form-submit';
import { Button } from '../ui/button';

import 'react-quill-new/dist/quill.snow.css';

interface CardDetails {
  cardData: Card;
  setCardData: (cardData: Card) => void | Promise<void>;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full animate-pulse rounded-md bg-slate-100" />
  ),
});

// Descriptions are written by other board members, so never render them
// unsanitized. DOMPurify needs a DOM, so render nothing on the server.
const sanitize = (html: string) =>
  typeof window === 'undefined' ? '' : DOMPurify.sanitize(html);

const CardDescription = ({ cardData, setCardData }: CardDetails) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editorValue, setEditorValue] = useState('');

  const startEditing = () => {
    // Seed the editor only when editing starts, so background revalidation
    // of the card never wipes in-progress edits.
    setEditorValue(cardData.description || '');
    setIsEditable(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const saved = await saveCard({
        previous: cardData,
        next: { ...cardData, description: editorValue },
        onCardUpdate: setCardData,
        action: c => updateCard({ id: c.id, description: c.description ?? '' }),
        successMessage: 'Card successfully updated',
      });
      if (saved) setIsEditable(false);
    },
    [cardData, editorValue, setCardData],
  );

  return (
    <div className="mb-[1rem]">
      <div>
        <p className="flex cursor-pointer items-center gap-2 font-bold text-slate-700">
          Description
        </p>
        <div className={`mt-5`}>
          {isEditable ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="min-h-[200px]">
                <ReactQuill
                  value={editorValue}
                  onChange={setEditorValue}
                  placeholder="Add more details"
                  modules={modules}
                  theme="snow"
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <FormSubmit>Save</FormSubmit>
                <Button
                  type="button"
                  onClick={() => setIsEditable(false)}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              role="button"
              className="max-h-70 rounded-ms min-h-20 overflow-auto bg-slate-100 p-3 px-8 text-sm"
              onClick={startEditing}
            >
              {cardData.description
                ? parse(sanitize(cardData.description))
                : 'Add More Details'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDescription;
