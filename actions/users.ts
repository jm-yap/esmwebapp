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
    Timestamp,
  } from "firebase/firestore";
import { db } from "../firebase";


export async function getUsers(accessKey: string): Promise<any[]> {
    //console.trace("getUsers called");
    const allUsers = collection(
        db, `ResearchModule/${accessKey}/ModuleUsers`
    )

    const userSnapshot = await getDocs(allUsers); //all documents in `ResearchModule/${accessKey}/ModuleUsers

    const surveyModArr = userSnapshot?.docs.map((doc) => {
        return {
            id: doc.data().UserID, // the ID contained in the document in surveymodule      
        }
    });
    
    console.log(surveyModArr); //[ { id: 'YDSpGAsOqqIlMOh7pTQJ' }, { id: 'WT9VRxK3OgjD6HPdIYIz' } ]

    // const userDocsList = await Promise.all(surveyModArr.map(async (user) => {
    //     const userInfo = await getUserInfo(user.id); // list of responses per responseID????????
    //     //console.log(userInfo);
    //     return userInfo;

    // }));
    //console.log(userDocsList);
    const userDocsList = await getUserInfo();

    let filteredUserDocsList: any[] = [];
    
    userDocsList.forEach((user: any) => {
        console.log({id: user.id});
        if (surveyModArr.some(surveyUser => surveyUser.id === user.id)) {
            delete user.PasswordHash; // deletes passwordhash from the user object
            delete user.Birthdate; // deletes birthdate from the user object
            filteredUserDocsList.push(user);
        }
    });
    console.log(filteredUserDocsList);
    return filteredUserDocsList;
}


async function getUserInfo(): Promise<any> {

    const userCollection = collection(db, `User`);

    const userSnapshot = await getDocs(userCollection);

    const userData = userSnapshot?.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
            }        
    });

    return userData;
}