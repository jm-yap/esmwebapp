"use client";

import React, { useState, useEffect } from "react";
import { getResponses, getSurveyDetails, getModuleAnon, } from "@/actions/surveyresponse";
import { getQuestions } from "@/actions/surveyquestion";
import './response.css';
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from "next-auth/react";
import CsvDownloader from 'react-csv-downloader';
import { LinearProgress, Stack } from "@mui/material";

import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import { set } from "firebase/database";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


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
  const [isLoading, setIsLoading] = useState(true);

  // Fetching: Fetch the responses once the questions have been fetched

  const { data: session } = useSession();

  const handleClick = (e) => {
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchData = () => {
      getSurveyDetails(params.surveyID).then((info: any) => {
        setIsLoading(true);
        setSurveyInfo(info);
        getModuleAnon(params.accessKey).then((moduleAnonInfo)=>{
          setModuleAnon(moduleAnonInfo.anon)
        })
      
      });
      getQuestions(params.accessKey, params.surveyID).then((questions: any) => {
        setHeaderQuestions(questions);
        getResponses(params.accessKey, params.surveyID, questions).then((responses: any) => {
          setResponses(responses); 
          setIsLoading(false);
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

  type clientNameType = string | null
  let clientNames: clientNameType[] = responses.map((responseObj) => {return responseObj.clientName})
  const noDuplicates = (arr: clientNameType[]): clientNameType[] => {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}
  clientNames = noDuplicates(clientNames).sort()


  const handleNameFilter = (e) => {
    setFilterName(e.target.value)
  }

  const downloadCSVHandler = () => {

    let questionIDToText: object[] = [];
    let questionIDToResponseInst: object[] = [];

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

    responses.forEach((responseObj, responseIdx) => {
      if (filterName === 'None' || responseObj.clientName === filterName) {
        let perRow = {};
        if (moduleAnon === false) perRow["Name"] =  responseObj.clientName
      
        perRow["Timestamp"] = responseObj.time;

        responseObj.list.forEach((value: any)=>{
 
          if (Array.isArray(value.Response)) {
            if (!value.Response.length) {
              // empty array
              perRow[value.QuestionID] = ""
            } else {
              perRow[value.QuestionID] = `"${value.Response.join(", ").replace(/,,,,,/g, "")}"`;
            }
          } else {
            perRow[value.QuestionID] = value.Response ? `"${value.Response.replace(/,,,,,/g, "")}"` : "";
          }

        })
        questionIDToResponseInst.push(perRow);
      }      
    })
    return [questionIDToText, questionIDToResponseInst];
        
  }  
  let csvData: any = downloadCSVHandler()
  let csvFileName: string = `${surveyInfo?.Title} Response Data`

  return(
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
          <div style={{position: 'fixed', width: '100%'}}>
            {isLoading && (
              <div>
                <Stack sx={{ width: '100%', color: '#cf6851' }} spacing={2}>
                  <LinearProgress color="inherit" sx={{ width: '100%', height: '7px' }} />
                </Stack>
              </div>
            )}
          </div>
          <div className="surveyInformation">
            <div className="surveyInfoLeft">
              {/* left */}
              <div className="surveyTitleBack">
                <Link href={`/surveymodule/${params.accessKey}`} onClick={handleClick}>
                  <ArrowBackIcon sx={{ fontSize: 60 }}/>
                </Link> 
                <h1 className="surveyTitle">{surveyInfo?.Title}</h1>
              </div>
              <div className="surveyInfoLeftBottom">
                <h1>
                <span className="surveyDescHeader">Survey Description</span></h1>
                <h1 className="surveyDesc"> {surveyInfo?.Description}</h1>
                <h1><span className="surveyDescHeader">Required No. of Sessions</span>
                <span className="roundedRec">{surveyInfo?.Sessions}</span></h1>
                <h1 style={{marginBottom: '2%'}}><span className="surveyDescHeader">Minimum Interval (in hours)</span>
                <span className="roundedRec">{surveyInfo?.Interval}</span> </h1>
                {((responses.length !== 0) && (moduleAnon === false)) &&
                    <select 
                    className={styles.sidebarTextField}
                    value = {filterName}                
                    onChange = {handleNameFilter}>
                    <option value='None'>Filter by Name</option>
                    {clientNames.map((data)=>{return <option key={data} value={data}>{data}</option>})}
                  </select>           
                }
              </div>
              
            </div>

            <div className="surveyInfoRight">
              {/* right */}
              {(responses.length !== 0) && 
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
                  // wrapColumnChar = '""'            
                />              
              }
              <h1><span className="surveyDescHeader">Module Anonymity: </span>
              <span className="roundedRec">{`${moduleAnon ? 'Anonymous' : 'Not Anonymous'}`}</span></h1>
              <h1><span className="surveyDescHeader">Opens on: </span>
              <span className="roundedRec">{startDate}</span></h1>
              <h1><span className="surveyDescHeader">Closes on: </span>
              <span className="roundedRec">{endDate}</span></h1>
              <h1><span className="surveyDescHeader">Total Questions: </span>
              <span className="roundedRec">{headerQuestions.length}</span></h1>
            </div>
          </div>

          {
            (responses.length !== 0) && 
            <div className = "tableDiv">
              <table className="table">
                <thead className="">
                  <tr key = {surveyInfo?.id}>

                    {(moduleAnon === false) &&
                      <th scope="col" className="tableHeader">ResponseID</th>            
                    }
                    {(moduleAnon === false) &&                    
                      <th scope="col" className="tableHeader">Name of Participant</th>
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
                                      Array.isArray(perResponse?.Response) && perResponse?.Response.map((option: any, perResponseIdx: number) => {

                                        if (perResponseIdx === perResponse.Response.length - 1) {
                                          return (
                                            `${option} `
                                          )
                                        } else {
                                          return (
                                            `${option}, `
                                          )
                                        }
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
          }
    
       
          {
            (responses.length === 0) && (isLoading === false) &&
            <div className="empty" style={{marginTop: '100px'}}>
              <AutoAwesomeIcon sx={{ fontSize: 100, color: '#ddd' }} style={{marginBottom: '20px'}}/>
              <h2>
                No responses for this survey yet!
              </h2>
            </div>    
          }
        </main>
      </div>
  )
}
