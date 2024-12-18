'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function BoardAutoJoin({ boardId }: { boardId: string }) {
  const { data: session } = useSession();

  useEffect(() => {
    const joinBoard = async () => {
      if (session?.user) {
        try {
          await fetch('/api/board/join', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ boardId }),
          });
        } catch (error) {
          console.error('Error joining board:', error);
        }
      }
    };

    joinBoard();
  }, [session, boardId]);

  return null;
}
