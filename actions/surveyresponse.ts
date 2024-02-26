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

  // Retrieving all responseInstances given a responseID
  const responseInstanceColl = collection(db, `ResponseInstance`);
    
  const relevantResponseInstances = await Promise.all(respArr?.map(async (response) => {
      let q =  query(responseInstanceColl, where("ResponseID", "==", `${response.id}`));
      let getResponseInst = await getDocs(q);  // get all responseInstances of responseID
      let docsToObj = getResponseInst?.docs.map((doc) => {              
        return {
          id: doc.id,
          data: doc.data(), // qID, response, rID
        };
      });

      // arrange the responseInstances according to the order of the questions
      let arrangedResponseInstances: any[] = []; 
      
      for (let i = 0; i < surveyQuestions.length; i++) {
        let flag: boolean = false;
        let respIt: any;
        for (let j = 0; j < docsToObj.length; j++) {            
            if (surveyQuestions[i].id === docsToObj[j].data.QuestionID) {              
              flag = true; 
              respIt = docsToObj[j];       
              break;     
            }
        }
        if (!flag) {
          arrangedResponseInstances.push({id: "null", data: {QuestionID: surveyQuestions[i].id, Response: "", ResponseID: response.id}});
        }
        else {
          arrangedResponseInstances.push(respIt);
        }
      }
      let out = {respID: response.id, time: response.data.Timestamp, list: arrangedResponseInstances};

      return out;
    })
  );

  return relevantResponseInstances;  
}


