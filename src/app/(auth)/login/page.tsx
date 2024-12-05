"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const session = useSession();

  if (session.status == "authenticated") {
    router.push("/boards");
  }

  return (
    <div className="grid h-screen place-content-center bg-[url(/login-bg.jpg)] bg-cover">
      <div className="flex h-[50vh] w-[400px] flex-col items-center justify-center gap-5 bg-yellow-400 shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" className="h-10 w-auto" width={100} height={100} alt="logo" />
          <span className="text-xl font-bold">JoyBoard</span>
        </div>
        <p className="text-md font-bold">Log in to continue</p>
        <div
          className="flex w-5/6 cursor-pointer items-center justify-center gap-2 rounded border-[1px] border-gray-200 bg-yellow-500 px-6 py-4 font-medium"
          onClick={() => signIn("google", { callbackUrl: "/boards" })}
        >
          <Image
            className="h-5 w-5"
            src="/google.png"
            alt=""
            width={5}
            height={5}
          />
          <span>Sign in with Google</span>
        </div>
        <Link
          href="/"
          className="cursor-pointer text-center text-xs text-blue-400 underline"
        >
          Go to home page
        </Link>
      </div>
      <Image
        src="/pikachu2.gif"
        className="absolute bottom-0 right-0 hidden w-[20%] lg:block"
        alt=""
        width={200}
        height={200}
      />
    </div>
  );
};

export default Login;
