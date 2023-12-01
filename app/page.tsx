"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { database } from "../firebase.js"; // Adjust the path accordingly
import { getDatabase, ref, get } from "firebase/database";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [masterKey, setMasterKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleMasterKeySubmit = async () => {
    try {
      // Validate master key against Firebase
      const masterKeyRef = ref(
        database,
        "MasterKey/Xl6FTYysaFaApEnjF7dG/MasterKey"
      );
      const snapshot = await get(masterKeyRef);
      const storedMasterKey = snapshot.val();

      if (masterKey === storedMasterKey) {
        // If master key is correct, navigate to the login/signup page
        router.push("/home"); // Replace with the actual path of your login/signup page
      } else {
        setError("Invalid master key");
      }
    } catch (error: any) {
      console.error("Error validating master key:", error.message);
      setError("An error occurred while validating the master key");
    }
  };

  return (
    <div>
      <h1>Welcome to Your Web App</h1>
      <p>Please enter the master key to proceed:</p>
      <input
        type="password"
        value={masterKey}
        onChange={(e) => setMasterKey(e.target.value)}
      />
      <button onClick={handleMasterKeySubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HomePage;
