"use client";

import React, { useState, useEffect } from "react";
import { getResponses, getSurveyDetails, getBuilderDetails } from "@/actions/surveyresponse";
import { getQuestions } from "@/actions/surveyquestion";
import './response.css';
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from "next-auth/react";
interface ResponsePageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}

export default function ResponsesPage({ params }: ResponsePageProps) {
  const [responses, setResponses] = useState([]);
  const [headerQuestions, setHeaderQuestions] = useState([]);
  const [surveyInfo, setSurveyInfo] = useState(null);
  // Fetching: Fetch the responses once the questions have been fetched

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = () => {
      getQuestions(params.accessKey, params.surveyID).then((questions: any) => {
        setHeaderQuestions(questions);
        getResponses(params.accessKey, params.surveyID, questions).then((responses: any) => {
          setResponses(responses); 
        });
      });
      getSurveyDetails(params.surveyID).then((info: any) => {
        setSurveyInfo(info);
        console.log(surveyInfo)

      
      })
    };
    fetchData();
  }, []);

  console.log(surveyInfo)
  console.log(session)
  const newStart = new Date(surveyInfo?.StartDate.seconds * 1000)
  const startDate = newStart.toLocaleDateString();

  const newEnd = new Date(surveyInfo?.EndDate.seconds * 1000)
  const endDate = newEnd.toLocaleDateString();
  if (responses.length == 0) {
    return (
          <div className="pageProperty">         
            <main className="main">
              <div className = "banner">
                <Link href={`/surveymodule/`}>
                <div className = "bannerTitle">
                  <h1 className="bannerTitleChild">Sagot</h1>
                  <h1 className="bannerTitleChild bannerKita">Kita</h1>
                  <h1 className="bannerTitleChild">.</h1>
                </div>   
                </Link> 
    
                {/* <div className="builderName">
                  <h1>
                    First Name Last Name  
                  </h1> 
                </div> */}
    
    
              </div>
              <div className="surveyInformation">
                <div className="surveyInfoLeft">
                  {/* left */}
                  <div className="surveyTitleBack">
                    <Link href={`/surveymodule/${params.accessKey}`}>
                      <ArrowBackIcon sx={{ fontSize: 60 }}/>
                    </Link> 
                    <h1 className="surveyTitle">{surveyInfo?.Title}</h1>
                  </div>
                  <div>
                    <h1 className="surveyInfoText">Survey Description: {surveyInfo?.Description}</h1>
                    <h1 className="surveyInfoText">Required No. of Sessions: {surveyInfo?.Sessions}</h1>
                    <h1 className="surveyInfoText">Minimum Interval (in hours): {surveyInfo?.Interval}</h1>
                  </div>
                  
                </div>
    
                <div className="surveyInfoRight">
                  {/* right */}
              
                  <h1 className="surveyInfoText">Opens on: {startDate}</h1>
                  <h1 className="surveyInfoText">Closes on: {endDate}</h1>
                  <h1 className="surveyInfoText">Total Questions: {surveyInfo?.TotalQuestions}</h1>
                </div>
              </div>
              <div className="nothingDiv">
                <h2 className="nothingH2">
                  No responses for this survey yet!
                </h2>
              </div>              
            </main>
        </div>
    );

  }
  else {
    return (      
      <div className="pageProperty">         
        <main className="main">
          <div className = "banner">
            <Link href={`/surveymodule/`}>
            <div className = "bannerTitle">
              <h1 className="bannerTitleChild">Sagot</h1>
              <h1 className="bannerTitleChild bannerKita">Kita</h1>
              <h1 className="bannerTitleChild">.</h1>
            </div>   
            </Link> 

            {/* <div className="builderName">
              <h1>
                First Name Last Name  
              </h1> 
            </div> */}


          </div>
          <div className="surveyInformation">
            <div className="surveyInfoLeft">
              {/* left */}
              <div className="surveyTitleBack">
                <Link href={`/surveymodule/${params.accessKey}`}>
                  <ArrowBackIcon sx={{ fontSize: 60 }}/>
                </Link> 
                <h1 className="surveyTitle">{surveyInfo?.Title}</h1>
              </div>
              <div>
                <h1 className="surveyInfoText">Survey Description: {surveyInfo?.Description}</h1>
                <h1 className="surveyInfoText">Required No. of Sessions: {surveyInfo?.Sessions}</h1>
                <h1 className="surveyInfoText">Minimum Interval (in hours): {surveyInfo?.Interval}</h1>
              </div>
              
            </div>

            <div className="surveyInfoRight">
              {/* right */}
          
              <h1 className="surveyInfoText">Opens on: {startDate}</h1>
              <h1 className="surveyInfoText">Closes on: {endDate}</h1>
              <h1 className="surveyInfoText">Total Questions: {surveyInfo?.TotalQuestions}</h1>
            </div>
          </div>

          <div className = "tableDiv">
            <table className="table">
              <thead className="">
                <tr>
                  <th scope="col" className="tableHeader">ResponseID</th>
                  <th scope="col" className="tableHeader">Timestamp</th>
                  {
                    headerQuestions.map((questionJSON: any) => {
                      return (
                        <th key={questionJSON.id} scope="col" className="tableHeader">
                          {questionJSON.data.QuestionText}
                        </th>
                      )
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  responses.map((response: any) => {
                    const date = new Date(response.time.seconds * 1000);
                    const dateString = date.toLocaleString();
                    console.log(dateString)
                    
                    return (
                      <tr key={response.respID}>
                        <td className="tableCell tr:hover">
                          {response.respID}
                        </td>

                        <td className="tableCell tr:hover">
                          {dateString}
                        </td>
                        
                        {
                          response.list.map((perResponse: any) => {
                            if (perResponse.data.Response === "") {
                              return (
                                <td key={perResponse.id} className="tableCell tr:hover">                              
                                </td>
                              )
                            }
                            else {
                              return (
                                <td key={perResponse.id} className="tableCell tr:hover">
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
              </tbody>
            </table>  
          </div>
        </main>
      </div>
    )
  } 
}
