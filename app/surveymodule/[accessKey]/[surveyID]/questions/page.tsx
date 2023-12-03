"use client";
import QuestionCard from "@/app/components/questions";
import { getQuestions, deleteQuestion } from "@/actions/surveyquestion";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Question</h1>
      <form onSubmit={handleAddQuestion} className="mb-4">
        <label className="block mb-2">
          Question:
          <input
            type="text"
            name="Question"
            className="border border-gray-300 rounded-md p-1"
          />
        </label>
        {/* <br /> */}
        <label className="block mb-2">
          Type:
          <input
            type="text"
            name="Type"
            className="border border-gray-300 rounded-md p-1"
          />
        </label>
        {/* <br /> */}
        <label className="block mb-2">
          Required:
          <input type="checkbox" name="Required" className="ml-2" />
        </label>
        <br />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
      <br />

      <Link href={`/surveymodule/${params.accessKey}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Back to Survey
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        Questions for Survey ID: {params.surveyID}
      </h1>
      <br />
      {QuestionsList.map((Question: any) => (
        <div key={Question.id} className="mb-4">
          <QuestionCard key={Question.id} Question={Question} />
          <button
            onClick={() => handleDeleteQuestion(Question.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
