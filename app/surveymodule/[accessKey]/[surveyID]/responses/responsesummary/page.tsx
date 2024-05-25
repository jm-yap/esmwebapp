"use client";

import React, { useState, useEffect } from "react";
import { getAllResponseSummary } from "@/actions/surveyresponsesummary";
import { getResponses, getSurveyDetails, getModuleAnon, } from "@/actions/surveyresponse";
import '../response.css';
import './responsesum.css'
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from "next-auth/react";
import { LinearProgress, Stack } from "@mui/material";
import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import { Padding } from "@mui/icons-material";
import { PieChart, ResponsiveChartContainer, useDrawingArea, PiePlot, ChartsLegend,pieArcLabelClasses  } from "@mui/x-charts";
interface ResponseSumPageProps {
    params: {
      accessKey: string;
      surveyID: string;
    };
  }
// This page must not be accessible if the responses page has 0 responses.
// This page must display a summary of the responses to the survey.
// The page must 
export default function ResponseSummaryPage({ params }:ResponseSumPageProps){
    const [isLoading, setIsLoading] = useState(true);
    const [summaryArray, setSummaryArray] = useState([]);
    const [surveyDetails, setSurveyDetails] = useState(null);
    const handleClick = (e) => {
        setIsLoading(true);
    };

    useEffect(() => {
        const fetchData = () => {
            getAllResponseSummary(params.accessKey, params.surveyID).then((allResponses: any) => {
                setSummaryArray(allResponses);
                console.log('bleak', summaryArray)
                getSurveyDetails(params.surveyID).then((info: any) => {            
                    setSurveyDetails(info);
                    setIsLoading(false);
                });
            });
            

        };

        fetchData();
    }, [])

    return (
        <div className="pageProperty"> 
            <main className="responseSumMain">       
                <div className = "banner">                    
                    <Link href={`/surveymodule/`}>
                        <div className = "bannerTitle">
                        <h1 className="bannerTitleChild">Sagot</h1>
                        <h1 className="bannerTitleChild bannerKita">Kita</h1>
                        <h1 className="bannerTitleChild">.</h1>
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
                <div className="aboveSummaryMain">
                    <Link href={`/surveymodule/${params.accessKey}/${params.surveyID}/responses`} onClick={handleClick}>
                        <ArrowBackIcon sx={{ fontSize: 60 }}/>
                    </Link>
                </div>
                <div className="otherStatsMain">

                </div>
                <div className = 'clientSummaryMain'>
                    {summaryArray?.map((summary: any) => {
                        return (
                            <div key={summary?.userEmail} className="summaryCard">                             
                                <div>
                                    <h1 className="summaryCardName">{summary.name}</h1>
                                </div>
                                <div style={{}}>
                                    <PieChart
                                        series={[
                                            {                       
                                            data: [
                                                { id: 0, value: summary?.numberOfSessions,  color: '#E07961', label: 'Sessions Finished'},
                                                { id: 1, value: surveyDetails?.Sessions - summary?.numberOfSessions, color: 'gray', label: 'Sessions Left' },                                         
                                            ],
                                            innerRadius:40,
                                            arcLabelMinAngle: 15, // baka pwede pa baguhin
                                            arcLabel: (item) => `${item.value}`,
                                            },
                                        ]}
                                        sx={{
                                            [`& .${pieArcLabelClasses.root}`]: {
                                              fill: 'white',
                                              fontWeight: 'bold',
                                              fontSize: 25,
                                            },
                                          }}
                                        width={336}
                                        height={160}
                                        slotProps={{
                                            legend: {
                                            direction: 'column',
                                            position: { vertical: 'middle', horizontal: 'right' },                                           
                                            },                                            
                                        }}                              
                                        margin={{left: -90, top: 20, bottom: 0}}
                                    />
                                    {/* <ResponsiveChartContainer
                                        series={[
                                            {data: [
                                                { id: 0, value: summary.numberOfSessions,  color: '#E07961', label: 'Sessions Finished'},
                                                { id: 1, value: surveyDetails?.Sessions - summary.numberOfSessions, color: 'gray', label: 'Sessions Left' },                                         
                                            ], type: 'pie', innerRadius:0}
                                        ]}                                  
                                        width = {420}
                                        height={200}
                                        margin = {{left: -155, top: 20, bottom: 0}}                                   
                                    >
                                        <PiePlot/>     
                                              
                                        <ChartsLegend                                           
                                            direction = {'column'}
                                            position = {{vertical: 'middle', horizontal: 'right'}}
                                        /> 
                                    </ResponsiveChartContainer> */}
                                </div>
                                
                                <div className="timeResponseParent">                            
                                    <div className="timeResponseChild">                     
                                        <h1><span className="surveyDescHeader">First Response: </span>
                                         <span className="roundedRec">{summary.firstResponse}</span></h1>
                                    </div>
                                    <div className="timeResponseChild">
                                        {/* <text>Latest Response: {summary.lastResponse}</text> */}
                                        <h1><span className="surveyDescHeader">Latest Response: </span>
                                         <span className="roundedRec">{summary.lastResponse}</span></h1>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </main>
        </div>
    )
}

