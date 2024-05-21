"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getClientAccountByEmail } from "@/actions/clients";
import Link from "next/link";
import styles from "./styles.module.css";
import { set } from "firebase/database";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ClientAccount() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");

  async function getUserData(email: string) {
    const isValid = sessionStorage.getItem("validInfo");

    if (isValid === "true") {
      const firstName = sessionStorage.getItem("firstName");
      const lastName = sessionStorage.getItem("lastName");
      const middleName = sessionStorage.getItem("middleName");
      const contactNumber = sessionStorage.getItem("contactNumber");
      
      setFirstName(firstName);
      setLastName(lastName);
      setMiddleName(middleName);
      setContactNumber(contactNumber);
      return {
        FirstName: firstName,
        LastName: lastName,
        MiddleName: middleName,
        ContactNumber: contactNumber,
      };
    } else {
      // console.log("fetching user data");
      const userdata = await getClientAccountByEmail(email);
      if (userdata) {
        sessionStorage.setItem("firstName", userdata.FirstName);
        sessionStorage.setItem("lastName", userdata.LastName);
        sessionStorage.setItem("middleName", userdata.MiddleName);
        sessionStorage.setItem("contactNumber", userdata.ContactNumber);
        return userdata;
      
      } else {
        return null;
      }
    }
  }

  function editClientAccount() {
    router.push("/editinfo");
  }

  const [userdata, setUserData] = useState<any>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");

    if (email) {
      setEmail(email);
      getUserData(email).then((data: any) => {
        if (data) setUserData(data);
        else router.push("/editaccountinfo");
      });
    } else {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { FirstName, MiddleName, LastName, ContactNumber } = userdata || {};

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href="/surveymodule" className={styles.navtext}>
          <h1 className={styles.navblack}>Sagot</h1>
          <h1 className={styles.navwhite}>Kita</h1>
          <h1 className={styles.navblack}>.</h1>
        </Link>
        <div className={styles.navprofilecontainer}>
          <h1 className={styles.navinfotext}>{firstName} {lastName}</h1>
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
          <p className={styles.info}>{firstName}</p>
        </div>

        {middleName && <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Middle Name</label>
          <p className={styles.info}>{middleName}</p>
        </div>} 

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Last Name</label>
          <p className={styles.info}>{lastName}</p>
        </div>

        <div className={styles.labelInfoContainer}>
          <label className={styles.label}>Contact Number</label>
          <p className={styles.info}>{contactNumber}</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => editClientAccount()}>E D I T</button>
          <button className={styles.button} onClick={() => {
            sessionStorage.setItem("validInfo", "false");
            sessionStorage.removeItem("masterKey");
            localStorage.removeItem("userEmail");
            signOut();
          }}>L O G O U T</button>
        </div>
      </div>
    </div>

    // <div className="container flex flex-col gap-4 mx-auto max-w-md mt-10">
    //   <h1 className="text-3xl font-bold mb-4">Client Account</h1>
    //   <Link href="/dashboard">
    //     <button className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4">
    //       Back
    //     </button>
    //   </Link>
    //   <div>
    //     <h2 className="text-xl font-semibold">First Name:</h2>
    //     <p>{FirstName}</p>
    //   </div>
    //   {MiddleName && (
    //     <div>
    //       <h2 className="text-xl font-semibold">Middle Name:</h2>
    //       <p>{MiddleName}</p>
    //     </div>
    //   )}
    //   <div>
    //     <h2 className="text-xl font-semibold">Last Name:</h2>
    //     <p>{LastName}</p>
    //   </div>
    //   <div>
    //     <h2 className="text-xl font-semibold">Contact Number:</h2>
    //     <p>{ContactNumber}</p>
    //   </div>
    //   <button
    //     className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
    //     onClick={() => editClientAccount()}
    //   >
    //     Edit Account Information
    //   </button>
    //   <button
    //     className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
    //     onClick={() => signOut()}
    //   >
    //     Sign out
    //   </button>
    // </div>
  );
}
