"use client"

import React, { useState, useEffect } from 'react';
import {
  collection,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  doc,
  where,
} from 'firebase/firestore';
import {db} from '../../../../../firebase';
import { getResponses } from '@/actions/surveyresponse';
import ResponseCard from "@/app/components/responses";
import { useRouter } from 'next/router'
// useEffect has two parameters: a function and an array of dependencies

// read responses from a database
// for every respondent, there are multiple responses. 

interface ResponsePageProps {
    params: {
      accessKey: string;
      surveyID: string;
    };
  }

export default function Responses({ params }: ResponsePageProps) {
    const [responses, setResponses] = useState([]);
    // const router = useRouter()
    // const { accessKey, surveyID } = router.query
    useEffect(() => {
            // accessKey refers to the instance of a research module
            // surveyID refers to a survey inside the research module
            // from surveyID, we are supposed to get the survey responses pertaining to that surveyID

            // Action Plan: 
            // 1. Try to retrieve data from the research module fields first.
            // 2. Then, try to retrieve data from the fields of all 
            const fetchResponses = () => {
                getResponses(params.accessKey, params.surveyID).then(
                    (responses: any) => {
                        setResponses(responses); // list of IDs
                    }
                );
            }
            fetchResponses();
        }
    , []);
  
    // webpage rendering
    if (!responses) {
        return <div>No Answers for this survey yet.</div>;
    } else {
        return (        
            <div>
                <h1>The Responses for SurveyID: {params.surveyID}</h1>
                
                {responses.map((response: any) => (
                    <ResponseCard key = {response.id} response = {response}  />
                    
                    
                ))}
                
            </div>
        );
    }
  }