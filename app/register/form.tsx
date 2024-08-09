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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Form() {
  const { data: session } = useSession();

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [passCheck1, setPassCheck1] = useState<boolean>(false);
  const [passCheck2, setPassCheck2] = useState<boolean>(false);
  const [passCheck3, setPassCheck3] = useState<boolean>(false);
  const [passCheck4, setPassCheck4] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepassword, setShowRepassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(password);
    setTimeout(() => {
      setError(null);
    }, 3000);
    if (!passCheck1 || !passCheck2 || !passCheck3 || !passCheck4) {
      setError("Satisfy all password requirements");
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

  useEffect(() => {
    if (/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{0,1000})$/.test(password) === true) {
      setPassCheck1(true);
    } else {
      setPassCheck1(false);
    }
    if (password.length >= 8) {
      setPassCheck2(true);
    } else {
      setPassCheck2(false);
    }
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      setPassCheck3(true);
    } else {
      setPassCheck3(false);
    }
    if (password === repassword && password !== "" && repassword !== "") {
      setPassCheck4(true);
    } else {
      setPassCheck4(false);
    }
  }, [password, repassword]);

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
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ?
                <VisibilityIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/> :
                <VisibilityOffIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/>
              }
            </button>
            <Tooltip title="Password must be alphanumeric and at least 8 characters long"
              placement="top" arrow
              slotProps={{ tooltip: { sx: { fontSize: '0.8em' } } }}
            >
              <HelpOutlineIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}} />
            </Tooltip>

          </div>
          <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className={styles.inputContainer}>
          <div style={{display: "flex", flexDirection: "row"}}>
            <label className={styles.inputLabel}>Confirm Password</label>
            <button type="button" onClick={() => setShowRepassword(!showRepassword)}>
              {!showRepassword ?
                <VisibilityIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/> :
                <VisibilityOffIcon style={{color: "#E07954", fontSize: "1.5rem", marginLeft: '2%'}}/>
              }
            </button>
          </div>
          <input
            className={styles.input}
            type={showRepassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
          
        </div>
      </div>
      <div className={styles.errorContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
        <div style={{color: passCheck4 ? "#008000" : "#ED4337"}}>
          Passwords match
          {passCheck4 ? <CheckIcon/> : <ClearIcon/>} 
        </div>
        <div style={{color: passCheck1 ? "#008000" : "#ED4337"}}>
          Password is alphanumeric
          {passCheck1 ? <CheckIcon/> : <ClearIcon/>} 
        </div>
        <div style={{color: passCheck2 ? "#008000" : "#ED4337"}}> 
          Password is at least 8 characters long
          {passCheck2 ? <CheckIcon/> : <ClearIcon/>}
        </div>
        <div style={{color: passCheck3 ? "#008000" : "#ED4337"}}>
          Password contains uppercase and lowercase letters
          {passCheck3 ? <CheckIcon/> : <ClearIcon/>} 
        </div>
        
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
