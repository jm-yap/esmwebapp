"use client";
import {
  collection,
  getDoc,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { doc } from "firebase/firestore";

export async function AddClient(
  email: string,
  firstName: string,
  lastName: string,
  middleName: string,
  contactNumber: string
) {
  try {
    const clientCollection = collection(db, "Builder");
    const newClient = await setDoc(doc(clientCollection, email), {
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