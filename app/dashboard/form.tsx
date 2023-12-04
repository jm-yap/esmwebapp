"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { CheckProfile } from "@/actions/register";

export default function Form() {
  try {
    const isMasterKeyPresent = sessionStorage.getItem("masterKey");
    if (isMasterKeyPresent !== "true") {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      {session?.data?.user?.email && (
        <h2 className="text-xl mb-4">Welcome {session.data.user.email}</h2>
      )}
      {/* <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
        onClick={() => signOut()}
      >
        Sign out
      </button> */}
      <div className="flex gap-4">
        <Link href="/surveymodule">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
            Go to Survey Module
          </button>
        </Link>

        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          onClick={() => {
            router.push("/clients");
          }}
        >
          Go to Client Account
        </button>
      </div>
    </div>
  );
}
