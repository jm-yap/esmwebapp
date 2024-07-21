"use client";
import {
  getDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

export async function fetchMasterKey() {
  try {
    const masterKeySnapshot = await getDoc(
      doc(db, "MasterKey", "Xl6FTYysaFaApEnjF7dG"),
    );

    return masterKeySnapshot.data();
  } catch (error) {
    return;
    console.error("Error fetching master key:", error);
    throw error;
  }
}
