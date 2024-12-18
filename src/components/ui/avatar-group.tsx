'use client';

import Image from 'next/image';

import { User } from '@/types';

import { Avatar, AvatarFallback } from './avatar';

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6 -ml-2 first:ml-0',
  md: 'h-8 w-8 -ml-3 first:ml-0',
  lg: 'h-10 w-10 -ml-4 first:ml-0',
};

const AvatarGroup = ({ users, max = 2, size = 'sm' }: AvatarGroupProps) => {
  const displayUsers = users?.slice(0, max);
  const remaining = users?.length > max ? users.length - max : 0;
  const sizeClass = sizeClasses[size];

  if (!users?.length) return null;

  return (
    <div className="flex">
      {displayUsers.map(user => (
        <Avatar
          key={user.id}
          className={`ring-2 ring-white transition-transform hover:z-10 hover:scale-110 ${sizeClass}`}
        >
          <div className="relative h-full w-full">
            <Image
              src={user.image || '/logo.jpg'}
              alt={user.name}
              className="rounded-full object-cover"
              fill
              unoptimized
              onError={e => {
                // If image fails to load, show fallback
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <AvatarFallback className="text-xs">
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-2 ring-white ${sizeClass}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
