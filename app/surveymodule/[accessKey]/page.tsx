"use client";
import SurveyCard from "@/app/components/surveys";
import { getSurveys, deleteSurvey, addSurvey } from "@/actions/survey";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { SurveyCardProps } from "@/app/components/surveys";
import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { clear } from "console";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { set } from "firebase/database";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Tooltip from "@mui/material/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface SurveyPageProps {
  params: {
    accessKey: string;
  };
}

export default function QuestionsPage({ params }: SurveyPageProps) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const fetchMasterKey = async () => {
      try {
        const isMasterKeyPresent = sessionStorage.getItem("masterKey");
        if (isMasterKeyPresent !== "true") {
          // console.log("Redirecting to masterkey");
          redirect("/");
        }
      } catch (error: any) {
        router.push("/");
      }
    };

    fetchMasterKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [SurveyList, setSurveyList] = useState([]);
  const [error, SetError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const handleClick = (e) => {
    setIsLoading(true);
  };

  // Adding
  const handleAddSurvey = async (e: any) => {
    setIsSaveDisabled(true);
    e.preventDefault();
    try {
      setIsLoading(true);
      const survey_details = {
        AccessCode: params.accessKey,
        BuilderID: session.data.user?.email,
        Title: e.target.elements.Title.value,
        Description: e.target.elements.Description.value,
        StartDate: new Date(e.target.elements.StartDate.value),
        EndDate: new Date(e.target.elements.EndDate.value),
        Sessions: e.target.elements.Sessions.value,
        Interval: e.target.elements.Interval.value,
        DTStart:
          parseInt(e.target.elements.StartHour.value) +
          (e.target.elements.StartPeriod.value === "PM" ? 12 : 0),
        DTEnd:
          parseInt(e.target.elements.EndHour.value) +
          (e.target.elements.EndPeriod.value === "PM" ? 12 : 0),
        TotalQuestions: 0,
        QuestionOrder: [],
      };

      let viableHours = 0;
      // let currentTime = new Date(survey_details.StartDate);
      // while (currentTime < survey_details.EndDate) {
      //   const currentHour = currentTime.getHours();
      //   console.log("VD Current Hour ", currentHour);
      //   if (currentHour >= survey_details.DTStart && currentHour < survey_details.DTEnd) {
      //     viableHours++;
      //   }
      //   currentTime.setHours(currentTime.getHours() + 1);
      // }
      // console.log("VD Viable Hours ", viableHours);

      const hourGap = 0;

      if (survey_details.StartDate > survey_details.EndDate) {
        SetError("Start Date must be before End Date");
        return;
      } else if (hourGap < 0) {
        SetError("End Date must be at least 9 hours after Start Date");
        return;
      } else if (survey_details.Interval <= 0) {
        SetError("Interval must be greater than 0");
        return;
      } else if (survey_details.Sessions <= 0) {
        SetError("Number of required sessions must be greater than 0");
        return;
      } else if (hourGap / survey_details.Sessions < survey_details.Interval) {
        SetError(
          "Minimum interval must be less than the time gap between sessions"
        );
        return;
      } else if (survey_details.DTStart > 24 || survey_details.DTStart < 0) {
        SetError("Invalid downtime start time");
        return;
      } else if (survey_details.DTEnd > 24 || survey_details.DTEnd < 0) {
        SetError("Invalid downtime end time");
        return;
      }

      console.log("VD Form Data for Survey:", survey_details);

      await addSurvey({ survey: survey_details });
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
      setIsLoading(false);

      const surveyModuleRef = doc(db, "ResearchModules", params.accessKey);
      await updateDoc(surveyModuleRef, {
        TotalSurveys: increment(1),
      });

      SetError(null);
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
    e.target.elements.StartHour.value = 0;
    e.target.elements.EndHour.value = 0;
    e.target.elements.StartPeriod.value = "AM";
    e.target.elements.EndPeriod.value = "AM";
    setIsSaveDisabled(false);
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      getSurveys(params.accessKey).then((surveys: any) => {
        setSurveyList(surveys);
        setIsLoading(false);
      });
    };
    fetchData();
    localStorage.removeItem("survey");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deletion
  const handleDeleteSurvey = async (SurveyID: string, SurveyTitle: string) => {
    const userConfirmed = confirm(
      `Are you sure you want to delete the survey "${SurveyTitle}"?`
    );
    if (!userConfirmed) return;
    try {
      setIsLoading(true);
      await deleteSurvey(params.accessKey, SurveyID);
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
      setIsLoading(false);
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

  const [tooltipContent, setTooltipContent] = useState("Click to copy");

  const handleCopy = () => {
    setTooltipContent("Copied!");
    setTimeout(() => {
      setTooltipContent("Click to copy");
    }, 2000); // Reset tooltip content after 2 seconds
  };

  const handleTimeChange = (e: any) => {
    const inputTime = e.target.value;
    const [hours] = inputTime.split(":");
    if (hours) {
      e.target.value = `${hours}:00`;
    }
  };
  // Rendering
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link
          href="/surveymodule"
          className={styles.navtext}
          onClick={handleClick}
        >
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

      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarTitle}>
            <h1 className={styles.SurveyModuleTitle}>Create Survey</h1>
          </div>
          <div className={styles.sidebarForm}>
            <form className={styles.sidebarFormComp} onSubmit={handleAddSurvey}>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Title</label>
                <input
                  type="text"
                  required
                  name="Title"
                  className={styles.sidebarTextField}
                />
              </div>
              <div className={styles.sidebarFormBit}>
                <label className={styles.sidebarLabel}>Description</label>
                <textarea
                  required
                  rows={2}
                  name="Description"
                  className={styles.sidebarTextField}
                />
              </div>
              <div className={styles.sidebarRow}>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Opens on</label>
                  <input
                    type="datetime-local"
                    required
                    name="StartDate"
                    className={styles.sidebarDateField}
                  />
                </div>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Closes on</label>
                  <input
                    type="datetime-local"
                    required
                    name="EndDate"
                    className={styles.sidebarDateField}
                  />
                </div>
              </div>
              <div className={styles.sidebarFormBit}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label className={styles.sidebarLabel}>
                    Required No. of Sessions
                  </label>
                  <Tooltip
                    title="Number of sessions required to complete the survey"
                    placement="top"
                    arrow
                    slotProps={{ tooltip: { sx: { fontSize: "0.8em" } } }}
                  >
                    <HelpOutlineIcon
                      style={{
                        color: "#E07954",
                        fontSize: "1.3rem",
                        marginLeft: "2%",
                        marginTop: "0.5%",
                      }}
                    />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  name="Sessions"
                  className={styles.sidebarTextField}
                />
              </div>
              <label className={styles.sidebarLabel}>
                Notification Downtime
              </label>
              <Tooltip
                title="Set time when notifications are disabled"
                placement="top"
                arrow
                slotProps={{ tooltip: { sx: { fontSize: "0.8em" } } }}
              >
                <HelpOutlineIcon
                  style={{
                    color: "#E07954",
                    fontSize: "1.3rem",
                    marginLeft: "2%",
                    marginTop: "0.5%",
                  }}
                />
              </Tooltip>
              <div className={`${styles.sidebarRow} pt-[10px]`}>
                <div className={styles.sidebarFormBit}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label className={styles.sidebarLabel}>From</label>
                  </div>
                  <div className="flex justify-between gap-1">
                    <input
                      type="number"
                      required
                      name="StartHour"
                      min="1"
                      max="12"
                      className={styles.sidebarTextField}
                    />
                    <select
                      required
                      name="StartPeriod"
                      className={styles.sidebarTextField}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div className={styles.sidebarFormBit}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label className={styles.sidebarLabel}>To</label>
                  </div>
                  <div className="flex justify-between gap-1">
                    <input
                      type="number"
                      required
                      name="EndHour"
                      min="1"
                      max="12"
                      className={styles.sidebarTextField}
                    />
                    <select
                      required
                      name="EndPeriod"
                      className={styles.sidebarTextField}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.sidebarFormBit}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label className={styles.sidebarLabel}>
                    Minimum Interval (in hours)
                  </label>
                  <Tooltip
                    title="Minimum time gap to answer sessions"
                    placement="top"
                    arrow
                    slotProps={{ tooltip: { sx: { fontSize: "0.8em" } } }}
                  >
                    <HelpOutlineIcon
                      style={{
                        color: "#E07954",
                        fontSize: "1.3rem",
                        marginLeft: "2%",
                        marginTop: "0.5%",
                      }}
                    />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  name="Interval"
                  className={styles.sidebarTextField}
                />
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button
                className={styles.sidebarButton}
                type="submit"
                disabled={isSaveDisabled}
              >
                C R E A T E
              </button>
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
        <div className={styles.mainRow}>
          <Link href={`/surveymodule/`} onClick={handleClick}>
            <ArrowBackIcon sx={{ fontSize: 40 }} />
          </Link>
          <h1 className={styles.SurveyModuleTitle}>
            {surveyModule.data.Title}
          </h1>
        </div>
        <h2 className={styles.SurveyModuleDescription}>
          {surveyModule.data.Description}
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            gap: "10px",
          }}
        >
          <h3 className={styles.SurveyModuleAccessCode}>
            Access Code: {surveyModule.id}
          </h3>
          <CopyToClipboard text={surveyModule.id} onCopy={handleCopy}>
            <Tooltip title={tooltipContent} arrow placement="top">
              <div style={{ cursor: "pointer" }}>
                <ContentCopyIcon sx={{ fontSize: 30, color: "#E07961" }} />
              </div>
            </Tooltip>
          </CopyToClipboard>
        </div>

        {SurveyList.length === 0 && !isLoading && (
          <div className={styles.empty}>
            <AutoAwesomeIcon
              sx={{ fontSize: 100, color: "#ddd" }}
              style={{ marginBottom: "20px" }}
            />
            <h1>No surveys here, try making one :D</h1>
          </div>
        )}
        {SurveyList.map((survey: any) => (
          <div key={survey.id}>
            <div className={styles.SurveyContainer}>
              <div className={styles.cardRow}>
                <Link
                  href={`/surveymodule/${params.accessKey}/${survey.id}/questions`}
                  onClick={handleClick}
                >
                  <button
                    className={styles.SurveyTitle}
                    onClick={() =>
                      localStorage.setItem("survey", JSON.stringify(survey))
                    }
                  >
                    {survey.data.Title}
                  </button>
                </Link>
                <div className={styles.cardRow}>
                  <Tooltip title="Responses" arrow placement="top">
                    <Link
                      href={`/surveymodule/${params.accessKey}/${survey.id}/responses`}
                      onClick={handleClick}
                    >
                      <ListAltOutlinedIcon
                        sx={{ fontSize: 30, color: "#E07961" }}
                      />
                    </Link>
                  </Tooltip>

                  <Tooltip title="Delete" arrow placement="top">
                    <button
                      onClick={() =>
                        handleDeleteSurvey(survey.id, survey.data.Title)
                      }
                    >
                      <DeleteOutlineIcon
                        sx={{ fontSize: 30, color: "#E07961" }}
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <h1 className={styles.SurveyDescription}>
                {survey.data.Description}
              </h1>
              <h1 className={styles.BuilderInfo}>
                Prepared by: {survey.data.BuilderID}
              </h1>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
