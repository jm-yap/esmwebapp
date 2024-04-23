"use client";
import QuestionCard from "@/app/components/questions";
import { getQuestions, deleteQuestion } from "@/actions/surveyquestion";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, updateDoc, increment, arrayUnion} from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import styles from "@/app/surveymodule/[accessKey]/styles.module.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { set } from "firebase/database";

interface QuestionPageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}



export default function QuestionsPage({ params }: QuestionPageProps) {
  const [QuestionsList, setQuestionsList] = useState([]);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const surveyStr = localStorage.getItem("survey");
    const parsedSurvey = surveyStr ? JSON.parse(surveyStr) : null;
    setSurvey(parsedSurvey);
    // if (survey) setQuestionOrder(survey.data.QuestionOrder);
  }, [params.surveyID]);
  

  // Adding
  const handleAddQuestion = async (e: any) => {
    const questionRef = collection(db, `SurveyQuestion`);

    e.preventDefault();

    const SurveyID = params.surveyID;
    const QuestionText = e.target.elements.QuestionText.value;
    const QuestionType = e.target.elements.QuestionType.value;

    try {
      let docRef;
      // Add a new document with a generated id
      if (QuestionType === "5") {
        const MinValue = parseInt(e.target.elements.MinValue.value);
        const MaxValue = parseInt(e.target.elements.MaxValue.value);
        const Step = parseInt(e.target.elements.Step.value);
        const slider = [MinValue, MaxValue, Step];
        docRef = await addDoc(questionRef, {
          SurveyID: SurveyID,
          QuestionText: QuestionText,
          QuestionType: QuestionType,
          Choices: slider,
        });
        console.log("Question added with ID:", docRef.id);
      } else {
        docRef = await addDoc(questionRef, {
          SurveyID: SurveyID,
          QuestionText: QuestionText,
          QuestionType: QuestionType,
          Choices: fields,
        });
        console.log("Question added with ID:", docRef.id);
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
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deletion
  const handleDeleteQuestion = async (QuestionID: string) => {
    try {
      await deleteQuestion(params.accessKey, params.surveyID, QuestionID);
      const updatedQuestions = await getQuestions(params.accessKey,params.surveyID);
      setQuestionsList(updatedQuestions);
    } catch (error: any) {
      console.error("Error deleting survey Question:", error.message);
    }
  };

  // Question Type
  const [questionType, setQuestionType] = useState('1');

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    if (questionType === "5" || questionType === "4") {
      // setNumFields(3);
      setFields([]);
    }
  };

  const [numFields, setNumFields] = useState(0);
  const [fields, setFields] = useState([]);

  const handleNumFieldsChange = (e) => {
    const value = parseInt(e.target.value);
    setNumFields(value);

    if (value > fields.length) {
      setFields([...fields, ...Array(value - fields.length).fill('')]);
    }
    else if (value < fields.length) {
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


  const newStart = new Date(survey?.data.StartDate.seconds * 1000)
  const startDate = newStart.toLocaleString();

  const newEnd = new Date(survey?.data.EndDate.seconds * 1000)
  const endDate = newEnd.toLocaleString();

  const firstName = sessionStorage.getItem("firstName");
  const lastName = sessionStorage.getItem("lastName");

  function valuetext(value: number) {
    return `${value}°C`;
  }

  // Rendering
  return (
    <div className={styles.container}>
      { survey && (
        <>
        {/* Navbar */}
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

        {/* Sidebar - Create Question */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarTitle}>
              <h1 className={styles.SurveyModuleTitle}>Create Question</h1>
            </div>
            <div className={styles.sidebarForm}>
              <form className={styles.sidebarFormComp} onSubmit={handleAddQuestion}>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Question</label>
                  <textarea rows={2} required name="QuestionText" className={styles.sidebarTextField} />
                </div>
                <div className={styles.sidebarFormBit}>
                  <label className={styles.sidebarLabel}>Type</label>
                  <select name="QuestionType" className={styles.sidebarTextField} 
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    defaultValue={"1"}>
                    <option value="1">Text</option>
                    <option value="2">Multiple Choice</option>
                    <option value="3">Checkbox</option>
                    <option value="4">Date</option>
                    <option value="5">Slider</option>
                  </select>
                </div>
                {
                  (questionType === "2" || questionType === "3") ? ( 
                    <div className={styles.sidebarFormBit}>
                      <label className={styles.sidebarLabel}>Number of Choices</label>
                      <input value={numFields} type="number" required onChange={handleNumFieldsChange} min="1" name="NumOptions" className={styles.sidebarTextField} />
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
                  ) : 
                  (questionType === "5") ? (
                    <div className={styles.sidebarFormBit}>
                      <label className={styles.sidebarLabel}>Minimum Value</label>
                      <input type="number" required name="MinValue" className={styles.sidebarTextField} />
                      <label className={styles.sidebarLabel}>Maximum Value</label>
                      <input type="number" required name="MaxValue" className={styles.sidebarTextField} />
                      <label className={styles.sidebarLabel}>Step</label>
                      <input type="number" required name="Step" className={styles.sidebarTextField} />
                    </div>
                  ) : null
                }
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
                <button className={styles.sidebarButton} type="submit">C R E A T E</button>
              </form>
            </div>
          </div>
        </div>

        <main className={styles.main}>
          <div className={styles.mainRow}>
            <Link href={`/surveymodule/${params.accessKey}`}>
              <ArrowBackIcon sx={{ fontSize: 40 }}/>
            </Link>
            <h1 className={styles.SurveyModuleTitle}>{survey.data.Title}</h1>
          </div>
          <h2 className={styles.SurveyInfo}>{survey.data.Description}</h2>
          <div className={styles.cardRow}>
            <h2 className={styles.SurveyInfo}>Required No. of Sessions: {survey.data.Sessions}</h2>
            <h2 className={styles.SurveyInfo}>Opens on: {startDate}</h2>
          </div>
          <div className={styles.cardRow}>
            <h2 className={styles.SurveyInfo}>Minimum Interval (in hours): {survey.data.Interval}</h2>
            <h2 className={styles.SurveyInfo}>Closes on: {endDate}</h2>
          </div>

          
          
          {QuestionsList.map((Question: any) => (
          <div key={Question.id}> 
            <div className={styles.SurveyContainer}>
              <div className={styles.cardRow}>
                <h1 className={styles.SurveyTitle}>{Question.data.QuestionText}</h1>
                <button onClick={() => handleDeleteQuestion(Question.id)}>
                  <DeleteOutlineIcon sx={{ fontSize: 30, color: '#E07961' }}/>
                </button>
              </div>
              {
                // Type 1 - Text
                (Question.data.QuestionType === "1") ? (
                <div className={styles.sidebarFormBit}>
                    <textarea rows={1}  name="QuestionText" className={styles.sidebarTextField} />
                  </div>
                ) :
                
                // Type 2 - Radio
                (Question.data.QuestionType === "2") ? (
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      >
                      {Question.data.Choices.map((choice, index) => {
                        return <FormControlLabel key={index} value={choice} control={<Radio className="ChoiceCard" sx={{
                        color: '#E07961',
                        '&.Mui-checked': {
                          color: '#E07961',
                        },
                      }}/>} label={choice} />
                      })}
                    </RadioGroup>
                  </FormControl> ) : 
                // Type 3 - Checkbox
                (Question.data.QuestionType === "3") ? (
                  <FormControl>
                    <FormGroup row>
                      {Question.data.Choices.map((choice, index) => {
                        return <FormControlLabel key={index} control={<Checkbox sx={{
                        color: '#E07961',
                        '&.Mui-checked': {
                          color: '#E07961',
                        },
                      }} />} label={choice} />
                      })}
                    </FormGroup>
                  </FormControl>
                ) :
                // Type 4 - Date
                (Question.data.QuestionType === "4") ? (
                  <div className={styles.sidebarFormBit}>
                    <input type="date" name="QuestionText" className={styles.sidebarTextField} />
                  </div>
                ) : 
                // Type 5 - Slider
                (Question.data.QuestionType === "5") ? (
                  <Box sx={{ width: 300}}>
                    {

                    }
                    <Slider
                      aria-label="Temperature"
                      defaultValue={0}
                      getAriaValueText={valuetext}
                      valueLabelDisplay="auto"
                      
                      step={Question.data.Choices[2]}
                      min={Question.data.Choices[0]}
                      max={Question.data.Choices[1]}
                      marks = {
                        generateMarks(Question.data.Choices[0], 
                        Question.data.Choices[1], 
                        Question.data.Choices[2])
                      }
                      sx={{
                        color: '#E07961',
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
