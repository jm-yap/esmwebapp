"use server";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
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

export async function updateSurveyModule(accessCode: string, title: string, description: string, isAnonymous: Boolean): Promise<any> {
  const surveyModuleDocRef = doc(db, "ResearchModules", accessCode);

  // surveyModuleDoc = await getDoc(surveyModuleDocRef);
  try {
    await updateDoc(surveyModuleDocRef, {
      Title: title,
      Description: description,
      IsAnonymous: isAnonymous
    });
    
    console.log("Survey module updated with ID: ", accessCode);
    return true;
  } catch (error) {
    console.error("Error updating survey module", error);
    return false;
  }
}