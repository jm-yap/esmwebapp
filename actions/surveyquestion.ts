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

export async function getQuestions(
  AccessCode: string,
  surveyID: string,
  oder: string[]
): Promise<any> {
  const Ref = collection(db, `SurveyQuestion`);
  const surveyRef = query(Ref, where("SurveyID", "==", surveyID));

  // const surveyStr = localStorage.getItem("survey");
  // const parsedSurvey = surveyStr ? JSON.parse(surveyStr) : null;
  const desiredOrder = ['bsoW3zuXxg7sUbBEEVM0','fmIIDoeCcw4jHUikK8th']

  const querySnapshot = await getDocs(surveyRef);
  const itemsArr = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      AccessCode: AccessCode,
      data: doc.data(),
    };
  });

  itemsArr.sort((a, b) => {
  const aIndex = desiredOrder.indexOf(a.id);
  const bIndex = desiredOrder.indexOf(b.id);

  if (aIndex === -1 && bIndex === -1) {
    // If both IDs are not present in the desiredOrder array, maintain their original order
    return 0;
  } else if (aIndex === -1) {
    // If 'a' is not present in the desiredOrder array, place it after 'b'
    return 1;
  } else if (bIndex === -1) {
    // If 'b' is not present in the desiredOrder array, place it after 'a'
    return -1;
  } else {
    // Sort based on the order in the desiredOrder array
    return aIndex - bIndex;
  }
  });

  return itemsArr;
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
