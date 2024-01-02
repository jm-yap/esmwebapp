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

export async function getSurveys(AccessCode: string): Promise<any> {
  const moduleRef = collection(db, `ResearchModule/${AccessCode}/Survey`);

  const querySnapshot = await getDocs(moduleRef);
  const surveyArr = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      AccessCode: AccessCode,
      data: doc.data(),
    };
  });
  return surveyArr;
}

export async function deleteSurvey(
  AccessCode: string,
  SurveyID: string
): Promise<boolean> {
  try {
    const surveyCollection = collection(
      db,
      `/ResearchModule/${AccessCode}/Survey`
    );
    await deleteDoc(doc(surveyCollection, SurveyID));
    console.log("Survey deleted with ID: ", SurveyID);
    return true;
  } catch (error) {
    console.error("Error deleting survey", error);
    return false;
  }
}
