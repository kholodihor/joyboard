"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { status } = useSession();
  return (
    <header className="bg-[url(/header-bg.jpg)] shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
          <img src="/logo.jpg" className="h-10 w-auto" alt="" />
          <span className="font-bold text-xl">JoyBoard</span>
        </Link>

        {status !== "authenticated" ? (
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
              onClick={(event) => {
                event.preventDefault();
                signOut();
              }}
              className="font-semibold text-md cursor-pointer"
            >
              Logout
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
