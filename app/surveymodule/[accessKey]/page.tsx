"use client";
import SurveyCard from "@/app/components/surveys";
import { getSurveys, deleteSurvey } from "@/actions/survey";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface SurveyPageProps {
  params: {
    accessKey: string;
  };
}

export default function QuestionsPage({ params }: SurveyPageProps) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [SurveyList, setSurveyList] = useState([]);

  // Adding
  const handleAddSurvey = async (e: any) => {
    const surveyRef = collection(
      db,
      `ResearchModule/${params.accessKey}/Survey/`
    );

    e.preventDefault();

    const AccessCode = params.accessKey;

    const Title = e.target.elements.Title.value;
    const Description = e.target.elements.Description.value;
    const StartDate = new Date(e.target.elements.StartDate.value);
    const EndDate = new Date(e.target.elements.EndDate.value);

    try {
      const docRef = await addDoc(surveyRef, {
        // ClientID: auth.currentUser?.uid,
        ClientID: session.data.user?.email,
        Description: Description,
        EndDate: EndDate,
        StartDate: StartDate,
        Title: Title,
      });

      console.log("Survey added with ID:", docRef.id);

      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
    } catch (error) {
      console.error("Error adding  survey:", error);
    }
    // clear text fields
    e.target.elements.Title.value = "";
    e.target.elements.Description.value = "";
    e.target.elements.StartDate.value = "";
    e.target.elements.EndDate.value = "";
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      getSurveys(params.accessKey).then((surveys: any) => {
        setSurveyList(surveys);
      });
    };

    fetchData();
  }, []);

  // Deletion
  const handleDeleteSurvey = async (SurveyID: string) => {
    try {
      await deleteSurvey(params.accessKey, SurveyID);
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
    } catch (error: any) {
      console.error("Error deleting survey question:", error.message);
    }
  };

  // Rendering
  return (
    <div className="p-4 max-w-[600px] mx-auto">
      <div className="mb-8 items-center">
        <Link href={`/surveymodule/`}>
          <button className="font-bold mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 flex justify-center">
            Back
          </button>
        </Link>
        <Link
          href={`/surveymodule/${params.accessKey}/users`}
          className="font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded p-4 mb-4"
        >
          See users
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-center">Add Survey</h1>
        <div className="bg-white border-solid border-2 border-black-300 rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleAddSurvey}>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                type="text"
                name="Title"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                type="text"
                name="Description"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                StartDate:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="date"
                name="StartDate"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                EndDate:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="date"
                name="EndDate"
              />
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
        Surveys for Access Code: {params.accessKey}
      </h1>
      {SurveyList.map((survey: any) => (
        <div
          key={survey.id}
          className="bg-white border-solid border-2 border-black-300 rounded px-8 pt-6 pb-9 mb-4 max-w-[600px] mx-auto"
        >
          <SurveyCard survey={survey} />
          <Link
            href={`/surveymodule/${params.accessKey}/${survey.id}/questions`}
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline mr-4">
              Questions
            </button>
          </Link>
          <Link
            href={`/surveymodule/${params.accessKey}/${survey.id}/responses`}
          >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
              Responses
            </button>
          </Link>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleDeleteSurvey(survey.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
