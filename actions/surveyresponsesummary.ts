"use server";

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


/**
 * This function determines the response count of a user given a survey
*/
async function getResponseCount(collection: any, surveyID: string, email: string) {
    // collection is the response Document Collection
    const specificQuery = query(collection, where("SurveyID", "==", `${surveyID}`), where("Email", "==", `${email}`));
    const responseList = await getDocs(specificQuery);
    return responseList?.docs.length;
}

// to get the first and last response of a user, dapat we should process its responses 

/**
 * This function processes the response summary of all users in a survey. 
 * 
 * Output: A list of objects containing the response count, first response date, and latest response date of a user.; List of user summaries
*/
export async function getAllResponseSummary(
    accessKey: string,
    surveyID: string,
): Promise<any[]>  {
    // Retrieve all relevant response docs given a surveyID
    const responseDocumentColl = collection(db, `Response`)  
    const relevantResponsesQuery = query(responseDocumentColl, where("SurveyID", "==", `${surveyID}`));
    const relevantResponses = await getDocs(relevantResponsesQuery);
    const responseArrObjects = relevantResponses?.docs.map((doc) => {
        return {
        id: doc.id,
        data: doc.data(), // data has  Email, SurveyID, Timestamp
        };
    });
    
    // The list of all users belonging to a survey module 
    // A user in a survey module is eligible in answering a survey
    const clientEmailColl = collection(db, `Client`);
    const clientToModuleQuery = query(clientEmailColl, where("EnrolledIn", 'array-contains-any', [accessKey]));
    const getRelevantClients = await getDocs(clientToModuleQuery);
    const associateEmailToClient = {}
    getRelevantClients?.docs.forEach((doc)=> {
        // doc.id is the email of the user
        // email to name mapping
        associateEmailToClient[doc.id] = doc.data().FullName
    })
    const relevantEmails: string[] = Object.keys(associateEmailToClient);

    // Final processing
    // list of {'userEmail'  'name'  'firstResponse'  'lastResponse', numberOfSessions}
    const responseSummary = []
    for (let email of relevantEmails) {
        let filtered = responseArrObjects.filter((responseObj) => responseObj.data.ClientEmail === email);
        let userSummary: object = {}
        userSummary['userEmail'] = email; // to be used as a key
        userSummary['name'] = associateEmailToClient[email] 

        const responseLength = filtered.length
        if (responseLength > 0) {
            // Get the first and latest timestamp
            filtered.sort((a, b) => a.data.Timestamp - b.data.Timestamp);
            let first = new Date(filtered[0].data.Timestamp.seconds * 1000)
            let last = new Date(filtered[responseLength - 1].data.Timestamp.seconds * 1000)
            userSummary['firstResponse'] = first.toLocaleString()
            userSummary['lastResponse'] = last.toLocaleString()
            userSummary['numberOfSessions'] = responseLength;
        } else {
            userSummary['firstResponse'] = ""
            userSummary['lastResponse'] = ""
            userSummary['numberOfSessions'] = 0;
        }
        responseSummary.push(userSummary);
    }
    // responseSummary.push(
    //     {
    //         'userEmail': 'hello',
    //         'name': 'brobrobrob',
    //         'firstResponse': 'today',
    //         'lastResponse': 'ago',
    //         'numberOfSessions': 3,
    //     }
    // )
   
    return responseSummary
}