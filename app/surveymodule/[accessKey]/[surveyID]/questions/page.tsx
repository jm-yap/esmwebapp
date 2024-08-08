"use client";

// MUI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

// MUI Core
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  addDoc,
  collection,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getQuestions,
  deleteQuestion,
  editQuestion,
} from "@/actions/surveyquestion";
import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import { db } from "@/firebase";

interface QuestionPageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}

export default function QuestionsPage({ params }: QuestionPageProps) {
  const [QuestionsList, setQuestionsList] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("1");
  const [editing, setEditing] = useState(false);

  const handleClick = (e) => {
    setIsLoading(true);
  };

  useEffect(() => {
    const surveyStr = localStorage.getItem("survey");
    const parsedSurvey = surveyStr ? JSON.parse(surveyStr) : null;
    setSurvey(parsedSurvey);
    // if (survey) setQuestionOrder(survey.data.QuestionOrder);
  }, [params.surveyID]);

  const cancelEditing = () => {
    setEditing(false);
    setQuestion(null);
    setQuestionText("");
    setQuestionType("1");
    setFields([]);
  };

  // Adding
  const handleAddQuestion = async (e: any) => {
    if (editing === true) {
      handleEditQuestion(e);
      return;
    }
    const questionRef = collection(db, `SurveyQuestion`);

    e.preventDefault();

    const SurveyID = params.surveyID;
    const QuestionText = e.target.elements.QuestionText.value;
    const QuestionType = e.target.elements.QuestionType.value;

    try {
      let docRef;
      setIsLoading(true);
      // Add a new document with a generated id
      if (QuestionType === "5") {
        const MinValue = parseInt(e.target.elements.MinValue.value);
        const MaxValue = parseInt(e.target.elements.MaxValue.value);
        const Step = parseInt(e.target.elements.Step.value);
        if (MinValue >= MaxValue) {
          setIsLoading(false);
          setError("Minimum value must be less than maximum value");
          return;
        }
        if (Step <= 0) {
          setIsLoading(false);
          setError("Step must be greater than 0");
          return;
        }
        if ((MaxValue - MinValue) % Step !== 0) {
          setIsLoading(false);
          setError("Step must be a divisor of the range");
          return;
        }
        const slider = [MinValue, MaxValue, Step];
        docRef = await addDoc(questionRef, {
          SurveyID: SurveyID,
          QuestionText: QuestionText,
          QuestionType: QuestionType,
          Choices: slider,
        });
        setIsLoading(false);
        // console.log("Question added with ID:", docRef.id);
      } else {
        setIsLoading(true);
        docRef = await addDoc(questionRef, {
          SurveyID: SurveyID,
          QuestionText: QuestionText,
          QuestionType: QuestionType,
          Choices: fields,
        });
        setIsLoading(false);
        // console.log("Question added with ID:", docRef.id);
      }

      // add 1 to total questions of survey
      const surveyRef = doc(db, "/Survey", params.surveyID);
      await updateDoc(surveyRef, {
        TotalQuestions: increment(1),
        // QuestionOrder: arrayUnion(docRef.id),
      });

      await updateDoc(surveyRef, {
        // TotalQuestions: increment(1),
        QuestionOrder: arrayUnion(docRef.id),
      });

      // Update the list of questions
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID,
      );
      setQuestionsList(updatedQuestions);

      // Clear form
      if (questionType == "5") {
        e.target.elements.MinValue.value = "";
        e.target.elements.MaxValue.value = "";
        e.target.elements.Step.value = "";
      }
      if (questionType == "2" || questionType == "3") {
        e.target.elements.NumOptions.value = 0;
        setFields([]);
      }
      setQuestionText("");
      e.target.elements.QuestionText.value = "";
      e.target.elements.QuestionType.value = "1";
      setNumFields(0);
      setQuestionType("1");
    } catch (error) {
      console.error("Error adding  Question:", error);
    }
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      getQuestions(params.accessKey, params.surveyID).then((Questions: any) => {
        setQuestionsList(Questions);
        setIsLoading(false);
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deletion
  const handleDeleteQuestion = async (QuestionID: string) => {
    // const userConfirmed = confirm(`Are you sure you want to delete this question?`);
    // if (!userConfirmed) return;
    try {
      setIsLoading(true);
      await deleteQuestion(params.accessKey, params.surveyID, QuestionID);
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID,
      );
      setQuestionsList(updatedQuestions);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error deleting survey Question:", error.message);
    }
  };

  const handleEditQuestionDetails = async (ques) => {
    setEditing(true);
    setQuestion(ques);
    setQuestionText(ques.data.QuestionText);
    setQuestionType(ques.data.QuestionType);
    setNumFields(ques.data.Choices.length);
    setFields(ques.data.Choices);
  };

  const handleEditQuestion = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      setIsLoading(true);
      // Add a new document with a generated id
      if (questionType === "1" || questionType === "4") {
        await editQuestion(question.id, questionText, questionType, []);
      } else {
        await editQuestion(question.id, questionText, questionType, fields);
      }
      // await editQuestion(question.id, questionText, questionType, fields);
      setIsLoading(false);
      // console.log("Question edited with ID:", docRef.id);

      // Update the list of questions
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID,
      );
      setQuestionsList(updatedQuestions);
      setEditing(false);

      // Clear form
      e.target.elements.QuestionText.value = "";
      e.target.elements.QuestionType.value = "1";
      setNumFields(0);
      setQuestionType("1");
    } catch (error) {
      console.error("Error editing  Question:", error);
    }
  };

  // Question Type

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    if (questionType === "5" || questionType === "4") {
      // setNumFields(3);
      setFields([]);
    }
  };

  const ClearChoices = () => {
    setFields([...fields.fill("")]);
  };

  const [numFields, setNumFields] = useState(0);
  const [fields, setFields] = useState([]);

  const handleNumFieldsChange = (e) => {
    const value = parseInt(e.target.value);
    setNumFields(value);

    if (value > fields.length) {
      setFields([...fields, ...Array(value - fields.length).fill("")]);
    } else if (value < fields.length) {
      setFields(fields.slice(0, value));
    }
  };

  const handleFieldChange = (e, index) => {
    const updatedFields = [...fields];
    updatedFields[index] = e.target.value;
    setFields(updatedFields);
  };

  const generateMarks = (min, max, step) => {
    const marks = [];
    for (let i = min; i <= max; i += step) {
      marks.push({ value: i, label: i.toString() });
    }
    return marks;
  };

  const newStart = new Date(survey?.data.StartDate.seconds * 1000);
  const startDate = newStart.toLocaleString();

  const newEnd = new Date(survey?.data.EndDate.seconds * 1000);
  const endDate = newEnd.toLocaleString();

  const firstName = sessionStorage.getItem("firstName");
  const lastName = sessionStorage.getItem("lastName");

  function valuetext(value: number) {
    return `${value}°C`;
  }

  // Rendering
  return (
    <div className={styles.container}>
      {survey && (
        <>
          {/* Navbar */}
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

          {/* Sidebar - Create Question */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarTitle}>
                <h1 className={styles.SurveyModuleTitle}>Create Question</h1>
              </div>
              <div className={styles.sidebarForm}>
                <form
                  className={styles.sidebarFormComp}
                  onSubmit={handleAddQuestion}
                >
                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Question</label>
                    <textarea
                      rows={2}
                      required
                      name="QuestionText"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className={styles.sidebarTextField}
                    />
                  </div>
                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Type</label>
                    <select
                      name="QuestionType"
                      className={styles.sidebarTextField}
                      value={questionType}
                      onChange={handleQuestionTypeChange}
                      defaultValue={"1"}
                    >
                      <option value="1">Text</option>
                      <option value="2">Multiple Choice</option>
                      <option value="3">Checkbox</option>
                      <option value="4">Date</option>
                      <option value="5">Slider</option>
                    </select>
                  </div>
                  {questionType === "2" || questionType === "3" ? (
                    <div className={styles.sidebarFormBit}>
                      <label className={styles.sidebarLabel}>
                        Number of Choices
                      </label>
                      <input
                        value={numFields}
                        type="number"
                        required
                        onChange={handleNumFieldsChange}
                        min="1"
                        max="20"
                        name="NumOptions"
                        className={styles.sidebarTextField}
                      />
                      <button
                        className={styles.clearButton}
                        onClick={ClearChoices}
                      >
                        Clear Choices
                      </button>
                      {fields.map((field, index) => (
                        <label key={index} className={styles.sidebarLabel}>
                          Option {index + 1}:
                          <input
                            className={styles.sidebarOptionField}
                            type="text"
                            required
                            value={field}
                            onChange={(e) => handleFieldChange(e, index)}
                          />
                        </label>
                      ))}
                    </div>
                  ) : questionType === "5" ? (
                    <div className={styles.sidebarFormBit}>
                      <label className={styles.sidebarLabel}>
                        Minimum Value
                      </label>
                      <input
                        type="number"
                        value={fields[0]}
                        onChange={(e) =>
                          setFields((prevFields) => [
                            e.target.value,
                            ...prevFields.slice(1),
                          ])
                        }
                        required
                        name="MinValue"
                        className={styles.sidebarTextField}
                      />
                      <label className={styles.sidebarLabel}>
                        Maximum Value
                      </label>
                      <input
                        type="number"
                        value={fields[1]}
                        onChange={(e) =>
                          setFields((prevFields) => [
                            prevFields[0],
                            e.target.value,
                            ...prevFields.slice(2),
                          ])
                        }
                        required
                        name="MaxValue"
                        className={styles.sidebarTextField}
                      />
                      <label className={styles.sidebarLabel}>Step</label>
                      <input
                        type="number"
                        value={fields[2]}
                        onChange={(e) =>
                          setFields((prevFields) => [
                            ...prevFields.slice(0, 2),
                            e.target.value,
                          ])
                        }
                        required
                        name="Step"
                        className={styles.sidebarTextField}
                      />
                      <div style={{ marginLeft: 10 }}>
                        {error && (
                          <p style={{ color: "red", fontSize: 15 }}>{error}</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                  {/* {fields.map((field, index) => (
                  <div key={index} className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>
                      Option {index + 1}:
                      <input
                      className={styles.sidebarOptionField}
                      type="text"
                      required
                      value={field}
                      onChange={(e) => handleFieldChange(e, index)}
                      />
                    </label>
                  </div>
                ))} */}

                  {editing ? (
                    <div>
                      <button className={styles.sidebarButton} type="submit">
                        E D I T
                      </button>
                      <button
                        onClick={cancelEditing}
                        style={{ color: "#E07961", marginTop: 10 }}
                      >
                        C A N C E L
                      </button>
                    </div>
                  ) : (
                    <button className={styles.sidebarButton} type="submit">
                      C R E A T E
                    </button>
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
            <div className={styles.mainRow}>
              <Link
                href={`/surveymodule/${params.accessKey}`}
                onClick={handleClick}
              >
                <ArrowBackIcon sx={{ fontSize: 40 }} />
              </Link>
              <h1 className={styles.SurveyModuleTitle}>{survey.data.Title}</h1>
            </div>
            <h2 className={styles.SurveyInfo}>{survey.data.Description}</h2>
            <div className={styles.cardRow}>
              <h2 className={styles.SurveyInfo}>
                Required No. of Sessions: {survey.data.Sessions}
              </h2>
              <h2 className={styles.SurveyInfo}>Opens on: {startDate}</h2>
            </div>
            <div className={styles.cardRow}>
              <h2 className={styles.SurveyInfo}>
                Minimum Interval (in hours): {survey.data.Interval}
              </h2>
              <h2 className={styles.SurveyInfo}>Closes on: {endDate}</h2>
            </div>

            {QuestionsList.length === 0 && isLoading === false && (
              <div className={styles.empty}>
                <AutoAwesomeIcon
                  sx={{ fontSize: 100, color: "#ddd" }}
                  style={{ marginBottom: "20px" }}
                />
                <h1>So clean! There are no questions yet.</h1>
              </div>
            )}

            {QuestionsList.map((Question: any) => (
              <div key={Question.id}>
                <div className={styles.QuestionContainer}>
                  <div className={styles.cardRow}>
                    <h1 className={styles.QuestionTitle}>
                      {Question.data.QuestionText}
                    </h1>
                    <div className={styles.cardRow} style={{ gap: "10px" }}>
                      <Tooltip title="Edit" arrow placement="top">
                        <button
                          onClick={() => handleEditQuestionDetails(Question)}
                        >
                          <EditIcon sx={{ fontSize: 30, color: "#E07961" }} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow placement="top">
                        <button
                          onClick={() => handleDeleteQuestion(Question.id)}
                        >
                          <DeleteOutlineIcon
                            sx={{ fontSize: 30, color: "#E07961" }}
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  {
                    // Type 1 - Text
                    Question.data.QuestionType === "1" ? (
                      <div className={styles.sidebarFormBit}>
                        <textarea
                          rows={1}
                          name="QuestionText"
                          className={styles.sidebarTextField}
                        />
                      </div>
                    ) : // Type 2 - Radio
                    Question.data.QuestionType === "2" ? (
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          {Question.data.Choices.map((choice, index) => {
                            return (
                              <FormControlLabel
                                key={index}
                                value={choice}
                                control={
                                  <Radio
                                    className="ChoiceCard"
                                    sx={{
                                      color: "#E07961",
                                      "&.Mui-checked": {
                                        color: "#E07961",
                                      },
                                    }}
                                  />
                                }
                                label={choice}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    ) : // Type 3 - Checkbox
                    Question.data.QuestionType === "3" ? (
                      <FormControl>
                        <FormGroup row>
                          {Question.data.Choices.map((choice, index) => {
                            return (
                              <FormControlLabel
                                key={index}
                                value={choice}
                                control={
                                  <Checkbox
                                    sx={{
                                      color: "#E07961",
                                      "&.Mui-checked": {
                                        color: "#E07961",
                                      },
                                    }}
                                  />
                                }
                                label={choice}
                              />
                            );
                          })}
                        </FormGroup>
                      </FormControl>
                    ) : // Type 4 - Date
                    Question.data.QuestionType === "4" ? (
                      <div className={styles.sidebarFormBit}>
                        <input
                          type="date"
                          name="QuestionText"
                          value={questionText}
                          className={styles.sidebarTextField}
                        />
                      </div>
                    ) : // Type 5 - Slider
                    Question.data.QuestionType === "5" ? (
                      <Box sx={{ width: "100%" }}>
                        {}
                        <Slider
                          aria-label="Temperature"
                          defaultValue={0}
                          getAriaValueText={valuetext}
                          valueLabelDisplay="auto"
                          step={Question.data.Choices[2]}
                          min={Question.data.Choices[0]}
                          max={Question.data.Choices[1]}
                          marks={generateMarks(
                            Question.data.Choices[0],
                            Question.data.Choices[1],
                            Question.data.Choices[2],
                          )}
                          sx={{
                            color: "#E07961",
                            width: "100%",
                          }}
                        />
                      </Box>
                    ) : null
                  }
                </div>
              </div>
            ))}
          </main>
        </>
      )}
    </div>
  );
}
