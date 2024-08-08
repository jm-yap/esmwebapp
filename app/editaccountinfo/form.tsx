"use client";
import { redirect, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import { AddClient } from "@/actions/register";
import styles from "./styles.module.css";

export default function Form() {
  try {
    const isMasterKeyPresent = sessionStorage.getItem("masterKey");
    if (isMasterKeyPresent !== "true") {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [contactNumber, setNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      setEmail(email);
    } else {
      signOut();
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !contactNumber || !firstName || !lastName) {
      setError("Please fill out all required fields");
    } else if (isNaN(Number(contactNumber))) {
      setError("Contact number can only contain numbers");
    } else if (contactNumber.slice(0, 2) !== "09") {
      setError("Invalid contact number format");
    } else if (contactNumber.length !== 11) {
      setError("Invalid contact number length");
    } else {
      const response = await AddClient(
        email,
        firstName,
        lastName,
        middleName,
        contactNumber,
      );
      if (response) {
        if (sessionStorage.getItem("validInfo") === "true") {
          router.push("/surveymodule");
        } else {
          router.push("/login");
        }
      } else {
        console.log("error updating account info");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.rowInputContainer}>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>First Name</p>
          <input
            className={styles.input}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Middle Name</p>
          <input
            className={styles.input}
            type="text"
            placeholder="Middle Name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.rowInputContainer}>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Last Name</p>
          <input
            className={styles.input}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Contact Number</p>
          <input
            className={styles.input}
            type="text"
            placeholder="09XXXXXXXXX"
            value={contactNumber}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.errorContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} type="submit">
          R E G I S T E R
        </button>
      </div>
    </form>

    //   <form
    //     onSubmit={handleSubmit}
    //     className="flex flex-col gap-4 mx-auto max-w-md mt-10"
    //   >
    //     <h1 className="text-3xl font-bold mb-4 text-center">Edit Account Profile</h1>
    //     <input
    //       className="border border-gray-300 rounded-md py-2 px-4"
    //       type="text"
    //       placeholder="Contact Number"
    //       value={contactNumber}
    //       onChange={(e) => setNumber(e.target.value)}
    //     />

    //     <input
    //       className="border border-gray-300 rounded-md py-2 px-4"
    //       type="text"
    //       placeholder="First Name"
    //       value={firstName}
    //       onChange={(e) => setFirstName(e.target.value)}
    //     />

    //     <input
    //       className="border border-gray-300 rounded-md py-2 px-4"
    //       type="text"
    //       placeholder="Last Name"
    //       value={lastName}
    //       onChange={(e) => setLastName(e.target.value)}
    //     />

    //     <input
    //       className="border border-gray-300 rounded-md py-2 px-4"
    //       type="text"
    //       placeholder="Middle Name"
    //       value={middleName}
    //       onChange={(e) => setMiddleName(e.target.value)}
    //     />
    //     {error && <p className="text-red-500">{error}</p>}
    //     <button className="bg-blue-500 text-white rounded-md py-2 px-4" type="submit">
    //       Update Account Information
    //     </button>
    //   </form>
  );
}
