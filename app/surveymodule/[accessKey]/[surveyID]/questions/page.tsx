"use client";
import QuestionCard from "@/app/components/questions";
import { getQuestions, deleteQuestion } from "@/actions/surveyquestion";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, updateDoc, increment} from "firebase/firestore";
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

interface QuestionPageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}

// get the survey modules from local storage
const surveyStr = localStorage.getItem("survey");
// parse
const survey = JSON.parse(surveyStr);

export default function QuestionsPage({ params }: QuestionPageProps) {
  const [QuestionsList, setQuestionsList] = useState([]);

  // Adding
  const handleAddQuestion = async (e: any) => {
    const questionRef = collection(db, `SurveyQuestion`);

    e.preventDefault();

    const SurveyID = params.surveyID;
    const QuestionText = e.target.elements.QuestionText.value;
    const QuestionType = e.target.elements.QuestionType.value;

    try {
      // Add a new document with a generated id
      const docRef = await addDoc(questionRef, {
        SurveyID: SurveyID,
        QuestionText: QuestionText,
        QuestionType: QuestionType,
        Choices: fields,
      });

      console.log("Question added with ID:", docRef.id);

      // Update the list of questions
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID
      );
      setQuestionsList(updatedQuestions);

      // add 1 to total questions of survey
      const surveyRef = doc(db, "/Survey", params.surveyID);
      await updateDoc(surveyRef, {
        TotalQuestions: increment(1)
      });

      // Clear form
      e.target.elements.QuestionText.value = "";
      e.target.elements.QuestionType.value = "";
      setNumFields(0);
      e.target.elements.NumOptions.value = 0;
      setFields([]);
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

  const newStart = new Date(survey?.data.StartDate.seconds * 1000)
  const startDate = newStart.toLocaleString();

  const newEnd = new Date(survey?.data.EndDate.seconds * 1000)
  const endDate = newEnd.toLocaleString();

  const firstName = sessionStorage.getItem("firstName");
  const lastName = sessionStorage.getItem("lastName");

  // Rendering
  return (
    <div className={styles.container}>
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
                  onChange={handleQuestionTypeChange}>
                  <option value="1">Text</option>
                  <option value="2">Multiple Choice</option>
                  <option value="3">Checkbox</option>
                  {/* <option value="4">Date</option> */}
                </select>
              </div>
              {
                (questionType === "2" || questionType === "3") ? ( 
                  <div className={styles.sidebarFormBit}>
                    <label className={styles.sidebarLabel}>Number of Choices</label>
                    <input value={numFields} type="number" required onChange={handleNumFieldsChange} min="1" name="NumOptions" className={styles.sidebarTextField} />
                  </div>
                ) : null
              }
              {fields.map((field, index) => (
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
              ))}
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
              (Question.data.QuestionType === "1") ? (
              <div className={styles.sidebarFormBit}>
                  <textarea rows={1}  name="QuestionText" className={styles.sidebarTextField} />
                </div>
              ) :
                  
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
              ) : null
            }
          </div>
        </div>
        ))}
      </main>
    </div>
  );
}
