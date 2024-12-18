'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Header = () => {
  const session = useSession();
  return (
    <header className="bg-[url(/header-bg.jpg)] shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
          <Image
            src="/logo.jpg"
            className="h-10 w-auto"
            alt="joyboard logo"
            width={30}
            height={30}
          />
          <span className="text-xl font-bold">JoyBoard</span>
        </Link>

        {session.status !== 'authenticated' ? (
          <Link
            href="/login"
            className="text-md font-semibold leading-6 text-gray-900"
          >
            Log in
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/boards"
              className="text-md font-semibold leading-6 text-gray-900"
            >
              Boards
            </Link>
            <div
              onClick={event => {
                event.preventDefault();
                signOut();
              }}
              className="text-md cursor-pointer font-semibold"
            >
              Logout
            </div>
            <Image
              src={session.data.user?.image || '/logo.jpg'}
              className="h-8 w-8 cursor-pointer rounded-full"
              width={30}
              height={30}
              alt={session.data.user?.name || 'user'}
              title={session.data.user?.name || 'User'}
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
