"use client";
import React, { useState, useEffect } from "react";
import {
  getSurveyModules,
  // countSurveys,
  addSurveyModule,
  deleteSurveyModule,
  editSurveyModule,
} from "@/actions/surveymodule";
import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import styles from "@/app/surveymodule/styles.module.css";
import Link from "next/link";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getClientAccountByEmail } from "@/actions/clients";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { sign } from "crypto";
import { red } from "@mui/material/colors";
import Tooltip from '@mui/material/Tooltip';
import { set } from "firebase/database";
import EditIcon from '@mui/icons-material/Edit';


export default function SurveyModule() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [withInfo, setWithInfo] = useState(false);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Unauthenticated, redirecting to login")
      localStorage.removeItem("userEmail");
      redirect("/login");
    },
  });

  useEffect(() => {
    const fetchMasterKey = async () => {
      try {
        const isMasterKeyPresent = sessionStorage.getItem("masterKey");
        if (isMasterKeyPresent !== "true") {
          console.log("Redirecting to masterkey");
          redirect("/");
        } else {
          setVerified(true);
        }
      } catch (error: any) {
        router.push("/");
      }
    };

    fetchMasterKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [builderEmail, setBuilderEmail] = useState(""); 
  const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
  // const [surveyCount, setSurveyCount] = useState<Record<string, number>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [surveyMod, setSurveyMod] = useState("");
  const [editing, setEditing] = useState(false);

  const handleClick = (e) => {
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const modules = await getSurveyModules();
          setSurveyModules(modules);
          setIsLoading(false);
          setBuilderEmail(email);
          
          const userdata = await getClientAccountByEmail(email);
          if (userdata) {
            sessionStorage.setItem("firstName", userdata.FirstName);
            sessionStorage.setItem("lastName", userdata.LastName);
            sessionStorage.setItem("middleName", userdata.MiddleName);
            sessionStorage.setItem("contactNumber", userdata.ContactNumber);
            setFirstName(userdata.FirstName);
            setLastName(userdata.LastName);
            setWithInfo(true);
          } else {
            console.log("No user data found");  
            router.push("/editaccountinfo");
          }
        } catch (error: any) {
          console.error("Error fetching survey modules:", error.message);
        }
      } else {
        router.push("/login");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSubmit = async (e: any) => {
    if (!editing) {
      handleAddSurveyModule(e);
    }
    else {
      handleEditSurveyModule(e);
      console.log("editing");
    }
  }

  const cancelEditing = () => {
    setEditing(false);
    setSurveyMod("");
    setTitle("");
    setDescription("");
  }

  const handleAddSurveyModule = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const title = e.target.elements.title.value;
      const description = e.target.elements.description.value;

      await addSurveyModule(`${firstName} ${lastName} (${builderEmail})`, title, description, 0, isAnonymous);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error adding survey module:", error.message);
    }
    e.target.elements.title.value = "";
    e.target.elements.description.value = "";
  };

  const handleEditSurveyModule = async (e:any) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      // const title = e.target.elements.title.value;
      // const description = e.target.elements.description.value;
      // const isAnonymous = e.target.elements.isAnonymous.checked;
      // update document here
      await editSurveyModule(surveyMod, title, description, isAnonymous);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
      console.log("Survey module edited");
      setEditing(false);
      setSurveyMod("");
      setTitle("");
      setDescription("");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error editing survey module:", error.message);
    }
  }

  const handleEditSurveyDetails = async (surveyModule) => {
    setEditing(true);
    setTitle(surveyModule.data.Title);
    setDescription(surveyModule.data.Description);
    setIsAnonymous(surveyModule.data.IsAnonymous);

    setSurveyMod(surveyModule.id);
  }

  const handleDeleteSurveyModule = async (surveyModuleID: string) => {
    try {
      setIsLoading(true);
      await deleteSurveyModule(surveyModuleID);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error deleting survey module:", error.message);
    }
  };

  return (
    <div>
      {(!verified || !withInfo) ?
        <div className={styles.loadingContainer}> 
          <Stack sx={{ color: '#E07961' }} spacing={2} direction="row">
            <CircularProgress color="inherit" size={50}/>
          </Stack>
        </div>:
        <div className={styles.container}>
          {/* <div> */}
            <div className={styles.navbar}>
              <Link href="/surveymodule" className={styles.navtext} onClick={handleClick}>
                <h1 className={styles.navblack}>Sagot</h1>
                <h1 className={styles.navwhite}>Kita</h1>
                <h1 className={styles.navblack}>.</h1>
              </Link>
              <Link href="/builderprofile" className={styles.navprofilecontainer} onClick={handleClick}>
                <h1 className={styles.navinfotext}>{firstName} {lastName}</h1>
                <AccountCircleIcon fontSize="large" />
              </Link>
            </div>
            {/* {isLoading &&
              <div className={styles.loading}>
                <Stack sx={{ width: '100%', color: '#cf6851' }} spacing={2}>
                  <LinearProgress color="inherit"  sx={{ width: '100%', height: '7px' }}/> 
                </Stack>
              </div>
            } */}
          {/* </div> */}

          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarTitleContainer}>
                {(editing) ? <h1 className={styles.sidebarTitle}>Edit Survey <br /> Module</h1> :
                <h1 className={styles.sidebarTitle}>Create Survey Module</h1>}
              </div>
              
              <div className={styles.sidebarForm}>
                <form className={styles.sidebarFormComp} onSubmit={handleSubmit}>
                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} name="title" className={styles.sidebarTextField} required/>
                  </div>

                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Description</label>
                    <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}  name="description" className={styles.sidebarTextField} required/>
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
                  
                  {editing ? 
                    <div>
                    <button className={styles.sidebarButton} type="submit">E D I T</button> 
                    <button onClick={cancelEditing} style={{color: '#E07961', marginTop: 10}}>C A N C E L</button>
                    </div>
                    :
                    <button className={styles.sidebarButton} type="submit">C R E A T E</button>
                  }
                </form>
              </div>
            </div>
          </div>
          
          <main className={styles.main}>
            <div style={{position: 'fixed', width: '100%'}}>
              {isLoading && (
                <div style={{ marginTop: '-20px', marginLeft: '-20px' }}>
                  <Stack sx={{ width: '100%', color: '#cf6851' }} spacing={2}>
                    <LinearProgress color="inherit" sx={{ width: '100%', height: '7px' }} />
                  </Stack>
                </div>
              )}
            </div>
            {surveyModules.length === 0 && !isLoading &&
              <div className={styles.empty}>
                <AutoAwesomeIcon sx={{ fontSize: 100, color: '#ddd' }} style={{marginBottom: '20px'}}/>
                <h1>No modules yet. Create one on the left!</h1>
              </div>
            }
            {verified && surveyModules.map((surveyModule: any) => (
              <div key={surveyModule.id}>
                
                  <div className={styles.SurveyContainer}>
                    <div className={styles.sidebarRow}>
                      <Link href={`/surveymodule/${surveyModule.id}`} onClick={handleClick}>
                        <button onClick={() =>
                          localStorage.setItem("surveyModule", JSON.stringify(surveyModule))} // export survey module details
                          className={styles.SurveyTitle}>
                            {surveyModule.data.Title}
                        </button>
                      </Link>
                      <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                        <Tooltip title="Edit" arrow placement="top">
                          <button onClick={() => handleEditSurveyDetails(surveyModule)}>
                            <EditIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete" arrow placement="top">
                          <button onClick={() => handleDeleteSurveyModule(surveyModule.id)}>
                            <DeleteOutlineIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                    <h1 className={styles.SurveyDescription}>{surveyModule.data.Description}</h1>
                    <h1 className={styles.BuilderInfo}>Prepared by: {surveyModule.data.BuilderID}</h1>
                  </div>
                
              </div>
            ))}
          </main>
          {/* } */}
          
        </div>
      }
    </div>
  );
}