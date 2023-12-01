'use server';

import {
    collection,
    getDocs,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function getSurveyModules() {
    const surveyModuleCollection = collection(db, 'ResearchModule');
    const surveyModuleSnapshot = await getDocs(surveyModuleCollection);

    const surveyModuleList = surveyModuleSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        return {
            id: doc.id,
            data: doc.data(),
        };
    });

    return surveyModuleList;
}