"use client";
import { FormEvent, useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from "@mui/material";

export default function Form() {
  const { data: session } = useSession();
  if (session) {
    redirect("/surveymodule");
  }

  // try {
  //   const isMasterKeyPresent = sessionStorage.getItem("masterKey");
  //   if (isMasterKeyPresent !== "true") {
  //     redirect("/");
  //   }
  // } catch (error) {
  //   redirect("/");
  // }

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== repassword) {
      setError("Passwords do not match");
    } else if (/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/.test(password) === false) { 
      setError("Password must be alphanumeric");
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await sendEmailVerification(user);
          sessionStorage.setItem("userEmail", email);
          router.push("/login");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setError("Email already in use");
          } else if (error.code === "auth/invalid-email") {
            setError("Invalid email");
          } else if (error.code === "auth/weak-password") {
            setError("Weak password");
          } else {
            setError("Invalid action");
          }
        });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
    >
      <div className={styles.rowInputContainer}>
        <div className={styles.oneInputContainer}>
          <label className={styles.inputLabel}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.rowInputContainer}>
        <div className={styles.inputContainer}>
          <div style={{display: "flex", flexDirection: "row"}}>
            <label className={styles.inputLabel}>Password</label>
            <Tooltip title="Password must be alphanumeric and at least 8 characters long"
              placement="top" arrow
              slotProps={{ tooltip: { sx: { fontSize: '0.8em' } } }}
            >
              <HelpOutlineIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}} />
            </Tooltip>
          </div>
          <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabel}>Confirm Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.errorContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
      <div className={styles.buttonContainer}>

        <Link href="/login" className={styles.clickableText}>Back</Link>
        <button
          className={styles.button}
          type="submit"
        >
          N E X T
        </button>
      </div>
    </form>
  );
}
