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
} from "firebase/firestore";
import { db } from "../firebase";
import { NewSurveyProps, SurveyCardProps } from "@/app/components/surveys";

export async function getSurveys(AccessCode: string): Promise<any> {
  const Ref = collection(db, `/Survey`);
  const moduleRef = query(Ref, where("AccessCode", "==", AccessCode));

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

export async function addSurvey({survey}:NewSurveyProps){
  const surveyRef = collection(db,`Survey`);
  try {
      const docRef = await addDoc(surveyRef, {
        AccessCode: survey.AccessCode,
        BuilderID: survey.BuilderID,
        Title: survey.Title,
        Description: survey.Description,
        SchedType: survey.SchedType,
        LaunchStart: survey.LaunchStart,
        LaunchEnd: survey.LaunchEnd,
        Deadline: survey.Deadline,
        TotalQuestions: survey.TotalQuestions
      });

      console.log("Survey added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding  survey:", error);
    }
}

export async function deleteSurvey(
  AccessCode: string,
  SurveyID: string
): Promise<boolean> {
  try {
    const surveyCollection = collection(
      db,
      `/Survey`
    );
    await deleteDoc(doc(surveyCollection, SurveyID));
    
    const surveyModuleRef = doc(db, "ResearchModules", AccessCode);
    await updateDoc(surveyModuleRef, {
      TotalSurveys: increment(-1)
    });

    console.log("Survey deleted with ID: ", SurveyID);
    return true;
  } catch (error) {
    console.error("Error deleting survey", error);
    return false;
  }
}
