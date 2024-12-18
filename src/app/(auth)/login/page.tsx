'use client';

import { Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const ClientLogin = () => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/boards';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="grid h-screen place-content-center bg-[url(/login-bg.jpg)] bg-cover">
      <div className="flex h-[50vh] w-[400px] flex-col items-center justify-center gap-5 bg-yellow-400 shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            className="h-10 w-auto"
            alt=""
            width={50}
            height={50}
          />
          <span className="text-xl font-bold">JoyBoard</span>
        </div>
        <p className="text-md font-bold">Log in to continue</p>
        <div
          className="flex w-5/6 cursor-pointer items-center justify-center gap-2 rounded border-[1px] border-gray-200 bg-yellow-500 px-6 py-4 font-medium"
          onClick={() => signIn('google', { callbackUrl })}
        >
          <Image
            width={100}
            height={100}
            className="h-5 w-5"
            src="/google.png"
            alt=""
          />
          <span>Sign in with Google</span>
        </div>
        <Link
          href="/"
          className="cursor-pointer text-center text-xs text-blue-400 underline"
        >
          Return to Home Page
        </Link>
      </div>
      <Image
        width={300}
        height={300}
        src="/pikachu2.gif"
        className="absolute bottom-0 right-0 hidden w-[20%] lg:block"
        alt=""
      />
    </div>
  );
};

const Login = () => {
  return (
    <Suspense>
      <ClientLogin />
    </Suspense>
  );
};

export default Login;
