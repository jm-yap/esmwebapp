'use server';
import {
    collection,
    getDocs,
    QueryDocumentSnapshot,
    addDoc,
    deleteDoc,
    setDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { doc } from 'firebase/firestore';

export async function AddClient(
    uid : string,
    firstName: string,
    lastName: string,
    middleName: string,
    contactNumber: string,
    email: string,
) {
    try {
        const clientCollection = collection(db, 'Client');
        const newClient = await setDoc(doc(clientCollection, uid), {
            FirstName: firstName,
            LastName: lastName,
            MiddleName: middleName,
            Email: email,
            ContactNumber: contactNumber,
        });
        
        console.log("New client created with ID: ", uid);
        return true;
    } catch (error) {
        console.error("Error creating new survey module", error);
        return false;
    }
}