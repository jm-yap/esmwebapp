"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AddClient } from "@/actions/register";
import styles from "./styles.module.css";
import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { set } from "firebase/database";

export default function Form() {
  try {
    const isMasterKeyPresent = sessionStorage.getItem("masterKey");
    if (isMasterKeyPresent !== "true") {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  const { data: session } = useSession();


  const router = useRouter();


  const [email, setEmail] = useState<string>(""); 
  const [contactNumber, setNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    const isValid = sessionStorage.getItem("validInfo");

    if (email) {
      setEmail(email);
      if (isValid === "true") {
        setFirstName(sessionStorage.getItem("firstName"));
        setLastName(sessionStorage.getItem("lastName"));
        setMiddleName(sessionStorage.getItem("middleName"));
        setNumber(sessionStorage.getItem("contactNumber"));
      } 
    } else {
      signOut();
    }
    
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !contactNumber || !firstName || !lastName ) {
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
        contactNumber
      );
      if (response) {
        sessionStorage.setItem("firstName", firstName);
        sessionStorage.setItem("lastName", lastName);
        sessionStorage.setItem("middleName", middleName);
        sessionStorage.setItem("contactNumber", contactNumber);
        router.push("/builderprofile");
      } else {
        console.log("error updating account info");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.navbar}>
        <Link href="/surveymodule" className={styles.navtext}>
          <h1 className={styles.navblack}>Sagot</h1>
          <h1 className={styles.navwhite}>Kita</h1>
          <h1 className={styles.navblack}>.</h1>
        </Link>
        <div className={styles.navprofilecontainer}>
          <h1 className={styles.navinfotext}>Currently editing profile for {firstName} {lastName}</h1>
          <AccountCircleIcon fontSize="large" />
        </div>
      </div>

      <div className={styles.contentContainer}>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Email</label>
          <p className={styles.info}>{email}</p>
        </div>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>First Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Middle Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Middle Name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Last Name</label>
          <input 
            className={styles.input}
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Contact Number</label>
          <input
            className={styles.input}
            type="text"
            placeholder="09XXXXXXXXX"
            value={contactNumber}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div className={styles.errorContainer}>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => {router.push("/builderprofile")}}>C A N C E L</button>
          <button className={styles.button} type="submit">U P D A T E</button>
        </div>
      </div>
    </form>

    // <form 
    //   onSubmit={handleSubmit}
    // >
    //   <div className={styles.rowInputContainer}>
    //     <div className={styles.inputContainer}>
    //       <p className={styles.inputLabel}>First Name</p>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="First Name"
    //         value={firstName}
    //         onChange={(e) => setFirstName(e.target.value)}
    //       />
    //     </div>
    //     <div className={styles.inputContainer}>
    //       <p className={styles.inputLabel}>Middle Name</p>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="Middle Name"
    //         value={middleName}
    //         onChange={(e) => setMiddleName(e.target.value)}
    //       />
    //     </div>
    //   </div>

    //   <div className={styles.rowInputContainer}>
    //     <div className={styles.inputContainer}>
    //       <p className={styles.inputLabel}>Last Name</p>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="Last Name"
    //         value={lastName}
    //         onChange={(e) => setLastName(e.target.value)}
    //       />
    //     </div>
    //     <div className={styles.inputContainer}>
    //       <p className={styles.inputLabel}>Contact Number</p>
    //       <input
    //         className={styles.input}
    //         type="text"
    //         placeholder="+63 9XX XXX XXXX"
    //         value={contactNumber}
    //         onChange={(e) => setNumber(e.target.value)}
    //       />
    //     </div>
    //   </div>
    //   <div className={styles.errorContainer}>
    //     {error && <p className={styles.errorText}>{error}</p>}
    //   </div>
    //   <div className={styles.buttonContainer}>
    //     <button className={styles.button} type="submit">
    //       R E G I S T E R
    //     </button>
    //   </div>
    // </form>


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
