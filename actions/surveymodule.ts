"use server";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { update } from "firebase/database";

export async function getSurveyModules(): Promise<any> {
  const surveyModuleCollection = collection(db, "ResearchModules");
  const surveyModuleSnapshot = await getDocs(surveyModuleCollection);
  const surveyModuleList = surveyModuleSnapshot.docs.map(
    (doc: QueryDocumentSnapshot) => {
      return {
        id: doc.id,
        data: doc.data() as { BuilderID: string; Title: string; Description: string; TotalSurveys: number; IsAnonymous: boolean }
      };
    }
  );

  return surveyModuleList;
}

// export async function countSurveys(AccessCode: string): Promise<any> {
//   const surveyCollection = collection(db, "Survey");
//   const filteredSurveyCollection = query(surveyCollection, where("AccessCode", "==", AccessCode));
//   const surveyCollectionSnapshot = await getDocs(filteredSurveyCollection);

//   return surveyCollectionSnapshot.docs.length.toString();
// }

export async function editSurveyModule(
  surveyModuleID: string,
  title: string,
  description: string,
  isAnonymous: boolean
): Promise<boolean> {
  try {
    const surveyModuleCollection = collection(db, "ResearchModules");
    await updateDoc(doc(surveyModuleCollection, surveyModuleID), {
      Title: title,
      Description: description,
      IsAnonymous: isAnonymous
    });

    console.log("Survey module edited with ID: ", surveyModuleID);
    return true;
  } catch (error) {
    console.error("Error editing survey module", error);
    return false;
  }
}

export async function addSurveyModule(
  builderEmail: string,
  title: string,
  description: string,
  totalSurveys: number,
  isAnonymous: boolean
) {
  try {
    const surveyModuleCollection = collection(db, "ResearchModules");
    const newSurveyModule = await addDoc(surveyModuleCollection, {
      BuilderID: builderEmail,
      Title: title,
      Description: description,
      TotalSurveys: totalSurveys,
      IsAnonymous: isAnonymous
    });

    console.log("New survey module created with ID: ", newSurveyModule.id);
    return true;
  } catch (error) {
    console.error("Error creating new survey module", error);
    return false;
  }
}

export async function deleteSurveyModule(
  surveyModuleID: string
): Promise<boolean> {
  try {
    const surveyModuleCollection = collection(db, "ResearchModules");
    const surveyCollection = collection(db, "Survey");
    const surveyQuestionCollection = collection(db, "SurveyQuestion");
    const responseCollection = collection(db, "Response");

    await deleteDoc(doc(surveyModuleCollection, surveyModuleID));
    console.log("Survey module deleted with ID: ", surveyModuleID);
    
    const querySurvey = query(surveyCollection, where("AccessCode", "==", surveyModuleID));
    const querySurveySnapshot = await getDocs(querySurvey);
    for (const survey of querySurveySnapshot.docs) {
      await deleteDoc(doc(surveyCollection, survey.id));
      console.log("Survey deleted with ID: ", survey.id);
    
      const queryQuestion = query(surveyQuestionCollection, where("SurveyID", "==", survey.id));
      const queryQuestionSnapshot = await getDocs(queryQuestion);
      for (const question of queryQuestionSnapshot.docs) {
        await deleteDoc(doc(surveyQuestionCollection, question.id));
        console.log("Question deleted with ID: ", question.id);
      }

      const queryResponse = query(responseCollection, where("SurveyID", "==", survey.id));
      const queryResponseSnapshot = await getDocs(queryResponse);
      for (const response of queryResponseSnapshot.docs) {
        await deleteDoc(doc(responseCollection, response.id));
        console.log("Response deleted with ID: ", response.id);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting survey module", error);
    return false;
  }
}