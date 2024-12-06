"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const { status } = useSession();

  if (status == "authenticated") {
    router.push("/");
  }
  return (
    <div className="grid place-content-center h-screen bg-[url(/login-bg.jpg)] bg-cover">
      <div className="flex flex-col justify-center gap-5 items-center h-[50vh] w-[400px] bg-yellow-400 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-10 w-auto" alt="" />
          <span className="text-xl font-bold">JoyBoard</span>
        </div>
        <p className="text-md font-bold">Log in to continue</p>
        <div
          className="py-4 px-6 rounded cursor-pointer flex justify-center items-center gap-2 bg-yellow-500 border-[1px] border-gray-200 font-medium w-5/6"
          onClick={() => signIn("google", { callbackUrl: "/boards" })}
        >
          <img
            className="w-5 h-5"
            src="https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo-thumbnail.png"
            alt=""
          />
          <span>Sign in with Google</span>
        </div>
        <Link
          href="/"
          className="text-center text-xs text-blue-400 cursor-pointer underline"
        >
          Go to home page
        </Link>
      </div>
      <img
        src="/pikachu2.gif"
        className="hidden lg:block absolute bottom-0 right-0 w-[20%]"
        alt=""
      />
    </div>
  );
};

export default Login;
