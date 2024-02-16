"use client";
import React, { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AddClient } from "@/actions/register";

interface Props {
  params: {
    email: string;
  };
}

export default function Form({ params }: Props) {
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

  const { data: session } = useSession();

  const router = useRouter();
  const email = auth.currentUser?.email;
  const [contactNumber, setNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await AddClient(
      email,
      firstName,
      lastName,
      middleName,
      contactNumber
    );
    if (response) {
      router.push("/dashboard");
    } else {
      console.log("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mx-auto max-w-md mt-10"
    >
      <h1 className="text-3xl font-bold mb-4 text-center">Update Account Credentials</h1>
      <input
        className="border border-gray-300 rounded-md py-2 px-4"
        type="text"
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setNumber(e.target.value)}
      />

      <input
        className="border border-gray-300 rounded-md py-2 px-4"
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="border border-gray-300 rounded-md py-2 px-4"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        className="border border-gray-300 rounded-md py-2 px-4"
        type="text"
        placeholder="Middle Name"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />

      <button className="bg-blue-500 text-white rounded-md py-2 px-4" type="submit">
        Update Account Information
      </button>
    </form>
  );
}
