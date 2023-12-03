"use client";
import React, { FormEvent, useState } from "react";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AddClient } from "@/actions/register";

interface Props {
  params: {
    email: string;
  };
}

export default function Form({ params }: Props) {
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
      className="flex flex-col gap-2 mx-auto max-w-md mt-10"
    >
      <h1 className="align-middle">Register Account</h1>
      <input
        className="border border-black rounded-md"
        type="text"
        placeholder="Type your contact number"
        value={contactNumber}
        onChange={(e) => setNumber(e.target.value)}
      />

      <input
        className="border border-black rounded-md"
        type="text"
        placeholder="Type your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="border border-black rounded-md"
        type="text"
        placeholder="Type your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        className="border border-black rounded-md"
        type="text"
        placeholder="Type your middle name"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />

      <button className="border border-black rounded-md" type="submit">
        Update account information
      </button>
    </form>
  );
}
