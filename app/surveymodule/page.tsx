"use client";

// MUI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

// MUI Components
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  LinearProgress,
  Stack,
  Tooltip,
} from "@mui/material";

// Firebase imports
import { sendEmailVerification } from "firebase/auth";

// React and Next.js imports
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";

// Local components and styles
import { getClientAccountByEmail } from "@/actions/clients";
import {
  getSurveyModules,
  addSurveyModule,
  deleteSurveyModule,
  editSurveyModule,
  getBuilders,
} from "@/actions/surveymodule";
import styles from "@/app/surveymodule/styles.module.css";
import { auth } from "../../firebase";

export default function SurveyModule() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [withInfo, setWithInfo] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [userNow, setUser] = useState(null);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      // console.log("Unauthenticated, redirecting to login")
      sessionStorage.removeItem("userEmail");
      redirect("/login");
    },
  });

  useEffect(() => {
    const fetchMasterKey = async () => {
      try {
        const isMasterKeyPresent = sessionStorage.getItem("masterKey");
        if (isMasterKeyPresent !== "true") {
          // console.log("Redirecting to masterkey");
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

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsVerified(user.emailVerified);
      }
      // else {setIsLoading(false);}
    });
  }, []);

  const [builderEmail, setBuilderEmail] = useState("");
  const [surveyModules, setSurveyModules] = useState(null);
  const [isNull, setIsNull] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [surveyMod, setSurveyMod] = useState("");
  const [editing, setEditing] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  const handleClick = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          setBuilderEmail(email);

          const builders = await getBuilders(email);
          setBuilders(builders);

          const modules = await getSurveyModules(builderEmail);
          setSurveyModules(modules);

          setIsLoading(false);

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

    if (surveyModules === null) fetchData();

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderEmail]);

  const handleCheckboxChange = (e: any) => {
    setIsAnonymous(e.target.checked);
  };

  const handleCollaborators = (e: any, builderID: string) => {
    if (e.target.checked) {
      setCollaborators([...collaborators, builderID]);
    } else {
      setCollaborators(collaborators.filter((id) => id !== builderID));
    }
    console.log(collaborators);
  };

  const handleSubmit = async (e: any) => {
    if (!editing) {
      handleAddSurveyModule(e);
    } else {
      handleEditSurveyModule(e);
      console.log("editing");
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setSurveyMod("");
    setTitle("");
    setDescription("");
    setCollaborators([]);
  };

  const handleAddSurveyModule = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const title = e.target.elements.title.value;
      const description = e.target.elements.description.value;

      await addSurveyModule(builderEmail, title, description, 0, isAnonymous);
      const updatedModules = await getSurveyModules(builderEmail);
      setSurveyModules(updatedModules);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error adding survey module:", error.message);
    }
    setTitle("");
    setDescription("");
  };

  const handleEditSurveyModule = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      // const title = e.target.elements.title.value;
      // const description = e.target.elements.description.value;
      // const isAnonymous = e.target.elements.isAnonymous.checked;
      // update document here
      await editSurveyModule(
        surveyMod,
        title,
        description,
        isAnonymous,
        collaborators,
      );
      const updatedModules = await getSurveyModules(builderEmail);
      setSurveyModules(updatedModules);
      console.log("Survey module edited");
      setEditing(false);
      setSurveyMod("");
      setTitle("");
      setDescription("");
      setIsLoading(false);
      setCollaborators([]);
    } catch (error: any) {
      console.error("Error editing survey module:", error.message);
    }
  };

  const handleEditSurveyDetails = async (surveyModule) => {
    setEditing(true);
    setTitle(surveyModule.data.Title);
    setDescription(surveyModule.data.Description);
    setIsAnonymous(surveyModule.data.IsAnonymous);
    setCollaborators(surveyModule.data.BuilderID);

    setSurveyMod(surveyModule.id);
  };

  const handleDeleteSurveyModule = async (
    surveyModuleID: string,
    surveyModuleTitle,
  ) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the Survey Module "${surveyModuleTitle}"?`,
    );
    if (!userConfirmed) return;
    try {
      setIsLoading(true);
      await deleteSurveyModule(surveyModuleID);
      const updatedModules = await getSurveyModules(builderEmail);
      setSurveyModules(updatedModules);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error deleting survey module:", error.message);
    }
  };

  const reverifyEmail = async () => {
    await auth.currentUser.reload();
    setIsVerified(auth.currentUser.emailVerified);
  };

  return (
    <div>
      {!verified || !withInfo || !isVerified ? (
        <div className={styles.loadingContainer}>
          <Stack sx={{ color: "#E07961" }} spacing={2} direction="row">
            <CircularProgress color="inherit" size={50} />
            {!isVerified ? (
              <div>
                <h1 className={styles.verifytext}>
                  Please verify your email address to continue. Click on the
                  link sent to your email to activate your account.
                </h1>
                <button
                  onClick={() => reverifyEmail()}
                  className={styles.signouttext}
                >
                  Already verified? Reload verification status here
                </button>
                <button
                  onClick={() => signOut()}
                  className={styles.signouttext}
                >
                  Sign Out
                </button>
                <button
                  onClick={async () => {
                    await sendEmailVerification(auth.currentUser);
                  }}
                  className={styles.signouttext}
                >
                  Resend Verification Email
                </button>
              </div>
            ) : null}
          </Stack>
        </div>
      ) : (
        <div className={styles.container}>
          {/* <div> */}
          <div className={styles.navbar}>
            <Link href="/surveymodule" className={styles.navtext}>
              <h1 className={styles.navblack}>Sagot</h1>
              <h1 className={styles.navwhite}>Kita</h1>
              <h1 className={styles.navblack}>.</h1>
            </Link>
            <Link
              href="/builderprofile"
              className={styles.navprofilecontainer}
              onClick={handleClick}
            >
              <h1 className={styles.navinfotext}>
                {firstName} {lastName}
              </h1>
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
                {editing ? (
                  <h1 className={styles.sidebarTitle}>
                    Edit Survey <br /> Module
                  </h1>
                ) : (
                  <h1 className={styles.sidebarTitle}>Create Survey Module</h1>
                )}
              </div>

              <div className={styles.sidebarForm}>
                <form
                  className={styles.sidebarFormComp}
                  onSubmit={handleSubmit}
                >
                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      name="title"
                      className={styles.sidebarTextField}
                      required
                    />
                  </div>

                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      name="description"
                      className={styles.sidebarTextField}
                      required
                    />
                  </div>

                  {editing ? (
                    <div>
                      <div className={styles.sidebarFormBit}>
                        <label className={styles.sidebarLabel}>
                          Add Collaborators
                        </label>
                        {builders.map((builder: any) => (
                          <div
                            key={builder.id}
                            className={styles.sidebarFormBit}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e) =>
                                    handleCollaborators(e, builder.id)
                                  }
                                  checked={collaborators.includes(builder.id)}
                                  sx={{ "&.Mui-checked": { color: "#E07961" } }}
                                />
                              }
                              label={
                                builder.data.FirstName +
                                " " +
                                builder.data.LastName +
                                " (" +
                                builder.id +
                                ")"
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className={styles.sidebarFormBit}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleCheckboxChange}
                              sx={{ "&.Mui-checked": { color: "#E07961" } }}
                            />
                          }
                          label="Are Clients Anonymous"
                        />
                      </div>
                      <button className={styles.sidebarButton} type="submit">
                        E D I T
                      </button>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          onClick={cancelEditing}
                          style={{ color: "#E07961", marginTop: "1em" }}
                        >
                          C A N C E L
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={styles.sidebarFormBit}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleCheckboxChange}
                              sx={{ "&.Mui-checked": { color: "#E07961" } }}
                            />
                          }
                          label="Are Clients Anonymous"
                        />
                      </div>
                      <button className={styles.sidebarButton} type="submit">
                        C R E A T E
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          <main className={styles.main}>
            <div style={{ position: "fixed", width: "100%" }}>
              {isLoading && (
                <div style={{ marginTop: "-20px", marginLeft: "-20px" }}>
                  <Stack sx={{ width: "100%", color: "#cf6851" }} spacing={2}>
                    <LinearProgress
                      color="inherit"
                      sx={{ width: "100%", height: "7px" }}
                    />
                  </Stack>
                </div>
              )}
            </div>
            {surveyModules.length === 0 && !isLoading && (
              <div className={styles.empty}>
                <AutoAwesomeIcon
                  sx={{ fontSize: 100, color: "#ddd" }}
                  style={{ marginBottom: "20px" }}
                />
                <h1>No modules yet. Create one on the left!</h1>
              </div>
            )}
            {verified &&
              surveyModules.map((surveyModule: any) => (
                <div key={surveyModule.id} className={styles.SurveyContainer}>
                  <div className={styles.mainRow}>
                    <Link
                      href={`/surveymodule/${surveyModule.id}`}
                      onClick={handleClick}
                    >
                      <button
                        onClick={() =>
                          localStorage.setItem(
                            "surveyModule",
                            JSON.stringify(surveyModule),
                          )
                        } // export survey module details
                        className={styles.SurveyTitle}
                      >
                        {surveyModule.data.Title}
                      </button>
                    </Link>
                    <div
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      <Tooltip title="Edit" arrow placement="top">
                        <button
                          onClick={() => handleEditSurveyDetails(surveyModule)}
                        >
                          <EditIcon sx={{ fontSize: 30, color: "#E07961" }} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <button
                          onClick={() =>
                            handleDeleteSurveyModule(
                              surveyModule.id,
                              surveyModule.data.Title,
                            )
                          }
                        >
                          <DeleteOutlineIcon
                            sx={{ fontSize: 30, color: "#E07961" }}
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="SurveyDescriptionDiv">
                    <h1 className={styles.SurveyDescription}>
                      {surveyModule.data.Description}
                    </h1>
                  </div>
                  <h1 className={styles.BuilderInfo}>
                    <span style={{ fontWeight: "bold" }}>Prepared by:</span>{" "}
                    {surveyModule.data.BuilderID.map(
                      (id: string, index: number) => {
                        if (id === builderEmail) {
                          return surveyModule.data.BuilderID.length === 1
                            ? `${firstName} ${lastName}`
                            : `${firstName} ${lastName}, `;
                        } else {
                          const builder = builders.find(
                            (builder) => builder.id === id,
                          );
                          return index + 1 ===
                            surveyModule.data.BuilderID.length
                            ? `${builder.data.FirstName} ${builder.data.LastName}`
                            : `${builder.data.FirstName} ${builder.data.LastName}, `;
                        }
                      },
                    )}
                  </h1>
                </div>
              ))}
          </main>
        </div>
      )}
    </div>
  );
}
