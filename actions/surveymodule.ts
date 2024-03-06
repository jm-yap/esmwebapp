"use server";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
  // query,
  // where,
} from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";

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
    await deleteDoc(doc(surveyModuleCollection, surveyModuleID));
    console.log("Survey module deleted with ID: ", surveyModuleID);
    return true;
  } catch (error) {
    console.error("Error deleting survey module", error);
    return false;
  }
}