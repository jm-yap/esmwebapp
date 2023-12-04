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
        sessionStorage.setItem("masterKey", "true");
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
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Web App</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="masterKeyInput" className="text-lg">
          Please enter the master key to proceed:
        </label>
        <input
          id="masterKeyInput"
          className="border border-black rounded-md px-2 py-1"
          type="text"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleMasterKeySubmit}
        >
          Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default HomePage;
