"use client";

import {
  collection,
  getDoc,
  getDocs,
  query,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
// import {Timestamp} from "firebase/firestore";
// import { getClientAccountByEmail } from "@/actions/clients";
// import { access } from "fs";

// For every Response to a Survey, fetches all the
export async function getResponses(
  accessKey: string,
  surveyID: string,
  surveyQuestions: any[],
): Promise<any[]> {
  // console.log(accessKey, surveyID, surveyQuestions)
  // Retrieve all relevant response docs given a surveyID
  const responseDocumentColl = collection(db, `Response`);
  const relevantResponsesQuery = query(
    responseDocumentColl,
    where("SurveyID", "==", `${surveyID}`),
  );
  const relevantResponses = await getDocs(relevantResponsesQuery);
  const respArr = relevantResponses?.docs.map((doc) => {
    return {
      id: doc.id,
      data: doc.data(),
    };
  });

  // Retrieve the client associated with a response
  // Data used when the survey module is not set to anonymous.
  const clientEmailColl = collection(db, `Client`);
  const clientToModuleQuery = query(
    clientEmailColl,
    where("EnrolledIn", "array-contains-any", [accessKey]),
  );
  const getRelevantClients = await getDocs(clientToModuleQuery);

  const associateEmailToClient = {};

  getRelevantClients?.docs.forEach((doc) => {
    associateEmailToClient[doc.id] = doc.data().FullName;
  });
  // console.log(associateEmailToClient, "THIS ISISISISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

  // Retrieve all responseInstances given a responseID, for all responseIDs
  const responseInstanceColl = collection(db, `ResponseInstance`);
  const relevantResponseInstances = await Promise.all(
    respArr?.map(async (response) => {
      let q = query(
        responseInstanceColl,
        where("ResponseID", "==", `${response.id}`),
      );
      let getResponseInst = await getDocs(q); // get all responseInstances of responseID
      let docsToObj = getResponseInst?.docs.map((doc) => {
        return {
          id: doc.id,
          QuestionID: doc.data().QuestionID,
          Response: doc.data().Response,
        };
      });
      console.log(docsToObj, "docsToObj");
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
          arrangedResponseInstances.push({
            id: surveyQuestions[i].id + response.id,
            QuestionID: surveyQuestions[i].id,
            Response: "",
          });
        } else {
          arrangedResponseInstances.push(respIt);
        }
      }

      // const date = new Date(response.data.Timestamp.seconds * 1000);
      const date = response.data.Timestamp.seconds * 1000;
      // const dateString = date.toLocaleString();
      const dateString = date; //definitely not a string, but it is in seconds * 1000
      let processedResponse = {
        respID: response.id,
        clientName: associateEmailToClient[response.data.ClientEmail],
        time: dateString,
        list: arrangedResponseInstances,
      };
      // console.log(out)
      return processedResponse;
    }),
  );

  // console.log(relevantResponseInstances, 'huhh')
  return relevantResponseInstances;
}

export async function getSurveyDetails(surveyID: string): Promise<any> {
  const docRef = doc(db, `Survey`, `${surveyID}`);
  const fetchedInfo = await getDoc(docRef);

  return {
    id: fetchedInfo.id,
    ...fetchedInfo.data(),
  };
}

export async function getModuleAnon(moduleID: string): Promise<any> {
  const docRef = doc(db, `ResearchModules`, `${moduleID}`);
  const fetchedModuleInfo = await getDoc(docRef);

  return {
    id: fetchedModuleInfo.id,
    anon: fetchedModuleInfo.data().IsAnonymous,
  };
}
