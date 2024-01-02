"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../../../../firebase";
import { getResponses } from "@/actions/surveyresponse";
import ResponseCard from "@/app/components/responses";
import { useRouter } from "next/router";
import Link from "next/link";
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
  useEffect(() => {
    const fetchResponses = () => {
      getResponses(params.accessKey, params.surveyID).then((responses: any) => {
        setResponses(responses); // list of IDs
      });
    };
    fetchResponses();
  }, []);
  console.log(responses);
  // webpage rendering
  if (responses.length == 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
        <h1 className="text-2xl font-bold mb-8">
          The Responses for SurveyID: {params.surveyID}
        </h1>
        <Link
          href={`/surveymodule/${params.accessKey}`}
          className="mt-4 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-black rounded shadow ripple hover:shadow-lg hover:bg-gray-900 focus:outline-none mb-4"
        >
          Back to Survey Module
        </Link>
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          Nothing to see here yet!
        </h2>
      </div>
    );
  } else {
    return (
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
        <h1 className="text-2xl font-bold mb-8">
          The Responses for SurveyID: {params.surveyID}
        </h1>
        <Link
          href={`/surveymodule/${params.accessKey}`}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Back to Survey Module
        </Link>

        {responses.map((response: any) => (
          <ResponseCard key={response.ResponseID} response={response} />
        ))}
      </div>
    );
  }
}
