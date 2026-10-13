'use client';

import React, { useState } from 'react';

import { toast } from 'sonner';

import FormSubmit from '../atomic/form-submit';
import TextAreaForm from '../atomic/textarea-form';
import { Button } from '../ui/button';

interface InlineTextFormProps {
  name: string;
  placeholder: string;
  submitLabel: string;
  // Toasted when the trimmed text is empty.
  emptyMessage: string;
  // Resolves to whether the save succeeded; the form is reset on success.
  onSubmit: (text: string) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  textareaClassName?: string;
  actionsClassName?: string;
}

export const InlineTextForm = ({
  name,
  placeholder,
  submitLabel,
  emptyMessage,
  onSubmit,
  onCancel,
  className = 'space-y-2',
  textareaClassName = 'mt-2 w-full',
  actionsClassName = 'flex items-center justify-between',
}: InlineTextFormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const text = (new FormData(form).get(name) as string) ?? '';
    if (!text.trim()) {
      toast.error(emptyMessage);
      return;
    }
    if (await onSubmit(text)) form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <TextAreaForm
        id={name}
        className={textareaClassName}
        placeholder={placeholder}
        defaultValue={''}
      />
      <div className={actionsClassName}>
        <FormSubmit>{submitLabel}</FormSubmit>
        <Button type="button" onClick={onCancel} size="sm" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
};

type ExpandableTextFormProps = Omit<InlineTextFormProps, 'onCancel'>;

// A placeholder box that turns into an InlineTextForm when clicked.
export const ExpandableTextForm = (props: ExpandableTextFormProps) => {
  const [isEditable, setIsEditable] = useState(false);

  if (isEditable) {
    return <InlineTextForm {...props} onCancel={() => setIsEditable(false)} />;
  }

  return (
    <div
      role="button"
      className="rounded-ms min-h-20 bg-slate-100 p-3 text-sm"
      onClick={() => setIsEditable(true)}
    >
      {props.placeholder}
    </div>
  );
};

export default InlineTextForm;
