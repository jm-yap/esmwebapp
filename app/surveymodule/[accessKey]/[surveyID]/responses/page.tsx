"use client";

import React, { useState, useEffect } from "react";
import { getResponses, getSurveyDetails, getModuleAnon, } from "@/actions/surveyresponse";
import { getQuestions } from "@/actions/surveyquestion";
import './response.css';
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from "next-auth/react";
import CsvDownloader from 'react-csv-downloader';

import styles from "@/app/surveymodule/[accessKey]/styles.module.css";


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
  const [moduleAnon, setModuleAnon] = useState(null);
  const [filterName, setFilterName] = useState('None')
  // I must store the statte of being filterd or not ? ? 


  // Fetching: Fetch the responses once the questions have been fetched

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = () => {
      getSurveyDetails(params.surveyID).then((info: any) => {
        setSurveyInfo(info);
        // console.log(info?.AccessCode, params.accessKey, "let us compare these valss")
        // console.log(info, "another info")
        getModuleAnon(params.accessKey).then((moduleAnonInfo)=>{
          // console.log("this is the module info:", moduleAnonInfo)
          setModuleAnon(moduleAnonInfo.anon)
        })
      
      });
      getQuestions(params.accessKey, params.surveyID).then((questions: any) => {
        setHeaderQuestions(questions);
        getResponses(params.accessKey, params.surveyID, questions).then((responses: any) => {
          setResponses(responses); 
        });
      });
      
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const newStart = new Date(surveyInfo?.StartDate.seconds * 1000)
  const startDate = newStart.toLocaleDateString();
  const newEnd = new Date(surveyInfo?.EndDate.seconds * 1000)
  const endDate = newEnd.toLocaleDateString();

  const builderFirstName = sessionStorage.getItem("firstName");
  const builderLastName = sessionStorage.getItem("lastName");

  // console.log(surveyInfo, 'Troubleshoot -1 Total Questions')
  // console.log(builderFirstName, builderLastName)
  // console.log(responses)

  type clientNameType = string | null
  let clientNames: clientNameType[] = responses.map((responseObj) => {return responseObj.clientName})
  const noDuplicates = (arr: clientNameType[]): clientNameType[] => {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}
  clientNames = noDuplicates(clientNames).sort()
  // console.log(clientNames)

  const handleNameFilter = (e) => {
    setFilterName(e.target.value)
  }

  console.log(filterName, "Marker of this locaion")

  const downloadCSVHandler = () => {

    let questionIDToText: object[] = [];
    let questionIDToResponseInst: object[] = [];

    // must take into account the anonymity of the survey module

    if (moduleAnon === false) {
      questionIDToText.push({
        id: "Name",
        displayName: "Name"
      })
    }

    questionIDToText.push({
      id: "Timestamp",
      displayName: "Timestamp"
    })

    headerQuestions?.forEach((object, index)=>{
      questionIDToText.push({
        id: object.id,
        displayName: object.data.QuestionText
      });
    })

    // Required: Timestamp column
    // if anon: wala, if not anon: name

    responses.forEach((responseObj, responseIdx) => {
      // let perRow = {}; //Assuming anonymous pa to ah
      // (filterName === 'None' || response.clientName === filterName)      
      // filterName is None when the survey is Anonymous
      if (filterName === 'None' || responseObj.clientName === filterName) {
        let perRow = {};
        if (moduleAnon === false) perRow["Name"] =  responseObj.clientName
      
        perRow["Timestamp"] = responseObj.time;
        // console.log(responseObj.clientName)
        responseObj.list.forEach((value: any)=>{
          // perRow[value.QuestionID] 
          if (Array.isArray(value.Response)) {
            if (!value.Response.length) {
              // empty array
              perRow[value.QuestionID] = ""
            } else {
              perRow[value.QuestionID] = `"${value.Response.join(", ").replace(/\n/g, ' ')}"`;
            }
          } else {
            perRow[value.QuestionID] = value.Response ? value.Response.replace(/\n/g, ' ') : "";
          }

        })
        questionIDToResponseInst.push(perRow);
      }      
    })
    console.log([questionIDToText, questionIDToResponseInst], 'PHUM VIPHURIT')
    console.log(questionIDToResponseInst, 'PHUM VIPHURIT');
    return [questionIDToText, questionIDToResponseInst]
        
  }  
  let csvData: any = downloadCSVHandler()
  let csvFileName: string = `${surveyInfo?.Title} Response Data`


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
                  {/* <h1 className="surveyInfoText">convert cv here</h1> */}
                  <h1 className="surveyInfoText">Module Anonymity: {`${moduleAnon ? 'Anonymous' : 'Not Anonymous'}`}</h1>
                  <h1 className="surveyInfoText">Opens on: {startDate}</h1>
                  <h1 className="surveyInfoText">Closes on: {endDate}</h1>
                  <h1 className="surveyInfoText">Total Questions: {headerQuestions.length}</h1>
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
                {/* filter shit */}
                {(moduleAnon === false) &&
                    <select 
                    className={styles.sidebarTextField}
                    value = {filterName}                
                    onChange = {handleNameFilter}>
                    <option value='None'>No filter</option>
                    {clientNames.map((data)=>{return <option key={data} value={data}>{data}</option>})}
                  </select>           
                }
              </div>
              
            </div>

            <div className="surveyInfoRight">
                  {/* right */}
              {/* <h1 className="surveyInfoText">Cojjknvert cv here</h1> */}
              {/* <button className="downloadCSVText" onClick={downloadCSVHandler}>DownloadMeHere</button> */}
              <CsvDownloader 
                className="downloadCSVText"
                filename = {csvFileName}
                extension = ".csv"
                separator=";"
                text="Download CSV file"
                meta= {true}
                title = {csvFileName}
                columns = {csvData[0]}
                datas = {csvData[1]}                
              />
              <h1 className="surveyInfoText">Module Anonymity: {`${moduleAnon ? 'Anonymous' : 'Not Anonymous'}`}</h1>
              <h1 className="surveyInfoText">Opens on: {startDate}</h1>
              <h1 className="surveyInfoText">Closes on: {endDate}</h1>
              <h1 className="surveyInfoText">Total Questions: {headerQuestions.length}</h1>
            </div>
          </div>

          <div className = "tableDiv">
            <table className="table">
              <thead className="">
                <tr key = {surveyInfo?.id}>

                  {(moduleAnon === false) &&
                    <th scope="col" className="tableHeader">ResponseID</th>            
                  }
                  {(moduleAnon === false) &&                    
                    <th scope="col" className="tableHeader">Name</th>
                  }     
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

                        {(filterName === 'None' || response.clientName === filterName) && (moduleAnon === false) && (
                          <>
                            <td className="tableCell tr:hover">
                              {response.respID}
                            </td>  
                            <td className="tableCell tr:hover">
                              {response.clientName}
                            </td>                         
                          </>                      
                          )                   
                        }                   

                        {(filterName === 'None' || response.clientName === filterName) && (
                          <>
                            <td className="tableCell tr:hover">{response.time}</td>
                            {response.list.map((perResponse: any) => {
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
                          })}
                          </>
                          
                        )}
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
