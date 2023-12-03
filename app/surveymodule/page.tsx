"use client";
import React, { useState, useEffect} from 'react'
import { getSurveyModules, addSurveyModule, deleteSurveyModule } from '@/actions/surveymodule'
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { auth } from "../../firebase";
import { apiBaseUrl } from 'next-auth/client/_utils';

export default function SurveyModule() {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login');
        },
    });

    const uid = auth.currentUser?.uid;

    const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
    const [isChecked, setIsChecked] = useState(false);
    
    useEffect(() => {
        const fetchData = () => {
            getSurveyModules().then((modules) => {
                setSurveyModules(modules);
            });
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };
    
    const handleIsAnonymous = async () => {
        try {
            await addSurveyModule(uid, isChecked);
            const updatedModules = await getSurveyModules();
            setSurveyModules(updatedModules);
        } catch (error: any) {
            console.error("Error adding survey module:", error.message);
        }
    };

    const handleDeleteSurveyModule = async (surveyModuleID: string) => {
        try {
            await deleteSurveyModule(surveyModuleID);
            const updatedModules = await getSurveyModules();
            setSurveyModules(updatedModules);
        } catch (error: any) {
            console.error("Error deleting survey module:", error.message);
        }
    };

    return (
        <div>
            <h1>Survey Module</h1>
            <ul>
                {surveyModules.map((surveyModule: { id: string, data: { ClientID: string, isAnonymous: boolean } }) => (
                    <li key={surveyModule.id}>
                        Access Code: {surveyModule.id} <br />
                        Client ID: {surveyModule.data.ClientID} <br />
                        Is Anonymous: {surveyModule.data.isAnonymous ? "Yes" : "No"} <br />
                        <button onClick={() => handleDeleteSurveyModule(surveyModule.id)}>Delete</button> <br />
                        <br />
                    </li>
                ))}
            </ul>
            <br />
            <button onClick={handleIsAnonymous}>Create Survey Module</button> <br />
            <input type="checkbox" onChange={handleCheckboxChange} /> Is Anonymous
        </div>
    );
}