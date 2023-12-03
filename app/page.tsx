"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMasterKey } from "@/actions/masterkey";

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
        router.push("/dashboard"); // Replace with the actual path of your login/signup page
      } else {
        setError("Invalid master key");
      }
    } catch (error: any) {
      console.error("Error validating master key:", error.message);
      setError("An error occurred while validating the master key");
    }
  };

  return (
    <div className="flex flex-col gap-2 mx-auto max-w-md mt-10">
      <h1 className="align-middle">Welcome to Your Web App</h1>
      <h2>Please enter the master key to proceed:</h2>
      <input
        className="border border-black rounded-md"
        type="text"
        value={masterKey}
        onChange={(e) => setMasterKey(e.target.value)}
      />
      <button onClick={handleMasterKeySubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HomePage;
