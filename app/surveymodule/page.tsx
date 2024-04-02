"use client";
import React, { useState, useEffect } from "react";
import {
  getSurveyModules,
  addSurveyModule,
  deleteSurveyModule
} from "@/actions/surveymodule";
import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import styles from "@/app/surveymodule/styles.module.css";
import Link from "next/link";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getClientAccountByEmail } from "@/actions/clients";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function SurveyModule() {
  try {
    const isMasterKeyPresent = sessionStorage.getItem("masterKey");
    if (isMasterKeyPresent !== "true") {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const router = useRouter();

  const [builderEmail, setBuilderEmail] = useState(""); 
  const [surveyModules, setSurveyModules] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const builderEmail = sessionStorage.getItem("userEmail");
      if (builderEmail) {
        try {
          const modules = await getSurveyModules();
          setSurveyModules(modules);
          const userdata = await getClientAccountByEmail(builderEmail);
          if (userdata) {
            sessionStorage.setItem("firstName", userdata.FirstName);
            sessionStorage.setItem("lastName", userdata.LastName);
            sessionStorage.setItem("middleName", userdata.MiddleName);
            sessionStorage.setItem("contactNumber", userdata.ContactNumber);
            setFirstName(userdata.FirstName);
            setLastName(userdata.LastName);
          } else {
            router.push("/editaccountinfo");
          }
        } catch (error: any) {
          console.error("Error fetching survey modules:", error.message);
        }
      } else {
        signOut();
      }
    };

    fetchData();
  }, [session]);
  
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
          <div className={styles.sidebarTitleContainer}>
            <h1 className={styles.sidebarTitle}>Create Survey Module</h1>
          </div>
          
          <div className={styles.sidebarForm}>
            <form className={styles.sidebarFormComp} onSubmit={handleAddSurveyModule}>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Title</label>
                <input type="text" name="title" className={styles.sidebarTextField} required/>
              </div>

              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Description</label>
                <textarea rows={2}  name="description" className={styles.sidebarTextField} required/>
              </div>

              <div className={styles.sidebarFormBit}>
                <FormControlLabel 
                  control={<Checkbox
                      onChange={handleCheckboxChange} 
                      sx={{'&.Mui-checked': {color: '#E07961'}}}
                    />}
                  label="Are Clients Anonymous"
                />
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