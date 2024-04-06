"use client";
import SurveyCard from "@/app/components/surveys";
import { getSurveys, deleteSurvey, addSurvey } from "@/actions/survey";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SurveyCardProps } from "@/app/components/surveys";
import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { clear } from "console";

interface SurveyPageProps {
  params: {
    accessKey: string;
  };
}


export default function QuestionsPage({ params }: SurveyPageProps) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [SurveyList, setSurveyList] = useState([]);

  // Adding
  const handleAddSurvey = async (e: any) => {
    e.preventDefault();
    try {
      const survey_details = {
        AccessCode : params.accessKey,
        BuilderID : session.data.user?.email,
        Title : e.target.elements.Title.value,
        Description : e.target.elements.Description.value,
        StartDate : new Date(e.target.elements.StartDate.value),
        EndDate : new Date(e.target.elements.EndDate.value),
        Sessions : e.target.elements.Sessions.value,
        Interval : e.target.elements.Interval.value,
        TotalQuestions : 0
      };

      await addSurvey({survey: survey_details});
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);

      const surveyModuleRef = doc(db, "ResearchModules", params.accessKey);
      await updateDoc(surveyModuleRef, {
        TotalSurveys: increment(1),
      });
    } catch (error) {
      console.error("Error adding  survey:", error);
    }
    // clear text fields
    e.target.elements.Title.value = "";
    e.target.elements.Description.value = "";
    e.target.elements.StartDate.value = "";
    e.target.elements.EndDate.value = "";
    e.target.elements.Sessions.value = "";
    e.target.elements.Interval.value = "";
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      getSurveys(params.accessKey).then((surveys: any) => {
        setSurveyList(surveys);
      });
    };
    fetchData();
    localStorage.removeItem("survey");
  }, []);

  // Deletion
  const handleDeleteSurvey = async (SurveyID: string) => {
    try {
      await deleteSurvey(params.accessKey, SurveyID);
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
    } catch (error: any) {
      console.error("Error deleting survey question:", error.message);
    }
  };



  // get the survey modules from local storage
  const surveyModuleStr = localStorage.getItem("surveyModule");
  // parse it
  const surveyModule = JSON.parse(surveyModuleStr);

  const firstName = sessionStorage.getItem("firstName");
  const lastName = sessionStorage.getItem("lastName");

  // Rendering
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href="/surveymodule" className={styles.navtext}>
          <h1 className={styles.navblack}>Sagot</h1>
          <h1 className={styles.navwhite}>Kita</h1>
          <h1 className={styles.navblack}>.</h1>
        </Link>
        <Link href="/builderprofile" className={styles.navprofilecontainer}>
          <h1 className={styles.navinfotext}>{firstName} {lastName}</h1>
          <AccountCircleIcon fontSize="large" />
        </Link>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarTitle}>
            <h1 className={styles.SurveyModuleTitle}>Create Survey</h1>
          </div>
          <div className={styles.sidebarForm}>
            <form className={styles.sidebarFormComp} onSubmit={handleAddSurvey}>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Title</label>
                <input type="text" required name="Title" className={styles.sidebarTextField} />
              </div>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Description</label>
                <textarea required rows={2}  name="Description" className={styles.sidebarTextField} />
              </div>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Required No. of Sessions</label>
                <input type="number" required min="1" name="Sessions" className={styles.sidebarTextField} />
              </div>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Minimum Interval (in hours)</label>
                <input type="number" required min="0" step="0.5" name="Interval" className={styles.sidebarTextField} />
              </div>
              <div className={styles.sidebarRow}>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Opens on</label>
                  <input type="datetime-local" required name="StartDate" className={styles.sidebarDateField}/>
                </div>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Closes on</label>
                  <input type="datetime-local" required name="EndDate" className={styles.sidebarDateField}/>
                </div>
              </div>
              <button className={styles.sidebarButton} type="submit">C R E A T E</button>
            </form>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.mainRow}>
          <Link href={`/surveymodule/`}>
            <ArrowBackIcon sx={{ fontSize: 40 }}/>
          </Link>
          <h1 className={styles.SurveyModuleTitle}>{surveyModule.data.Title}</h1>
        </div>
        <h2 className={styles.SurveyModuleDescription}>{surveyModule.data.Description}</h2>
        <h3 className={styles.SurveyModuleAccessCode}>Access Code: {surveyModule.id}</h3>
        {SurveyList.map((survey: any) => (
          <div key={survey.id}>
            <div className={styles.SurveyContainer}>
              <div className={styles.cardRow}>
                <Link href={`/surveymodule/${params.accessKey}/${survey.id}/questions`}>
                  <button className={styles.SurveyTitle} onClick={() => localStorage.setItem("survey", JSON.stringify(survey))}>
                    {survey.data.Title}
                  </button>
                </Link>
                <div className={styles.cardRow}>
                <Link href={`/surveymodule/${params.accessKey}/${survey.id}/responses`}>
                  <ListAltOutlinedIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                </Link>
                <button onClick={() => handleDeleteSurvey(survey.id)}>
                  <DeleteOutlineIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                </button>
                </div>
              </div>
              <h1 className={styles.SurveyDescription}>{survey.data.Description}</h1>
              <h1 className={styles.BuilderInfo}>Prepared by: {survey.data.BuilderID}</h1>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

