"use server"

import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    QuerySnapshot,
    query,
    onSnapshot,
    deleteDoc,
    doc,
    where,
  } from "firebase/firestore";
import { db } from "../firebase";


export async function getUsers(accessKey: string): Promise<any[]> {4

    const allUsers = collection(
        db, `ResearchModule/${accessKey}/ModuleUsers`
    )

    const userSnapshot = await getDocs(allUsers); //all documents in `ResearchModule/${accessKey}/ModuleUsers
    const userDocsList = userSnapshot.docs.map((doc) => {
        return {
            id: doc.id,    // hahahah
            ...doc.data(), // LastName, Birthdate,... et. al
        }
    })
    return userDocsList;
}