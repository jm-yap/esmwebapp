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
        StartDate: survey.StartDate,
        EndDate: survey.EndDate,
        Sessions: survey.Sessions,
        Interval: survey.Interval,
        TotalQuestions: survey.TotalQuestions,
        QuestionOrder: []
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
    const surveyCollection = collection(db, `/Survey`);
    const surveyQuestionCollection = collection(db, "SurveyQuestion");
    const responseCollection = collection(db, "Response");

    await deleteDoc(doc(surveyCollection, SurveyID));
    console.log("Survey deleted with ID: ", SurveyID);
    
    const queryQuestion = query(surveyQuestionCollection, where("SurveyID", "==", SurveyID));
    const queryQuestionSnapshot = await getDocs(queryQuestion);
    for (const question of queryQuestionSnapshot.docs) {
      await deleteDoc(doc(surveyQuestionCollection, question.id));
      console.log("Question deleted with ID: ", question.id);
    }

    const queryResponse = query(responseCollection, where("SurveyID", "==", SurveyID));
    const queryResponseSnapshot = await getDocs(queryResponse);
    for (const response of queryResponseSnapshot.docs) {
      await deleteDoc(doc(responseCollection, response.id));
      console.log("Response deleted with ID: ", response.id);
    }

    const surveyModuleRef = doc(db, "ResearchModules", AccessCode);
    await updateDoc(surveyModuleRef, {
      TotalSurveys: increment(-1)
    });

    return true;
  } catch (error) {
    console.error("Error deleting survey", error);
    return false;
  }
}
