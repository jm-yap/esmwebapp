'use server';
import {
    collection,
    getDocs,
    QueryDocumentSnapshot,
    addDoc
} from 'firebase/firestore';
import { db } from '../firebase';

type SurveyModule = {
    id: string;
    data: {
        isAnonymous: boolean;
    };
};

export async function getSurveyModules() : Promise<any> {
    const surveyModuleCollection = collection(db, 'ResearchModule');
    const surveyModuleSnapshot = await getDocs(surveyModuleCollection);

    const surveyModuleList = surveyModuleSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        return {
            id: doc.id,
            data: doc.data() as { isAnonymous: boolean },
        };
    });

    return surveyModuleList;
}

export async function addSurveyModule(isSurveyModuleAnonymous: boolean) {
    try {
        const surveyModuleCollection = collection(db, 'ResearchModule');
        const newSurveyModule = await addDoc(surveyModuleCollection, {
            isAnonymous: isSurveyModuleAnonymous
        });
        
        console.log("New survey module created with ID: ", newSurveyModule.id);
        return true;
    } catch (error) {
        console.error("Error creating new survey module", error);
        return false;
    }
}