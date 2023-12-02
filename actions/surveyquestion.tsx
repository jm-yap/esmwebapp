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
} from "firebase/firestore";
import { db } from "../firebase";

export async function getQuestions(
  accessKey: string,
  surveyID: string
): Promise<any> {
  const surveyRef = collection(
    db,
    `ResearchModule/${accessKey}/Survey/${surveyID}/SurveyQuestion`
  );

  const querySnapshot = await getDocs(surveyRef);
  const itemsArr = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      accessKey: accessKey,
      data: doc.data(),
    };
  });
  return itemsArr;
}

export async function deleteQuestion(
  accessKey: string,
  surveyID: string,
  questionID: string
): Promise<boolean> {
  try {
    const questionCollection = collection(
      db,
      `/ResearchModule/${accessKey}/Survey/${surveyID}/SurveyQuestion`
    );
    await deleteDoc(doc(questionCollection, questionID));
    console.log("Question deleted with ID: ", questionID);
    return true;
  } catch (error) {
    console.error("Error deleting question", error);
    return false;
  }
}
