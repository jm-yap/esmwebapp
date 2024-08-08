"use client";
import {
  collection,
  doc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";

export async function AddClient(
  email: string,
  firstName: string,
  lastName: string,
  middleName: string,
  contactNumber: string,
) {
  try {
    const clientCollection = collection(db, "Builder");
    await setDoc(doc(clientCollection, email), {
      FirstName: firstName,
      LastName: lastName,
      MiddleName: middleName,
      ContactNumber: contactNumber,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
