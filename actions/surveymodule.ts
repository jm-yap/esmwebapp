'use server';
import {
    collection,
    getDocs,
    QueryDocumentSnapshot,
    addDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { doc } from 'firebase/firestore';

export async function getSurveyModules() : Promise<any> {
    const surveyModuleCollection = collection(db, 'ResearchModule');
    const surveyModuleSnapshot = await getDocs(surveyModuleCollection);

    const surveyModuleList = surveyModuleSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        return {
            id: doc.id,
            data: doc.data() as { ClientID: string, isAnonymous: boolean },
        };
    });

    return surveyModuleList;
}

export async function addSurveyModule(uid : string, isSurveyModuleAnonymous: boolean) {
    try {
        const surveyModuleCollection = collection(db, 'ResearchModule');
        const newSurveyModule = await addDoc(surveyModuleCollection, {
            ClientID: uid,
            isAnonymous: isSurveyModuleAnonymous
        });
        
        console.log("New survey module created with ID: ", newSurveyModule.id);
        return true;
    } catch (error) {
        console.error("Error creating new survey module", error);
        return false;
    }
}

export async function deleteSurveyModule(surveyModuleID: string): Promise<boolean> {
    try {
        const surveyModuleCollection = collection(db, 'ResearchModule');
        await deleteDoc(doc(surveyModuleCollection, surveyModuleID));
        console.log("Survey module deleted with ID: ", surveyModuleID);
        return true;
    } catch (error) {
        console.error("Error deleting survey module", error);
        return false;
    }
}