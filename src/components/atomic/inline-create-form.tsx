'use client';

import React, { useRef, useState } from 'react';

import { Plus, X } from 'lucide-react';

import { Button } from '../ui/button';

import FormSubmit from './form-submit';
import InputForm from './input-form';
import TextAreaForm from './textarea-form';

interface InlineCreateFormProps {
  triggerLabel: string;
  placeholder: string;
  submitLabel: string;
  /** Resolves to true when the item was created; the form then resets and closes. */
  onCreate: (title: string) => Promise<boolean>;
  /** Root element. Cards render inside a div, lists are direct children of an ol. */
  as?: 'div' | 'li';
  /** Root classes while closed (trigger shown). */
  className?: string;
  /** Root classes while open (form shown). */
  openClassName?: string;
  triggerClassName?: string;
  formClassName?: string;
  closeClassName?: string;
  /** Use a textarea instead of a single-line input. */
  multiline?: boolean;
  label?: string;
}

const InlineCreateForm = ({
  triggerLabel,
  placeholder,
  submitLabel,
  onCreate,
  as: Root = 'div',
  className,
  openClassName,
  triggerClassName,
  formClassName,
  closeClassName,
  multiline = false,
  label,
}: InlineCreateFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const title = formData.get('title') as string;

    const created = await onCreate(title);
    if (created) {
      formRef.current?.reset();
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Root className={className}>
        <Button className={triggerClassName} onClick={() => setIsOpen(true)}>
          {triggerLabel}
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </Root>
    );
  }

  return (
    <Root className={openClassName}>
      <form onSubmit={handleSubmit} ref={formRef} className={formClassName}>
        <div>
          {multiline ? (
            <TextAreaForm id="title" placeholder={placeholder} />
          ) : (
            <InputForm
              id="title"
              label={label}
              name="title"
              type="text"
              placeholder={placeholder}
            />
          )}
          <FormSubmit className="mt-2">{submitLabel}</FormSubmit>
        </div>
      </form>
      <Button className={closeClassName} onClick={() => setIsOpen(false)}>
        <X className="h-4 w-4" />
      </Button>
    </Root>
  );
};

export default InlineCreateForm;
