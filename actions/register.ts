"use server";
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
    const clientCollection = collection(db, "Client");
    const newClient = await setDoc(doc(clientCollection, email), {
      FirstName: firstName,
      LastName: lastName,
      MiddleName: middleName,
      ContactNumber: contactNumber,
    });

    console.log("New client created with ID: ", email);
    return true;
  } catch (error) {
    console.error("Error creating new account client", error);
    return false;
  }
}

export async function CheckProfile(email: string) {
  try {
    const clientCollection = collection(db, "Client");
    const clientDoc = await getDoc(doc(clientCollection, email));
    return clientDoc.data();
  } catch (error) {
    console.error("Error retrieving client profile", error);
    return null;
  }
}
