"use client";

import React, { useState, useEffect } from "react";
import { getAllResponseSummary } from "@/actions/surveyresponsesummary";
import {getSurveyDetails, getModuleAnon, } from "@/actions/surveyresponse";
import '../response.css';
import './responsesum.css'
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LinearProgress, Stack } from "@mui/material";
import { PieChart, ResponsiveChartContainer, PiePlot, ChartsLegend,pieArcLabelClasses, axisClasses, BarChart  } from "@mui/x-charts";
interface ResponseSumPageProps {
    params: {
      accessKey: string;
      surveyID: string;
    };
  }

export default function ResponseSummaryPage({ params }:ResponseSumPageProps){
    const [isLoading, setIsLoading] = useState(true);
    const [summaryArray, setSummaryArray] = useState([]);
    const [surveyDetails, setSurveyDetails] = useState(null);
    const [moduleAnon, setModuleAnon] = useState(null);
    const handleClick = (e) => {
        setIsLoading(true);
    };

    useEffect(() => {
        const fetchData = () => {
            getAllResponseSummary(params.accessKey, params.surveyID).then((allResponses: any) => {
                setSummaryArray(allResponses);
                getSurveyDetails(params.surveyID).then((info: any) => {            
                    setSurveyDetails(info);                    
                    getModuleAnon(params.accessKey).then((moduleAnonInfo)=>{
                        setModuleAnon(moduleAnonInfo.anon)
                        setIsLoading(false);
                      })
                });
            });        
        };

        fetchData();
    }, [])

    let clientDataSet = [];
    let summaryCopy = [...summaryArray];
   
    let abc = parseInt(surveyDetails?.Sessions) + 1 
    for (let i = 0; i < abc; i++) {
        let obj = {
            category: i,
            count: 0,
        }
        clientDataSet.push(obj)  
    }

    for (let point of clientDataSet) {
        for (let userSummary of [...summaryCopy]) {
            if (point.category === userSummary.numberOfSessions) {
                point['count'] += 1
                let indexDeleted = summaryCopy.indexOf(userSummary)
                summaryCopy.splice(indexDeleted , 1)                    
            }                
        }
    }
    
    const chartSetting = {
        yAxis: [
          {
            label: 'Number of Clients',
          },
        ],
        width: 900,
        height: 500,
        sx: {
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-5px, 0)',
          },
        },
      };

    const valueFormatter = (value: number | null) => value == 1 ? `${value} client` : `${value} clients`;
    
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
                    <div className="otherStatsMainInfo">                                     
                        <div style={{margin: 10}}>
                            <h1><span className="responseSumDescHeader">Number of Participants: </span>
                            <span className="responseSumRoundedRec">{summaryArray.length}</span></h1>  
                        </div>                         
                        <div style={{margin: 10}}>
                            <h1><span className="responseSumDescHeader">Total Sessions: </span>
                            <span className="responseSumRoundedRec">{surveyDetails?.Sessions}</span></h1>   
                        </div>                          
                    </div>
                    <div className="barChartDiv">              
                        <h1><span className="responseSumDescHeader">Number of Clients per Sessions Answered So Far </span></h1>                         
                        <div style={{
                                    display: 'flex',
                                    flexDirection: 'row', 
                                    // justifyContent: 'flex-start',
                                    }}>
                            {/* <div className="rotatedText">This text is rotated 90 degrees.</div> */}
                            <BarChart
                                dataset={clientDataSet}
                                xAxis={[{ scaleType: 'band', dataKey: 'category',  label: 'Current Total Sessions Finished', }]}
                                series={[
                                    { dataKey: 'count', label: 'Client Count', valueFormatter, color: '#E07961' },
                                ]}
                                {...chartSetting}
                                margin={{left: 50, }}
                            />
                        </div>
                       
                    </div>
                </div>
                { (moduleAnon === false) && 
                    <div className = 'clientSummaryMain'>
                        {summaryArray?.map((summary: any) => {
                            return (
                                <div key={summary?.userEmail} className="summaryCard">                             
                                    <div>
                                        <h1 className="summaryCardName">{summary.name}</h1>
                                    </div>
                                    <div className="">
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
                                            <h1><span className="responseSumDescHeader">First Response: </span>
                                            <span className="responseSumRoundedRec">{summary.firstResponse}</span></h1>
                                        </div>
                                        <div className="timeResponseChild">
                                            <h1><span className="responseSumDescHeader">Latest Response: </span>
                                            <span className="responseSumRoundedRec">{summary.lastResponse}</span></h1>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </main>
        </div>
    )
}

