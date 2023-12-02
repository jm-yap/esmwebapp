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
    const question = e.target.elements.question.value;
    const required = e.target.elements.required.checked;
    const type = e.target.elements.type.value;

    try {
      const docRef = await addDoc(surveyRef, {
        surveyID,
        question,
        required,
        type,
      });

      console.log("Question added with ID:", docRef.id);

      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID
      );
      setQuestionsList(updatedQuestions);

      e.target.elements.question.value = "";
      e.target.elements.required.checked = false;
      e.target.elements.type.value = "";
    } catch (error) {
      console.error("Error adding  question:", error);
    }
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      getQuestions(params.accessKey, params.surveyID).then((questions: any) => {
        setQuestionsList(questions);
      });
    };

    fetchData();
  }, []);

  // Deletion
  const handleDeleteQuestion = async (questionID: string) => {
    try {
      await deleteQuestion(params.accessKey, params.surveyID, questionID);
      const updatedQuestions = await getQuestions(
        params.accessKey,
        params.surveyID
      );
      setQuestionsList(updatedQuestions);
    } catch (error: any) {
      console.error("Error deleting survey question:", error.message);
    }
  };

  // Rendering
  return (
    <div>
      <h1>Add Question</h1>
      <form onSubmit={handleAddQuestion}>
        <label>
          Question:
          <input type="text" name="question" />
        </label>
        <br />
        <label>
          Required:
          <input type="checkbox" name="required" />
        </label>
        <br />
        <label>
          Type:
          <input type="text" name="type" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />

      <h1>Questions for Survey ID: {params.surveyID}</h1>
      <br />
      {QuestionsList.map((question: any) => (
        <div>
          <QuestionCard key={question.id} question={question} />
          <button onClick={() => handleDeleteQuestion(question.id)}>
            Delete
          </button>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
