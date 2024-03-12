"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMasterKey } from "@/actions/masterkey";
import styles from "./styles.module.css";

function HomePage() {
  const router = useRouter();
  const [masterKey, setMasterKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleMasterKeySubmit = async () => {
    try {
      // Get the master key from the database
      const databaseMasterkey = await fetchMasterKey();

      if (masterKey === databaseMasterkey?.MasterKey) {
        // If master key is correct, navigate to the login/signup page
        sessionStorage.setItem("masterKey", "true");
        router.push("/surveymodule"); // Replace with the actual path of your login/signup page
      } else {
        setError("Invalid master key");
      }
    } catch (error: any) {
      console.error("Error validating master key:", error.message);
      setError("An error occurred while validating the master key");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerBox}>
        <div className={styles.titleBox}>
          <div className={styles.titleWebPage}>
            <h1>Sagot</h1><h1 className={styles.titleOrange}>Kita</h1><h1>.</h1>
            
          </div>
        </div>
        <div className={styles.titleBox}>
          <div className={styles.masterKeyForm}>
            <h1 className={styles.masterKeyText}>Masterkey</h1>
            <input
              id="masterKeyInput"
              className={styles.inputBox}
              type="password"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
            />
            {error && <p  className={styles.errorText}>{error}</p>}
          </div>
          <div className={styles.masterKeyForm}>
            <button
              className={styles.submitButton}
              onClick={handleMasterKeySubmit}
            > 
              N E X T
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
