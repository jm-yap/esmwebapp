"use client";
import React, { useState, useEffect } from "react";
import {
  getSurveyModules,
  // countSurveys,
  addSurveyModule,
  deleteSurveyModule
} from "@/actions/surveymodule";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styles from "@/app/surveymodule/styles.module.css";
import Link from "next/link";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CheckBox } from "@mui/icons-material";


export default function SurveyModule() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const builderEmail = session.data?.user?.email;
  const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
  // const [surveyCount, setSurveyCount] = useState<Record<string, number>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (builderEmail) {
        try {
          const modules = await getSurveyModules();
          setSurveyModules(modules);
        } catch (error: any) {
          console.error("Error fetching survey modules:", error.message);
        }
      }
    };

    fetchData();
  }, [session]);

  // useEffect(() => {
  //   const fetchSurveyCounts = async () => {
  //     const counts = await Promise.all(
  //       surveyModules.map(async (surveyModule) => {
  //         const count = await countSurveys(surveyModule.id);
  //         return { id: surveyModule.id, count };
  //       })
  //     );
  
  //     const countMap = counts.reduce((map, { id, count }) => {
  //       map[id] = count;
  //       return map;
  //     }, {});
  
  //     setSurveyCount(countMap);
  //   };
  
  //   fetchSurveyCounts();
  // }, [surveyModules]);
  
  const handleCheckboxChange = (e: any) => {
    setIsAnonymous(e.target.checked);
  };

  const handleAddSurveyModule = async (e: any) => {
    e.preventDefault();
    try {
      const title = e.target.elements.title.value;
      const description = e.target.elements.description.value;

      await addSurveyModule(builderEmail, title, description, 0, isAnonymous);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
    } catch (error: any) {
      console.error("Error adding survey module:", error.message);
    }
    e.target.elements.title.value = "";
  };

  const handleDeleteSurveyModule = async (surveyModuleID: string) => {
    try {
      await deleteSurveyModule(surveyModuleID);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
    } catch (error: any) {
      console.error("Error deleting survey module:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href={`/surveymodule/`}>
          <button>Home</button>
        </Link>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarTitleContainer}>
            <h1 className={styles.sidebarTitle}>Create Survey Module</h1>
          </div>
          
          <div className={styles.sidebarForm}>
            <form className={styles.sidebarFormComp} onSubmit={handleAddSurveyModule}>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Title</label>
                <input type="text" name="title" className={styles.sidebarTextField} />
              </div>

              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Description</label>
                <textarea rows={2}  name="description" className={styles.sidebarTextField} />
              </div>

              <button className={styles.sidebarButton} type="submit">C R E A T E</button>
            </form>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        {surveyModules.map((surveyModule: any) => (
          <div key={surveyModule.id}>
            
              <div className={styles.SurveyContainer}>
                <div className={styles.sidebarRow}>
                  <Link href={`/surveymodule/${surveyModule.id}`}>
                    <button onClick={() =>
                      localStorage.setItem("surveyModule", JSON.stringify(surveyModule))} // export survey module details
                      className={styles.SurveyTitle}>
                        {surveyModule.data.Title}
                    </button>
                  </Link>
                  <button onClick={() => handleDeleteSurveyModule(surveyModule.id)}>
                    <DeleteOutlineIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                  </button>
                </div>
                <h1 className={styles.SurveyDescription}>{surveyModule.data.Description}</h1>
                <h1 className={styles.BuilderInfo}>Prepared by: {surveyModule.data.BuilderID}</h1>
              </div>
            
          </div>
        ))}
      </main>
      
    </div>
  );
}