"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getClientAccountByEmail } from "@/actions/clients";
import Link from "next/link";

export default function ClientAccount() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  
  const router = useRouter();

  async function getUserData(email: string) {
    
    const userdata = await getClientAccountByEmail(email);
    return userdata;
  }

  function editClientAccount() {
    router.push("/editaccountinfo");
  }

  const [userdata, setUserData] = useState<any>(null);

  useEffect(() => {
    if (session.data?.user?.email) {
      getUserData(session.data.user.email).then((data: any) => {
        if (data) setUserData(data);
        else router.push("/editaccountinfo");
      });
    }
  }, [session.data?.user?.email]);

  const { FirstName, MiddleName, LastName, ContactNumber } = userdata || {};

  return (
    <div className="container flex flex-col gap-4 mx-auto max-w-md mt-10">
      <h1 className="text-3xl font-bold mb-4">Client Account</h1>
      <Link href="/dashboard">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4">
          Back
        </button>
      </Link>
      <div>
        <h2 className="text-xl font-semibold">First Name:</h2>
        <p>{FirstName}</p>
      </div>
      {MiddleName && (
        <div>
          <h2 className="text-xl font-semibold">Middle Name:</h2>
          <p>{MiddleName}</p>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold">Last Name:</h2>
        <p>{LastName}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Contact Number:</h2>
        <p>{ContactNumber}</p>
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
        onClick={() => editClientAccount()}
      >
        Edit Account Information
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
