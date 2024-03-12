"use client";
import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from './styles.module.css';

export default function Form() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  if (session) {
    sessionStorage.setItem("userEmail", email);
    sessionStorage.removeItem("firstName");
    sessionStorage.removeItem("lastName");
    sessionStorage.removeItem("middleName");
    sessionStorage.removeItem("contactNumber");
    redirect("/surveymodule");
  }

  try {
    const isMasterKeyPresent = sessionStorage.getItem("masterKey");
    if (isMasterKeyPresent !== "true") {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (response.error === "CredentialsSignin") {
      setError("Email or password is incorrect");
    } else if (response.error === "ConfigurationError") {
      setError("Invalid action");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <p className={styles.inputLabel}>Email</p>
        <input
          className={styles.emailInput}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.inputContainer}>
        <p className={styles.inputLabel}>Password</p>
        <input
          className={styles.emailInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className={styles.errorContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>

      <div className={styles.buttonContainer}>

        <Link href="/register" className={styles.clickableText}>Create Account</Link>
        <button className={styles.button} type="submit">
          L O G I N
        </button>
      </div>

      
    </form>


  );
}
