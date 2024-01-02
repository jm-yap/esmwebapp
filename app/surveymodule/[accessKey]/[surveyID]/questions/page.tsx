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
    <div className="container max-w-[600px] mx-auto p-4">
      <Link href={`/surveymodule/${params.accessKey}`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mb-4">
          Back to Survey
        </button>
      </Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Add Question</h1>
        <div className="bg-white border-solid border-2 border-black-600 rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleAddQuestion}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Question:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="Question"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Type:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="Type"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Required:
              </label>
              <input className="ml-2" type="checkbox" name="Required" />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Questions for Survey ID: {params.surveyID}
      </h1>
      {QuestionsList.map((Question: any) => (
        <div
          key={Question.id}
          className="bg-white border-solid border-2 border-black-600 rounded px-8 pt-6 pb-8 mb-4"
        >
          <QuestionCard key={Question.id} Question={Question} />
          <button
            className="bg-red-500 mt-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleDeleteQuestion(Question.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
