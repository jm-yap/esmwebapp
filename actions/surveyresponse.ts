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

export async function getResponses(
  accessKey: string,
  surveyID: string
): Promise<any[]> {
  const responseDocument = collection(
    db,
    `ResearchModule/${accessKey}/SurveyData`
  );
  const q = query(responseDocument, where("SurveyID", "==", `${surveyID}`));
  const querySnapshot = await getDocs(q);
  const respArr = querySnapshot?.docs.map((doc) => {
    return {
      id: doc.id,
      data: doc.data(), // data refers to the data within that document.
    };
  });

  const oneResponse = await Promise.all(
    respArr.map(async (resp) => {
      const list = await getResponse(accessKey, resp.id); // list of responses per responseID

      return {
        responseID: resp.id,
        data: {
          ...resp.data,
          Timestamp: new Date(resp.data.Timestamp.seconds * 1000), // Update next time
        },
        list: list,
      };
    })
  );
  return oneResponse;
}

async function getResponse(
  accessKey: string,
  responseID: string
): Promise<any> {
  const response = collection(
    db,
    `ResearchModule/${accessKey}/SurveyData/${responseID}/SurveyResponses`
  );
  const docSnapshot = await getDocs(response);
  const userResponsesArray = docSnapshot.docs.map((doc) => {
    return {
      surveyresponsesDocID: doc.id, // docID
      //data: doc.data(), //hopefully, qID, response, rID
      data: {
        ...doc.data(),
      },
    };
  });
  return userResponsesArray;
}
