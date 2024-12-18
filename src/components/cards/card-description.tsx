'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { useParams } from 'next/navigation';

import { toast } from 'sonner';

import { updateCard } from '@/app/actions/card';

import FormSubmit from '../atomic/form-submit';
import { Button } from '../ui/button';

import 'react-quill-new/dist/quill.snow.css';

interface CardDetails {
  cardData: any;
  setCardData: (cardData: any) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

const CardDescription = ({ cardData, setCardData }: CardDetails) => {
  const { boardId }: { boardId: string } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!cardData) return;
    setMounted(true);
    setEditorValue(cardData?.description || '');
  }, [cardData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cardData?.id) return;

      try {
        const res = await updateCard({
          description: editorValue,
          boardId,
          id: cardData.id,
        });
        if (res?.result) {
          setCardData(res.result);
          setIsEditable(false);
          toast.success('Card successfully updated');
        }
      } catch (error) {
        console.log(error);
        toast.error('Card not updated');
      }
    },
    [editorValue, cardData?.id, boardId],
  );

  if (!mounted) {
    return (
      <div className="mb-[1rem]">
        <div>
          <p className="font-bold text-slate-700">Description</p>
          <div className="mt-5 h-[200px] w-full animate-pulse rounded-md bg-slate-100" />
        </div>
      </div>
    );
  }

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
              className="max-h-70 rounded-ms min-h-20 overflow-auto bg-slate-100 p-3 text-sm"
              onClick={() => setIsEditable(true)}
              dangerouslySetInnerHTML={{
                __html: editorValue || 'Add More Details',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDescription;
