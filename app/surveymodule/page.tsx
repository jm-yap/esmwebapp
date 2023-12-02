"use client";
import React, { useState, useEffect} from 'react'
import { getSurveyModules, addSurveyModule } from '@/actions/surveymodule'

export default function surveyModule() {
    const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
    const [isAnonymous, setIsAnonymous] = useState(false); // Get the list of survey modules
    
    useEffect(() => {
        const fetchData = () => {
            getSurveyModules().then((modules) => {
                setSurveyModules(modules);
            });
        };

        fetchData();
    }, []);

    const handleIsNotAnonymous = async () => {
        try {
            await addSurveyModule(isAnonymous);
        } catch (error: any) {
            console.error("Error adding survey module:", error.message);
        }
    };

    const handleIsAnonymous = async () => {
        try {
            await addSurveyModule(true);
        } catch (error: any) {
            console.error("Error adding survey module:", error.message);
        }
    };

    return (
        <div>
            <h1>Survey Module</h1>
            <ul>
                {surveyModules.map((surveyModule: { id: string, data: { isAnonymous: boolean } }) => (
                    <li key={surveyModule.id}>
                        {surveyModule.id}
                    </li>
                ))}
            </ul>
            <p>Create Survey Module</p>
            <p>Is this Survey Module Anonymous?</p>
            <button onClick={handleIsAnonymous}>Yes</button>
            <button onClick={handleIsNotAnonymous}>No</button>
        </div>
    );
}