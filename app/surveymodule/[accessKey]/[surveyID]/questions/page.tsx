"use client";
import QuestionCard from "@/app/components/questions";
import { getQuestions, deleteQuestion } from "@/actions/surveyquestion";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

interface QuestionPageProps {
  params: {
    accessKey: string;
    surveyID: string;
  };
}

export default function QuestionsPage({ params }: QuestionPageProps) {
  const [QuestionsList, setQuestionsList] = useState([]);

  // Adding
  const handleAddQuestion = async (e: any) => {
    const surveyRef = collection(
      db,
      `ResearchModule/${params.accessKey}/Survey/${params.surveyID}/SurveyQuestion`
    );

    e.preventDefault();

    const surveyID = params.surveyID;
    const Question = e.target.elements.Question.value;
    const Required = e.target.elements.Required.checked;
    const Type = e.target.elements.Type.value;

    try {
      const docRef = await addDoc(surveyRef, {
        surveyID,
        Question,
        Required,
        Type,
      });

      console.log("Question added with ID:", docRef.id);

      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID
      );
      setQuestionsList(updatedQuestions);

      e.target.elements.Question.value = "";
      e.target.elements.Required.checked = false;
      e.target.elements.Type.value = "";
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
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID
      );
      setQuestionsList(updatedQuestions);
    } catch (error: any) {
      console.error("Error deleting survey Question:", error.message);
    }
  };

  // Rendering
  return (
    <div>
      <h1>Add Question</h1>
      <form onSubmit={handleAddQuestion}>
        <label>
          Question:
          <input type="text" name="Question" />
        </label>
        <br />
        <label>
          Required:
          <input type="checkbox" name="Required" />
        </label>
        <br />
        <label>
          Type:
          <input type="text" name="Type" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />

      <h1>Questions for Survey ID: {params.surveyID}</h1>
      <br />
      {QuestionsList.map((Question: any) => (
        <div key={Question.id}>
          <QuestionCard key={Question.id} Question={Question} />
          <button onClick={() => handleDeleteQuestion(Question.id)}>
            Delete
          </button>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
