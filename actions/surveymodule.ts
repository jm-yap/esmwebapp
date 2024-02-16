"use server";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { doc } from "firebase/firestore";

export async function getSurveyModules(): Promise<any> { // email: string // for filtering
  const surveyModuleCollection = collection(db, "ResearchModule");
  // const q = query(surveyModuleCollection, where("ClientID", "==", email));
  const surveyModuleSnapshot = await getDocs(surveyModuleCollection);
  const surveyModuleList = surveyModuleSnapshot.docs.map(
    (doc: QueryDocumentSnapshot) => {
      return {
        id: doc.id,
        data: doc.data() as { ClientID: string; isAnonymous: boolean },
      };
    }
  );

  return surveyModuleList;
}

export async function addSurveyModule(
  email: string,
  isSurveyModuleAnonymous: boolean
) {
  try {
    const surveyModuleCollection = collection(db, "ResearchModules");
    const newSurveyModule = await addDoc(surveyModuleCollection, {
      BuilderID: email,
      isAnonymous: isSurveyModuleAnonymous,
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
