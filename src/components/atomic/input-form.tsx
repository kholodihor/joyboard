import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const InputForm = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, type, placeholder, name, className, defaultValue }, ref) => {
    return (
      <div>
        <div>
          <Label htmlFor={id} className="mb-2 font-medium text-gray-600">
            {label}
          </Label>
          <Input
            id={id}
            ref={ref}
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            type={type}
            autoFocus={false}
            className={cn('h-7 px-2 py-1 text-sm', className)}
          />
        </div>
      </div>
    );
  },
);

InputForm.displayName = 'InputForm';

export default InputForm;
