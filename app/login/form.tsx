"use client";
import { FormEvent, useState, useEffect  } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import styles from './styles.module.css';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Form() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("userEmail", email);
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (response.error === "CredentialsSignin") {
      setError("Email or password is incorrect");
    } else if (response.error === "ConfigurationError") {
      setError("Invalid action");
    } else if (response.ok) {
      router.push("/surveymodule");
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
        <div style={{display: "flex", flexDirection: "row", marginRight: '2%'}}>
          <p className={styles.inputLabel}>Password</p>
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ?
                <VisibilityIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/> :
                <VisibilityOffIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/>
              }
            </button>
        </div>
        <input
          className={styles.emailInput}
          type={showPassword ? "text" : "password"}
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
