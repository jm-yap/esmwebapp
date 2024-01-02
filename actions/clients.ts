"use server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getClientAccountByEmail(email: string): Promise<any> {
  try {
    const clientAccountSnapshot = await getDoc(doc(db, "Client", email));

    return clientAccountSnapshot.data();
  } catch (error) {
    return "adsf";
    console.error("Error fetching client account:", error);
    throw error;
  }
}
