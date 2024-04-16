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
  updateDoc,
  increment,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { getSurveyDetails } from "./surveyresponse";

export async function getQuestions(
  AccessCode: string,
  surveyID: string,
): Promise<any> {
  const Ref = collection(db, `SurveyQuestion`);
  const survey = await getSurveyDetails(surveyID);
  const surveyRef = query(Ref, where("SurveyID", "==", surveyID));

  const querySnapshot = await getDocs(surveyRef);
  const itemsArr = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      AccessCode: AccessCode,
      data: doc.data(),
    };
  });

  const sortedItemsArr = survey.QuestionOrder
  .map((id) => itemsArr.find((item) => item.id === id))
  .filter((item) => item !== undefined);

  return sortedItemsArr;
}

export async function deleteQuestion(
  AccessCode: string,
  surveyID: string,
  questionID: string
): Promise<boolean> {
  try {
    const questionCollection = collection(
      db,
      `/SurveyQuestion`
    );
    await deleteDoc(doc(questionCollection, questionID));
    const surveyRef = doc(db, "/Survey", surveyID);
      await updateDoc(surveyRef, {
      TotalQuestions: increment(-1),
      // remove id from question order array
      QuestionOrder: arrayRemove(questionID)
      });
    console.log("Question deleted with ID: ", questionID);
    return true;
  } catch (error) {
    console.error("Error deleting question", error);
    return false;
  }
}
