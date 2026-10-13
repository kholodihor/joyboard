'use client';

import React, { useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';

import SubTitle from './sub-title';

interface CardSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  // Rendered under the item list, inside the collapsible area.
  footer?: React.ReactNode;
  // Optional controlled open state, for sections that unmount while editing.
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
}

// Collapsible card-modal section: a SubTitle header over a list of items.
const CardSection = ({
  title,
  count,
  children,
  footer,
  ...controlled
}: CardSectionProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlled.isOpen ?? localIsOpen;
  const setIsOpen = controlled.setIsOpen ?? setLocalIsOpen;

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle
          title={title}
          length={count}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div
          className={`no-scrollbar max-h-[40vh] overflow-auto ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="my-2">{children}</div>
          {footer}
        </div>
      </div>
    </div>
  );
};

export const RemoveItemButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-red-500">
    <FaRegTrashCan />
  </button>
);

export default CardSection;
