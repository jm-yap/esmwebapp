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
import {Timestamp} from "firebase/firestore";
import { getClientAccountByEmail } from "@/actions/clients";

export async function getResponses(
  accessKey: string,
  surveyID: string,
  surveyQuestions: any[],
): Promise<any[]> {
  // surveyQuestions is already in the form of: return {
  //   id: doc.id,
  //   AccessCode: AccessCode,
  //   data: doc.data(),
  // };

  // Retrieving all relevant response docs given a surveyID
  const responseDocumentColl = collection(db, `Response`)  
  const relevantResponsesQuery = query(responseDocumentColl, where("SurveyID", "==", `${surveyID}`));
  const relevantResponses = await getDocs(relevantResponsesQuery);
  const respArr = relevantResponses?.docs.map((doc) => {
    return {
      id: doc.id,
      data: doc.data(), 
    };
  });
  console.log(respArr, 'bruh')
  // Retrieving all responseInstances given a responseID
  const responseInstanceColl = collection(db, `ResponseInstance`);
    
  const relevantResponseInstances = await Promise.all(respArr?.map(async (response) => {
      let q =  query(responseInstanceColl, where("ResponseID", "==", `${response.id}`));
      let getResponseInst = await getDocs(q);  // get all responseInstances of responseID
      let docsToObj = getResponseInst?.docs.map((doc) => {              
        return {
          id: doc.id,
          ...doc.data(), // qID, response, rID
        };
      });

      // arrange the responseInstances according to the order of the questions
      let arrangedResponseInstances: any[] = []; 
      
      for (let i = 0; i < surveyQuestions.length; i++) {
        let flag: boolean = false;
        let respIt: any;
        for (let j = 0; j < docsToObj.length; j++) {            
            if (surveyQuestions[i].id === docsToObj[j].QuestionID) {              
              flag = true; 
              respIt = docsToObj[j];       
              break;     
            }
        }
        if (!flag) {
          // why did i add the QID and RID if the responseinstance does not exist (e.g. no answer to that question)?
          // to still create a unique ID and prevent console error
          arrangedResponseInstances.push({id: surveyQuestions[i].id + response.id, 
            QuestionID: surveyQuestions[i].id, Response: "", ResponseID: response.id});
        }
        else {
          arrangedResponseInstances.push(respIt);
        }
      }

      const date = new Date(response.data.Timestamp.seconds * 1000);
      const dateString = date.toLocaleString();
      let out = {respID: response.id, time: dateString, list: arrangedResponseInstances};
      console.log(out)
      return out;
    })
  );

  return relevantResponseInstances;  
}


export async function getSurveyDetails(
  surveyID: string,
): Promise<any> {

  const docRef = doc(db, `Survey`, `${surveyID}`);
  const fetchedInfo = await getDoc(docRef);
  
  return {
    id: fetchedInfo.id,
    ...fetchedInfo.data(),
  }
}

export async function getBuilderDetails(
  builderMail: string, 
): Promise<any> {
  
}