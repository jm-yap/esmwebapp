"use client";

import React, { useState, useEffect } from "react";
import { getResponses, getSurveyDetails, getBuilderDetails, } from "@/actions/surveyresponse";
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
        // console.log(surveyInfo)

      
      })
    };
    fetchData();
  }, []);

  console.log(headerQuestions)
  // console.log(surveyInfo)
  // console.log(session)
  const newStart = new Date(surveyInfo?.StartDate.seconds * 1000)
  const startDate = newStart.toLocaleDateString();
  const newEnd = new Date(surveyInfo?.EndDate.seconds * 1000)
  const endDate = newEnd.toLocaleDateString();

  const builderFirstName = sessionStorage.getItem("firstName");
  const builderLastName = sessionStorage.getItem("lastName");

  // console.log(builderFirstName, builderLastName)
  console.log(responses)

  const downloadCSV = () => {
    alert("Downloading CSV file");
    console.log("MARKER OF THIS EVENT",headerQuestions)
    console.log("MARKER OF THIS EVENT",responses)
    let questionIDToText = {};
    // let questionIDToResponseInst: any[] = [];

    headerQuestions?.map((object, index)=>{
      questionIDToText[object.id] = object.data.QuestionText
    })

    
    console.log("hellaur",questionIDToText)
  }
  
  if (responses.length === 0) {
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
    
                <div className="builderName">
                  <h1>
                    First Name Last Name  
                  </h1> 
                </div>
    
    
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
                  {/* <h1 className="surveyInfoText">convert cv here</h1> */}
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

            <Link href={``}>
              <div className="builderName">
                <h1>
                  {builderFirstName} {builderLastName}
                </h1> 
              </div>
            </Link>


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
              {/* <h1 className="surveyInfoText">Convert cv here</h1> */}
              <button className="downloadCSVText" onClick={downloadCSV}>sdsds</button>
              <h1 className="surveyInfoText">Opens on: {startDate}</h1>
              <h1 className="surveyInfoText">Closes on: {endDate}</h1>
              <h1 className="surveyInfoText">Total Questions: {surveyInfo?.TotalQuestions}</h1>
            </div>
          </div>

          <div className = "tableDiv">
            <table className="table">
              <thead className="">
                <tr key = {surveyInfo?.id}>
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
                    return (
                      <tr key={response?.respID}>
                        <td className="tableCell tr:hover">
                          {response.respID}
                        </td>

                        <td className="tableCell tr:hover">
                          {response.time}
                        </td>
                        
                        {
                          response.list.map((perResponse: any) => {
                            if (perResponse.Response === "") {
                              return (
                                <td key={perResponse.id} className="tableCell tr:hover">                              
                                </td>
                              )
                            }
                            else {
                              return (
                                <td key={perResponse.id} className="tableCell tr:hover">
                                  {
                                    (typeof perResponse?.Response === 'string' || perResponse?.Response instanceof String) && perResponse?.Response
                                  }
                                  {
                                    Array.isArray(perResponse?.Response) && perResponse?.Response.map((option: any) => {
                                      return (
                                        `${option}, `
                                      )
                                    })
                                  }
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
