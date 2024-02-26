"use client";

import React, { useState, useEffect } from "react";
import { getResponses } from "@/actions/surveyresponse";
import { getQuestions } from "@/actions/surveyquestion";
import Link from "next/link";

interface ResponsePageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}

export default function ResponsesPage({ params }: ResponsePageProps) {
  const [responses, setResponses] = useState([]);
  const [headerQuestions, setHeaderQuestions] = useState([]);
 
  // Fetching: Fetch the responses once the questions have been fetched
  useEffect(() => {
    const fetchData = () => {
      getQuestions(params.accessKey, params.surveyID).then((questions: any) => {
        setHeaderQuestions(questions);
        getResponses(params.accessKey, params.surveyID, questions).then((responses: any) => {
          setResponses(responses); 
        });
      });
    };
    fetchData();
  }, []);


  if (responses.length == 0) {
    return (
          <div className= "overflow-auto border-0 p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
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

  }
  else {
    return (
      <div className=" overflow-auto border-0 p-6 max-w-auto mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
        <h1 className="text-2xl font-bold mb-8">
          The Responses for SurveyID: {params.surveyID}
        </h1>
        <Link
          href={`/surveymodule/${params.accessKey}`}
          className="mt-4 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-black rounded shadow ripple hover:shadow-lg hover:bg-gray-900 focus:outline-none mb-4"
        >
          Back to Survey Module
        </Link>      
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs text-black-500 uppercase tracking-wider border-2 border-gray-300 bg-gray-400">ResponseID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs  text-black-500 uppercase tracking-wider border-2 border-gray-300 bg-gray-400">TimeStamp</th>
              {
                headerQuestions.map((questionJSON: any) => {
                  return (
                    <th scope="col" className="px-6 py-3 text-left text-xs text-black-500 uppercase tracking-wider border-2 border-gray-300 bg-gray-400">
                      {questionJSON.data.QuestionText}
                    </th>
                  )
                })
              }
            </tr>
  
            {
              responses.map((response: any) => {
                const date = new Date(response.time.seconds * 1000);
                const dateString = date.toLocaleString();
                console.log(dateString)
               
                return (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap border-2 border-gray-300">
                      {response.respID}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap border-2 border-gray-300">
                      {dateString}
                    </td>
                    
                    {
                      response.list.map((perResponse: any) => {
                        if (perResponse.data.Response === "") {
                          return (
                            <td className="px-6 py-4 whitespace-nowrap border-2 border-gray-300">                              
                            </td>
                          )
                        }
                        else {
                          return (
                            <td className="px-6 py-4 whitespace-nowrap border-2 border-gray-300">
                              {perResponse.data.Response}
                            </td>
                          )
                        }
                      })
                    }
                  </tr>
                )
              })
            }
          </thead>
        </table>  
      </div>  
    )
  } 
}
