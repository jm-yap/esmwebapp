"use client";
import React from 'react'
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Prop {
  submitMasterKey: (masterKey: string, error: string | null, setError: React.Dispatch<React.SetStateAction<string | null>>) => void;
}

const SubmitMasterkey = ({submitMasterKey} : Prop) => {  
  const router = useRouter();
  const [masterKey, setMasterKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  return (
    <>
    <input
        type="text"
        value={masterKey}
        onChange={(e) => setMasterKey(e.target.value)}
      />
      <button onClick={() => submitMasterKey(masterKey, error, setError)}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default SubmitMasterkey;